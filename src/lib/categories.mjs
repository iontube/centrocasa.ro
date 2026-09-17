// Sursa unica pentru categorii (nume, slug, descriere).
export const categories = [
  {
    name: 'Gradinarit si Unelte',
    short: 'Gradinarit',
    slug: 'gradinarit-unelte',
    description: 'Recenzii si comparatii pentru tractorase de tuns gazonul, motocoase, motosape si unelte de gradina. Te ajutam sa alegi echipamentele potrivite pentru ingrijirea curtii si gradinii tale, indiferent de suprafata sau buget.'
  },
  {
    name: 'Mobilier Gradina',
    short: 'Mobilier Gradina',
    slug: 'mobilier-gradina',
    description: 'Seturi de masa si scaune pentru gradina, umbrele rezistente la vant, hamace si mobilier de terasa. Transforma spatiul exterior intr-o oaza de relaxare cu recomandarile noastre testate si verificate.'
  },
  {
    name: 'Electrocasnice Casa',
    short: 'Electrocasnice',
    slug: 'electrocasnice-casa',
    description: 'Aspiratoare robot, aparate de aer conditionat, purificatoare de aer si electrocasnice moderne pentru o casa confortabila. Analizam performanta, consumul energetic si raportul calitate-pret pentru fiecare produs.'
  },
  {
    name: 'Bucatarie si Gatit',
    short: 'Bucatarie',
    slug: 'bucatarie-gatit',
    description: 'Oale, cratite, tigai si vase de gatit comparate pe material, compatibilitate cu plita, capacitate reala si ce spun cumparatorii dupa luni de folosire.'
  },
  {
    name: 'Decoratiuni Casa',
    short: 'Decoratiuni',
    slug: 'decoratiuni-casa',
    description: 'Corpuri de iluminat pentru living, plante artificiale decorative, tablouri si accesorii pentru amenajari interioare moderne. Idei si recomandari pentru a-ti transforma locuinta intr-un spatiu elegant si primitor.'
  },
  {
    name: 'Curatenie si Intretinere',
    short: 'Curatenie',
    slug: 'curatenie-intretinere',
    description: 'Masini de spalat cu presiune, aspiratoare profesionale, produse de curatenie si sfaturi practice pentru intretinerea casei. Solutii eficiente pentru a mentine casa curata si ordonata cu efort minim.'
  },
  {
    name: 'Mobila si Dormitor',
    short: 'Mobila',
    slug: 'mobila-dormitor',
    description: 'Saltele ortopedice, canapele si mobila pentru dormitor, living si bucatarie. Comparam fermitatea, materialele si confortul, cu recomandari clare in functie de cum dormi si de spatiul pe care il ai.'
  },
  {
    name: 'Amenajari si Instalatii',
    short: 'Amenajari',
    slug: 'amenajari-instalatii',
    description: 'Usi de interior si exterior, cabine de dus, panouri solare, saune, generatoare si piscine. Comparam materiale, montaj si eficienta, cu recomandari clare pentru amenajarea si dotarea casei.'
  },
  {
    name: 'Securitate si Smart Home',
    short: 'Securitate',
    slug: 'securitate-smart-home',
    description: 'Camere de supraveghere, yale inteligente, senzori de miscare, sonerii video si prize smart. Explicam ce se monteaza singur si ce cere electrician, cum stau lucrurile cu abonamentele si stocarea in cloud, si ce alegi cand nu ai internet la locatie.'
  },
  {
    name: 'Incalzire si Climatizare',
    short: 'Incalzire',
    slug: 'incalzire-climatizare',
    description: 'Calorifere si convectoare electrice, seminee, sobe, boilere, dezumidificatoare, purificatoare si ventilatoare. Comparam consumul real, puterea de care ai nevoie pe metru patrat si costul de folosire pe sezon, nu doar pretul de pe eticheta.'
  }
];

export function categoryBySlug(slug) {
  return categories.find(c => c.slug === slug);
}
