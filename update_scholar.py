"""Met à jour scholar.json à partir du profil Google Scholar (citations, h, i10, publications)."""
import json, os, re, sys, time, datetime, urllib.request, urllib.parse

USER = "phsMm7sAAAAJ"
OUT = "scholar.json"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")

def from_scholar():
    base = f"https://scholar.google.com/citations?user={USER}&hl=en&pagesize=100"
    html = get(base)
    cells = [int(x) for x in re.findall(r'class="gsc_rsb_std">(\d+)<', html)]
    if len(cells) < 6:
        raise RuntimeError("tableau des indicateurs introuvable (CAPTCHA ?)")
    pubs, start, page = 0, 0, html
    while True:
        n = len(re.findall(r'class="gsc_a_tr"', page))
        pubs += n
        if n < 100:
            break
        start += 100
        time.sleep(3)
        page = get(base + f"&cstart={start}")
    return {"citations": cells[0], "h_index": cells[2], "i10_index": cells[4], "publications": pubs}

def from_serpapi(key):
    q = {"engine": "google_scholar_author", "author_id": USER, "hl": "en", "num": 100, "api_key": key}
    d = json.loads(get("https://serpapi.com/search.json?" + urllib.parse.urlencode(q)))
    t = {list(r)[0]: r[list(r)[0]]["all"] for r in d["cited_by"]["table"]}
    pubs, start, arts = 0, 0, d.get("articles", [])
    while True:
        pubs += len(arts)
        if len(arts) < 100:
            break
        start += 100
        q["start"] = start
        arts = json.loads(get("https://serpapi.com/search.json?" + urllib.parse.urlencode(q))).get("articles", [])
    return {"citations": t["citations"], "h_index": t["h_index"], "i10_index": t["i10_index"], "publications": pubs}

def main():
    try:
        new = from_scholar()
        src = "scholar"
    except Exception as e:
        print("Google Scholar direct :", e)
        key = os.environ.get("SERPAPI_KEY")
        if not key:
            print("Pas de SERPAPI_KEY : valeurs précédentes conservées.")
            return 0
        new = from_serpapi(key)
        src = "serpapi"
    old = {}
    if os.path.exists(OUT):
        old = json.load(open(OUT, encoding="utf-8"))
    keys = ("citations", "h_index", "i10_index", "publications")
    if all(old.get(k) == new[k] for k in keys):
        print("Aucun changement :", new)
        return 0
    new["updated"] = datetime.date.today().isoformat()
    new["source"] = src
    new["profile"] = f"https://scholar.google.com/citations?user={USER}"
    json.dump(new, open(OUT, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    print("Mis à jour :", new)
    return 0

if __name__ == "__main__":
    sys.exit(main())
