"""Met à jour scholar.json à partir du profil Google Scholar :
citations, indices h et i10, nombre de publications, citations par an et publications récentes."""
import html as H, json, os, re, sys, time, datetime, urllib.request, urllib.parse

USER = "phsMm7sAAAAJ"
OUT = "scholar.json"
N_RECENT = 5
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.read().decode("utf-8", "replace")


def txt(s):
    return H.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def to_int(s):
    s = re.sub(r"\D", "", str(s or ""))
    return int(s) if s else 0


def recent(arts):
    arts = [a for a in arts if a["title"]]
    arts.sort(key=lambda a: (a["year"] or 0, a["cites"]), reverse=True)
    return arts[:N_RECENT]


# ---------- 1) lecture directe de Google Scholar ----------
def from_scholar():
    base = f"https://scholar.google.com/citations?user={USER}&hl=en&pagesize=100"
    page = get(base)
    cells = [int(x) for x in re.findall(r'class="gsc_rsb_std">(\d+)<', page)]
    if len(cells) < 6:
        raise RuntimeError("tableau des indicateurs introuvable (CAPTCHA ?)")
    years = [int(y) for y in re.findall(r'class="gsc_g_t"[^>]*>(\d{4})<', page)]
    vals = [int(v) for v in re.findall(r'class="gsc_g_al">(\d+)<', page)]
    graph = [{"year": y, "citations": v} for y, v in zip(years, vals)] if len(years) == len(vals) else []
    arts, start = [], 0
    while True:
        rows = re.findall(r'<tr class="gsc_a_tr">(.*?)</tr>', page, re.S)
        for r in rows:
            t = re.search(r'<a[^>]*href="([^"]+)"[^>]*class="gsc_a_at"[^>]*>(.*?)</a>', r, re.S)
            grays = re.findall(r'<div class="gs_gray">(.*?)</div>', r, re.S)
            c = re.search(r'class="gsc_a_ac[^"]*"[^>]*>(\d*)<', r)
            y = re.search(r'class="gsc_a_h[^"]*"[^>]*>(\d{4})<', r)
            venue = re.sub(r'<span class="gs_oph">.*?</span>', "", grays[1]) if len(grays) > 1 else ""
            arts.append({
                "title": txt(t.group(2)) if t else "",
                "link": "https://scholar.google.com" + H.unescape(t.group(1)) if t else "",
                "authors": txt(grays[0]) if grays else "",
                "venue": txt(venue),
                "year": int(y.group(1)) if y else None,
                "cites": to_int(c.group(1)) if c else 0,
            })
        if len(rows) < 100:
            break
        start += 100
        time.sleep(3)
        page = get(base + f"&cstart={start}")
    return {"citations": cells[0], "h_index": cells[2], "i10_index": cells[4],
            "publications": len(arts), "graph": graph, "recent": recent(arts)}


# ---------- 2) secours : SerpAPI ----------
def from_serpapi(key):
    q = {"engine": "google_scholar_author", "author_id": USER, "hl": "en", "num": 100, "api_key": key}
    d = json.loads(get("https://serpapi.com/search.json?" + urllib.parse.urlencode(q)))
    if d.get("error"):
        raise RuntimeError(d["error"])
    t = {}
    for row in d["cited_by"]["table"]:
        k = list(row)[0]
        t[k] = row[k]["all"]
    graph = [{"year": int(g["year"]), "citations": int(g["citations"])}
             for g in d["cited_by"].get("graph", [])]
    raw, start = list(d.get("articles", [])), 0
    last = raw
    while len(last) >= 100:
        start += 100
        q["start"] = start
        last = json.loads(get("https://serpapi.com/search.json?" + urllib.parse.urlencode(q))).get("articles", [])
        raw += last
    arts = [{
        "title": a.get("title", ""),
        "link": a.get("link", ""),
        "authors": a.get("authors", ""),
        "venue": a.get("publication", ""),
        "year": to_int(a.get("year")) or None,
        "cites": to_int((a.get("cited_by") or {}).get("value")),
    } for a in raw]
    return {"citations": t["citations"], "h_index": t["h_index"], "i10_index": t["i10_index"],
            "publications": len(arts), "graph": graph, "recent": recent(arts)}


def main():
    try:
        new, src = from_scholar(), "scholar"
    except Exception as e:
        print("Google Scholar direct :", e)
        key = os.environ.get("SERPAPI_KEY")
        if not key:
            print("Pas de SERPAPI_KEY : valeurs précédentes conservées.")
            return 0
        try:
            new, src = from_serpapi(key), "serpapi"
        except Exception as e2:
            print("SerpAPI :", e2, "- valeurs précédentes conservées.")
            return 0
    old = json.load(open(OUT, encoding="utf-8")) if os.path.exists(OUT) else {}
    if all(old.get(k) == v for k, v in new.items()):
        print("Aucun changement :", {k: new[k] for k in ("citations", "h_index", "i10_index", "publications")})
        return 0
    new["updated"] = datetime.date.today().isoformat()
    new["source"] = src
    new["profile"] = f"https://scholar.google.com/citations?user={USER}"
    json.dump(new, open(OUT, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print("Mis à jour :", {k: new[k] for k in ("citations", "h_index", "i10_index", "publications")})
    return 0


if __name__ == "__main__":
    sys.exit(main())
