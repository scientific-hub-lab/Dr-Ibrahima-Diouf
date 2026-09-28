document.getElementById('yr').textContent = new Date().getFullYear();

document.getElementById('burger').addEventListener('click', () => {
  document.getElementById('nav').classList.toggle('open');
});
document.querySelectorAll('nav.main a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('nav').classList.remove('open'))
);

const themeBtn = document.getElementById('theme');
function setTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'dark' ? '☀' : '☾';
  try { localStorage.setItem('idd_theme', t); } catch(e){}
}
let storedTheme = null;
try { storedTheme = localStorage.getItem('idd_theme'); } catch(e){}
setTheme(storedTheme || 'light');
themeBtn.addEventListener('click', () =>
  setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
);

function reveal(el){
  if(el.classList.contains('in')) return;
  el.classList.add('in');
  el.querySelectorAll('[data-count]').forEach(c => {
    const target = +c.dataset.count, sfx = c.dataset.suffix || '';
    const dur = 1400, t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      c.textContent = Math.round(target * eased) + sfx;
      if(k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  el.querySelectorAll('.fill').forEach(f => {
    setTimeout(() => { f.style.width = f.dataset.w + '%'; }, 180);
  });
}
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ reveal(e.target); io.unobserve(e.target); } });
}, {threshold:0, rootMargin:'0px 0px -80px 0px'});
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* fallback: never leave a block invisible (deep links, fast scrolls, reduced motion) */
function sweep(){
  document.querySelectorAll('.rv:not(.in)').forEach(el => {
    if(el.getBoundingClientRect().top < window.innerHeight - 40) reveal(el);
  });
}
window.addEventListener('scroll', sweep, {passive:true});
window.addEventListener('load', () => { sweep(); setTimeout(sweep, 500); });
sweep();

document.querySelectorAll('.fbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    applyFilter(btn.dataset.f);
  });
});
function applyFilter(f){
  let n = 0;
  document.querySelectorAll('#publist .pub').forEach(p => {
    const show = f === 'all' || (p.dataset.tags || '').split(' ').includes(f);
    p.style.display = show ? '' : 'none';
    if(show) n++;
  });
  const c = document.getElementById('fcount');
  if(c){
    const lang = document.documentElement.getAttribute('lang');
    c.textContent = n + (lang === 'fr' ? (n > 1 ? ' articles' : ' article') : (n > 1 ? ' articles' : ' article'));
  }
}
applyFilter('all');

const I18N = {
  fr: {},
  en: {
    'hdr.role':'Physicist, Climate &amp; Health Scientist',
    'nav.1':'Home','nav.2':'Research','nav.3':'Tools','nav.4':'Impact','nav.5':'Publications','nav.6':'Career','nav.7':'Contact',
    'hero.kicker':'IPCC AR7 Lead Author · Chapter 7 — Africa, WGII',
    'hero.h1':'Turning climate data into <em>public-health decisions</em>.',
    'hero.lead':'Lecturer-researcher in climate &amp; health and international consultant. For fifteen years I have modelled the link between climate variability and vector-borne disease, and turned those models into early warning systems African health systems can act on.',
    'cred.2':'University of Labé — Guinea','cred.3':'IPCC AR7 · WGII','cred.4':'HMST — Global Fund',
    'tk.gis':'GIS','tk.eu':'EU FP7 — QWeCI, PREFACE',
    'ct.1v':'<a href="https://www.ucad.sn/" target="_blank" rel="noopener">ESP/UCAD, Senegal</a> · <a href="https://univ-labe.edu.gn/" target="_blank" rel="noopener">University of Labé, Guinea</a>',
    'hero.cv':'Download CV ↓','hero.work':'See publications','hero.contact':'Get in touch',
    'hero.pcap':'Dakar · Labé · Field &amp; data',
    'fig.b':'Motto','fig.t':'“Turning data into knowledge for a resilient and healthy future.”',
    's1.h':'A profile at the interface of climate, health and data',
    's1.p':'Fifteen years of interdisciplinary research, from a PhD on seasonal malaria in the Sahel to IPCC assessments — with projects funded by the European Union (FP7), USAID, WHO, UNICEF, NOAA and IRD.',
    'm.1':'Scientific publications','m.2':'Citations','m.3':'h-index','m.4':'i10-index','m.5':'Years of experience','m.6':'IPCC Lead Author',
    'm.src':'Bibliometric indicators — <a href="https://scholar.google.com/citations?user=phsMm7sAAAAJ&amp;hl=en" target="_blank" rel="noopener">Google Scholar</a>, <span class="sch-date">September 2026</span>.',
    'dist.1':'Malaria &amp; climate','dist.2':'Other climate-sensitive diseases — meningitis, heatwaves, COVID-19',
    'dist.3':'Rainfall extremes &amp; hydrology','dist.4':'Climate services, data &amp; adaptation','dist.art':'articles',
    'tk.1':'Programming','tk.2':'Models','tk.3':'Funding',
    's2.h':'Four research pillars',
    's2.p':'One question runs through all of my work: how do you turn a climate signal into a useful health decision, in time and at the right scale?',
    'p1.h':'Climate &amp; health','p1.p':'Climate-health interactions and seasonal forecasting in West Africa: how climate variability and change shape vector-borne disease risk.',
    'p2.h':'Malaria modelling','p2.p':'Dynamical VECTRI and LMM models coupled to atmosphere and hydrology, driven by observations, reanalyses and bias-corrected CMIP5/CMIP6 projections.',
    'p3.h':'Early warning &amp; adaptation','p3.p':'Early warning tools, risk mapping, vulnerability assessments and support to national adaptation plans and health system resilience.',
    'p4.h':'AI &amp; data science','p4.p':'Machine learning for climate-health forecasting: malaria incidence, heatwave-related hospitalisations, and the quality of gridded rainfall products.',
    's3.h':'From models to tools people actually use',
    's3.p':'My work does not stop at the paper: it becomes interactive, open and reproducible applications hosted on Hugging Face.',
    'd.tag':'Flagship application','d.h':'Malaria Early Warning System (EWS) — Senegal',
    'd.p':'A national dashboard combining malaria incidence, population and climate to identify at-risk regions and track regional trends over a decade.',
    'd.k1':'14 regions','d.k2':'NMCP / DHIS2','d.btn':'Open the application →',
    'dc1.h':'Rainfall indices','dc1.p':'Trends in rainfall extremes over Senegal, CMIP6 validation.',
    'dc2.h':'CMIP6 projections','dc2.p':'Malaria and extreme precipitation under future scenarios.',
    'dc3.h':'Risk mapping','dc3.p':'Climate-health vulnerability by region and season.',
    'dc4.h':'All spaces','dc4.p':'Every application and tool on my Hugging Face profile.',
    's4.h':'Impact &amp; engagements','s4.p':'Research designed to be used: international assessments, support to national programmes and operational tools.',
    'c.now':'ongoing',
    'c1.h':'IPCC global assessment','c1.p':'Lead Author of Chapter 7 “Africa” of the Seventh Assessment Report (Working Group II): synthesising climate-health risks and adaptation options for governments.',
    'c2.h':'Global Fund — HMST team','c2.p':'Francophone Team Lead for climate-health integration: technical assistance missions in Senegal, Niger, CAR, Burundi and Guinea-Bissau.',
    'c3.h':'Climate expert, Institut Pasteur de Dakar &amp; WHO','c3.p':'Integrated surveillance of climate-linked vector-borne diseases: data analysis, risk mapping and policy recommendations.',
    'eng.l':'Recent engagements',
    'e.d1':'May 2026','e.d2':'April 2026','e.d3':'March 2026','e.d4':'Feb.–March 2026','e.d5':'January 2026','e.d6':'December 2025','t.d4':'June 2023 — Aug. 2024','t.d5':'Aug. 2023 — Jan. 2024','t.d6':'July 2021 — Dec. 2023','t.d7':'July 2017 — July 2021','t.d8':'Nov. 2013 — Oct. 2017','t.d9':'Jan. 2010 — July 2013',
    'e.1':'Second Lead Author Meeting, IPCC AR7 (WGII) — Nassau, Bahamas',
    'e.2':'Global Goal on Adaptation implementation workshop, IIED — Addis Ababa',
    'e.3':'CORDEX-Africa — developing a shared African climate literacy, University of Cape Town',
    'e.4':'Climate &amp; health technical assistance missions, HMST / Global Fund — 5 countries',
    'e.5':'Expert meeting on Climate Change and Health, Wellcome Trust — London',
    'e.6':'First Lead Author Meeting, IPCC AR7 — Paris',
    'pt.l':'Institutions &amp; partners','pt.gf':'Global Fund','pt.labe':'University of Labé',
    's5.h':'Publications','s5.p':'<span class="sch-p">56</span> scientific publications listed on Google Scholar — <span class="sch-c">586</span> citations, h-index <span class="sch-hh">13</span>. The <span class="pub-n">40</span> peer-reviewed works below, four of them under review.',
    'f.all':'All','f.mal':'Malaria','f.dis':'Other diseases','f.ext':'Extremes &amp; hydrology','f.ai':'AI &amp; data','f.serv':'Climate services',
    'pub.rev':'in review','pub.gn':'Guinea','pub.co':'Co-author','pub.sn':'Senegal','pub.mod':'Modelling','pub.prev':'Seasonal forecasting',
    'pub.men':'Meningitis','pub.wa':'West Africa','pub.heat':'Heatwaves','pub.mort':'Mortality','pub.mal':'Malaria','pub.ext':'Extremes','pub.ai':'AI','pub.serv':'Climate services','pub.data':'Data','pub.pol':'Policy','pub.pol':'Policy','pub.adapt':'Adaptation','pub.hyd':'Hydrology','pub.surv':'Surveillance','pub.pub':'Public health','pub.first':'First author',
    's5.btn':'Google Scholar profile →',
    'sl.h1':'Citations per year','sl.h2':'Latest work on Google Scholar','sl.src':'Updated automatically every day from Google Scholar.',
    's6.h':'Career &amp; education','s6.p':'From a PhD on seasonal malaria in the Sahel to international climate assessments.',
    't.n1':'Since Dec. 2025','t.n2':'Since Oct. 2024','t.n3':'Since May 2023',
    'tl.1':'Lead Author of Chapter 7 “Africa” of the Seventh Assessment Report.',
    'tl.2h':'Lecturer-Researcher — University of Labé, Guinea','tl.2':'Teaching and research in climate and health; supervision of Master’s and PhD students; coordination of environmental science modules.',
    'tl.3h':'Climate Expert — Institut Pasteur de Dakar / WHO','tl.3':'Integrated surveillance and control of climate-linked vector-borne diseases: data analysis, risk mapping, policy recommendations.',
    'tl.4h':'Consultant — MSAS &amp; Save the Children / UNICEF','tl.4':'Strengthened health system resilience to climate risks; led climate vulnerability assessments and supported strategy design.',
    'tl.5h':'Climate Expert — Centre de Suivi Écologique (CSE), Senegal','tl.5':'Technical expertise on climate-health links, community vulnerability assessments and adaptation policy planning.',
    'tl.6h':'Postdoctoral Researcher — Ministry of Environment, NAP-GEF','tl.6':'Contributed to Senegal’s National Adaptation Plan: stakeholder training, educational materials and ministry advice on adaptation data.',
    'tl.7h':'Postdoc &amp; Associate Scientist — NOAA CPC / UCAR, USA','tl.7':'Led modelling of malaria and climate variability in Africa; developed early-warning tools; coordinated international collaborations.',
    'tl.8h':'Researcher — PREFACE, Universidad Complutense de Madrid','tl.8':'Studied the tropical Atlantic’s influence on public health in West Africa; integrated climate indicators into health policy.',
    'tl.9h':'PhD Researcher — University of Liverpool, QWeCI project','tl.9':'Built malaria-climate databases and tested dynamic disease models; integrated seasonal forecasts into West African health systems.',
    'edu.l':'Education',
    'edu.1h':'Ph.D. — Climate and Health Impacts','edu.2h':'M.Sc. — Meteorology, Oceanography, Arid Zones Management','edu.3h':'M.Sc. — Physics and Chemistry',
    's7.h':'Let’s work together',
    's7.p':'Expert review, assessment, training, doctoral supervision or the development of climate-health tools: I welcome institutional and academic enquiries.',
    'memb.l':'Professional affiliations',
    'mb.1':'Francophone Team Lead, HMST — Global Fund','mb.2':'Lead Author, IPCC AR7 (Ch. 7 — Africa), WGII','mb.3':'Expert, IIED — inclusive indicators for the GGA','mb.4':'Co-Chair, AMMnet Senegal','mb.5':'Member, American Meteorological Society (AMS)','mb.6':'Member, African Meteorological Society (AfMS)','mb.7':'Member, International Expert Centre on Climate Change and Health','mb.8':'Contributing Author, CMIP Project Office',
    'ct.1':'Affiliations','ct.2':'Email','ct.3':'Email','ct.4':'Areas','ct.4v':'Climate &amp; health · Early warning · Adaptation · AI',
    'ct.5':'Languages','ct.5v':'French (native) · English (advanced) · Spanish (upper-intermediate)',
    'ct.6v':'Curriculum vitæ (PDF, August 2026)',
    'g.t1':"Bellagio Center, Italy · 7 Sept 2026",
    'g.h1':"Talk: “Building Climate–Health Early Warning Systems for West Africa”",
    'g.t2':"Nassau, The Bahamas · 18–22 May 2026",
    'g.h2':"Second Lead Author Meeting, IPCC AR7 (Working Group II)",
    'g.t3':"Dakar, Senegal · 8–11 June 2026",
    'g.h3':"ACCLIMATISE project partners (UCAD, Wellcome, ICTP, NYU, PNLP, Swiss TPH…)",
    'g.t4':"Cape Town, South Africa · 20–23 Sept 2024",
    'g.h4':"Poster “Enhancing Climate-Health Resilience in Senegal: Integrating Predictive Modelling and Adaptation Strategies” — 8th World One Health Congress",
    'g.t5':"Nassau, The Bahamas · May 2026",
    'g.h5':"With fellow IPCC AR7 authors",
    'g.t6':"Bissau, Guinea-Bissau · 2026",
    'g.h6':"Ministry of Public Health — HMST / Global Fund technical assistance mission",
    'g.t7':"Trieste, Italy",
    'g.h7':"At the Abdus Salam International Centre for Theoretical Physics (ICTP)",
    'g.t8':"Hôtel Le Ndiambour, Dakar · 3 Nov 2023",
    'g.h8':"Panel — World One Health Day 2023: “Connecting Air, Land and Water!”",
    'g.t9':"Dakar, Senegal · June 2026",
    'g.h9':"Presenting at the ACCLIMATISE project kick-off workshop",
    'g.t10':"Bellagio Center, Italy · Sept 2026",
    'g.h10':"Rockefeller Foundation residency — work on climate-health early warning systems",
    'g.t11':"Bellagio, Italy · Sept 2026",
    'g.h11':"In the gardens of the Bellagio Center",
    'g.t12':"Hôtel Fleur de Lys, Almadies · June 2026",
    'g.h12':"ACCLIMATISE kick-off meeting",
    'g.t13':"Nassau, The Bahamas · May 2026",
    'g.h13':"IPCC AR7 WGII — Lead Author Meeting 2",
    'g.t14':"Burundi · 2026",
    'g.h14':"Meeting at IOM Burundi — HMST / Global Fund technical assistance mission",
    'g.t15':"18 Feb 2026",
    'g.h15':"Climate-health working session with national teams",
    'g.t16':"Niamey, Niger · 2026",
    'g.h16':"At the African Centre of Meteorological Applications for Development (ACMAD)",
    'g.t17':"International workshop",
    'g.h17':"Group photo of participants",
    'g.t18':"Scientific meeting",
    'g.h18':"Group photo of participants",
    'g.t19':"INES-Ruhengeri, Rwanda · L’Initiative (Expertise France)",
    'g.h19':"Participants in the climate change training",
    'g.t20':"INES-Ruhengeri, Rwanda · L’Initiative (Expertise France)",
    'g.h20':"Hands-on session during the training",
    'g.t21':"INES-Ruhengeri, Rwanda",
    'g.h21':"Presentation of training certificates",
    'g.t22':"INES-Ruhengeri, Rwanda",
    'g.h22':"“Earth’s energy balance” lecture — climate change training",
    'g.t23':"Bangkok, Thailand · 21 July 2025",
    'g.h23':"2025 CSIDNet Annual Gathering (CSID Network, MORU Tropical Health Network, Wellcome)",
    'g.t24':"Hôtel Azalaï, Dakar · 28–30 Apr 2025",
    'g.h24':"Presentation at the 2nd Congress of the Senegalese Society of Infectious and Tropical Pathology (SOSEPIT)",
    'g.t25':"Cape Town, South Africa · Sept 2024",
    'g.h25':"8th World One Health Congress — contribution to a plenary session",
    'g.t26':"Guinea",
    'g.h26':"Welcome ceremony for new lecturer-researchers — Ministry of Higher Education, Scientific Research and Innovation",
    'g.t27':"Meeting",
    'g.h27':"Institutional meeting",
    'g.t28':"Training",
    'g.h28':"Group photo of participants",
    'g.t29':"LPAO-SF, UCAD · Dakar",
    'g.h29':"Presenting results: 1985–2014 precipitation climatology, ERA5 and CMIP6 models",
    'g.t30':"Dakar, Senegal",
    'g.h30':"At the Centre de Suivi Écologique (CSE)",
    'g.t31':"Hôtel Le Ndiambour, Dakar · 3 Nov 2023",
    'g.h31':"World One Health Day — National High Council for Global Health Security",
    'g.t32':"Dakar · 2023",
    'g.h32':"Group photo — Dakar conference on epidemics",
    'g.t33':"Trieste, Italy · 22–26 May 2023",
    'g.h33':"Joint ICTP-IAEA Workshop on Accounting for Climate in Vector-borne Disease Intervention Planning, including the Sterile Insect Technique",
    'g.t34':"Presentation",
    'g.h34':"Speaking at a session",
    'g.t35':"Panel discussion",
    'g.h35':"Speaking at a panel discussion",
    'g.t36':"Discussion session",
    'g.h36':"Group discussion session",
    'g.t37':"Istanbul, Türkiye",
    'g.h37':"On the sidelines of an international conference",
    'g.t38':"International meeting",
    'g.h38':"With fellow participants",
    'g.t39':"Meeting",
    'g.h39':"With fellow participants",
    'g.t40':"Laboratory",
    'g.h40':"Laboratory working session",
    'nav.8':"Gallery",
    's8.h':"In pictures",
    's8.p':"IPCC meetings, conferences, workshops, training courses and technical assistance missions: moments from the field.",
    'g.f0':"All",
    'g.f1':"IPCC",
    'g.f5':"Conferences",
    'g.f2':"Workshops &amp; training",
    'g.f3':"Missions &amp; institutions",
    'g.f6':"Academic life",
    'g.f4':"Bellagio residency",
    'g.more':"See all photos",
    'ft.role':'Physicist, Climate &amp; Health Scientist','ft.rights':'All rights reserved','ft.top':'Back to top ↑'
    ,'ex.h':'Explore','ex.p':'Research, tools, publications and career, each on its own page.','ex.go':'Open →'
  }
};
document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.getAttribute('data-i18n'); if(I18N.fr[k] === undefined) I18N.fr[k] = el.innerHTML; });

function setLang(lang){
  const dict = I18N[lang];
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if(dict && dict[k] !== undefined) el.innerHTML = dict[k];
  });
  document.querySelectorAll('[data-lang]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang))
  );
  try { localStorage.setItem('idd_lang', lang); } catch(e){}
  const on = document.querySelector('.fbtn.on');
  if(on && typeof applyFilter === 'function') applyFilter(on.dataset.f);
}
let storedLang = null;
try { storedLang = localStorage.getItem('idd_lang'); } catch(e){}
setLang(storedLang === 'fr' ? 'fr' : 'en');
document.querySelectorAll('[data-lang]').forEach(b =>
  b.addEventListener('click', () => setLang(b.dataset.lang))
);


/* ---------- Google Scholar : indicateurs mis à jour automatiquement (scholar.json) ---------- */
let SCHOLAR = null;
const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
document.querySelectorAll('.pub-n').forEach(e => e.textContent = document.querySelectorAll('#publist .pub').length);
function renderLive(fr){
  const box = document.getElementById('schlive');
  const g = (SCHOLAR.graph || []).filter(d => d && d.year);
  const rec = SCHOLAR.recent || [];
  if(!box || (!g.length && !rec.length)) return;
  box.hidden = false;
  const gw = document.getElementById('sl-graph');
  if(g.length){
    const W = Math.max(280, Math.round(gw.clientWidth || 560)), H = 190, top = 20, bot = 24, n = g.length, gap = W < 480 ? 3 : 6;
    const bw = (W - gap * (n - 1)) / n, max = Math.max(...g.map(d => d.citations), 1);
    const nowY = new Date().getFullYear(), short = bw < 32;
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${fr ? 'Citations par an' : 'Citations per year'}">`;
    g.forEach((d, i) => {
      const h = Math.max(2, (H - top - bot) * d.citations / max), x = i * (bw + gap), y = H - bot - h;
      svg += `<rect class="bar${d.year === nowY ? ' cur' : ''}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="2"><title>${d.year} : ${d.citations}</title></rect>`;
      svg += `<text class="bv" x="${(x + bw / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle">${d.citations}</text>`;
      svg += `<text class="by" x="${(x + bw / 2).toFixed(1)}" y="${H - 6}" text-anchor="middle">${short ? "'" + String(d.year).slice(2) : d.year}</text>`;
    });
    svg += `<line class="base" x1="0" x2="${W}" y1="${H - bot + .5}" y2="${H - bot + .5}"/></svg>`;
    const hasCur = g.some(d => d.year === nowY);
    gw.innerHTML = svg + (hasCur ? `<div class="sl-note">${fr ? nowY + ' : année en cours.' : nowY + ': year to date.'}</div>` : '');
  } else gw.parentElement.hidden = true;
  const ol = document.getElementById('sl-list');
  ol.innerHTML = rec.map(a => {
    const c = a.cites ? ` · ${a.cites} ${fr ? (a.cites > 1 ? 'citations' : 'citation') : (a.cites > 1 ? 'citations' : 'citation')}` : '';
    const t = a.link ? `<a href="${esc(a.link)}" target="_blank" rel="noopener">${esc(a.title)}</a>` : `<span>${esc(a.title)}</span>`;
    const v = String(a.venue || a.authors || '').replace(/,\s*(19|20)\d{2}\s*$/, '');
    return `<li><span class="y">${esc(a.year || '')}</span><div>${t}<div class="v">${esc(v)}${c}</div></div></li>`;
  }).join('');
  if(!rec.length) ol.parentElement.hidden = true;
}
function applyScholar(){
  document.querySelectorAll('.pub-n').forEach(e => e.textContent = document.querySelectorAll('#publist .pub').length);
  if(!SCHOLAR) return;
  const fr = document.documentElement.getAttribute('lang') === 'fr';
  const setCount = (id, v) => {
    const c = document.getElementById(id);
    if(!c || v == null) return;
    c.dataset.count = v;
    c.dataset.suffix = '';
    if(c.closest('.rv') && c.closest('.rv').classList.contains('in')) c.textContent = v;
  };
  setCount('sch-cit', SCHOLAR.citations);
  setCount('sch-h', SCHOLAR.h_index);
  setCount('sch-i10', SCHOLAR.i10_index);
  setCount('sch-pubs', SCHOLAR.publications);
  document.querySelectorAll('.sch-c').forEach(e => e.textContent = SCHOLAR.citations);
  document.querySelectorAll('.sch-hh').forEach(e => e.textContent = SCHOLAR.h_index);
  if(SCHOLAR.publications) document.querySelectorAll('.sch-p').forEach(e => e.textContent = SCHOLAR.publications);
  if(SCHOLAR.updated){
    const d = new Date(SCHOLAR.updated + 'T12:00:00');
    const txt = d.toLocaleDateString(fr ? 'fr-FR' : 'en-US', {month:'long', year:'numeric'});
    document.querySelectorAll('.sch-date').forEach(e => e.textContent = txt);
  }
  renderLive(fr);
}
let _slT; window.addEventListener('resize', () => { clearTimeout(_slT); _slT = setTimeout(() => { if(SCHOLAR) renderLive(document.documentElement.getAttribute('lang') === 'fr'); }, 200); });
const _setLang = setLang;
setLang = function(l){ _setLang(l); applyScholar(); };
applyScholar();
fetch('scholar.json?v=' + Date.now(), {cache:'no-store'})
  .then(r => r.ok ? r.json() : null)
  .then(d => { if(d && d.citations){ SCHOLAR = d; applyScholar(); } })
  .catch(() => {});

/* ---------- gallery: filters + lightbox ---------- */
(function(){
  const items = Array.from(document.querySelectorAll('#gallery .gitem'));
  if(!items.length) return;
  const gal = document.getElementById('gallery'), more = document.getElementById('gmore');
  const expand = () => { gal.classList.remove('collapsed'); if(more) more.parentElement.hidden = true; };
  if(more) more.addEventListener('click', expand);
  document.querySelectorAll('.gbtn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.gbtn').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    if(b.dataset.g !== 'all') expand();
    items.forEach(it => { it.hidden = !(b.dataset.g === 'all' || it.dataset.cat === b.dataset.g); });
    layout();
  }));
  /* masonry that keeps chronological order row by row: each photo goes to the shortest column */
  let ncols = 0;
  function layout(){
    const n = window.innerWidth <= 900 ? 2 : 3;
    ncols = n;
    const cols = Array.from({length:n}, () => { const c = document.createElement('div'); c.className = 'gcol'; return c; });
    gal.querySelectorAll('.gcol').forEach(c => c.remove());
    cols.forEach(c => gal.appendChild(c));
    items.forEach(it => {
      if(it.hidden){ cols[0].appendChild(it); return; }
      let best = cols[0];
      cols.forEach(c => { if(c.offsetHeight < best.offsetHeight - 1) best = c; });
      best.appendChild(it);
    });
  }
  layout();
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { const n = window.innerWidth <= 900 ? 2 : 3; if(n !== ncols) layout(); }, 150); });
  const lb = document.getElementById('lb'), img = document.getElementById('lbimg'), cap = document.getElementById('lbcap');
  let cur = 0, last = null;
  const visible = () => items.filter(it => !it.hidden && it.offsetParent !== null);
  function show(it){
    const btn = it.querySelector('.gopen');
    img.src = btn.dataset.full;
    img.alt = btn.querySelector('img').alt;
    cap.innerHTML = it.querySelector('figcaption').innerHTML;
    cur = visible().indexOf(it);
  }
  function open(it){ last = document.activeElement; show(it); lb.hidden = false; document.body.style.overflow = 'hidden'; document.getElementById('lbx').focus(); }
  function close(){ lb.hidden = true; img.src = ''; document.body.style.overflow = ''; if(last) last.focus(); }
  function step(d){ const v = visible(); if(v.length) show(v[(cur + d + v.length) % v.length]); }
  items.forEach(it => it.querySelector('.gopen').addEventListener('click', () => open(it)));
  document.getElementById('lbx').addEventListener('click', close);
  document.getElementById('lbp').addEventListener('click', () => step(-1));
  document.getElementById('lbn').addEventListener('click', () => step(1));
  lb.addEventListener('click', e => { if(e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if(lb.hidden) return;
    if(e.key === 'Escape') close();
    else if(e.key === 'ArrowLeft') step(-1);
    else if(e.key === 'ArrowRight') step(1);
  });
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, {passive:true});
  lb.addEventListener('touchend', e => { if(x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if(Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); x0 = null; });
})();
/* ---------- embedded CV (works with no separate file on the server) ---------- */
/* CV : fichier CV_Dr_Ibrahima_DIOUF.pdf à la racine du dépôt */

/* old one-page links (ibrahimadiouf.com/#publications ...) now open the matching page */
(function(){
  const map = {recherche:'/research', dashboards:'/dashboards', impact:'/impact',
               publications:'/publications', parcours:'/career', contact:'/contact'};
  const h = location.hash.slice(1);
  if(map[h] && (location.pathname === '/' || location.pathname.endsWith('/index.html'))) location.replace(map[h]);
})();
