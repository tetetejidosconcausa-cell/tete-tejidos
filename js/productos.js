// Catálogo de Teté. Precios de referencia en pesos chilenos: ajústalos aquí.
// Cada color apunta a una foto sin fondo en /img/p.
// sim: true = vista previa del color generada a partir de la foto real (Teté lo teje a pedido).
const sim = (n, c, img) => ({ n, c, img, sim: true });

const PRODUCTOS = [
  {
    id: 'gorrito-gatito', nombre: 'Gorrito Gatito', cat: 'gorros', precio: 15990,
    badge: 'Favorito ♥', etiquetaColor: 'Color', tallas: ['Niño/a', 'Adulto S/M', 'Adulto L/XL'], guia: 'gorro',
    desc: 'Gorrito con orejitas de gato tejido en punto relieve, con doblez abrigador y etiqueta Teté. Tierno, calentito y con mucha personalidad.',
    detalles: ['Tejido 100% a mano', 'Punto relieve con doblez', 'Tallas niño/a y adulto'],
    colores: [
      { n: 'Rojo', c: '#D7192A', img: 'gatito-rojo' },
      sim('Negro', '#2A2627', 'gatito-negro'),
      sim('Fucsia', '#D81B7A', 'gatito-fucsia'),
      sim('Rosado', '#F2A2C0', 'gatito-rosado'),
      sim('Lila', '#A98BD8', 'gatito-lila'),
      sim('Celeste', '#7EC3EA', 'gatito-celeste'),
      sim('Azul marino', '#1F3B73', 'gatito-azul'),
      sim('Verde', '#3E8E5A', 'gatito-verde'),
      sim('Mostaza', '#D9A21B', 'gatito-mostaza'),
      sim('Café', '#6B4226', 'gatito-cafe'),
      sim('Crema', '#F1E4C9', 'gatito-crema'),
    ],
  },
  {
    id: 'pescador-flores', nombre: 'Gorro Pescador con Flores', cat: 'gorros', precio: 18990,
    badge: 'Nuevo', etiquetaColor: 'Color del gorro', tallas: ['Niño/a', 'Adulto S/M', 'Adulto L/XL'], guia: 'gorro',
    desc: 'Gorro tipo pescador con ala de vuelos y una corrida de flores granny en tonos pastel. Para el sol, los paseos y para lucirlo.',
    detalles: ['Tejido 100% a mano', 'Ala con vuelos', 'Flores granny tejidas'],
    colores: [
      { n: 'Fucsia', c: '#E0167E', img: 'pescador-fucsia' },
      sim('Rojo', '#C8202B', 'pescador-rojo'),
      sim('Lila', '#9A7BD0', 'pescador-lila'),
      sim('Celeste', '#6FB8E6', 'pescador-celeste'),
      sim('Turquesa', '#1FA3A0', 'pescador-turquesa'),
      sim('Mostaza', '#D6A019', 'pescador-mostaza'),
      sim('Negro', '#2A2627', 'pescador-negro'),
      sim('Crema', '#EFE2C6', 'pescador-crema'),
    ],
  },
  {
    id: 'bolso-rombos', nombre: 'Bolso Granny Rombos', cat: 'bolsos', precio: 24990,
    badge: 'Hecho a mano', etiquetaColor: 'Color de los rombos',
    desc: 'Bolso de hombro con cuadros granny en diseño de rombos, combinados con tonos crudos y asas largas. Liviano, resistente y elegante.',
    detalles: ['Cuadros granny unidos a mano', 'Asas largas para el hombro', 'Diseño de rombos'],
    colores: [
      { n: 'Lila', c: '#B49BDF', img: 'bolso-lila' },
      sim('Rosado', '#EBA3BE', 'bolso-rombos-rosado'),
      sim('Celeste', '#93C6E8', 'bolso-rombos-celeste'),
      sim('Menta', '#94D2B8', 'bolso-rombos-menta'),
      sim('Mostaza', '#E2B550', 'bolso-rombos-mostaza'),
      sim('Terracota', '#CF7457', 'bolso-rombos-terracota'),
    ],
  },
  {
    id: 'bolso-multicolor', nombre: 'Bolso Granny Multicolor', cat: 'bolsos', precio: 24990,
    badge: 'Elige tu paleta', etiquetaColor: 'Paleta',
    desc: 'Bolso de hombro hecho con cuadros granny de distintos colores, unidos con borde crudo. Alegre, liviano y único.',
    detalles: ['Cuadros granny unidos a mano', 'Asas largas para el hombro', 'Cada combinación es única'],
    colores: [
      { n: 'Pastel', c: 'conic-gradient(#8E6FD8,#2BB3A6,#F2B425,#F08DB4,#8E6FD8)', img: 'bolso-pastel' },
      sim('Océano', 'conic-gradient(#2BB3A6,#3F7FD0,#7FC4E8,#2BB3A6)', 'bolso-multi-oceano'),
      sim('Atardecer', 'conic-gradient(#E2338A,#E2553B,#F2B425,#E2338A)', 'bolso-multi-atardecer'),
      sim('Jardín', 'conic-gradient(#7BB33A,#2BB3A6,#C9D96B,#7BB33A)', 'bolso-multi-jardin'),
      sim('Frutal', 'conic-gradient(#8E6FD8,#E2338A,#E2553B,#8E6FD8)', 'bolso-multi-frutal'),
    ],
  },
  {
    id: 'beanie-jaspeado', nombre: 'Gorro Beanie Jaspeado', cat: 'gorros', precio: 13990,
    badge: 'Básico', etiquetaColor: 'Color', tallas: ['Niño/a', 'Adulto S/M', 'Adulto L/XL'], guia: 'gorro',
    desc: 'Beanie clásico con doblez ancho, tejido en lana jaspeada suave. El básico que abriga todo el invierno.',
    detalles: ['Tejido 100% a mano', 'Doblez ancho', 'Lana jaspeada'],
    colores: [
      { n: 'Celeste', c: 'linear-gradient(135deg,#A9C4E8,#EEF2F8)', img: 'beanie-celeste' },
      sim('Rosado', 'linear-gradient(135deg,#E9A6C2,#F7E7EE)', 'beanie-rosado'),
      sim('Fucsia', 'linear-gradient(135deg,#D0307E,#F4C6DC)', 'beanie-fucsia'),
      sim('Lila', 'linear-gradient(135deg,#B9A3E0,#F1ECF8)', 'beanie-lila'),
      sim('Menta', 'linear-gradient(135deg,#9AD3BC,#EEF8F3)', 'beanie-menta'),
      sim('Mostaza', 'linear-gradient(135deg,#D9AE4E,#F7EEDB)', 'beanie-mostaza'),
      sim('Gris', 'linear-gradient(135deg,#9A9A9A,#EDEDED)', 'beanie-gris'),
    ],
  },
  {
    id: 'cuello-jaspeado', nombre: 'Cuello Jaspeado', cat: 'abrigo', precio: 12990,
    badge: 'Abrigador', etiquetaColor: 'Color',
    desc: 'Cuello tubular tejido en lana jaspeada, suave y abrigador. Se pone fácil y protege del frío sin apretar.',
    detalles: ['Tejido 100% a mano', 'Tubular, sin botones', 'Talla única'],
    colores: [
      { n: 'Fucsia', c: 'linear-gradient(135deg,#C8187A,#F4B6D6)', img: 'cuello-fucsia' },
      sim('Morado', 'linear-gradient(135deg,#7B3FA0,#E3D2F0)', 'cuello-morado'),
      sim('Rojo', 'linear-gradient(135deg,#C2262E,#F3C9CB)', 'cuello-rojo'),
      sim('Celeste', 'linear-gradient(135deg,#4FA6DA,#DCEEF9)', 'cuello-celeste'),
      sim('Turquesa', 'linear-gradient(135deg,#1FA3A0,#CDEDEC)', 'cuello-turquesa'),
      sim('Verde', 'linear-gradient(135deg,#3E8E5A,#D5EBDD)', 'cuello-verde'),
      sim('Gris', 'linear-gradient(135deg,#777,#E5E5E5)', 'cuello-gris'),
    ],
  },
  {
    id: 'cintillo-turbante', nombre: 'Cintillo Turbante', cat: 'abrigo', precio: 7990,
    badge: 'Combina', etiquetaColor: 'Color',
    desc: 'Cintillo con nudo tipo turbante en lana jaspeada. Abriga las orejas y combina con el cuello del mismo color.',
    detalles: ['Tejido 100% a mano', 'Nudo central', 'Talla única ajustable'],
    colores: [
      { n: 'Fucsia', c: 'linear-gradient(135deg,#C8187A,#F4B6D6)', img: 'cintillo-fucsia' },
      sim('Morado', 'linear-gradient(135deg,#7B3FA0,#E3D2F0)', 'cintillo-morado'),
      sim('Rojo', 'linear-gradient(135deg,#C2262E,#F3C9CB)', 'cintillo-rojo'),
      sim('Celeste', 'linear-gradient(135deg,#4FA6DA,#DCEEF9)', 'cintillo-celeste'),
      sim('Turquesa', 'linear-gradient(135deg,#1FA3A0,#CDEDEC)', 'cintillo-turquesa'),
      sim('Verde', 'linear-gradient(135deg,#3E8E5A,#D5EBDD)', 'cintillo-verde'),
      sim('Gris', 'linear-gradient(135deg,#777,#E5E5E5)', 'cintillo-gris'),
    ],
  },
  {
    id: 'chaqueta-granny', nombre: 'Chaqueta Granny', cat: 'abrigo', precio: 34990,
    badge: 'Pieza única', etiquetaColor: 'Paleta', tallas: ['XS', 'S', 'M', 'L', 'XL', 'A medida'], guia: 'ropa',
    desc: 'Chaqueta abierta en punto granny con degradado de colores, mangas abullonadas y puños elasticados. Calentita y llena de vida.',
    detalles: ['Tejido 100% a mano', 'Mangas globo con puño', 'Hecha a tu talla'],
    colores: [
      { n: 'Arcoíris', c: 'linear-gradient(135deg,#C2262E,#F29A1F,#F5D02A,#1FA3A0)', img: 'chaqueta-arcoiris' },
      sim('Atardecer', 'linear-gradient(135deg,#C2264F,#E2553B,#F2B425)', 'chaqueta-atardecer'),
      sim('Océano', 'linear-gradient(135deg,#1FA3A0,#2F6FC0,#6B4FB8)', 'chaqueta-oceano'),
      sim('Bosque', 'linear-gradient(135deg,#B9C23A,#3E8E5A,#1F8A7A)', 'chaqueta-bosque'),
      sim('Pastel', 'linear-gradient(135deg,#F2B6C6,#F7E0A6,#BDE3E0)', 'chaqueta-pastel'),
    ],
  },
  {
    id: 'atrapasuenos', nombre: 'Atrapasueños Mandala', cat: 'regalos', precio: 22990,
    badge: 'Hecho a pedido', etiquetaColor: 'Paleta',
    desc: 'Mandala tejido sobre aro con colgantes de esferas tejidas. Llena de color y buena energía un dormitorio, una pieza de niños o tu rincón favorito.',
    detalles: ['Tejido 100% a mano', 'Listo para colgar', 'Cada pieza es única'],
    colores: [
      { n: 'Fuego', c: 'linear-gradient(135deg,#C2262E,#F29A1F,#F5D02A)', img: 'atrapasuenos-fuego' },
      sim('Océano', 'linear-gradient(135deg,#2F6FC0,#1FA3A0,#7FD0E8)', 'atrapasuenos-oceano'),
      sim('Bosque', 'linear-gradient(135deg,#2E8B57,#7BB33A,#C9D96B)', 'atrapasuenos-bosque'),
      sim('Lavanda', 'linear-gradient(135deg,#7B3FA0,#C2338A,#F08DB4)', 'atrapasuenos-lavanda'),
    ],
  },
  {
    id: 'set-bebe', nombre: 'Set Bebé Zapatitos + Cintillo', cat: 'regalos', precio: 14990,
    badge: 'Regalo ideal', etiquetaColor: 'Color', tallas: ['0-3 m', '3-6 m', '6-12 m', '12-18 m'], guia: 'bebe',
    desc: 'Zapatitos tipo ballerina con lacito y cintillo a juego, suaves y livianos. El regalo perfecto para un baby shower.',
    detalles: ['Zapatitos + cintillo', 'Lana suave para bebé', 'Detalles con cinta de raso'],
    colores: [
      { n: 'Rosado', c: '#F08DB4', img: 'bebe-rosado' },
      sim('Celeste', '#8CC8EE', 'bebe-celeste'),
      sim('Lila', '#B79AE6', 'bebe-lila'),
      sim('Crema', '#F3E6C8', 'bebe-crema'),
    ],
  },
];

// Productos retirados de la tienda. Para volver a mostrarlos, muévelos a PRODUCTOS
// (sus imágenes siguen en /img/p).
const PRODUCTOS_RETIRADOS = [
  { id: 'set-individual', nombre: 'Juego de Individuales', precio: 54990, imgs: ['posavasos-todos'] },
  { id: 'mandala-esferas', nombre: 'Mandala con Esferas', precio: 19990, imgs: ['mandala-esferas'] },
  { id: 'gorro-girasoles', nombre: 'Gorro Girasoles', precio: 16990, imgs: ['gorro-girasol'] },
  { id: 'sweater-cafe', nombre: 'Sweater Café con Leche', precio: 34990, imgs: ['sweater-tierra'] },
  { id: 'frutitas', nombre: 'Frutitas de Regalo', precio: 3490, imgs: ['frutas-limon', 'frutas-naranja'] },
];

// Guías de tallas (medidas referenciales: Teté confirma o ajusta cada pedido).
const GUIAS = {
  ropa: { titulo: 'Guía de tallas · Ropa', cols: ['Talla', 'Contorno de pecho', 'Largo aprox.'],
    filas: [['XS', '80 – 84 cm', '48 cm'], ['S', '85 – 89 cm', '50 cm'], ['M', '90 – 95 cm', '52 cm'], ['L', '96 – 101 cm', '54 cm'], ['XL', '102 – 107 cm', '56 cm'], ['A medida', 'Envíanos tus medidas', '—']] },
  gorro: { titulo: 'Guía de tallas · Gorros', cols: ['Talla', 'Contorno de cabeza'],
    filas: [['Niño/a', '48 – 52 cm'], ['Adulto S/M', '53 – 56 cm'], ['Adulto L/XL', '57 – 60 cm']] },
  bebe: { titulo: 'Guía de tallas · Bebé', cols: ['Talla', 'Largo del pie', 'Contorno de cabeza'],
    filas: [['0-3 m', '9 cm', '35 – 40 cm'], ['3-6 m', '10 cm', '40 – 43 cm'], ['6-12 m', '11,5 cm', '43 – 46 cm'], ['12-18 m', '12,5 cm', '46 – 48 cm']] },
};

// "Completa el look": qué se sugiere en la ficha de cada producto (ajústalo aquí).
const COMBINA = {
  'gorrito-gatito': ['cuello-jaspeado', 'bolso-multicolor'],
  'pescador-flores': ['bolso-rombos', 'bolso-multicolor'],
  'bolso-rombos': ['pescador-flores', 'beanie-jaspeado'],
  'bolso-multicolor': ['gorrito-gatito', 'pescador-flores'],
  'beanie-jaspeado': ['cuello-jaspeado', 'cintillo-turbante'],
  'cuello-jaspeado': ['beanie-jaspeado', 'gorrito-gatito'],
  'cintillo-turbante': ['cuello-jaspeado', 'bolso-rombos'],
  'chaqueta-granny': ['beanie-jaspeado', 'bolso-multicolor'],
  'atrapasuenos': ['set-bebe', 'bolso-multicolor'],
  'set-bebe': ['atrapasuenos', 'gorrito-gatito'],
};
PRODUCTOS.forEach(p => { p.combina = COMBINA[p.id] || []; });