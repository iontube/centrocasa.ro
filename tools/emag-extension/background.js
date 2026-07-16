// Service worker: primeste produse de la content-script si le POST-eaza la colectorul CentroCasa.
const COLLECTOR = 'https://centrocasa-emag-collector.noisy-star-b5e3.workers.dev';
const SECRET = 'ccasa_emag_2026';

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg && msg.type === 'products' && Array.isArray(msg.items)) {
    fetch(COLLECTOR + '/?k=' + SECRET, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ products: msg.items }),
    })
      .then((r) => r.json())
      .then((j) => {
        chrome.storage.local.get({ totalSent: 0 }, (d) => {
          chrome.storage.local.set({ totalSent: (d.totalSent || 0) + (j.saved || 0) });
        });
        reply({ ok: true, saved: j.saved || 0 });
      })
      .catch((e) => reply({ ok: false, error: String(e) }));
    return true;
  }
  if (msg && msg.type === 'getTotal') {
    chrome.storage.local.get({ totalSent: 0 }, (d) => reply(d));
    return true;
  }
});
