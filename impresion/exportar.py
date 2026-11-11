"""Exporta la tarjeta: PNG 300 dpi, PDF con marcas de corte, vista previa y verificación del QR.
Uso: python exportar.py "<carpeta de salida>" "<pdf de imprenta ya generado>" """
import sys
import fitz
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter

Image.init()

def safe_path(path):
    """Si el archivo está abierto (bloqueado), devuelve un nombre alternativo."""
    try:
        open(path, "ab").close()
        return path
    except PermissionError:
        base, ext = path.rsplit(".", 1)
        alt = f"{base} (actualizado).{ext}"
        print(f"  aviso: {path.split(chr(92))[-1]} está abierto; se guarda como {alt.split(chr(92))[-1]}")
        return alt
out, pdf_path = sys.argv[1], sys.argv[2]
px = 300 / 25.4

doc = fitz.open(pdf_path)
mm = lambda pt: pt / 72 * 25.4
print("PDF imprenta:", doc.page_count, "páginas ·", " | ".join(f"{mm(p.rect.width):.1f} x {mm(p.rect.height):.1f} mm" for p in doc))

cards = []
for i, name in enumerate(["frente", "reverso"]):
    pix = doc[i].get_pixmap(dpi=300)
    path = fr"{out}\Tarjeta Teté - {name} 300dpi (con sangrado).png"
    pix.save(path)
    img = Image.open(path).convert("RGB")
    img.save(path, dpi=(300, 300))
    cards.append(img)
    print(f"PNG {name}: {img.width} x {img.height} px")

# QR: leerlo desde el PNG final del reverso
det = cv2.QRCodeDetector()
data, _, _ = det.detectAndDecode(cv2.cvtColor(np.array(cards[1]), cv2.COLOR_RGB2BGR))
print("QR en el archivo final:", data or "NO LEIDO")

# PDF con marcas de corte (8 mm de margen blanco, marcas en la línea de corte)
pages = []
for card in cards:
    pad = round(8 * px)
    canvas = Image.new("RGB", (card.width + 2 * pad, card.height + 2 * pad), "white")
    canvas.paste(card, (pad, pad))
    dr = ImageDraw.Draw(canvas)
    t, gap, w = round(3 * px), round(1 * px), max(2, round(.15 * px))
    x0, y0, x1, y1 = pad + t, pad + t, pad + card.width - t, pad + card.height - t
    for x in (x0, x1):
        dr.line([(x, 0), (x, pad - gap)], fill="black", width=w)
        dr.line([(x, canvas.height - pad + gap), (x, canvas.height)], fill="black", width=w)
    for y in (y0, y1):
        dr.line([(0, y), (pad - gap, y)], fill="black", width=w)
        dr.line([(canvas.width - pad + gap, y), (canvas.width, y)], fill="black", width=w)
    pages.append(canvas)
pages[0].save(safe_path(fr"{out}\Tarjeta Teté - con marcas de corte.pdf"), save_all=True, append_images=pages[1:], resolution=300)
print("PDF con marcas de corte listo")

# Vista previa: tarjeta ya cortada (90 x 50 mm) con sombra
t = round(3 * px)
cut = [c.crop((t, t, c.width - t, c.height - t)) for c in cards]
cw, ch = cut[0].size
bg = Image.new("RGB", (cw + 260, ch * 2 + 300), (233, 224, 212))
for k, c in enumerate(cut):
    x, y = 130, 110 + k * (ch + 80)
    sh = Image.new("L", bg.size, 0)
    ImageDraw.Draw(sh).rounded_rectangle((x + 8, y + 18, x + cw + 8, y + ch + 18), radius=24, fill=120)
    bg.paste((90, 70, 55), mask=sh.filter(ImageFilter.GaussianBlur(22)))
    m = Image.new("L", c.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, cw, ch), radius=14, fill=255)
    bg.paste(c, (x, y), m)
bg.save(safe_path(fr"{out}\Vista previa - tarjeta cortada.png"))
print("Vista previa lista")
