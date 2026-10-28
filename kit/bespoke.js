// Rend fonctionnelles les maquettes sur mesure dessinées en deux versions (.dk ordinateur, .mb mobile) :
// champs saisissables, boutons reliés, menu mobile, demande de date avec confirmation. Aucune donnée n'est envoyée.
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const B = document.body.dataset;
  const ACC = B.accent || '#222', TEL = B.tel || '+33000000000', MAIL = B.mail || 'contact@exemple.fr', NAME = B.name || document.title.split(' — ')[0];
  const fmtDate = v => v ? new Date(v + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const isMob = () => getComputedStyle($('.mb')).display !== 'none';
  const root = () => isMob() ? $('.mb') : $('.dk');

  // ---- styles des éléments ajoutés
  const css = document.createElement('style');
  css.textContent = `
  .bk-in{all:unset;display:block;width:100%;box-sizing:border-box;font:inherit;color:inherit;cursor:text;min-height:1.3em}
  .bk-in::placeholder{color:inherit;opacity:.5}
  select.bk-in{cursor:pointer;appearance:auto}
  textarea.bk-in{height:calc(100% - 22px);resize:none}
  .bk-in:focus{outline:none;box-shadow:0 1px 0 0 currentColor}
  .btn[role=button],.cal .d span:not(.full),.burger,.call,.links span,.pl{cursor:pointer}
  .cal .d span.sel{outline:2px solid ${ACC};outline-offset:2px}
  .bk-ov{position:fixed;inset:0;z-index:200;background:rgba(12,12,12,.55);display:none;align-items:center;justify-content:center;padding:16px;font-family:inherit}
  .bk-ov.on{display:flex}
  .bk-dl{background:#fff;color:#1d1d1b;width:min(520px,100%);max-height:calc(100vh - 32px);overflow:auto;border-radius:10px;padding:28px 26px;position:relative;box-shadow:0 30px 80px rgba(0,0,0,.3);font-size:15.5px;line-height:1.55}
  .bk-dl h3{font-size:24px;line-height:1.2;margin:0 34px 6px 0}
  .bk-dl p{color:#5d5d58;margin:0 0 12px}
  .bk-dl .x{position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;border:0;background:#f0efeb;font-size:20px;cursor:pointer;color:#1d1d1b}
  .bk-dl dl{display:grid;grid-template-columns:auto 1fr;gap:4px 16px;margin:10px 0 16px;padding:12px 14px;background:#f5f4f0;border-radius:6px;font-size:14.5px}
  .bk-dl dt{color:#6b6b66}.bk-dl dd{margin:0;font-weight:600}
  .bk-dl form{display:grid;gap:10px}
  .bk-dl label{display:grid;gap:4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:#444}
  .bk-dl input,.bk-dl select,.bk-dl textarea{font:inherit;font-size:15px;letter-spacing:0;text-transform:none;font-weight:400;color:#1d1d1b;border:1px solid #d8d6cf;border-radius:6px;padding:11px 12px;background:#fff;width:100%;box-sizing:border-box}
  .bk-dl input:focus,.bk-dl select:focus,.bk-dl textarea:focus{outline:2px solid ${ACC};outline-offset:0;border-color:transparent}
  .bk-dl .cs{display:flex;gap:10px;text-transform:none;letter-spacing:0;font-weight:400;font-size:13.5px;color:#5d5d58}
  .bk-dl .cs input{width:auto;margin-top:3px;accent-color:${ACC}}
  .bk-dl button.go,.bk-dl a.go{display:flex;justify-content:center;align-items:center;width:100%;border:0;border-radius:6px;background:${ACC};color:#fff;font:inherit;font-weight:700;padding:14px;cursor:pointer;margin-top:6px;text-decoration:none}
  .bk-dl .ok{border-left:4px solid ${ACC};padding-left:14px}
  .bk-dl .demo{font-size:12.5px;color:#8a8a84;margin-top:12px}
  .bk-mn{position:fixed;inset:0;z-index:150;background:#fff;display:none;flex-direction:column;padding:84px 24px 30px;font-family:inherit}
  .bk-mn.on{display:flex}
  .bk-mn a{font-size:26px;padding:12px 0;border-bottom:1px solid #e6e4de;color:#1d1d1b;text-decoration:none}
  .bk-mn a.go{margin-top:22px;border:0;background:${ACC};color:#fff;text-align:center;border-radius:6px;font-size:17px;font-weight:700}
  .bk-mn .x{position:absolute;top:18px;right:18px;width:44px;height:44px;border-radius:50%;border:1px solid #ddd;background:#fff;font-size:22px;cursor:pointer}
  .bk-toast{position:fixed;left:50%;bottom:96px;transform:translateX(-50%);background:#1d1d1b;color:#fff;padding:11px 18px;border-radius:6px;font-size:14.5px;z-index:220;opacity:0;transition:opacity .25s;pointer-events:none;max-width:calc(100vw - 32px);text-align:center}
  .bk-toast.on{opacity:1}`;
  document.head.append(css);

  const toast = m => { let t = $('.bk-toast'); if (!t) { t = document.createElement('div'); t.className = 'bk-toast'; t.setAttribute('role', 'status'); document.body.append(t); } t.textContent = m; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2600); };

  // ---- fenêtre de demande
  const ov = document.createElement('div'); ov.className = 'bk-ov'; ov.innerHTML = '<div class="bk-dl" role="dialog" aria-modal="true"><button class="x" type="button" aria-label="Fermer">×</button><div class="ct"></div></div>';
  document.body.append(ov);
  const close = () => ov.classList.remove('on');
  ov.addEventListener('click', e => { if (e.target === ov || e.target.closest('.x')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { close(); menu.classList.remove('on'); } });
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function dialog(title, intro, summary, fields = ['nom', 'email', 'tel'], cta = 'Envoyer ma demande', okText = 'Nous vous répondons sous 48 h.') {
    const rows = summary.filter(([, v]) => v).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
    const F = { nom: '<label>Nom<input name="nom" autocomplete="name" required></label>', email: '<label>E-mail<input name="email" type="email" autocomplete="email" required></label>', tel: '<label>Téléphone<input name="tel" type="tel" autocomplete="tel"></label>', msg: '<label>Message<textarea name="msg" rows="3"></textarea></label>' };
    $('.ct', ov).innerHTML = `<h3>${esc(title)}</h3><p>${esc(intro)}</p>${rows ? `<dl>${rows}</dl>` : ''}<form novalidate>${fields.map(f => F[f]).join('')}<label class="cs"><input type="checkbox" required> J’accepte que ces informations servent à répondre à ma demande.</label><button class="go" type="submit">${esc(cta)}</button></form>`;
    $('form', ov).addEventListener('submit', e => {
      e.preventDefault(); const f = e.target; if (!f.reportValidity()) return;
      $('.ct', ov).innerHTML = `<div class="ok"><h3>Demande envoyée</h3><p>Merci ${esc(f.nom ? f.nom.value : '')}. ${esc(okText)}</p></div>${rows ? `<dl>${rows}</dl>` : ''}<p class="demo">Maquette de démonstration : aucune donnée n’est envoyée.</p><button class="go" type="button">Fermer</button>`;
      $('.ct .go', ov).onclick = close;
    });
    ov.classList.add('on'); setTimeout(() => $('input', ov)?.focus(), 50);
  }
  function legal() {
    $('.ct', ov).innerHTML = `<h3>Mentions légales</h3><p>${esc(NAME)}, [forme juridique], SIRET [000 000 000 00000], [adresse]. Hébergeur : [nom et adresse de l’hébergeur].</p><h3 style="font-size:19px;margin-top:16px">Données personnelles</h3><p>Les informations envoyées par les formulaires servent uniquement à répondre à votre demande. Elles sont conservées trois ans au plus. Pour y accéder ou les supprimer : [e-mail de contact].</p><p class="demo">Maquette : emplacements à compléter. Photos : Unsplash.</p>`;
    ov.classList.add('on');
  }

  // ---- champs dessinés -> vrais champs
  const formulas = sc => [...new Set($$('.tc h3, .tc b, .fc b, .card h3, .fm h3, [class*=plan] h3', sc).map(e => e.textContent.trim()).filter(Boolean))];
  function makeInput(label, shown, sc) {
    const l = label.toLowerCase();
    let el;
    if (/date/.test(l)) { el = document.createElement('input'); el.type = 'date'; el.min = new Date(Date.now() + 864e5).toISOString().slice(0, 10); el.required = true; }
    else if (/formule/.test(l) && formulas(sc).length) { el = document.createElement('select'); formulas(sc).forEach(f => el.add(new Option(f, f, false, f === shown))); }
    else if (/mail/.test(l)) { el = document.createElement('input'); el.type = 'email'; el.required = true; el.placeholder = shown; }
    else if (/invit|nombre|personnes/.test(l)) { el = document.createElement('input'); el.type = 'number'; el.min = 1; el.placeholder = shown.replace(/[^0-9 ]/g, '').trim() || 'environ'; }
    else if (/mariage$/.test(l) && /^\d{4}$/.test(shown)) { el = document.createElement('select'); ['2027', '2028', '2029'].forEach(y => el.add(new Option(y))); }
    else { el = document.createElement('input'); el.placeholder = shown.replace(/^\[|\]$/g, ''); if (/pr[ée]nom|nom/.test(l)) el.required = true; }
    el.className = 'bk-in'; el.name = l.replace(/[^a-z]+/g, '-'); el.dataset.label = label; el.setAttribute('aria-label', label);
    return el;
  }
  // .field (libellé en <b> ou .mono, valeur en texte)
  $$('.field').forEach(f => {
    const lab = f.querySelector('b, .mono, .cap'); if (!lab) return;
    const label = lab.textContent.trim(); const shown = [...f.childNodes].filter(n => n !== lab).map(n => n.textContent).join('').trim();
    [...f.childNodes].forEach(n => { if (n !== lab) n.remove(); });
    const sc = f.closest('.dk, .mb');
    let el = makeInput(label, shown, sc);
    if (f.offsetHeight > 90 || /projet|journée|message/i.test(label)) { el = document.createElement('textarea'); el.className = 'bk-in'; el.placeholder = shown; el.name = 'message'; el.dataset.label = label; el.setAttribute('aria-label', label); }
    f.append(el); f.style.cursor = 'text'; f.addEventListener('click', () => el.focus());
  });
  // blocs « libellé + valeur en gras » (.check, .book)
  $$('.check > div, .book .f > div').forEach(d => {
    const lab = d.querySelector('.cap'), b = d.querySelector('b'); if (!lab || !b) return;
    const el = makeInput(lab.textContent.trim(), b.textContent.trim(), d.closest('.dk, .mb'));
    el.style.fontWeight = getComputedStyle(b).fontWeight; el.style.fontSize = getComputedStyle(b).fontSize; el.style.fontFamily = getComputedStyle(b).fontFamily;
    b.replaceWith(el); d.style.cursor = 'text'; d.addEventListener('click', () => el.focus());
  });

  const valuesOf = box => $$('.bk-in', box).map(i => [i.dataset.label, i.type === 'date' ? fmtDate(i.value) : i.value]);
  const widget = () => isMob() ? $('.mb .book') : ($('.dk .check') || $$('.dk .field').find(f => !f.closest('.form'))?.parentElement);
  function goWidget() {
    const w = widget(); if (!w) return goContact();
    w.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => $('.bk-in', w)?.focus({ preventScroll: true }), 500);
  }
  function goContact() { const c = root().querySelector('#contact, [id$=infos], .contact, .visit, #mb-final'); (c || root()).scrollIntoView({ behavior: 'smooth' }); }
  function submitWidget(box, kind) {
    const req = $$('.bk-in[required]', box).find(i => !i.value);
    if (req) { req.focus(); toast('Indiquez : ' + req.dataset.label.toLowerCase()); return; }
    const isVisit = /visite/i.test(kind);
    dialog(isVisit ? 'Organiser une visite' : 'Vérifier ma date', isVisit ? 'Laissez vos coordonnées : nous vous proposons un créneau de visite.' : 'Laissez vos coordonnées : nous vérifions la date et vous envoyons un devis.', valuesOf(box), ['nom', 'email', 'tel', 'msg'], isVisit ? 'Demander la visite' : 'Envoyer ma demande');
  }

  // ---- boutons
  $$('span.btn, .call, .pl').forEach(b => {
    b.setAttribute('role', 'button'); b.tabIndex = 0;
    const t = b.textContent.trim().toLowerCase(), box = b.closest('.check, .book, .form, .contact, #contact');
    let act;
    if (b.classList.contains('call') || /appeler|^\[?0\d/.test(t)) act = () => { location.href = 'tel:' + TEL; };
    else if (/écrire/.test(t)) act = () => { location.href = 'mailto:' + MAIL; };
    else if (/envoyer/.test(t) && box) act = () => {
      const f = b.closest('.form');
      const miss = $$('.bk-in[required]', f).find(i => !i.value || (i.type === 'email' && !i.checkValidity()));
      if (miss) { miss.focus(); toast('Vérifiez : ' + miss.dataset.label.toLowerCase()); return; }
      const rows = valuesOf(f);
      f.innerHTML = `<div style="grid-column:1/-1;padding:10px 4px"><h3 style="margin:0 0 8px">Demande envoyée</h3><p style="margin:0 0 12px">Nous vous répondons sous 48 h. Récapitulatif :</p>${rows.filter(r => r[1]).map(([k, v]) => `<div><b>${esc(k)}</b> : ${esc(v)}</div>`).join('')}<p style="font-size:13px;opacity:.7;margin-top:12px">Maquette de démonstration : aucune donnée n’est envoyée.</p></div>`;
    };
    else if (/tarif/.test(t)) act = () => (root().querySelector('#tarifs, #formules, #mb-sig') || root()).scrollIntoView({ behavior: 'smooth' });
    else if (/brochure/.test(t)) act = () => dialog('Recevoir la brochure tarifs', 'La brochure PDF vous est envoyée par e-mail.', [], ['nom', 'email'], 'Recevoir la brochure', 'La brochure arrive dans votre boîte mail.');
    else if (/option/.test(t)) act = () => {
      const s = $('.cal .d span.sel');
      if (!s) { toast('Choisissez d’abord un samedi libre dans le calendrier'); $('.cal').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      dialog('Poser une option', 'Option gratuite pendant 10 jours, sans engagement.', [['Date', s.dataset.when]], ['nom', 'email', 'tel'], 'Poser l’option', 'L’option est enregistrée, vous recevez la confirmation par e-mail.');
    };
    else if (/écouter|mix/.test(t) || b.classList.contains('pl')) act = () => {
      $('.ct', ov).innerHTML = `<h3>Écouter un mix</h3><p>Emplacement du lecteur : le mix du DJ s’intègre ici depuis Mixcloud ou SoundCloud.</p><dl><dt>Mix</dt><dd>[Titre du mix] · [durée]</dd><dt>Lien</dt><dd>[lien Mixcloud ou SoundCloud]</dd></dl><button class="go" type="button">Fermer</button>`;
      $('.ct .go', ov).onclick = close; ov.classList.add('on');
    };
    else if (/vérifier|réserver|visite|disponibilit/.test(t)) act = () => {
      const w = b.closest('.check, .book') || (box && $$('.bk-in', box).length && !b.closest('.form') ? box : null);
      if (w && /vérifier|visite|disponibilit/.test(t)) submitWidget(w, t);
      else if (!widget()) dialog(/visite/.test(t) ? 'Organiser une visite' : 'Vérifier ma date', 'Indiquez vos disponibilités : nous vous rappelons pour fixer un rendez-vous.', [], ['nom', 'email', 'tel', 'msg'], 'Envoyer ma demande');
      else goWidget();
    };
    else act = () => goContact();
    b.addEventListener('click', act);
    b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
  });

  // ---- calendrier des samedis (lieu de réception)
  $$('.cal .mo').forEach(mo => {
    const month = $('b', mo).textContent;
    $$('.d span', mo).forEach(s => {
      s.dataset.when = 'Samedi ' + s.textContent + ' ' + month.toLowerCase() + ' 2027';
      if (s.classList.contains('full')) { s.title = 'Date réservée'; return; }
      s.setAttribute('role', 'button'); s.tabIndex = 0; s.title = s.classList.contains('opt') ? 'Option en cours : liste d’attente possible' : 'Date libre';
      const pick = () => { $$('.cal .d span').forEach(x => x.classList.toggle('sel', x === s)); toast(s.dataset.when + (s.classList.contains('opt') ? ' : option en cours, liste d’attente' : ' : date libre')); };
      s.addEventListener('click', pick); s.addEventListener('keydown', e => { if (e.key === 'Enter') pick(); });
    });
  });

  // ---- menu mobile
  const menu = document.createElement('nav'); menu.className = 'bk-mn'; menu.setAttribute('aria-label', 'Menu');
  const mobTargets = $$('.mb section[id]');
  const findMob = label => {
    const L = label.toLowerCase();
    return mobTargets.find(s => (s.querySelector('h2, .cap')?.textContent || '').toLowerCase().includes(L.split(' ')[0].replace(/^l’|^le |^la /, '')))?.id || 'mb-final';
  };
  const navLinks = $$('.dk header nav a').map(a => [a.textContent.trim(), findMob(a.textContent.trim())]);
  const cta = $('.mb .sticky .btn')?.textContent.trim() || 'Contact';
  menu.innerHTML = '<button class="x" type="button" aria-label="Fermer le menu">×</button>' + navLinks.map(([t, id]) => `<a href="#${id}">${esc(t)}</a>`).join('') + `<a class="go" href="#">${esc(cta)}</a>`;
  document.body.append(menu);
  $$('a', menu).forEach(a => a.addEventListener('click', e => { menu.classList.remove('on'); if (a.classList.contains('go')) { e.preventDefault(); setTimeout(goWidget, 50); } }));
  $('.x', menu).onclick = () => menu.classList.remove('on');
  $$('.burger').forEach(b => { b.setAttribute('role', 'button'); b.setAttribute('aria-label', 'Menu'); b.tabIndex = 0; b.addEventListener('click', () => menu.classList.add('on')); b.addEventListener('keydown', e => { if (e.key === 'Enter') menu.classList.add('on'); }); });

  // ---- liens du pied de page mobile, mentions légales, réseaux
  $$('.mb .links span').forEach(s => {
    s.setAttribute('role', 'link'); s.tabIndex = 0;
    const t = s.textContent.trim();
    const go = () => /mention/i.test(t) ? legal() : document.getElementById(findMob(t))?.scrollIntoView({ behavior: 'smooth' });
    s.addEventListener('click', go); s.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  });
  $$('footer').forEach(ft => {
    ft.querySelectorAll('span, p, div').forEach(n => {
      if (n.children.length) return;
      n.innerHTML = n.innerHTML.replace(/Mentions légales/, '<a href="#" data-legal style="text-decoration:underline;text-underline-offset:3px">Mentions légales</a>').replace(/Confidentialité/, '<a href="#" data-legal style="text-decoration:underline;text-underline-offset:3px">Confidentialité</a>');
    });
  });
  $$('[data-legal]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); legal(); }));
})();
