// Registre opératoire — toutes les données restent sur l'appareil (localStorage), rien n'est envoyé en ligne.
const STORAGE_KEY = 'registre-operatoire-v1';
const BACKUP_KEY = 'registre-operatoire-sauvegarde';
const BACKUP_EVERY = 10; // rappel de sauvegarde tous les 10 nouveaux patients

const store = {
  data: { patients: [], fiches: [], astuces: {}, ficheImages: {}, ficheEdits: {}, autoFiches: false },
  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) this.data = { patients: saved.patients || [], fiches: saved.fiches || [], astuces: saved.astuces || {}, ficheImages: saved.ficheImages || {}, ficheEdits: saved.ficheEdits || {}, autoFiches: !!saved.autoFiches };
    } catch (e) { /* données illisibles : on repart de zéro sans les écraser tant que rien n'est modifié */ }
  },
  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  },
};

// Suivi des sauvegardes : nombre de patients ajoutés depuis la dernière, et sa date.
const backup = {
  get state() {
    try {
      const saved = JSON.parse(localStorage.getItem(BACKUP_KEY));
      if (saved) return saved;
    } catch (e) { /* on repart du nombre de patients */ }
    return { ajouts: store.data.patients.length, date: null };
  },
  set state(value) { localStorage.setItem(BACKUP_KEY, JSON.stringify(value)); },
  patientAdded() { const s = this.state; this.state = { ...s, ajouts: s.ajouts + 1 }; },
  done() { this.state = { ajouts: 0, date: new Date().toISOString() }; },
  get due() { return this.state.ajouts >= BACKUP_EVERY; },
};
let backupSnoozed = false;

// Radios post-op : images trop lourdes pour localStorage, rangées dans IndexedDB (toujours sur l'appareil).
const RADIO_MAX = 1600; // plus grand côté, en pixels
const radios = {
  db: null,
  open() {
    if (!this.db) this.db = new Promise((resolve, reject) => {
      const req = indexedDB.open('registre-operatoire', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('radios');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return this.db;
  },
  async run(mode, fn) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('radios', mode);
      const req = fn(tx.objectStore('radios'));
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = tx.onabort = () => reject(tx.error);
    });
  },
  put(id, blob) { return this.run('readwrite', s => s.put(blob, id)); },
  get(id) { return this.run('readonly', s => s.get(id)); },
  remove(id) { return this.run('readwrite', s => s.delete(id)).catch(() => {}); },
  clear() { return this.run('readwrite', s => s.clear()); },
};

// Réduit la photo (les photos d'iPhone font plusieurs Mo) et la convertit en JPEG.
async function shrinkImage(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, RADIO_MAX / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('conversion')), 'image/jpeg', 0.8));
  } finally {
    URL.revokeObjectURL(url);
  }
}

const toDataUrl = blob => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(blob);
});

// Adresses temporaires des images affichées dans la fenêtre de saisie, libérées à sa fermeture.
let sheetUrls = [];
const objectUrl = blob => { const url = URL.createObjectURL(blob); sheetUrls.push(url); return url; };

// Images ajoutées aux fiches (rangées avec les radios, sur l'appareil) : ficheImages = { idFiche: [idImage, …] }.
const ficheImages = id => (store.data.ficheImages ||= {})[id] || [];
let ficheUrls = [];

// Visionneuse plein écran : toutes les images de la série, on passe de l'une à l'autre en glissant (ou avec les flèches).
function openViewer(srcs, index = 0) {
  const viewer = document.createElement('div');
  viewer.className = 'viewer';
  viewer.innerHTML = `
    <div class="viewer-track">${srcs.map(src => `<div class="viewer-slide"><img src="${src}" alt="Image"></div>`).join('')}</div>
    <button type="button" class="viewer-close" aria-label="Fermer">✕</button>
    ${srcs.length > 1 ? `<span class="viewer-count"></span>
    <button type="button" class="viewer-nav prev" aria-label="Image précédente">‹</button>
    <button type="button" class="viewer-nav next" aria-label="Image suivante">›</button>` : ''}`;
  document.body.append(viewer);
  const track = $('.viewer-track', viewer);
  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  const paint = () => {
    if (srcs.length < 2) return;
    $('.viewer-count', viewer).textContent = `${current() + 1} / ${srcs.length}`;
    $('.prev', viewer).hidden = current() === 0;
    $('.next', viewer).hidden = current() === srcs.length - 1;
  };
  const go = (i, smooth = true) => track.scrollTo({ left: i * track.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
  go(index, false);
  paint();
  track.addEventListener('scroll', paint);
  viewer.addEventListener('click', e => {
    if (e.target.closest('.prev')) go(current() - 1);
    else if (e.target.closest('.next')) go(current() + 1);
    else if (e.target.tagName !== 'IMG') viewer.remove(); // la croix, ou le fond noir autour de l'image
  });
}

// Ouvre la visionneuse sur l'image touchée, avec toutes les vignettes de la même grille.
function viewGrid(grid, img) {
  const imgs = [...grid.querySelectorAll('img')];
  openViewer(imgs.map(i => i.src), imgs.indexOf(img));
}

const $ = (sel, root = document) => root.querySelector(sel);
const view = $('#view');
const sheet = $('#sheet');
const sheetBody = $('#sheet-body');
let currentTab = 'patients';
let search = '';
let openFicheId = null;

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const frDate = iso => iso ? new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
const key = s => String(s || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const stars = n => `<span class="stars" aria-label="${n} sur 5">${'★'.repeat(n)}<span class="off">${'★'.repeat(5 - n)}</span></span>`;
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

const allFiches = () => [
  // une fiche fournie avec l'appli peut avoir été renommée sur l'appareil
  ...FICHES_INTEGREES.map(f => ({ ...f, titre: store.data.ficheEdits?.[f.id]?.titre || f.titre, integree: true })),
  ...store.data.fiches,
].sort((a, b) => a.titre.localeCompare(b.titre, 'fr'));

// Regroupe les patients par opération (sans tenir compte des majuscules ni des accents).
// Rôle au bloc : opérateur (par défaut, y compris pour les patients saisis avant ce choix) ou aide.
const isAide = p => p.role === 'aide';

function operationsStats(patients = store.data.patients) {
  const map = new Map();
  for (const p of patients) {
    const k = key(p.operation);
    if (!k) continue;
    if (!map.has(k)) map.set(k, { label: p.operation.trim(), count: 0, noteSum: 0, noted: 0 });
    const op = map.get(k);
    op.count++;
    if (p.note) { op.noteSum += p.note; op.noted++; }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'fr'));
}

function render() {
  ficheUrls.forEach(url => URL.revokeObjectURL(url));
  ficheUrls = [];
  const n = store.data.patients.length;
  $('#counter').textContent = plural(n, 'patient');
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('active', b.dataset.tab === currentTab));
  $('#title').textContent = { patients: 'Patients', stats: 'Statistiques', fiches: 'Fiches' }[currentTab];
  ({ patients: renderPatients, stats: renderStats, fiches: openFicheId ? renderFiche : renderFiches })[currentTab]();
}

/* ---------- Patients ---------- */

function renderPatients() {
  const reminder = backup.due && !backupSnoozed ? `
    <div class="backup-banner">
      <p>💾 <b>${backup.state.ajouts} ${backup.state.ajouts > 1 ? 'nouveaux patients' : 'nouveau patient'}</b> depuis la dernière sauvegarde.</p>
      <div class="actions"><button class="btn ghost" id="backup-later">Plus tard</button><button class="btn primary" id="backup-now">Sauvegarder</button></div>
    </div>` : '';
  view.innerHTML = `${reminder}
    <input type="search" id="q" class="search" placeholder="Rechercher un patient, une opération…" value="${esc(search)}">
    <ul class="list" id="patient-list"></ul>
    <button class="fab" id="add-patient" aria-label="Ajouter un patient">+</button>`;
  $('#q').addEventListener('input', e => { search = e.target.value; renderPatientList(); });
  $('#add-patient').addEventListener('click', () => openPatientForm());
  $('#backup-now')?.addEventListener('click', exportData);
  $('#backup-later')?.addEventListener('click', () => { backupSnoozed = true; render(); });
  renderPatientList();
}

function renderPatientList() {
  const list = $('#patient-list');
  const q = key(search);
  const patients = store.data.patients
    .filter(p => !q || key(`${p.nom} ${p.prenom} ${p.operation} ${p.commentaire}`).includes(q))
    .sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.id.localeCompare(a.id));
  if (!patients.length) {
    list.innerHTML = `<li class="empty">${store.data.patients.length
      ? 'Aucun patient ne correspond à la recherche.'
      : 'Aucun patient pour l’instant.<br>Touchez le bouton <b>+</b> pour ajouter votre première opération.'}</li>`;
    return;
  }
  list.innerHTML = patients.map(p => `
    <li class="card patient${isAide(p) ? ' aide' : ''}" data-id="${esc(p.id)}">
      ${isAide(p) ? '<span class="badge-aide">Aide</span>' : ''}
      <div class="card-head">
        <strong>${esc((p.nom || '').toUpperCase())} ${esc(p.prenom)}${p.age ? `<span class="age"> · ${esc(p.age)} ans</span>` : ''}</strong>
        ${p.note ? stars(p.note) : ''}
      </div>
      <div class="card-op">${esc(p.operation)}</div>
      <div class="card-date">${esc(frDate(p.date))}</div>
      ${p.commentaire ? `<p class="card-comment">${esc(p.commentaire)}</p>` : ''}
      ${p.radios?.length ? `<button type="button" class="open-radios" data-radios="${esc(p.id)}">🩻 Voir ${p.radios.length > 1 ? `les ${p.radios.length} radios` : 'la radio'}</button>` : ''}
    </li>`).join('');
  list.querySelectorAll('.card').forEach(li => li.addEventListener('click', () => openPatientForm(li.dataset.id)));
  // Bouton « Voir les radios » : ouvre directement la visionneuse, sans passer par la fiche du patient.
  list.querySelectorAll('.open-radios').forEach(btn => btn.addEventListener('click', async e => {
    e.stopPropagation();
    const patient = store.data.patients.find(p => p.id === btn.dataset.radios);
    const blobs = (await Promise.all((patient?.radios || []).map(rid => radios.get(rid).catch(() => null)))).filter(Boolean);
    if (!blobs.length) return;
    openViewer(blobs.map(blob => { const url = URL.createObjectURL(blob); ficheUrls.push(url); return url; }));
  }));
}

function openPatientForm(id) {
  const existing = store.data.patients.find(p => p.id === id);
  const p = existing || { nom: '', prenom: '', age: '', operation: '', role: 'operateur', date: today(), note: 0, commentaire: '' };
  let note = p.note || 0;
  let radioIds = [...(p.radios || [])];
  const addedIds = []; // radios ajoutées dans cette fenêtre : à effacer si on annule
  // Opérations déjà saisies pour d'autres patients, les plus fréquentes d'abord.
  const suggestions = operationsStats().map(o => o.label);

  openSheet(`
    <h2>${existing ? 'Modifier le patient' : 'Nouveau patient'}</h2>
    <form id="patient-form">
      <div class="field">Mon rôle au bloc
        <div class="segmented">
          <label><input type="radio" name="role" value="operateur"${isAide(p) ? '' : ' checked'}><span>Opérateur</span></label>
          <label class="aide"><input type="radio" name="role" value="aide"${isAide(p) ? ' checked' : ''}><span>Aide</span></label>
        </div>
      </div>
      <label>Nom<input name="nom" value="${esc(p.nom)}" autocomplete="off" autocapitalize="characters" required></label>
      <label>Prénom<input name="prenom" value="${esc(p.prenom)}" autocomplete="off" autocapitalize="words"></label>
      <label>Âge (ans)<input type="number" name="age" value="${esc(p.age)}" min="0" max="120" step="1" inputmode="numeric" autocomplete="off"></label>
      <label>Opération réalisée<input name="operation" id="op-input" value="${esc(p.operation)}" autocomplete="off" placeholder="Choisir ou écrire une opération" required></label>
      <div class="suggest" id="op-suggest" hidden></div>
      <label>Date<input type="date" name="date" value="${esc(p.date)}"></label>
      <div class="field">Comment je m’en suis sorti
        <div class="star-input" id="star-input">${[1, 2, 3, 4, 5].map(i => `<button type="button" data-n="${i}" aria-label="${i} étoile${i > 1 ? 's' : ''}">★</button>`).join('')}</div>
      </div>
      <label>Commentaire<textarea name="commentaire" rows="4" placeholder="Difficultés, points à retenir…">${esc(p.commentaire)}</textarea></label>
      <div class="field">Radios post-op
        <div class="radio-grid" id="radio-grid"></div>
        <label class="btn ghost file">📷 Ajouter une radio<input type="file" id="radio-input" accept="image/*" multiple hidden></label>
      </div>
      <div class="actions">
        ${existing ? '<button type="button" class="btn danger" id="delete-patient">Supprimer</button>' : ''}
        <button type="button" class="btn ghost" id="cancel">Annuler</button>
        <button type="submit" class="btn primary">Enregistrer</button>
      </div>
    </form>`);

  const paintStars = () => sheetBody.querySelectorAll('#star-input button').forEach(b => b.classList.toggle('on', +b.dataset.n <= note));
  sheetBody.querySelectorAll('#star-input button').forEach(b => b.addEventListener('click', () => {
    note = note === +b.dataset.n ? 0 : +b.dataset.n; // retoucher la même étoile efface la note
    paintStars();
  }));
  paintStars();

  // Menu déroulant des opérations : tout s'affiche au toucher du champ, puis se filtre à la frappe.
  const opInput = $('#op-input');
  const opSuggest = $('#op-suggest');
  const paintSuggest = () => {
    const q = key(opInput.value);
    const matches = suggestions.filter(s => key(s).includes(q) && key(s) !== q);
    opSuggest.hidden = !matches.length;
    opSuggest.innerHTML = matches.map(s => `<button type="button">${esc(s)}</button>`).join('');
  };
  opInput.addEventListener('focus', paintSuggest);
  opInput.addEventListener('input', paintSuggest);
  opInput.addEventListener('blur', () => setTimeout(() => { opSuggest.hidden = true; }, 300));
  // Empêche le champ de perdre le focus (et le menu de se fermer) avant que le choix soit pris en compte.
  ['pointerdown', 'mousedown'].forEach(type => opSuggest.addEventListener(type, e => e.preventDefault()));
  opSuggest.addEventListener('click', e => {
    const choice = e.target.closest('button');
    if (!choice) return;
    opInput.value = choice.textContent;
    opSuggest.hidden = true;
  });

  // Radios : vignettes, ajout (photo ou photothèque), retrait, affichage en grand.
  const grid = $('#radio-grid');
  const paintRadios = async () => {
    const items = await Promise.all(radioIds.map(async rid => ({ rid, blob: await radios.get(rid).catch(() => null) })));
    if (!grid.isConnected) return;
    grid.innerHTML = items.map(({ rid, blob }) => blob ? `
      <div class="radio-thumb">
        <img src="${objectUrl(blob)}" data-view alt="Radio post-op">
        <button type="button" data-remove="${esc(rid)}" aria-label="Retirer cette radio">✕</button>
      </div>` : '').join('');
  };
  grid.addEventListener('click', e => {
    if (e.target.dataset.remove) {
      if (!confirm('Retirer cette radio ?')) return;
      radioIds = radioIds.filter(rid => rid !== e.target.dataset.remove);
      paintRadios();
    } else if ('view' in e.target.dataset) viewGrid(grid, e.target);
  });
  $('#radio-input').addEventListener('change', async e => {
    for (const file of [...e.target.files]) {
      try {
        const rid = newId();
        await radios.put(rid, await shrinkImage(file));
        radioIds.push(rid);
        addedIds.push(rid);
      } catch (err) {
        alert('Cette image n’a pas pu être ajoutée.');
      }
    }
    e.target.value = '';
    paintRadios();
  });
  paintRadios();

  $('#cancel').addEventListener('click', () => { addedIds.forEach(rid => radios.remove(rid)); closeSheet(); });
  $('#delete-patient')?.addEventListener('click', () => {
    if (!confirm(`Supprimer définitivement ${p.nom} ${p.prenom} du registre ?`)) return;
    [...(p.radios || []), ...addedIds].forEach(rid => radios.remove(rid));
    store.data.patients = store.data.patients.filter(x => x.id !== id);
    store.save(); closeSheet(); render();
  });
  $('#patient-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const values = {
      nom: f.get('nom').trim(), prenom: f.get('prenom').trim(), age: f.get('age') ? Number(f.get('age')) : '', operation: f.get('operation').trim(), role: f.get('role') === 'aide' ? 'aide' : 'operateur',
      date: f.get('date') || today(), note, commentaire: f.get('commentaire').trim(), radios: radioIds,
    };
    [...(p.radios || []), ...addedIds].filter(rid => !radioIds.includes(rid)).forEach(rid => radios.remove(rid));
    const created = ficheForNewOperation(values.operation, existing?.id);
    if (created) toast(`Fiche « ${created.titre} » créée dans l’onglet Fiches`);
    if (existing) Object.assign(existing, values);
    else {
      backup.patientAdded(); // avant l'ajout : sans sauvegarde antérieure, le compte part du nombre de patients existants
      store.data.patients.push({ id: newId(), ...values });
      backupSnoozed = false;
    }
    store.save(); closeSheet(); render();
  });
}

/* ---------- Statistiques ---------- */

function renderStats() {
  const patients = store.data.patients;
  if (!patients.length) {
    view.innerHTML = '<p class="empty">Les statistiques apparaîtront dès le premier patient enregistré.</p>';
    return;
  }
  // Deux décomptes séparés : opérateur et aide.
  const mine = patients.filter(p => !isAide(p));
  const aides = patients.filter(isAide);
  const ops = operationsStats(mine);
  const opsAide = operationsStats(aides);
  const noted = mine.filter(p => p.note);
  const avg = noted.length ? (noted.reduce((s, p) => s + p.note, 0) / noted.length) : 0;

  // 12 derniers mois
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const inMonth = list => list.filter(p => (p.date || '').startsWith(k)).length;
    months.push({ label: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''), op: inMonth(mine), aide: inMonth(aides) });
  }
  const maxMonth = Math.max(1, ...months.map(m => m.op + m.aide));

  const opList = (list, cls) => {
    const max = list[0]?.count || 1;
    return `<ul class="list">${list.map(o => `
      <li class="card stat ${cls}">
        <div class="card-head"><strong>${esc(o.label)}</strong><span class="count">${o.count}</span></div>
        <div class="bar"><i style="width:${(o.count / max) * 100}%"></i></div>
        <div class="card-date">${o.noted ? `Note moyenne ${(o.noteSum / o.noted).toFixed(1).replace('.', ',')} ★` : 'Pas encore de note'}</div>
      </li>`).join('')}</ul>`;
  };

  view.innerHTML = `
    <div class="tiles">
      <div class="tile"><b>${mine.length}</b><span>en opérateur</span></div>
      <div class="tile aide"><b>${aides.length}</b><span>en aide</span></div>
      <div class="tile"><b>${avg ? avg.toFixed(1).replace('.', ',') : '–'}</b><span>note moyenne opérateur / 5</span></div>
    </div>
    <h2 class="section">Opérateur · ${plural(ops.length, 'opération')} ${ops.length > 1 ? 'différentes' : 'différente'}</h2>
    ${ops.length ? opList(ops, '') : '<p class="empty small">Aucun patient en opérateur pour l’instant.</p>'}
    <h2 class="section aide">Aide · ${plural(opsAide.length, 'opération')} ${opsAide.length > 1 ? 'différentes' : 'différente'}</h2>
    ${opsAide.length ? opList(opsAide, 'aide') : '<p class="empty small">Aucun patient en aide pour l’instant.</p>'}
    <h2 class="section">Par mois (12 derniers mois)</h2>
    <div class="months">${months.map(m => `
      <div class="month"><div class="bars"><span class="month-n">${m.op + m.aide || ''}</span>${m.aide ? `<i class="aide" style="height:${(m.aide / maxMonth) * 100}%"></i>` : ''}<i style="height:${(m.op / maxMonth) * 100}%"></i></div><span>${esc(m.label)}</span></div>`).join('')}</div>
    <p class="legend"><i></i>Opérateur <i class="aide"></i>Aide</p>`;
}

/* ---------- Fiches ---------- */

function renderFiches() {
  const fiches = allFiches();
  const ops = operationsStats(store.data.patients.filter(p => !isAide(p)));
  const opsAide = operationsStats(store.data.patients.filter(isAide));
  view.innerHTML = `
    <ul class="list">${fiches.length ? fiches.map(f => {
      const done = ops.find(o => key(o.label) === key(f.titre))?.count || 0;
      const helped = opsAide.find(o => key(o.label) === key(f.titre))?.count || 0;
      return `<li class="swipe-row">
        ${f.integree ? '' : `<button type="button" class="swipe-delete" data-delete="${esc(f.id)}" aria-label="Supprimer la fiche">✕</button>`}
        <div class="card fiche" data-id="${esc(f.id)}">
        <div class="card-head"><strong>${esc(f.titre)}</strong><span class="chevron">›</span></div>
        <div class="card-date">${done ? `Réalisée ${done} fois` : 'Pas encore réalisée'}${helped ? ` · aide ${helped} fois` : ''}${ficheImages(f.id).length ? ` · 🖼 ${plural(ficheImages(f.id).length, 'image')}` : ''}</div>
        </div>
      </li>`;
    }).join('') : '<li class="empty">Aucune fiche pour l’instant.<br>Touchez <b>+</b> pour créer une fiche d’opération.</li>'}</ul>
    <button class="fab" id="add-fiche" aria-label="Ajouter une fiche">+</button>`;
  // Toucher une fiche l'ouvre ; la glisser vers la gauche découvre la croix rouge de suppression.
  view.querySelectorAll('.swipe-row').forEach(row => {
    const card = $('.fiche', row);
    let start = null;
    let swiped = false;
    card.addEventListener('pointerdown', e => { start = { x: e.clientX, y: e.clientY }; swiped = false; });
    card.addEventListener('pointermove', e => {
      if (!start || !$('.swipe-delete', row)) return;
      const dx = e.clientX - start.x;
      if (Math.abs(dx) < 30 || Math.abs(dx) < Math.abs(e.clientY - start.y)) return;
      view.querySelectorAll('.swipe-row.swiped').forEach(other => other !== row && other.classList.remove('swiped'));
      row.classList.toggle('swiped', dx < 0);
      swiped = true;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => card.addEventListener(type, () => { start = null; }));
    card.addEventListener('click', () => {
      if (swiped) { swiped = false; return; } // fin du glissement : ne pas ouvrir la fiche
      if (row.classList.contains('swiped')) { row.classList.remove('swiped'); return; }
      openFicheId = card.dataset.id; render(); window.scrollTo(0, 0);
    });
    $('.swipe-delete', row)?.addEventListener('click', () => {
      const f = store.data.fiches.find(x => x.id === card.dataset.id);
      if (!confirm(`Supprimer définitivement la fiche « ${f.titre} », et ses images ?`)) { row.classList.remove('swiped'); return; }
      deleteFiche(f);
      store.save();
      render();
    });
  });
  $('#add-fiche').addEventListener('click', () => openFicheForm());
}

// Retire une fiche personnelle avec tout ce qui lui est rattaché (astuces, images de la fiche et de ses rubriques).
function deleteFiche(f) {
  store.data.fiches = store.data.fiches.filter(x => x.id !== f.id);
  delete store.data.astuces[f.id];
  dropImages(f.id);
  (f.sections || []).forEach(sec => dropImages(`${f.id}/${sec.id}`));
}

// Rubriques d'une fiche. Fiche fournie avec l'appli : texte d'origine, remplacé par la version modifiée
// sur l'appareil s'il y en a une (ficheEdits), plus les rubriques ajoutées. Fiche personnelle : ses propres rubriques.
// Renumérote les titres qui commencent par un numéro (« 3. INSTALLATION ») selon leur place actuelle,
// pour que la suite reste 1, 2, 3… après une suppression. Les titres sans numéro restent tels quels.
function renumber(sections) {
  let n = 0;
  return sections.map(sec => {
    const numbered = sec.titre.match(/^\d+\s*[.)]\s*(.*)$/);
    return numbered ? { ...sec, titre: `${++n}. ${numbered[1]}` } : sec;
  });
}

function ficheSections(f) {
  if (!f.integree) {
    f.sections ||= f.contenu ? [{ id: newId(), titre: 'Fiche', texte: f.contenu }] : []; // anciennes fiches à texte unique
    return renumber(f.sections.map(sec => ({ ...sec, perso: true })));
  }
  const edits = store.data.ficheEdits?.[f.id] || {};
  return renumber([
    ...f.sections.map(sec => {
      const id = key(sec.titre);
      const edited = edits.sections?.[id];
      return { id, ...(edited || sec), modifiee: !!edited };
    }).filter(sec => !edits.hidden?.includes(sec.id)), // rubriques d'origine supprimées par l'utilisateur
    ...(edits.extras || []).map(sec => ({ ...sec, perso: true })),
  ]);
}

// Liste où vivent les rubriques ajoutées par l'utilisateur pour cette fiche.
function persoSections(f) {
  if (!f.integree) return store.data.fiches.find(x => x.id === f.id).sections;
  const edits = (store.data.ficheEdits ||= {})[f.id] ||= {};
  return edits.extras ||= [];
}

// Texte d'origine d'une rubrique (issu des fiches Word) -> HTML : « - » puce, « - » en retrait sous-puce, « # » sous-titre, **gras**.
function renderTexte(texte) {
  const inline = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const out = [];
  let inList = false;
  for (const raw of String(texte || '').split('\n')) {
    const bullet = raw.match(/^(\s*)[-•]\s+(.*)$/);
    if (bullet) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li${bullet[1].length >= 2 ? ' class="sub"' : ''}>${inline(bullet[2])}</li>`);
      continue;
    }
    if (inList) { out.push('</ul>'); inList = false; }
    const line = raw.trim();
    if (!line) continue;
    out.push(line.startsWith('#') ? `<h4>${inline(line.replace(/^#+\s*/, ''))}</h4>` : `<p>${inline(line)}</p>`);
  }
  if (inList) out.push('</ul>');
  return out.join('');
}

// Ne garde du HTML saisi dans l'éditeur (ou venu d'une sauvegarde) que la mise en forme prévue : aucun script, lien ni style.
const SAFE_TAGS = new Set(['B', 'I', 'U', 'P', 'DIV', 'BR', 'UL', 'OL', 'LI', 'H4']);
const TAG_ALIASES = { STRONG: 'B', EM: 'I', H1: 'H4', H2: 'H4', H3: 'H4', H5: 'H4', H6: 'H4' };
function sanitizeHtml(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = String(html || '');
  const walk = node => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) continue;
      if (child.nodeType !== Node.ELEMENT_NODE || ['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED'].includes(child.tagName)) { child.remove(); continue; }
      walk(child);
      // texte passé en rouge par l'éditeur : <font color>, style « color » ou notre classe
      const red = child.classList.contains('red') || (child.tagName === 'FONT' && child.hasAttribute('color'))
        || /(^|[;\s])color\s*:/i.test(child.getAttribute('style') || '');
      const tag = TAG_ALIASES[child.tagName] || (SAFE_TAGS.has(child.tagName) ? child.tagName : null);
      if (!tag && !red) { child.replaceWith(...child.childNodes); continue; }
      const clean = document.createElement(tag || 'SPAN');
      if (red) clean.className = 'red';
      else if (tag === 'LI' && child.classList.contains('sub')) clean.className = 'sub';
      clean.append(...child.childNodes);
      child.replaceWith(clean);
    }
  };
  walk(tpl.content);
  return tpl.innerHTML;
}

// Une rubrique modifiée dans l'appli est enregistrée en HTML ; sinon on part du texte d'origine.
const sectionHtml = sec => (sec.html != null ? sanitizeHtml(sec.html) : renderTexte(sec.texte));
// Rubriques qui proposent un bouton photo, selon leur titre : installation, temps opératoires / voie d'abord.
function sectionPhotoLabel(sec) {
  const k = key(sec.titre);
  if (k.includes('installation')) return 'Ajouter une photo de l’installation';
  if (k.includes('temps op') || k.includes('temps chir') || k.includes('voie d')) return 'Ajouter une photo de la voie d’abord';
  return null;
}

// Rubriques d'une fiche vierge, créée quand une opération est saisie pour la première fois.
const FICHE_MODELE = ['1. INDICATIONS', '2. PLANIFICATION PRÉOPÉRATOIRE', '3. INSTALLATION AU BLOC', '4. CHAMPAGE',
  '5. TEMPS OPÉRATOIRES DÉTAILLÉS', '6. SUITES OPÉRATOIRES', '7. COMPLICATIONS À SURVEILLER'];

function createBlankFiche(titre) {
  const fiche = { id: newId(), titre, sections: FICHE_MODELE.map(t => ({ id: newId(), titre: t, html: '' })) };
  store.data.fiches.push(fiche);
  return fiche;
}

// Crée la fiche si l'opération n'a jamais été saisie pour un autre patient et qu'aucune fiche ne porte ce nom.
function ficheForNewOperation(operation, patientId) {
  const k = key(operation);
  if (!k) return null;
  if (store.data.patients.some(p => p.id !== patientId && key(p.operation) === k)) return null;
  if (allFiches().some(f => key(f.titre) === k)) return null;
  return createBlankFiche(operation.trim());
}

// Une seule fois : fiches vierges pour les opérations déjà saisies avant l'arrivée de cette fonction.
function initAutoFiches() {
  if (store.data.autoFiches) return;
  for (const op of operationsStats()) {
    if (!allFiches().some(f => key(f.titre) === key(op.label))) createBlankFiche(op.label);
  }
  store.data.autoFiches = true;
  store.save();
}

function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), 4000);
}

// Bloc « vignettes + bouton d'ajout » pour une liste d'images (fiche entière, ou rubrique : clé « idFiche/idRubrique »).
const imageBlock = (imgKey, label) => `
  <div class="img-block" data-key="${esc(imgKey)}">
    <div class="radio-grid"></div>
    <label class="btn ghost file">📷 ${label}<input type="file" accept="image/*" multiple hidden></label>
  </div>`;

// Branche les blocs d'images affichés : enregistrées dès l'ajout, sans bouton de validation.
function mountImageBlocks() {
  view.querySelectorAll('.img-block').forEach(block => {
    const imgKey = block.dataset.key;
    const grid = $('.radio-grid', block);
    const paint = async () => {
      const items = await Promise.all(ficheImages(imgKey).map(async iid => ({ iid, blob: await radios.get(iid).catch(() => null) })));
      if (!grid.isConnected) return;
      grid.innerHTML = items.map(({ iid, blob }) => {
        if (!blob) return '';
        const url = URL.createObjectURL(blob);
        ficheUrls.push(url);
        return `<div class="radio-thumb"><img src="${url}" data-view alt="Image de la fiche"><button type="button" data-remove="${esc(iid)}" aria-label="Retirer cette image">✕</button></div>`;
      }).join('');
    };
    grid.addEventListener('click', e => {
      if (e.target.dataset.remove) {
        if (!confirm('Retirer cette image de la fiche ?')) return;
        const iid = e.target.dataset.remove;
        store.data.ficheImages[imgKey] = ficheImages(imgKey).filter(x => x !== iid);
        if (!store.data.ficheImages[imgKey].length) delete store.data.ficheImages[imgKey];
        store.save();
        radios.remove(iid);
        paint();
      } else if ('view' in e.target.dataset) viewGrid(grid, e.target);
    });
    $('input', block).addEventListener('change', async e => {
      for (const file of [...e.target.files]) {
        try {
          const iid = newId();
          await radios.put(iid, await shrinkImage(file));
          store.data.ficheImages[imgKey] = [...ficheImages(imgKey), iid];
          store.save();
        } catch (err) {
          alert('Cette image n’a pas pu être ajoutée.');
        }
      }
      e.target.value = '';
      paint();
    });
    paint();
  });
}

// Efface les images rattachées à une clé (fiche ou rubrique).
function dropImages(imgKey) {
  ficheImages(imgKey).forEach(iid => radios.remove(iid));
  delete store.data.ficheImages?.[imgKey];
}

const openSections = new Set(); // rubriques dépliées, gardées le temps de la session

function renderFiche() {
  const f = allFiches().find(x => x.id === openFicheId);
  if (!f) { openFicheId = null; return renderFiches(); }
  $('#title').textContent = f.titre;
  const sections = ficheSections(f);
  const hidden = (f.integree && store.data.ficheEdits?.[f.id]?.hidden) || [];
  view.innerHTML = `
    <button class="back" id="back">‹ Toutes les fiches</button>
    <section class="fiche-images">
      <h2>🖼 Mes images</h2>
      ${imageBlock(f.id, 'Ajouter une image')}
    </section>
    ${f.entete ? `<p class="fiche-entete">${esc(f.entete)}</p>` : ''}
    <div class="sections">${sections.map(sec => {
      const imgKey = `${f.id}/${sec.id}`;
      return `
      <div class="section-row">
      <button type="button" class="swipe-delete" data-delete="${esc(sec.id)}" aria-label="Supprimer la rubrique">✕</button>
      <details class="section" data-id="${esc(sec.id)}"${openSections.has(imgKey) ? ' open' : ''}>
        <summary><span>${esc(sec.titre)}</span><button type="button" class="edit-section" data-edit="${esc(sec.id)}">Modifier</button></summary>
        <div class="fiche-content">
          ${sectionHtml(sec) || '<p><i>Rubrique vide : touchez « Modifier » pour la remplir.</i></p>'}
          ${sectionPhotoLabel(sec) || ficheImages(imgKey).length ? imageBlock(imgKey, sectionPhotoLabel(sec) || 'Ajouter une photo') : ''}
        </div>
      </details>
      </div>`;
    }).join('')}</div>
    <div class="actions column">
      <button class="btn ghost" id="add-section">+ Ajouter une rubrique</button>
      ${hidden.length ? `<button class="btn ghost" id="restore-sections">Rétablir ${hidden.length > 1 ? `les ${hidden.length} rubriques supprimées` : 'la rubrique supprimée'}</button>` : ''}
      <button class="btn ghost" id="edit-fiche">${f.integree ? 'Renommer la fiche' : 'Renommer ou supprimer la fiche'}</button>
    </div>`;
  view.querySelectorAll('.section').forEach(d => d.addEventListener('toggle', () => {
    openSections[d.open ? 'add' : 'delete'](`${f.id}/${d.dataset.id}`);
  }));
  view.querySelectorAll('.edit-section').forEach(b => b.addEventListener('click', e => {
    e.preventDefault(); // le bouton est dans le titre : ne pas replier/déplier la rubrique
    openSectionForm(f, sections.find(sec => sec.id === b.dataset.edit));
  }));
  $('#add-section').addEventListener('click', () => openSectionForm(f));

  // Glisser un titre vers la gauche découvre la croix rouge de suppression ; vers la droite, ou toucher ailleurs, la referme.
  view.querySelectorAll('.section-row').forEach(row => {
    const summary = $('summary', row);
    let start = null;
    let swiped = false;
    summary.addEventListener('pointerdown', e => { start = { x: e.clientX, y: e.clientY }; swiped = false; });
    summary.addEventListener('pointermove', e => {
      if (!start) return;
      const dx = e.clientX - start.x;
      if (Math.abs(dx) < 30 || Math.abs(dx) < Math.abs(e.clientY - start.y)) return;
      view.querySelectorAll('.section-row.swiped').forEach(other => other !== row && other.classList.remove('swiped'));
      row.classList.toggle('swiped', dx < 0);
      swiped = true;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => summary.addEventListener(type, () => { start = null; }));
    summary.addEventListener('click', e => {
      if (swiped) { e.preventDefault(); swiped = false; } // le glissement ne doit pas déplier la rubrique
      else if (row.classList.contains('swiped')) { e.preventDefault(); row.classList.remove('swiped'); }
    });
    $('.swipe-delete', row).addEventListener('click', () => {
      const sec = sections.find(x => x.id === row.querySelector('.section').dataset.id);
      if (!confirm(`Supprimer la rubrique « ${sec.titre} » ?`)) { row.classList.remove('swiped'); return; }
      if (sec.perso) {
        const list = persoSections(f);
        list.splice(list.findIndex(x => x.id === sec.id), 1);
        dropImages(`${f.id}/${sec.id}`);
      } else {
        // rubrique d'origine : seulement masquée, pour pouvoir la rétablir
        const edits = (store.data.ficheEdits ||= {})[f.id] ||= {};
        (edits.hidden ||= []).push(sec.id);
      }
      store.save();
      render();
    });
  });
  $('#restore-sections')?.addEventListener('click', () => {
    delete store.data.ficheEdits[f.id].hidden;
    store.save();
    render();
  });
  $('#back').addEventListener('click', () => { openFicheId = null; render(); });
  $('#edit-fiche').addEventListener('click', () => (f.integree ? openRenameForm(f) : openFicheForm(f.id)));
  mountImageBlocks();
}

function openFicheForm(id) {
  const existing = store.data.fiches.find(f => f.id === id);
  const f = existing || { titre: '' };
  openSheet(`
    <h2>${existing ? 'Renommer la fiche' : 'Nouvelle fiche'}</h2>
    <form id="fiche-form">
      <label>Opération<input name="titre" value="${esc(f.titre)}" autocomplete="off" required></label>
      ${existing ? '' : '<p class="hint">Vous ajouterez ensuite les rubriques (indications, installation, temps opératoires…) une par une.</p>'}
      <div class="actions">
        ${existing ? '<button type="button" class="btn danger" id="delete-fiche">Supprimer</button>' : ''}
        <button type="button" class="btn ghost" id="cancel">Annuler</button>
        <button type="submit" class="btn primary">Enregistrer</button>
      </div>
    </form>`);
  $('#cancel').addEventListener('click', closeSheet);
  $('#delete-fiche')?.addEventListener('click', () => {
    if (!confirm(`Supprimer définitivement la fiche « ${f.titre} », et ses images ?`)) return;
    deleteFiche(f);
    openFicheId = null;
    store.save(); closeSheet(); render();
  });
  $('#fiche-form').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const titre = data.get('titre').trim();
    if (existing) existing.titre = titre;
    else {
      const fiche = { id: newId(), titre, sections: [] };
      store.data.fiches.push(fiche);
      openFicheId = fiche.id; // on ouvre la nouvelle fiche pour y ajouter ses rubriques
    }
    store.save(); closeSheet(); render();
  });
}

// Renommer une fiche fournie avec l'appli : le nouveau nom est gardé sur l'appareil.
function openRenameForm(f) {
  const original = FICHES_INTEGREES.find(x => x.id === f.id).titre;
  openSheet(`
    <h2>Renommer la fiche</h2>
    <form id="rename-form">
      <label>Nom de la fiche<input name="titre" value="${esc(f.titre)}" autocomplete="off" required></label>
      <div class="actions">
        <button type="button" class="btn ghost" id="cancel">Annuler</button>
        <button type="submit" class="btn primary">Enregistrer</button>
      </div>
    </form>`);
  $('#cancel').addEventListener('click', closeSheet);
  $('#rename-form').addEventListener('submit', e => {
    e.preventDefault();
    const titre = new FormData(e.target).get('titre').trim();
    const edits = (store.data.ficheEdits ||= {})[f.id] ||= {};
    if (titre === original) delete edits.titre; else edits.titre = titre;
    store.save(); closeSheet(); render();
  });
}

// Ajout ou modification d'une rubrique (sec absent = nouvelle rubrique), avec éditeur de texte mis en forme.
function openSectionForm(f, sec) {
  openSheet(`
    <h2>${sec ? 'Modifier la rubrique' : 'Nouvelle rubrique'}</h2>
    <form id="section-form">
      <label>Titre<input name="titre" value="${esc(sec?.titre || '')}" autocomplete="off" required></label>
      <div class="field">Contenu
        <div class="toolbar" id="toolbar">
          <button type="button" data-cmd="bold" aria-label="Gras"><b>G</b></button>
          <button type="button" data-cmd="italic" aria-label="Italique"><i>I</i></button>
          <button type="button" data-cmd="underline" aria-label="Souligné"><u>S</u></button>
          <button type="button" data-cmd="red" aria-label="Rouge"><span class="red">A</span></button>
          <button type="button" data-cmd="insertUnorderedList">• Liste</button>
          <button type="button" data-cmd="h4">Sous-titre</button>
          <button type="button" data-cmd="removeFormat">Effacer</button>
        </div>
        <div class="editor fiche-content" id="editor" contenteditable="true" role="textbox" aria-multiline="true"></div>
      </div>
      <p class="hint">Sélectionnez du texte puis touchez <b>G</b> (gras), <b>I</b> (italique), <b>S</b> (souligné) ou <b>A</b> (rouge). « Effacer » retire la mise en forme.</p>
      <div class="actions">
        ${sec?.perso ? '<button type="button" class="btn danger" id="delete-section">Supprimer</button>' : ''}
        ${sec?.modifiee ? '<button type="button" class="btn danger" id="reset-section">Rétablir l’original</button>' : ''}
        <button type="button" class="btn ghost" id="cancel">Annuler</button>
        <button type="submit" class="btn primary">Enregistrer</button>
      </div>
    </form>`);
  const editor = $('#editor');
  const toolbar = $('#toolbar');
  editor.innerHTML = sec ? sectionHtml(sec) : '';

  // Boutons de mise en forme : ils agissent sur la sélection, sans faire perdre le curseur à l'éditeur.
  const paintToolbar = () => ['bold', 'italic', 'underline', 'insertUnorderedList'].forEach(cmd => {
    $(`[data-cmd="${cmd}"]`, toolbar).classList.toggle('on', document.queryCommandState(cmd));
  });
  ['pointerdown', 'mousedown'].forEach(type => toolbar.addEventListener(type, e => e.preventDefault()));
  toolbar.addEventListener('click', e => {
    const cmd = e.target.closest('button')?.dataset.cmd;
    if (!cmd) return;
    editor.focus();
    if (cmd === 'red') document.execCommand('foreColor', false, '#e0392b');
    else if (cmd === 'h4') document.execCommand('formatBlock', false, document.queryCommandValue('formatBlock').toLowerCase() === 'h4' ? 'p' : 'h4');
    else document.execCommand(cmd);
    paintToolbar();
  });
  ['keyup', 'mouseup', 'touchend', 'focus'].forEach(type => editor.addEventListener(type, paintToolbar));

  const done = () => { store.save(); closeSheet(); render(); };
  $('#cancel').addEventListener('click', closeSheet);
  $('#delete-section')?.addEventListener('click', () => {
    if (!confirm(`Supprimer définitivement la rubrique « ${sec.titre} » ?`)) return;
    const list = persoSections(f);
    list.splice(list.findIndex(x => x.id === sec.id), 1);
    dropImages(`${f.id}/${sec.id}`);
    done();
  });
  $('#reset-section')?.addEventListener('click', () => {
    if (!confirm('Abandonner vos modifications et revenir au texte d’origine de cette rubrique ?')) return;
    delete store.data.ficheEdits[f.id].sections[sec.id];
    done();
  });
  $('#section-form').addEventListener('submit', e => {
    e.preventDefault();
    const titre = new FormData(e.target).get('titre').trim();
    const html = editor.textContent.trim() ? sanitizeHtml(editor.innerHTML) : '';
    if (!sec) {
      const added = { id: newId(), titre, html };
      persoSections(f).push(added);
      openSections.add(`${f.id}/${added.id}`);
    } else if (sec.perso) {
      const target = persoSections(f).find(x => x.id === sec.id);
      Object.assign(target, { titre, html });
      delete target.texte; // ancien format texte, remplacé par la version mise en forme
    } else {
      // rubrique d'origine : la version modifiée est gardée à part, sous le même identifiant
      const edits = (store.data.ficheEdits ||= {})[f.id] ||= {};
      (edits.sections ||= {})[sec.id] = { titre, html };
    }
    done();
  });
}

/* ---------- Réglages : sauvegarde ---------- */

function openSettings() {
  openSheet(`
    <h2>Réglages</h2>
    <p class="hint">Les patients, radios, fiches et images sont enregistrés <b>uniquement sur cet appareil</b>. Un rappel de sauvegarde s’affiche tous les ${BACKUP_EVERY} nouveaux patients : choisissez « Enregistrer dans Fichiers » puis iCloud Drive.</p>
    <p class="hint">Dernière sauvegarde : <b>${backup.state.date ? new Date(backup.state.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'jamais'}</b></p>
    <div class="actions column">
      <button class="btn primary" id="export">Sauvegarder mes données</button>
      <label class="btn ghost file">Restaurer une sauvegarde<input type="file" id="import" accept="application/json,.json" hidden></label>
      <label class="btn ghost file">Importer des fiches<input type="file" id="import-fiches" accept="application/json,.json" hidden></label>
      <button class="btn ghost" id="share-app">Partager l’appli</button>
      <button class="btn ghost" id="cancel">Fermer</button>
    </div>`);
  $('#cancel').addEventListener('click', closeSheet);
  $('#export').addEventListener('click', exportData);
  $('#import').addEventListener('change', importData);
  $('#import-fiches').addEventListener('change', importFiches);
  $('#share-app').addEventListener('click', shareApp);
}

// Envoie le lien du site (jamais les données : chacun repart d'une appli vide sur son propre téléphone).
async function shareApp() {
  const url = location.origin + location.pathname;
  if (navigator.share) {
    try { await navigator.share({ title: 'Registre opératoire', text: 'Mon registre de patients opérés, à installer sur le téléphone :', url }); } catch (e) { /* partage annulé */ }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    toast('Lien copié');
  } catch (e) {
    prompt('Lien à copier :', url);
  }
}

// Ajoute les fiches d'un fichier (fichier de fiches ou sauvegarde) sans toucher aux patients.
async function importFiches(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const incoming = JSON.parse(await file.text()).fiches;
    if (!Array.isArray(incoming) || !incoming.every(f => f && typeof f.titre === 'string')) throw new Error('format');
    if (!confirm(`Importer ${plural(incoming.length, 'fiche')} ? Vos patients ne sont pas modifiés.`)) return;
    const isBlank = f => !(f.sections || []).some(sec => sec.html || sec.texte) && !f.contenu && !store.data.astuces[f.id];
    for (const fiche of incoming) {
      const imported = {
        id: String(fiche.id || newId()), titre: fiche.titre.trim(), entete: fiche.entete ? String(fiche.entete) : undefined,
        sections: (fiche.sections || []).map(sec => ({ id: String(sec.id || newId()), titre: String(sec.titre || ''), ...(sec.html != null ? { html: String(sec.html) } : { texte: String(sec.texte || '') }) })),
      };
      // remplace la même fiche déjà importée, ou la fiche vierge créée automatiquement pour cette opération
      store.data.fiches = store.data.fiches.filter(f => f.id !== imported.id && !(key(f.titre) === key(imported.titre) && isBlank(f)));
      store.data.fiches.push(imported);
    }
    store.save(); closeSheet(); currentTab = 'fiches'; openFicheId = null; render();
    toast(`${plural(incoming.length, 'fiche')} ${incoming.length > 1 ? 'importées' : 'importée'}`);
  } catch (err) {
    alert('Ce fichier ne contient pas de fiches.');
  }
}

async function exportData() {
  const name = `registre-operatoire-${today()}.json`;
  const images = {};
  const ids = [...store.data.patients.flatMap(p => p.radios || []), ...Object.values(store.data.ficheImages || {}).flat()];
  for (const rid of ids) {
    const blob = await radios.get(rid).catch(() => null);
    if (blob) images[rid] = await toDataUrl(blob);
  }
  const json = JSON.stringify({ version: 1, date: new Date().toISOString(), ...store.data, radios: images });
  const file = new File([json], name, { type: 'application/json' });
  if (navigator.canShare?.({ files: [file] })) {
    // Partage annulé : la sauvegarde n'est pas faite, le rappel reste affiché.
    try { await navigator.share({ files: [file] }); backupDone(); return; } catch (e) {
      if (e.name === 'AbortError') return;
      if (e.name === 'NotAllowedError') {
        // Préparer les radios a pris trop de temps : l'iPhone exige un nouveau toucher pour ouvrir le partage.
        openSheet(`
          <h2>Sauvegarde prête</h2>
          <p class="hint">Touchez le bouton, puis « Enregistrer dans Fichiers » et iCloud Drive.</p>
          <div class="actions column"><button class="btn primary" id="share-ready">Enregistrer la sauvegarde</button><button class="btn ghost" id="cancel">Annuler</button></div>`);
        $('#cancel').addEventListener('click', closeSheet);
        $('#share-ready').addEventListener('click', async () => {
          try { await navigator.share({ files: [file] }); backupDone(); } catch (err) { /* annulé : on laisse la fenêtre ouverte */ }
        });
        return;
      }
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  backupDone();
}

function backupDone() {
  backup.done();
  closeSheet();
  render();
}

async function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const saved = JSON.parse(await file.text());
    if (!Array.isArray(saved.patients)) throw new Error('format');
    if (!confirm(`Remplacer les données actuelles (${plural(store.data.patients.length, 'patient')}) par la sauvegarde (${plural(saved.patients.length, 'patient')}) ?`)) return;
    store.data = { patients: saved.patients, fiches: saved.fiches || [], astuces: saved.astuces || {}, ficheImages: saved.ficheImages || {}, ficheEdits: saved.ficheEdits || {}, autoFiches: !!saved.autoFiches };
    initAutoFiches();
    await radios.clear();
    for (const [rid, dataUrl] of Object.entries(saved.radios || {})) {
      if (String(dataUrl).startsWith('data:image/')) await radios.put(rid, await (await fetch(dataUrl)).blob());
    }
    backup.done(); // ce qu'on vient de restaurer existe déjà en sauvegarde
    store.save(); closeSheet(); render();
  } catch (err) {
    alert('Ce fichier n’est pas une sauvegarde valide du registre.');
  }
}

/* ---------- Fenêtre (sheet) ---------- */

function openSheet(html) {
  // Croix en haut à droite de chaque fenêtre : même effet que son bouton « Annuler » / « Fermer ».
  sheetBody.innerHTML = '<button type="button" class="sheet-close" aria-label="Fermer">✕</button>' + html;
  $('.sheet-close', sheetBody).addEventListener('click', () => {
    const cancel = $('#cancel', sheetBody);
    if (cancel) cancel.click(); else closeSheet();
  });
  sheet.hidden = false;
  document.body.classList.add('no-scroll');
  sheetBody.scrollTop = 0;
}
function closeSheet() {
  sheet.hidden = true;
  sheetBody.innerHTML = '';
  sheetUrls.forEach(url => URL.revokeObjectURL(url));
  sheetUrls = [];
  document.body.classList.remove('no-scroll');
}

/* ---------- Démarrage ---------- */

document.querySelectorAll('.tabbar button').forEach(b => b.addEventListener('click', () => {
  currentTab = b.dataset.tab;
  openFicheId = null;
  render();
  window.scrollTo(0, 0);
}));
$('#btn-settings').addEventListener('click', openSettings);

// Sur le site (navigateur), on commence par expliquer l'installation et l'enregistrement des données.
const isInstalled = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
const TUTO_SEEN = 'registre-tuto-vu';

function showTutorial() {
  const tuto = document.createElement('div');
  tuto.className = 'tuto';
  tuto.innerHTML = `
    <div class="tuto-body">
      <img src="icons/icon-192.png" alt="" class="tuto-icon">
      <h1>Registre opératoire</h1>
      <p class="tuto-lead">Le carnet des patients que vous opérez : patients, radios post-op, statistiques et fiches d’opération. Pour l’utiliser, installez-le comme une application sur votre téléphone.</p>

      <section>
        <h2>📱 Installer sur iPhone ou iPad</h2>
        <ol>
          <li>Ouvrez cette page dans <b>Safari</b>.</li>
          <li>Touchez le bouton <b>Partager</b> (le carré avec une flèche vers le haut).</li>
          <li>Faites défiler et touchez <b>Sur l’écran d’accueil</b>.</li>
          <li>Touchez <b>Ajouter</b>.</li>
        </ol>
        <p>L’icône « Registre » apparaît sur l’écran d’accueil : ouvrez toujours l’appli par cette icône.</p>
      </section>

      <section>
        <h2>🤖 Installer sur Android</h2>
        <ol>
          <li>Ouvrez cette page dans <b>Chrome</b>.</li>
          <li>Touchez le menu <b>⋮</b> en haut à droite.</li>
          <li>Touchez <b>Installer l’application</b> (ou <b>Ajouter à l’écran d’accueil</b>).</li>
        </ol>
      </section>

      <section>
        <h2>🔒 Où sont enregistrées vos données</h2>
        <ul>
          <li><b>Uniquement sur votre téléphone.</b> Patients, radios et fiches ne sont jamais envoyés sur internet : personne d’autre n’y a accès, pas même l’auteur de l’appli.</li>
          <li><b>L’appli fonctionne sans réseau</b>, par exemple au bloc.</li>
          <li><b>Chaque téléphone a ses propres données.</b> Ce que vous saisissez ici dans le navigateur ne passe pas dans l’appli installée.</li>
        </ul>
      </section>

      <section>
        <h2>💾 Sauvegarder</h2>
        <ul>
          <li>Tous les <b>10 nouveaux patients</b>, l’appli propose une sauvegarde : touchez <b>Sauvegarder</b>, puis <b>Enregistrer dans Fichiers</b> et choisissez <b>iCloud Drive</b>.</li>
          <li>À tout moment : <b>⚙︎</b> en haut à droite, puis <b>Sauvegarder mes données</b>.</li>
          <li><b>Supprimer l’appli efface ses données.</b> Pour les retrouver (nouveau téléphone, réinstallation) : <b>⚙︎</b>, puis <b>Restaurer une sauvegarde</b>.</li>
        </ul>
      </section>

      <button class="btn ghost" id="tuto-skip">Continuer sans installer</button>
    </div>`;
  document.body.append(tuto);
  $('#tuto-skip', tuto).addEventListener('click', () => {
    try { sessionStorage.setItem(TUTO_SEEN, '1'); } catch (e) { /* navigation privée */ }
    tuto.remove();
  });
}

store.load();
initAutoFiches();
render();
let tutoSeen = false;
try { tutoSeen = sessionStorage.getItem(TUTO_SEEN) === '1'; } catch (e) { /* navigation privée */ }
if (!isInstalled && !tutoSeen) showTutorial();

// Demande au navigateur de ne pas effacer les données en cas de manque de place.
navigator.storage?.persist?.();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js');
