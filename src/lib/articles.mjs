// Articolele noi (roundup-uri) se marcheaza FARA `legacy`; cele vechi au legacy:true.
// De indata ce apare macar un articol nou, cele vechi se ascund din index/categorii/sitemap
// (raman 200 pe link direct, nu 404). Daca inca nu exista articole noi, le aratam pe toate.
export function visibleArticles(list) {
  const all = list || [];
  const fresh = all.filter(a => !a.legacy);
  return fresh.length ? fresh : all;
}

export function slugify(s) {
  return (s || '').toLowerCase()
    .replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i')
    .replace(/ș/g, 's').replace(/ț/g, 't')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
