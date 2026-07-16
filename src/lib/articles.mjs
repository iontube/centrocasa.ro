// Articolele noi (roundup-uri) se marcheaza FARA `legacy`; cele vechi au legacy:true.
// Pana avem destule articole noi aratam si cele vechi (site-ul nu se subtiaza), iar cand
// ajungem la prag ascundem complet cele vechi (raman 200, nu 404). Prag reglabil.
const HIDE_LEGACY_AT = 6;
export function visibleArticles(list) {
  const all = list || [];
  const fresh = all.filter(a => !a.legacy);
  return fresh.length >= HIDE_LEGACY_AT ? fresh : all;
}

export function slugify(s) {
  return (s || '').toLowerCase()
    .replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i')
    .replace(/ș/g, 's').replace(/ț/g, 't')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}
