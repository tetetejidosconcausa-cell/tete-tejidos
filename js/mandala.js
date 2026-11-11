// Mandalas decorativos tejidos (SVG generado) para el concepto 02 · Huella mandala
(function () {
  const C = { choco: '#4A2C1F', crema: '#FBF5EC', coral: '#E2553B', girasol: '#F2B425', turq: '#1FA3A0', rosa: '#E86A9A', caramelo: '#B86B2B' };
  const pal = [C.coral, C.girasol, C.turq, C.rosa];

  function ring(n, r, draw) {
    let s = '';
    for (let i = 0; i < n; i++) s += draw((360 / n) * i, i, r);
    return s;
  }
  function mandala(light) {
    const line = light ? C.crema : C.choco;
    let s = '';
    s += `<circle r="96" fill="none" stroke="${C.coral}" stroke-width="3" stroke-dasharray="6 5"/>`;
    s += ring(36, 88, (a, i) => `<circle cx="0" cy="-88" r="5.2" fill="${pal[i % 4]}" transform="rotate(${a})"/>`);
    s += ring(24, 74, (a, i) => `<path d="M0 -60 Q9 -71 0 -82 Q-9 -71 0 -60Z" fill="${i % 2 ? C.turq : C.girasol}" transform="rotate(${a})"/>`);
    s += `<circle r="58" fill="none" stroke="${line}" stroke-width="2" stroke-dasharray="2 4" opacity=".55"/>`;
    s += ring(16, 48, (a, i) => `<ellipse cx="0" cy="-45" rx="7.5" ry="12" fill="${i % 2 ? C.rosa : C.coral}" transform="rotate(${a})"/>`);
    s += ring(16, 48, (a) => `<circle cx="0" cy="-45" r="2.6" fill="${C.crema}" transform="rotate(${a + 11.25})"/>`);
    s += `<circle r="32" fill="${C.girasol}"/>`;
    s += `<circle r="27" fill="none" stroke="${C.choco}" stroke-width="3" stroke-dasharray="4 3" opacity=".5"/>`;
    s += ring(8, 18, (a) => `<ellipse cx="0" cy="-16" rx="5" ry="8.5" fill="${C.coral}" transform="rotate(${a})"/>`);
    s += `<circle r="8" fill="${C.turq}"/><circle r="3" fill="${C.crema}"/>`;
    return `<svg viewBox="-100 -100 200 200" aria-hidden="true">${s}</svg>`;
  }
  document.querySelectorAll('.mandala-deco').forEach(el => { el.innerHTML = mandala(el.classList.contains('cause-mandala')); });
})();
