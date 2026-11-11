# Teté · Tejidos con causa

Tienda web de **Teté**: tejidos a crochet hechos a mano (gorros, bolsos, abrigo y regalos), en el color y la talla que elija cada cliente. Parte de cada compra se destina a alimentar perritos de la calle.

El carrito no cobra en línea: arma el pedido y lo envía por **WhatsApp** a Teté, que coordina el pago y la entrega.

## Cómo verla

Es una página estática (HTML, CSS y JavaScript, sin instalar nada). Abre `index.html` en el navegador.

- `index.html`: versión principal (concepto de marca 02 · Huella mandala).
- `index-ovillo.html`: versión alternativa (concepto 01 · Huella-ovillo).

## Qué editar

| Quiero cambiar… | Archivo |
|---|---|
| Productos, precios, colores, tallas, "Completa el look" | `js/productos.js` |
| Número de WhatsApp | `js/app.js` (constante `WHATSAPP`) |
| Textos de la página | `index.html` |
| Diseño | `css/` (`refine.css` tiene los ajustes finales) |

Las fotos de producto están en `img/p/` (900 px, para la ficha y la portada) e `img/p/sm/` (560 px, para tarjetas y miniaturas). Los colores marcados con `sim: true` en `productos.js` son vistas previas generadas a partir de la foto real.

## Publicar

1. Ejecuta `.\preparar-para-publicar.ps1 -Sitio "https://tu-dominio.cl"` para que la vista previa al compartir (WhatsApp, Facebook) use direcciones completas.
2. Sube la carpeta a un hosting estático (GitHub Pages, Netlify o Cloudflare Pages).
3. Revisa la vista previa en el [depurador de Facebook](https://developers.facebook.com/tools/debug/).
