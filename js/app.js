// ===== Teté · tienda local =====
// WhatsApp de Teté: +56 9 5029 4831 (formato wa.me: sin "+" ni espacios).
const WHATSAPP = '56950294831';
const waLink = text => `https://wa.me/${WHATSAPP}${text ? '?text=' + encodeURIComponent(text) : ''}`;

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clp = n => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
const img = name => `img/p/${name}.webp`;          // fotos de producto sin fondo (900 px: ficha, portada)
const imgSm = name => `img/p/sm/${name}.webp`;     // versión liviana (560 px: tarjetas, miniaturas, carrito)
const byId = id => PRODUCTOS.find(p => p.id === id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;

// ---------- carrito ----------
let cart = [];
try { cart = JSON.parse(localStorage.getItem('tete-cart')) || []; } catch { cart = []; }
cart = cart.filter(i => byId(i.id));
const saveCart = () => { localStorage.setItem('tete-cart', JSON.stringify(cart)); renderCart(); };

function bumpCart() {
  const btn = $('#openCart');
  btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
}

// La foto del producto "vuela" hasta el carrito
function flyToCart(fromEl, done) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const r = fromEl && fromEl.getBoundingClientRect();
  if (reduce || !r || !r.width || !fromEl.animate) { done(); return; }
  const t = $('#openCart').getBoundingClientRect();
  const size = Math.min(r.width, r.height, 200);
  const f = new Image(); f.src = fromEl.currentSrc || fromEl.src; f.className = 'fly-img'; f.alt = '';
  Object.assign(f.style, { left: `${r.left + r.width / 2 - size / 2}px`, top: `${r.top + r.height / 2 - size / 2}px`, width: `${size}px`, height: `${size}px` });
  document.body.appendChild(f);
  const dx = t.left + t.width / 2 - (r.left + r.width / 2), dy = t.top + t.height / 2 - (r.top + r.height / 2);
  const a = f.animate([
    { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: `translate(${dx * .5}px, ${dy * .5 - 90}px) scale(.6) rotate(-8deg)`, opacity: 1, offset: .5 },
    { transform: `translate(${dx}px, ${dy}px) scale(.1) rotate(0deg)`, opacity: .35 },
  ], { duration: 780, easing: 'cubic-bezier(.45,0,.25,1)' });
  a.onfinish = () => { f.remove(); done(); };
}

function addToCart(id, colorIdx = 0, talla = null, qty = 1, fromEl = null) {
  const p = byId(id);
  const key = `${id}|${colorIdx}|${talla || ''}`;
  const found = cart.find(i => i.key === key);
  if (found) found.qty += qty; else cart.push({ key, id, colorIdx, talla, qty });
  flyToCart(fromEl, () => { saveCart(); bumpCart(); });
  toast(`${p.nombre} (${p.colores[colorIdx].n}${talla ? ', ' + talla : ''}) agregado`);
}

// ---------- efecto 3D (inclinación con el mouse) ----------
function tilt(stage, obj, floor, max = 14) {
  if (!finePointer) return;
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    obj.style.transform = `rotateY(${x * max * 2}deg) rotateX(${-y * max * 1.4}deg) translateZ(30px) scale(1.04)`;
    if (floor) floor.style.transform = `translateX(${-x * 30}px) scale(${1 - Math.abs(x) * .15})`;
  });
  stage.addEventListener('pointerleave', () => { obj.style.transform = ''; if (floor) floor.style.transform = ''; });
}

// ---------- cambio de color con fundido cruzado (sin parpadeo) ----------
function xfade(el, src) {
  if (el.getAttribute('src') === src) return;
  const ghost = el.cloneNode();
  ghost.removeAttribute('id'); ghost.classList.add('xf-ghost'); ghost.alt = '';
  el.parentNode.insertBefore(ghost, el.nextSibling);           // la imagen anterior queda encima
  const pre = new Image(); pre.src = src;
  (pre.decode ? pre.decode() : Promise.resolve()).catch(() => {}).then(() => {
    el.src = src;
    requestAnimationFrame(() => requestAnimationFrame(() => { ghost.style.opacity = 0; }));
    setTimeout(() => ghost.remove(), 520);
  });
}

// ---------- tarjetas ----------
const swatches = (p, active = 0) => p.colores.map((c, i) =>
  `<button class="sw ${i === active ? 'on' : ''}" data-i="${i}" style="background:${c.c}" title="${esc(c.n)}" aria-label="Color ${esc(c.n)}"></button>`).join('');
const sizeChips = (p, sel) => p.tallas.map(t => `<button class="sz ${t === sel ? 'on' : ''}" data-t="${esc(t)}">${esc(t)}</button>`).join('');

function renderGrid() {
  $('#grid').innerHTML = PRODUCTOS.map(p => `
    <article class="card reveal" data-id="${p.id}" data-cat="${p.cat}" data-color="0">
      <div class="c-media stage3d" data-open>
        <span class="badge">${esc(p.badge)}</span>
        <div class="floor"></div>
        <div class="obj"><img src="${imgSm(p.colores[0].img)}" alt="${esc(p.nombre)}" loading="lazy" decoding="async" draggable="false"></div>
        <button class="quick" data-open>Ver de cerca</button>
      </div>
      <div class="c-body">
        <div class="c-top"><h3>${esc(p.nombre)}</h3><span class="price">${clp(p.precio)}</span></div>
        <div class="c-color">${esc(p.etiquetaColor)}: <b>${esc(p.colores[0].n)}</b></div>
        ${p.colores.length > 1 ? `<div class="sws">${swatches(p)}</div>` : ''}
        ${p.tallas ? `<div class="c-sizes"><div class="sz-head"><span>Talla</span><button class="guide-link" data-guia="${p.guia}">Guía de tallas</button></div><div class="szs">${sizeChips(p)}</div><small class="sz-err">Elige una talla</small></div>` : ''}
        <button class="add"><svg><use href="#bag"/></svg><span>Agregar al carrito</span></button>
      </div>
    </article>`).join('');

  $$('.card').forEach(card => {
    const p = byId(card.dataset.id);
    const pic = $('.obj img', card);
    tilt($('.stage3d', card), $('.obj', card), $('.floor', card));
    $$('.sw', card).forEach(sw => sw.addEventListener('click', () => {
      const i = +sw.dataset.i; card.dataset.color = i;
      $$('.sw', card).forEach(s => s.classList.toggle('on', s === sw));
      $('.c-color b', card).textContent = p.colores[i].n;
      xfade(pic, imgSm(p.colores[i].img));

    }));
    $$('.sz', card).forEach(b => b.addEventListener('click', () => {
      card.dataset.talla = b.dataset.t;
      $$('.sz', card).forEach(x => x.classList.toggle('on', x === b));
      card.classList.remove('need-size');
    }));
    $$('[data-open]', card).forEach(el => el.addEventListener('click', e => { e.stopPropagation(); openModal(p.id, +card.dataset.color, card.dataset.talla); }));
    $('.add', card).addEventListener('click', e => {
      if (p.tallas && !card.dataset.talla) { card.classList.remove('need-size'); void card.offsetWidth; card.classList.add('need-size'); return; }
      addToCart(p.id, +card.dataset.color, card.dataset.talla || null, 1, pic);
      const b = e.currentTarget, t = $('span', b);
      b.classList.add('ok'); t.textContent = '¡Agregado!';
      setTimeout(() => { b.classList.remove('ok'); t.textContent = 'Agregar al carrito'; }, 1400);
    });
  });
  $$('.guide-link').forEach(b => b.addEventListener('click', () => openGuide(b.dataset.guia)));
  observe();
}

$$('#filters .chip').forEach(ch => { const k = ch.dataset.cat; const n = k === 'todos' ? PRODUCTOS.length : PRODUCTOS.filter(p => p.cat === k).length; ch.insertAdjacentHTML('beforeend', ` <small>${n}</small>`); if (!n) ch.hidden = true; }); // chip small
$$('#filters .chip').forEach(ch => ch.addEventListener('click', () => {
  $$('#filters .chip').forEach(c => c.classList.toggle('on', c === ch));
  const cat = ch.dataset.cat;
  $$('.card').forEach(card => card.classList.toggle('hide', cat !== 'todos' && card.dataset.cat !== cat));
}));

// ---------- visor 3D del modal ----------
const LAYERS = 9;   // capas apiladas que dan grosor al girar
const viewer = { rx: -6, ry: -18, zoom: 1, auto: true, drag: null, t: 0 };
function buildLayers(src) {
  $('#vObj').innerHTML = Array.from({ length: LAYERS }, (_, i) =>
    `<img src="${src}" alt="" draggable="false" style="transform:translateZ(${-i * 1.6}px);${i ? `filter:brightness(${.62 - i * .02}) saturate(.9)` : ''}">`).join('');
}
function renderViewer() {
  $('#vObj').style.transform = `scale(${viewer.zoom}) rotateX(${viewer.rx}deg) rotateY(${viewer.ry}deg)`;
  $('#vFloor').style.transform = `translateX(${-viewer.ry * .8}px) scaleX(${1 - Math.abs(viewer.ry) / 160})`;
}
(function loop() {
  if (viewer.auto && !viewer.drag && $('#modal').classList.contains('open')) {
    viewer.t += .012;
    viewer.ry = Math.sin(viewer.t) * 32;
    viewer.rx = -6 + Math.sin(viewer.t * .7) * 5;
    renderViewer();
  }
  requestAnimationFrame(loop);
})();
const vStage = $('#viewer');
vStage.addEventListener('pointerdown', e => { viewer.drag = { x: e.clientX, y: e.clientY, rx: viewer.rx, ry: viewer.ry }; vStage.setPointerCapture(e.pointerId); vStage.classList.add('grab'); setAuto(false); });
vStage.addEventListener('pointermove', e => {
  if (!viewer.drag) return;
  viewer.ry = clamp(viewer.drag.ry + (e.clientX - viewer.drag.x) * .45, -55, 55);
  viewer.rx = clamp(viewer.drag.rx - (e.clientY - viewer.drag.y) * .3, -30, 30);
  renderViewer();
});
const endDrag = () => { viewer.drag = null; vStage.classList.remove('grab'); };
vStage.addEventListener('pointerup', endDrag); vStage.addEventListener('pointercancel', endDrag);
vStage.addEventListener('wheel', e => { e.preventDefault(); setZoom(viewer.zoom - e.deltaY * .0012); }, { passive: false });
function setZoom(z) { viewer.zoom = clamp(z, .8, 1.8); renderViewer(); }
function setAuto(on) { viewer.auto = on; $('#vAuto').classList.toggle('on', on); if (on) viewer.t = Math.asin(clamp(viewer.ry / 32, -1, 1)); }
$('#vIn').onclick = () => setZoom(viewer.zoom + .15);
$('#vOut').onclick = () => setZoom(viewer.zoom - .15);
$('#vAuto').onclick = () => setAuto(!viewer.auto);
$('#vReset').onclick = () => { Object.assign(viewer, { rx: -6, ry: 0, zoom: 1 }); setAuto(false); renderViewer(); };

// ---------- "Completa el look" en la ficha ----------
function renderLook(p) {
  const ids = (p.combina || []).filter(byId);
  $('#mLook').hidden = !ids.length;
  $('#mLookRow').innerHTML = ids.map(id => {
    const q = byId(id);
    return `<div class="look">
      <button class="look-img" data-go="${id}" title="Ver ${esc(q.nombre)}"><img src="${imgSm(q.colores[0].img)}" alt="${esc(q.nombre)}" decoding="async"></button>
      <button class="look-txt" data-go="${id}"><b>${esc(q.nombre)}</b><span>${clp(q.precio)}</span></button>
      <button class="look-add" data-add="${id}" aria-label="${q.tallas ? 'Elegir talla de' : 'Agregar'} ${esc(q.nombre)}">${q.tallas ? 'Elegir' : '+ Agregar'}</button>
    </div>`;
  }).join('');
  $$('#mLookRow [data-go]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.go, 0)));
  $$('#mLookRow [data-add]').forEach(b => b.addEventListener('click', () => {
    const q = byId(b.dataset.add);
    if (q.tallas) { openModal(q.id, 0); return; }               // necesita talla → abre su ficha
    addToCart(q.id, 0, null, 1, $('img', b.closest('.look')));
    b.textContent = '✓ Listo'; b.classList.add('ok');
    setTimeout(() => { b.textContent = '+ Agregar'; b.classList.remove('ok'); }, 1500);
  }));
}

// ---------- modal de producto ----------
const modal = { id: null, color: 0, talla: null, qty: 1 };
function openModal(id, color = 0, talla = null) {
  const p = byId(id);
  Object.assign(modal, { id, color, talla: talla || null, qty: 1 });
  $('#mBadge').textContent = p.badge;
  $('#mName').textContent = p.nombre;
  $('#mPrice').textContent = clp(p.precio);
  $('#mDesc').textContent = p.desc;
  $('#mColorLbl').textContent = p.etiquetaColor;
  $('#mDet').innerHTML = p.detalles.map(d => `<li>${esc(d)}</li>`).join('');
  $('#mSw').innerHTML = swatches(p, color);
  $('#mThumbs').innerHTML = p.colores.length > 1 ? p.colores.map((c, i) => `<button data-i="${i}" title="${esc(c.n)}"><img src="${imgSm(c.img)}" alt="${esc(c.n)}" decoding="async"></button>`).join('') : '';
  $('#mSizeWrap').style.display = p.tallas ? '' : 'none';
  $('#mSizeWrap').classList.remove('need-size');
  if (p.tallas) {
    $('#mSizes').innerHTML = sizeChips(p, modal.talla);
    $('#mGuide').onclick = () => openGuide(p.guia);
    $$('#mSizes .sz').forEach(b => b.addEventListener('click', () => {
      modal.talla = b.dataset.t; $$('#mSizes .sz').forEach(x => x.classList.toggle('on', x === b));
      $('#mSizeWrap').classList.remove('need-size');
    }));
  }
  $$('#mSw .sw, #mThumbs button').forEach(el => el.addEventListener('click', () => setModalColor(+el.dataset.i)));
  renderLook(p);
  $('#mAsk').href = waLink(`¡Hola Teté! 🐾 Quiero consultar por: ${p.nombre}. ¿Me das más información?`);
  Object.assign(viewer, { rx: -6, ry: 0, zoom: 1, t: 0 }); setAuto(true);
  setModalColor(color); setQty(1);
  $('#modal').classList.add('open'); $('#modal').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function setModalColor(i) {
  const p = byId(modal.id); modal.color = i;
  const src = img(p.colores[i].img), v = $('#vObj');
  if (!v.children.length || !$('#modal').classList.contains('open')) { buildLayers(src); renderViewer(); }
  else {
    const pre = new Image(); pre.src = src;
    v.style.opacity = .15;
    (pre.decode ? pre.decode() : Promise.resolve()).catch(() => {}).then(() => setTimeout(() => { buildLayers(src); renderViewer(); v.style.opacity = 1; }, 140));
  }
  $('#mColorName').textContent = p.colores[i].n + (p.colores[i].sim ? ' · vista previa del color (se teje a pedido)' : '');
  $$('#mSw .sw').forEach(s => s.classList.toggle('on', +s.dataset.i === i));
  $$('#mThumbs button').forEach(s => s.classList.toggle('on', +s.dataset.i === i));
}
function setQty(q) { modal.qty = Math.max(1, q); $('#mQty').textContent = modal.qty; }
$('#mMinus').onclick = () => setQty(modal.qty - 1);
$('#mPlus').onclick = () => setQty(modal.qty + 1);
$('#mAdd').onclick = () => {
  const p = byId(modal.id);
  if (p.tallas && !modal.talla) { const w = $('#mSizeWrap'); w.classList.remove('need-size'); void w.offsetWidth; w.classList.add('need-size'); return; }
  addToCart(modal.id, modal.color, modal.talla, modal.qty, $('#vObj img')); closeModal();
};
function closeModal() { $('#modal').classList.remove('open'); $('#modal').setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
$$('[data-close]').forEach(el => el.addEventListener('click', closeModal));

// ---------- guía de tallas ----------
function openGuide(key) {
  const g = GUIAS[key]; if (!g) return;
  $('#gTitle').textContent = g.titulo;
  $('#gTable').innerHTML = `<thead><tr>${g.cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
    <tbody>${g.filas.map(r => `<tr>${r.map((c, i) => i ? `<td>${c}</td>` : `<th>${c}</th>`).join('')}</tr>`).join('')}</tbody>`;
  $('#guide').classList.add('open');
}
$$('[data-gclose]').forEach(el => el.addEventListener('click', () => $('#guide').classList.remove('open')));

// ---------- drawer del carrito ----------
function openCart() { $('#drawer').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
function closeCart() { $('#drawer').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
$('#openCart').onclick = openCart;
$$('[data-dclose]').forEach(el => el.addEventListener('click', closeCart));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { $('#guide').classList.remove('open'); closeModal(); closeCart(); } });

function renderCart() {
  const count = cart.reduce((a, i) => a + i.qty, 0);
  const total = cart.reduce((a, i) => a + byId(i.id).precio * i.qty, 0);
  $('#cartCount').textContent = count;
  $('#dTotal').textContent = clp(total);
  $('#dFoot').style.display = cart.length ? '' : 'none';
  if (!cart.length) {
    $('#dItems').innerHTML = `<div class="empty"><svg class="logo-pos"><use href="#${document.body.dataset.logo || 'ovillo'}"/></svg>
      <p><b>Tu carrito está vacío</b><br>¡Hay muchos tejidos esperándote!</p>
      <a href="#tienda" class="btn btn-choco" data-dclose>Ir a la tienda</a></div>`;
    $$('#dItems [data-dclose]').forEach(el => el.addEventListener('click', closeCart));
    return;
  }
  $('#dItems').innerHTML = cart.map((it, idx) => {
    const p = byId(it.id), c = p.colores[it.colorIdx];
    return `<div class="d-item">
      <div class="d-thumb"><img src="${imgSm(c.img)}" alt=""></div>
      <div><h4>${esc(p.nombre)}</h4><small>${esc(p.etiquetaColor)}: ${esc(c.n)}${it.talla ? ' · Talla ' + esc(it.talla) : ''}</small>
        <div class="qty"><button data-q="${idx}" data-d="-1">−</button><span>${it.qty}</span><button data-q="${idx}" data-d="1">+</button></div></div>
      <div class="right"><b>${clp(p.precio * it.qty)}</b><button class="rm" data-rm="${idx}">Quitar</button></div>
    </div>`;
  }).join('');
  $$('#dItems [data-q]').forEach(b => b.onclick = () => {
    const it = cart[+b.dataset.q]; it.qty += +b.dataset.d;
    if (it.qty < 1) cart.splice(+b.dataset.q, 1);
    saveCart();
  });
  $$('#dItems [data-rm]').forEach(b => b.onclick = () => { cart.splice(+b.dataset.rm, 1); saveCart(); });
}

$('#orderForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const lineas = cart.map(it => {
    const p = byId(it.id), c = p.colores[it.colorIdx];
    return `• ${it.qty} x ${p.nombre} (${p.etiquetaColor}: ${c.n}${it.talla ? ', talla ' + it.talla : ''}) — ${clp(p.precio * it.qty)}`;
  });
  const total = cart.reduce((a, i) => a + byId(i.id).precio * i.qty, 0);
  const msg = ['¡Hola Teté! 🐾 Quiero hacer este pedido:', '', ...lineas, '', `Total: ${clp(total)}`, '',
    `Nombre: ${f.get('nombre')}`, `Comuna/ciudad: ${f.get('comuna')}`, `Entrega: ${f.get('entrega')}`,
    f.get('nota') ? `Notas: ${f.get('nota')}` : ''].join('\n').trim();
  window.open(waLink(msg), '_blank');
});

// ---------- "elige tu color" ----------
(function picker() {
  const p = byId('gorrito-gatito');
  let i = 0;
  tilt($('#pickStage'), $('#pickObj'), $('#pickFloor'), 16);
  $('#pickPrice').textContent = clp(p.precio);
  $('#pickSw').innerHTML = swatches(p, 0);
  $$('#pickSw .sw').forEach(sw => sw.addEventListener('click', () => {
    i = +sw.dataset.i;
    $$('#pickSw .sw').forEach(s => s.classList.toggle('on', s === sw));
    $('#pickName').textContent = p.colores[i].n;
    xfade($('#pickImg'), img(p.colores[i].img));

  }));
  $('#pickAdd').onclick = () => openModal(p.id, i);
})();

// ---------- hero: producto destacado ----------
$('#heroPrice').textContent = clp(byId('gorrito-gatito').precio);
$('#heroTag').onclick = () => openModal('gorrito-gatito', 0);

// ---------- hero: rastro de huellitas alrededor del mandala ----------
const PAWS = 9;
function layoutPaws() {
  const trail = $('#pawTrail'); if (!trail) return;
  const art = $('.hero-art').getBoundingClientRect();
  const ref = ($('.hero-mandala') || $('.hero-art')).getBoundingClientRect();
  if (!art.width) return;
  const cx = ref.left - art.left + ref.width / 2, cy = ref.top - art.top + ref.height / 2;
  const R = ref.width / 2 * 1.1;                       // un poco por fuera del mandala
  const a0 = 168, a1 = 248;                            // desde la izquierda, subiendo hasta arriba del mandala
  const colors = ['var(--coral)', 'var(--turquesa)', 'var(--girasol)', 'var(--rosa)'];
  const size = clamp(ref.width * .058, 18, 32);
  trail.innerHTML = Array.from({ length: PAWS }, (_, i) => {
    const t = i / (PAWS - 1), a = (a0 + (a1 - a0) * t) * Math.PI / 180;
    const side = i % 2 ? 1 : -1;                       // pisada izquierda / derecha
    const nx = Math.cos(a), ny = Math.sin(a);          // normal (hacia afuera del círculo)
    const x = cx + nx * (R + side * size * .55), y = cy + ny * (R + side * size * .55);
    const rot = (a0 + (a1 - a0) * t) + 180;           // dedos apuntando hacia donde camina
    return `<svg class="pp" viewBox="0 0 200 200" style="left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;--r:${rot}deg;--d:${i * .42}s;color:${colors[i % 4]}"><use href="#paw"/></svg>`;
  }).join('');
}
layoutPaws();
let pawT; addEventListener('resize', () => { clearTimeout(pawT); pawT = setTimeout(layoutPaws, 150); });
document.fonts && document.fonts.ready.then(layoutPaws);

// ---------- hero: parallax ----------
if (finePointer) {
  const art = $('.hero-art');
  $('.hero').addEventListener('pointermove', e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    $$('[data-depth]', art).forEach(el => {
      const d = +el.dataset.depth;
      el.style.translate = `${x * d * 40}px ${y * d * 30}px`;
    });
  });
}

// ---------- pedido a medida: cotizar por WhatsApp ----------

$('#ideaForm').addEventListener('submit', e => {
  e.preventDefault();
  const idea = $('#ideaText').value.trim();
  if (!idea) { $('#ideaText').focus(); return; }
  const cuando = $('#ideaFor').value.trim(), nombre = $('#ideaName').value.trim();
  const extra = [cuando && `Lo necesito: ${cuando}`, nombre && `Mi nombre: ${nombre}`].filter(Boolean);
  const msg = ['¡Hola Teté! 🐾 Tengo una idea de tejido y quiero cotizarla:', '', idea, ...(extra.length ? ['', ...extra] : [])].join('\n');
  window.open(waLink(msg), '_blank');
});

if (!finePointer) $('.v-hint').lastChild.textContent = ' Arrastra para girar';

// ---------- menú en teléfono / tablet ----------
const menuBtn = $('#menuBtn'), nav = $('#nav');
const setMenu = open => { nav.classList.toggle('open', open); menuBtn.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); };
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
$$('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', e => { if (nav.classList.contains('open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false); });

// ---------- marquee ----------
(function marquee() {
  const items = ['Hecho a mano', '<span class="script">tejidos con causa</span>', 'Elige tu color', 'Hecho a tu medida', '<span class="script">con amor</span>', 'Ayuda a un perrito'];
  const row = items.map(t => `<span>${t}<svg><use href="#paw"/></svg></span>`).join('');
  $('#marquee').innerHTML = row.repeat(4);
})();

// ---------- toast ----------
let tt;
function toast(t) {
  $('#toastTxt').textContent = t;
  $('#toast').classList.add('show');
  clearTimeout(tt); tt = setTimeout(() => $('#toast').classList.remove('show'), 2400);
}

// ---------- animaciones al hacer scroll ----------
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
function observe() { $$('.reveal:not(.in)').forEach((el, k) => { el.style.transitionDelay = `${(k % 4) * 70}ms`; io.observe(el); }); }
window.addEventListener('scroll', () => $('#header').classList.toggle('scrolled', scrollY > 10), { passive: true });

const saludo = '¡Hola Teté! 🐾 Vengo de la página y quiero consultar por sus tejidos.';
if ($('#footWa')) $('#footWa').href = waLink(saludo);
$('#waFloat').href = waLink(saludo);
$('#year').textContent = new Date().getFullYear();
renderGrid();
renderCart();
