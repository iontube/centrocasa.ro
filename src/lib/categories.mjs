// Sursa unica pentru categorii (nume, slug, descriere).
export const categories = [
  {
    name: 'Gradinarit si Unelte',
    slug: 'gradinarit-unelte',
    description: 'Recenzii si comparatii pentru tractorase de tuns gazonul, motocoase, motosape si unelte de gradina. Te ajutam sa alegi echipamentele potrivite pentru ingrijirea curtii si gradinii tale, indiferent de suprafata sau buget.'
  },
  {
    name: 'Mobilier Gradina',
    slug: 'mobilier-gradina',
    description: 'Seturi de masa si scaune pentru gradina, umbrele rezistente la vant, hamace si mobilier de terasa. Transforma spatiul exterior intr-o oaza de relaxare cu recomandarile noastre testate si verificate.'
  },
  {
    name: 'Electrocasnice Casa',
    slug: 'electrocasnice-casa',
    description: 'Aspiratoare robot, aparate de aer conditionat, purificatoare de aer si electrocasnice moderne pentru o casa confortabila. Analizam performanta, consumul energetic si raportul calitate-pret pentru fiecare produs.'
  },
  {
    name: 'Decoratiuni Casa',
    slug: 'decoratiuni-casa',
    description: 'Corpuri de iluminat pentru living, plante artificiale decorative, tablouri si accesorii pentru amenajari interioare moderne. Idei si recomandari pentru a-ti transforma locuinta intr-un spatiu elegant si primitor.'
  },
  {
    name: 'Curatenie si Intretinere',
    slug: 'curatenie-intretinere',
    description: 'Masini de spalat cu presiune, aspiratoare profesionale, produse de curatenie si sfaturi practice pentru intretinerea casei. Solutii eficiente pentru a mentine casa curata si ordonata cu efort minim.'
  }
];

export function categoryBySlug(slug) {
  return categories.find(c => c.slug === slug);
}
