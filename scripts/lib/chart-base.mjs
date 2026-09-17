// Bazele comune pentru graficele statice din articole.
//
// ⭐ DIMENSIONARE PORNITA DE LA MOBIL (userul a prins fonturile ilizibile pe telefon).
// Graficele sunt imagini rasterizate afisate la latimea coloanei de text. Pe un telefon de
// 360 px, un canvas de 1600 px se reduce de 4.4 ori: un font de 20 px ajunge la 4.5 px pe ecran.
// Regula: canvas INGUST (1100 px) + fonturi MARI. Raport font/latime >= 0.031 inseamna
// minimum 11 px efectivi pe un ecran de 360 px, adica pragul de lizibilitate.
//   font 34 px la 1100 px canvas -> 11.1 px pe ecran  ✓
//   font 40 px la 1100 px canvas -> 13.1 px pe ecran  ✓
// La graficele cu multe randuri, creste INALTIMEA, nu latimea.
export const W = 1100;
export const FONT = 'DejaVu Sans, Arial, sans-serif';
export const SURFACE = '#fcfcfb';
export const INK = '#0b0b0b';
export const INK2 = '#52514e';
export const GRID = '#e4e3df';

// scara tipografica, calibrata pentru W = 1100
export const T = {
  titlu: 52,
  subtitlu: 36,
  eticheta: 38,   // nume de produs, categorii — 12.4 px pe un ecran de 360
  valoare: 40,    // cifra de pe marca
  axa: 34,
  legenda: 34,
  nota: 30,
};

export const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** verifica raportul de lizibilitate si avertizeaza daca un font e prea mic pentru mobil */
export function checkLizibilitate(fonts = Object.values(T)) {
  const prag = 0.031;
  const mici = fonts.filter(f => f / W < prag);
  if (mici.length) console.warn(`  ⚠️ fonturi sub pragul de lizibilitate mobil: ${mici.join(', ')} (minim ${Math.ceil(W * prag)} px)`);
  return mici.length === 0;
}
