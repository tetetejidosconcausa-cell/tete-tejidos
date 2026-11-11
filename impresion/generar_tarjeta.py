"""Genera la tarjeta de presentación de Teté (HTML listo para exportar a PDF de imprenta).
Medidas: 90 x 50 mm al corte + 3 mm de sangrado por lado = 96 x 56 mm.
Uso: python generar_tarjeta.py  -> crea tarjeta.html en esta carpeta."""
import os
import segno

URL = "https://tete-tejidos.vercel.app"
WHATSAPP = "+56 9 5029 4831"
WEB = "tete-tejidos.vercel.app"
AQUI = os.path.dirname(os.path.abspath(__file__))

# QR vectorial, corrección H (30 %) para admitir el logo al centro
qr = segno.make(URL, error="h", micro=False)
n = qr.symbol_size(scale=1, border=0)[0]
cells = []
for y, row in enumerate(qr.matrix):
    for x, v in enumerate(row):
        if v:
            cells.append(f"M{x} {y}h1v1h-1z")
qr_path = "".join(cells)
c = n / 2
logo_r = n * 0.11  # zona del logo: ~13 % del ancho (bien dentro del margen de corrección H)

MANDALA_ICON = """<svg viewBox="0 0 200 200" class="ic">
 <circle cx="46" cy="80" r="17" fill="#E2553B"/><circle cx="46" cy="80" r="10" fill="none" stroke="{st}" stroke-width="2.5" stroke-dasharray="3 3"/>
 <circle cx="80" cy="48" r="18" fill="#F2B425"/><circle cx="80" cy="48" r="11" fill="none" stroke="{st}" stroke-width="2.5" stroke-dasharray="3 3"/>
 <circle cx="120" cy="48" r="18" fill="#1FA3A0"/><circle cx="120" cy="48" r="11" fill="none" stroke="{st}" stroke-width="2.5" stroke-dasharray="3 3"/>
 <circle cx="154" cy="80" r="17" fill="#E86A9A"/><circle cx="154" cy="80" r="10" fill="none" stroke="{st}" stroke-width="2.5" stroke-dasharray="3 3"/>
 <circle cx="100" cy="130" r="44" fill="{pad}"/><circle cx="100" cy="130" r="37" fill="none" stroke="#F2B425" stroke-width="5" stroke-dasharray="5 4"/>
 <g fill="#E2553B">""" + "".join(
    f'<ellipse cx="100" cy="108" rx="6" ry="10" transform="rotate({a} 100 130)"/>' for a in range(0, 360, 45)
) + """</g><circle cx="100" cy="130" r="10" fill="#1FA3A0"/><circle cx="100" cy="130" r="4" fill="#FBF5EC"/></svg>"""

DOT_COLORS = ["#E2553B", "#F2B425", "#1FA3A0", "#E86A9A"]
DOTS = "".join(f'<circle cx="{1.2 + k * 2.4:.2f}" cy=".8" r=".58" fill="{DOT_COLORS[k % 4]}"/>' for k in range(40))
PAW = '<svg viewBox="0 0 200 200" class="i"><ellipse cx="46" cy="78" rx="15" ry="19" transform="rotate(-25 46 78)"/><ellipse cx="79" cy="48" rx="16" ry="21"/><ellipse cx="121" cy="48" rx="16" ry="21"/><ellipse cx="154" cy="78" rx="15" ry="19" transform="rotate(25 154 78)"/><circle cx="100" cy="128" r="40"/></svg>'
WA = '<svg viewBox="0 0 32 32" class="i"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.8-3.8-1.8-5.9C5 9.9 9.9 5.1 16 5.1s11 4.8 11 10.7-4.9 10.6-11 10.6zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.3 3.6 5.7 4.9 2.8 1.1 3.4.9 4 .8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>'
WEBI = '<svg viewBox="0 0 24 24" class="i"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2.5 12h19M12 2.5c3 3 3 16 0 19M12 2.5c-3 3-3 16 0 19" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'

html = f"""<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Tarjeta Teté</title>
<link rel="stylesheet" href="../css/fonts.css">
<style>
@page {{ size: 96mm 56mm; margin: 0; }}
* {{ box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
html, body {{ margin: 0; padding: 0; background: #fff; }}
body {{ font-family: Nunito, sans-serif; color: #4A2C1F; }}
.card {{ width: 96mm; height: 56mm; position: relative; overflow: hidden; page-break-after: always; break-after: page; }}
.card:last-child {{ page-break-after: auto; break-after: auto; }}
.i {{ width: 3.1mm; height: 3.1mm; fill: currentColor; flex: none; }}

/* ---------- FRENTE ---------- */
.front {{ background: radial-gradient(70% 90% at 78% 50%, #5A3628 0%, #4A2C1F 55%, #3D2419 100%); color: #FBF5EC; }}
.front .mand {{ position: absolute; width: 62mm; height: 62mm; right: -14mm; top: -3mm; opacity: .9; }}
.front .mand svg {{ width: 100%; height: 100%; }}
.front .mand::after {{ content: ""; position: absolute; inset: 15mm; border-radius: 50%; background: radial-gradient(closest-side, rgba(74,44,31,.0), rgba(74,44,31,0)); }}
.front .brand {{ position: absolute; left: 9mm; top: 12.5mm; }}
.front .ic {{ width: 15mm; height: 15mm; display: block; margin: 0 0 1mm -1mm; }}
.front .word {{ font-family: Pacifico, cursive; font-size: 30pt; line-height: .9; letter-spacing: .2pt; }}
.front .tag {{ font-weight: 900; font-size: 6.4pt; letter-spacing: 2.2pt; text-transform: uppercase; color: #F2B425; margin-top: 2.6mm; }}
.front .hand {{ position: absolute; left: 9mm; bottom: 7.2mm; font-weight: 700; font-size: 6.6pt; opacity: .85; letter-spacing: .2pt; }}

/* ---------- REVERSO ---------- */
.back {{ background: #FBF5EC; }}
.back .grid {{ position: absolute; left: 7.5mm; top: 7mm; right: 7.5mm; bottom: 12.2mm; display: flex; gap: 5mm; align-items: center; }}
.qrbox {{ flex: none; width: 26mm; text-align: center; }}
.qr {{ width: 26mm; height: 26mm; background: #fff; border-radius: 2.4mm; padding: 1.8mm; box-shadow: 0 0 0 .25mm #E9D8BF; }}
.qr svg {{ width: 100%; height: 100%; display: block; }}
.qrcap {{ font-weight: 900; font-size: 6.1pt; margin-top: 1.4mm; line-height: 1.2; color: #4A2C1F; }}
.qrcap b {{ color: #E2553B; }}
.info {{ flex: 1; min-width: 0; }}
.info .mini {{ display: flex; align-items: center; gap: 1.5mm; margin-bottom: 1.8mm; }}
.info .mini .ic {{ width: 6.5mm; height: 6.5mm; }}
.info .mini span {{ font-family: Pacifico, cursive; font-size: 15pt; line-height: 1; }}
.info h2 {{ margin: 0 0 2.2mm; font-weight: 900; font-size: 8.2pt; line-height: 1.22; letter-spacing: -.1pt; }}
.info h2 em {{ font-style: normal; color: #E2553B; }}
.row {{ display: flex; align-items: center; gap: 1.6mm; font-size: 7.4pt; font-weight: 800; margin-top: 1.3mm; white-space: nowrap; }}
.row.wa .i {{ color: #1EAE57; }} .row.web .i {{ color: #1FA3A0; }}
.cause {{ position: absolute; left: 0; right: 0; bottom: 0; height: 11.4mm; background: #1FA3A0; color: #fff; display: flex; align-items: center; justify-content: center; gap: 1.5mm; font-weight: 800; font-size: 6.4pt; padding-bottom: 3.4mm; letter-spacing: .15pt; }}
.cause .i {{ color: #F2B425; width: 2.8mm; height: 2.8mm; }}
.dots {{ position: absolute; left: 0; right: 0; bottom: 11mm; height: 1.6mm;
  width: 96mm; display: block;
  }}

/* guías solo para revisar en pantalla (no se imprimen) */
.guides .card::before {{ content:""; position:absolute; inset:3mm; outline:.2mm dashed rgba(255,0,0,.8); z-index:9; }}
.guides .card::after {{ content:""; position:absolute; inset:6mm; outline:.2mm dashed rgba(0,160,255,.8); z-index:9; }}
</style></head><body>

<section class="card front">
  <div class="mand mandala-deco cause-mandala"></div>
  <div class="brand">
    {MANDALA_ICON.format(st="#4A2C1F", pad="#FBF5EC")}
    <div class="word">teté</div>
    <div class="tag">Tejidos con causa</div>
  </div>
  <div class="hand">Crochet hecho a mano · Chile</div>
</section>

<section class="card back">
  <div class="grid">
    <div class="qrbox">
      <div class="qr"><svg viewBox="0 0 {n} {n}" shape-rendering="crispEdges">
        <path d="{qr_path}" fill="#3A2117"/>
        <circle cx="{c}" cy="{c}" r="{logo_r + 0.9:.2f}" fill="#fff"/>
        <g transform="translate({c - logo_r:.2f} {c - logo_r * 1.12:.2f}) scale({2 * logo_r / 200:.4f})">{MANDALA_ICON.format(st="#FBF5EC", pad="#4A2C1F").replace('<svg viewBox="0 0 200 200" class="ic">', '').replace('</svg>', '')}</g>
      </svg></div>
      <div class="qrcap">Escanea y mira<br><b>la tienda</b></div>
    </div>
    <div class="info">
      <div class="mini">{MANDALA_ICON.format(st="#FBF5EC", pad="#4A2C1F")}<span>teté</span></div>
      <h2>Tejidos a crochet hechos a mano, <em>en&nbsp;tu&nbsp;color</em></h2>
      <div class="row wa">{WA}<span>{WHATSAPP}</span></div>
      <div class="row web">{WEBI}<span>{WEB}</span></div>
    </div>
  </div>
  <svg class="dots" viewBox="0 0 96 1.6" preserveAspectRatio="none">{DOTS}</svg>
  <div class="cause">{PAW}Parte de cada compra alimenta a perritos de la calle{PAW}</div>
</section>

<script src="../js/mandala.js"></script>
<style>.mandala-deco svg{{animation:none!important}}</style>
</body></html>"""

with open(os.path.join(AQUI, "tarjeta.html"), "w", encoding="utf-8") as f:
    f.write(html)
print(f"tarjeta.html creada · QR {n}x{n} módulos · URL {URL}")
