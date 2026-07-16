// Articole vizibile: ascunde cele marcate `legacy` DOAR daca exista articole noi.
// Cat timp nu exista articole non-legacy, le arata pe toate (site-ul nu se goleste).
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
