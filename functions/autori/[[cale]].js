// Autorii vechi au fost inlocuiti cu Redactia CentroCasa (Lucian Grecu si Alina Grecu).
export const onRequest = ({ request }) => Response.redirect(new URL('/despre/', request.url).toString(), 301);
