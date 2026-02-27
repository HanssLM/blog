let onAuthStateChanged;
let addDoc;
let collection;
let getDocs;
let orderBy;
let query;
let serverTimestamp;
let where;

let auth;
let db;

let firebaseLoadPromise = null;

async function ensureFirebaseLoaded() {
  if (USE_MOCK) return;
  if (firebaseLoadPromise) return firebaseLoadPromise;

  firebaseLoadPromise = (async () => {
    const authMod = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
    const fsMod = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const localMod = await import('./../../js/firebase.js');

    onAuthStateChanged = authMod.onAuthStateChanged;

    addDoc = fsMod.addDoc;
    collection = fsMod.collection;
    getDocs = fsMod.getDocs;
    orderBy = fsMod.orderBy;
    query = fsMod.query;
    serverTimestamp = fsMod.serverTimestamp;
    where = fsMod.where;

    auth = localMod.auth;
    db = localMod.db;
  })();

  return firebaseLoadPromise;
}

const estado = document.getElementById('estadoAuth');
const lista = document.getElementById('listaPosts');
const form = document.getElementById('formPost');
const msg = document.getElementById('msgPost');
const paginacion = document.getElementById('paginacionPosts');
const bloqueCrearPost = document.getElementById('bloqueCrearPost');
const formFiltres = document.getElementById('formFiltres');
const filtreText = document.getElementById('filtreText');
const filtreTag = document.getElementById('filtreTag');
const filtreSort = document.getElementById('filtreSort');
const btnResetFiltres = document.getElementById('btnResetFiltres');
const btnClearSearch = document.getElementById('btnClearSearch');

const btnOpenModal = document.getElementById('btnOpenModal');
const modalCrearPost = document.getElementById('crearPostModal');
let lastActiveElement = null;

const navAuthChip = document.getElementById('navAuthChip');
const navAuthAvatar = document.getElementById('navAuthAvatar');
const navAuthLogged = document.getElementById('navAuthLogged');
const navAuthGuest = document.getElementById('navAuthGuest');
const navAvatarImg = document.getElementById('navAvatarImg');
const navAvatarFallback = document.getElementById('navAvatarFallback');

const imageUrlInput = document.getElementById('imageUrl');
const imagePreview = document.getElementById('imagePreview');
let previewObjectUrl = null;

let isSubmittingPost = false;

const USE_MOCK = new URLSearchParams(window.location.search).has('mock');

const MOCK_POSTS = [
  {
    id: 'mock-1',
    title: 'Guía rápida: montar un PC en 2026',
    author: 'Hans',
    tags: ['hardware', 'pc', 'guía'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-2',
    title: 'Nuevas GPUs: qué mirar antes de comprar',
    author: 'Hans',
    tags: ['gpu', 'benchmark', 'compra'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-3',
    title: 'RAM DDR5: latencias, perfiles XMP y recomendaciones',
    author: 'Hans',
    tags: ['ram', 'ddr5', 'xmp'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-4',
    title: 'SSD NVMe: temperaturas y disipadores',
    author: 'Hans',
    tags: ['ssd', 'nvme', 'thermals'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    imageUrl: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-5',
    title: 'PSU: cómo elegir una fuente sin morir en el intento',
    author: 'Hans',
    tags: ['psu', 'seguridad', 'guía'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-6',
    title: 'Refrigeración: aire vs AIO',
    author: 'Hans',
    tags: ['cooling', 'aio', 'air'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 160),
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-7',
    title: 'Monitores: IPS vs VA vs OLED',
    author: 'Hans',
    tags: ['monitor', 'oled', 'ips'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 200),
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-8',
    title: 'Placas base: VRM, fases y estabilidad',
    author: 'Hans',
    tags: ['motherboard', 'vrm', 'oc'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 240),
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-9',
    title: 'Teclados mecánicos: switches y layout',
    author: 'Hans',
    tags: ['keyboard', 'switches', 'setup'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 280),
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-10',
    title: 'Ratones gaming: sensores, peso y polling',
    author: 'Hans',
    tags: ['mouse', 'sensor', 'gaming'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 320),
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-11',
    title: 'Cajas PC: airflow y filtros de polvo',
    author: 'Hans',
    tags: ['case', 'airflow', 'build'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 360),
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-12',
    title: 'WiFi 7: ¿vale la pena ya?',
    author: 'Hans',
    tags: ['wifi', 'network', 'router'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 420),
    imageUrl: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-13',
    title: 'Overclock básico: límites seguros',
    author: 'Hans',
    tags: ['oc', 'cpu', 'safety'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed arcu. Cras consequat. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 480),
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-14',
    title: 'Windows vs Linux para gaming',
    author: 'Hans',
    tags: ['os', 'linux', 'gaming'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 520),
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-15',
    title: 'Guía de backups: 3-2-1 en casa',
    author: 'Hans',
    tags: ['backup', 'nas', 'seguridad'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 560),
    imageUrl: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-16',
    title: 'Audio para gaming: DAC, impedancia y micrófonos',
    author: 'Hans',
    tags: ['audio', 'gaming', 'setup'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla sed consectetur. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 620),
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-17',
    title: 'Cableado y gestión: tu setup limpio en 30 minutos',
    author: 'Hans',
    tags: ['setup', 'cables', 'organización'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed odio dui. Cras mattis consectetur purus sit amet fermentum. Etiam porta sem malesuada magna mollis euismod. Maecenas faucibus mollis interdum.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 700),
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-18',
    title: 'Cómo elegir portátil: CPU, GPU y autonomía',
    author: 'Hans',
    tags: ['laptop', 'compra', 'guía'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 780),
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-19',
    title: 'Teclas y keycaps: materiales, perfiles y sonido',
    author: 'Hans',
    tags: ['keyboard', 'keycaps', 'sound'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor. Sed posuere consectetur est at lobortis. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nulla vitae elit libero.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 860),
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-20',
    title: 'Red local: latencia, QoS y trucos para jugar mejor',
    author: 'Hans',
    tags: ['network', 'qos', 'latency'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 940),
    imageUrl: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-21',
    title: 'Almacenamiento: HDD todavía sirve? Casos reales',
    author: 'Hans',
    tags: ['storage', 'hdd', 'archivos'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nulla vitae elit libero, a pharetra augue. Duis mollis, est non commodo luctus.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1020),
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-22',
    title: 'Bloatware en Windows: qué quitar (sin romper nada)',
    author: 'Hans',
    tags: ['windows', 'tweaks', 'rendimiento'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Aenean lacinia bibendum nulla sed consectetur. Cras mattis consectetur purus sit amet fermentum.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1100),
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-23',
    title: 'Linux para devs: distros, tooling y productividad',
    author: 'Hans',
    tags: ['linux', 'dev', 'tooling'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas faucibus mollis interdum. Nulla vitae elit libero, a pharetra augue. Vestibulum id ligula porta felis euismod semper. Curabitur blandit tempus porttitor.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1180),
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-24',
    title: 'Sillas gaming: ergonomía real vs marketing',
    author: 'Hans',
    tags: ['ergonomía', 'setup', 'salud'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper nulla non metus auctor fringilla. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nullam id dolor id nibh ultricies vehicula.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1260),
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-25',
    title: 'Iluminación RGB: cómo hacerlo elegante',
    author: 'Hans',
    tags: ['rgb', 'setup', 'estética'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Duis mollis, est non commodo luctus.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1340),
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-26',
    title: 'Monitores ultrawide: pros y contras para estudiar',
    author: 'Hans',
    tags: ['monitor', 'ultrawide', 'productividad'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Curabitur blandit tempus porttitor.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1420),
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-27',
    title: 'Qué es una BIOS y por qué deberías actualizarla',
    author: 'Hans',
    tags: ['bios', 'motherboard', 'seguridad'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed odio dui. Vestibulum id ligula porta felis euismod semper. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1500),
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-28',
    title: 'Streaming básico: escena, bitrate y webcam',
    author: 'Hans',
    tags: ['streaming', 'obs', 'creator'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nulla vitae elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1580),
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-29',
    title: 'Seguridad en casa: 2FA, passwords y hábitos',
    author: 'Hans',
    tags: ['seguridad', '2fa', 'passwords'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Donec sed odio dui.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1660),
    imageUrl: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&w=1400&q=60'
  },
  {
    id: 'mock-30',
    title: 'NAS casero: cuándo compensa y cómo empezar',
    author: 'Hans',
    tags: ['nas', 'backup', 'home-lab'],
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Nulla vitae elit libero, a pharetra augue.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1740),
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=60'
  }
];

let allItems = [];
let filteredItems = [];
let currentPage = 1;
let currentPageSize = 12;

function getPageSize() {
  if (window.matchMedia('(min-width: 1368px)').matches) return 12;
  if (window.matchMedia('(min-width: 1100px)').matches) return 12;
  if (window.matchMedia('(min-width: 700px)').matches) return 6;
  return 3;
}

function totalPages() {
  return Math.max(1, Math.ceil(filteredItems.length / currentPageSize));
}

function setPage(next) {
  const max = totalPages();
  currentPage = Math.min(Math.max(1, next), max);
  renderCurrentPage();
}

function renderPaginacion() {
  if (!paginacion) return;
  paginacion.innerHTML = '';

  const max = totalPages();
  if (max <= 1) return;

  const mkBtn = (text, page, disabled, current) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    if (disabled) b.disabled = true;
    if (current) b.setAttribute('aria-current', 'page');
    b.addEventListener('click', () => setPage(page));
    return b;
  };

  paginacion.appendChild(mkBtn('«', currentPage - 1, currentPage === 1, false));

  for (let p = 1; p <= max; p++) {
    paginacion.appendChild(mkBtn(String(p), p, false, p === currentPage));
  }

  paginacion.appendChild(mkBtn('»', currentPage + 1, currentPage === max, false));
}

function renderCurrentPage() {
  const start = (currentPage - 1) * currentPageSize;
  const pageItems = filteredItems.slice(start, start + currentPageSize);
  renderPosts(pageItems);
  renderPaginacion();
}

function normTag(t) {
  const s = String(t || '').trim();
  if (!s) return '';
  return s.startsWith('#') ? s.slice(1).trim() : s;
}

function uniqTags(list) {
  const seen = new Set();
  const out = [];
  for (const raw of list) {
    const t = normTag(raw);
    const key = t.toLowerCase();
    if (!t || seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

function slugify(text) {
  const s = String(text || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'post';
}

function withTimeout(promise, ms, label) {
  let t = null;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => {
      reject(new Error(`timeout:${label}`));
    }, ms);
  });

  return Promise.race([
    promise.finally(() => {
      if (t) clearTimeout(t);
    }),
    timeout
  ]);
}

function normVisibility(v) {
  const s = String(v || '').trim().toLowerCase();
  if (s === 'public' || s === 'unlisted' || s === 'private') return s;
  return 'public';
}

function postVisibility(post) {
  if (post?.visibility) return normVisibility(post.visibility);
  if (typeof post?.published === 'boolean') return post.published ? 'public' : 'private';
  return 'public';
}

function toDateValue(v) {
  if (v?.toDate?.()) return v.toDate();
  if (v instanceof Date) return v;
  return null;
}

function populateTagOptions() {
  if (!filtreTag) return;
  const current = String(filtreTag.value || '');
  const tags = new Set();
  for (const it of allItems) {
    const list = Array.isArray(it.tags) ? it.tags : [];
    for (const t of list) {
      const n = normTag(t);
      if (n) tags.add(n);
    }
  }
  const sorted = Array.from(tags).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

  filtreTag.innerHTML = '';
  const optAll = document.createElement('option');
  optAll.value = '';
  optAll.textContent = 'Totes';
  filtreTag.appendChild(optAll);

  for (const t of sorted) {
    const o = document.createElement('option');
    o.value = t;
    o.textContent = t;
    filtreTag.appendChild(o);
  }

  filtreTag.value = sorted.includes(current) ? current : '';
}

function applyFilters() {
  const q = String(filtreText?.value || '').trim().toLowerCase();
  const tag = normTag(filtreTag?.value || '');
  const sort = String(filtreSort?.value || 'new');

  filteredItems = allItems.filter((it) => {
    if (tag) {
      const list = Array.isArray(it.tags) ? it.tags : [];
      const has = list.some((t) => normTag(t).toLowerCase() === tag.toLowerCase());
      if (!has) return false;
    }
    if (q) {
      const t = String(it.title || '').toLowerCase();
      const c = String(it.content || '').toLowerCase();
      if (!t.includes(q) && !c.includes(q)) return false;
    }
    return true;
  });

  if (sort === 'title') {
    filteredItems.sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'es', { sensitivity: 'base' }));
  } else {
    filteredItems.sort((a, b) => {
      const da = toDateValue(a.createdAt)?.getTime?.() || 0;
      const db = toDateValue(b.createdAt)?.getTime?.() || 0;
      return sort === 'old' ? da - db : db - da;
    });
  }

  currentPage = 1;
  renderCurrentPage();
}

if (formFiltres) {
  formFiltres.addEventListener('submit', (e) => e.preventDefault());
  filtreText?.addEventListener('input', () => applyFilters());
  filtreTag?.addEventListener('change', () => applyFilters());
  filtreSort?.addEventListener('change', () => applyFilters());
  btnClearSearch?.addEventListener('click', () => {
    if (!filtreText) return;
    filtreText.value = '';
    filtreText.dispatchEvent(new Event('input', { bubbles: true }));
    filtreText.focus();
  });
  formFiltres.addEventListener('reset', () => {
    queueMicrotask(() => applyFilters());
  });
}

if (imageUrlInput && imagePreview) {
  imageUrlInput.addEventListener('input', () => {
    const raw = String(imageUrlInput.value || '').trim();

    imagePreview.hidden = true;
    imagePreview.removeAttribute('src');

    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
      previewObjectUrl = null;
    }

    if (!raw) return;

    let parsed = null;
    try {
      parsed = new URL(raw);
    } catch {
      return;
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return;

    imagePreview.src = parsed.toString();
    imagePreview.hidden = false;
  });
}

function setPublishUi(isPublishing) {
  const btn = form?.querySelector?.('button[type="submit"]');
  if (!(btn instanceof HTMLButtonElement)) return;
  if (isPublishing) {
    btn.disabled = true;
    if (!btn.dataset.originalText) btn.dataset.originalText = btn.textContent || '';
    btn.textContent = 'Publicant…';
  } else {
    btn.disabled = false;
    const original = btn.dataset.originalText;
    if (typeof original === 'string' && original) btn.textContent = original;
    delete btn.dataset.originalText;
  }
}

function setMsg(texto, esError) {
  if (!msg) return;
  msg.textContent = texto;
  msg.dataset.tipo = esError ? 'error' : 'ok';
}

function renderEstado(user) {
  if (!estado) return;
  if (user) {
    const nombre = user.displayName || user.email || 'Usuario';
    estado.textContent = `Sesión iniciada como ${nombre}`;

    if (navAuthChip) navAuthChip.hidden = false;
    if (navAuthAvatar) navAuthAvatar.hidden = false;
    if (navAuthLogged) {
      navAuthLogged.hidden = false;
      navAuthLogged.textContent = user.displayName || user.email || 'Perfil';
    }
    if (navAuthGuest) navAuthGuest.hidden = true;

    const photoUrl = typeof user.photoURL === 'string' ? user.photoURL : '';
    if (navAvatarImg && navAvatarFallback) {
      if (photoUrl) {
        navAvatarImg.src = photoUrl;
        navAvatarImg.hidden = false;
        navAvatarFallback.hidden = true;
      } else {
        navAvatarImg.hidden = true;
        navAvatarImg.removeAttribute('src');
        navAvatarFallback.hidden = false;
      }
    }

    if (bloqueCrearPost) bloqueCrearPost.style.display = 'block';
    if (btnOpenModal) btnOpenModal.style.display = 'inline-flex';
    if (form) form.style.display = 'block';
  } else {
    estado.textContent = 'No has iniciado sesión.';

    if (navAuthChip) navAuthChip.hidden = false;
    if (navAuthAvatar) navAuthAvatar.hidden = false;
    if (navAuthLogged) navAuthLogged.hidden = true;
    if (navAuthGuest) navAuthGuest.hidden = false;
    if (navAvatarImg) {
      navAvatarImg.hidden = true;
      navAvatarImg.removeAttribute('src');
    }
    if (navAvatarFallback) navAvatarFallback.hidden = false;

    if (bloqueCrearPost) bloqueCrearPost.style.display = 'none';
    if (btnOpenModal) btnOpenModal.style.display = 'none';
    if (form) form.style.display = 'none';
  }
}

function isModalOpen() {
  return modalCrearPost?.classList.contains('is-open');
}

function openModal() {
  if (!modalCrearPost) return;
  lastActiveElement = document.activeElement;
  modalCrearPost.style.display = 'flex';
  modalCrearPost.classList.add('is-open');
  modalCrearPost.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  const focusable = modalCrearPost.querySelector('input, textarea, select, button');
  if (focusable instanceof HTMLElement) focusable.focus();
}

function closeModal() {
  if (!modalCrearPost) return;
  modalCrearPost.classList.remove('is-open');
  modalCrearPost.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  modalCrearPost.style.display = 'none';
  if (lastActiveElement instanceof HTMLElement) lastActiveElement.focus();
  lastActiveElement = null;

  if (imagePreview) {
    imagePreview.hidden = true;
    imagePreview.removeAttribute('src');
  }
  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
    previewObjectUrl = null;
  }
  if (imageUrlInput) imageUrlInput.value = '';
}

if (btnOpenModal && modalCrearPost) {
  if (!modalCrearPost.classList.contains('is-open')) {
    modalCrearPost.style.display = 'none';
    modalCrearPost.setAttribute('aria-hidden', 'true');
  }

  btnOpenModal.addEventListener('click', () => openModal());

  modalCrearPost.addEventListener('click', (ev) => {
    const t = ev.target;
    if (t instanceof Element && t.closest('[data-close-modal]')) closeModal();
  });

  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && isModalOpen()) {
      ev.preventDefault();
      closeModal();
    }
  });
}

function renderPosts(items) {
  if (!lista) return;
  lista.innerHTML = '';

  if (!items.length) {
    const p = document.createElement('p');
    p.textContent = 'No hay posts aún.';
    lista.appendChild(p);
    return;
  }

  for (const data of items) {

    const art = document.createElement('article');
    const h = document.createElement('h3');
    const meta = document.createElement('p');
    const body = document.createElement('p');
    const tags = document.createElement('div');
    const actions = document.createElement('div');
    const leerMas = document.createElement('a');

    h.textContent = data.title || '(Sin título)';
    meta.className = 'post-meta';
    body.className = 'post-extracto';
    tags.className = 'post-tags';
    actions.className = 'post-actions';
    leerMas.className = 'post-leer-mas';

    const fecha = data.createdAt?.toDate?.() || (data.createdAt instanceof Date ? data.createdAt : null);
    const fechaTxt = fecha
      ? fecha.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
      : '';
    const autor = (data.author || data.authorName || '').trim();
    meta.textContent = [autor ? `Autor: ${autor}` : '', fechaTxt].filter(Boolean).join(' | ');

    const contenido = (data.content || '').trim();
    const extracto = contenido.length > 180 ? `${contenido.slice(0, 180)}…` : contenido;
    body.textContent = extracto;

    const tagList = Array.isArray(data.tags) ? data.tags : [];
    for (const t of tagList.slice(0, 6)) {
      const s = document.createElement('span');
      s.className = 'post-tag';
      const limpio = String(t || '').trim();
      if (!limpio) continue;
      s.textContent = limpio.startsWith('#') ? limpio : `#${limpio}`;
      tags.appendChild(s);
    }

    const id = data.id || '';
    const qs = new URLSearchParams();
    if (id) qs.set('id', id);
    if (USE_MOCK) qs.set('mock', '1');
    leerMas.href = `./post.html?${qs.toString()}`;
    leerMas.textContent = 'Leer más';

    if (data.imageUrl) {
      const img = document.createElement('img');
      img.className = 'post-cover';
      img.src = data.imageUrl;
      img.alt = '';
      img.loading = 'lazy';
      art.appendChild(img);
    }

    art.appendChild(h);
    if (meta.textContent) art.appendChild(meta);
    if (tags.childNodes.length) art.appendChild(tags);
    art.appendChild(body);
    actions.appendChild(leerMas);
    art.appendChild(actions);

    art.tabIndex = 0;
    art.setAttribute('role', 'link');
    art.setAttribute('aria-label', `Obrir: ${h.textContent}`);
    art.addEventListener('click', (ev) => {
      const t = ev.target;
      if (t instanceof Element && t.closest('a, button')) return;
      window.location.href = leerMas.href;
    });
    art.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        window.location.href = leerMas.href;
      }
    });

    lista.appendChild(art);
  }
}

async function cargarPosts(user) {
  if (USE_MOCK) {
    allItems = MOCK_POSTS.map((p) => ({ ...p }));
    currentPageSize = getPageSize();
    currentPage = 1;
    applyFilters();
    return;
  }

  await withTimeout(ensureFirebaseLoaded(), 15000, 'firebase-load');
  await cargarPostsFirestore(user);
}

async function cargarPostsFirestore(user) {
  try {
    const currentUser = user ?? auth.currentUser;
    const q = query(
      collection(db, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );

    const snap = await getDocs(q);
    const publicItems = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (currentUser) {
      const qMine = query(collection(db, 'posts'), where('authorUid', '==', currentUser.uid));
      const mineSnap = await getDocs(qMine);
      const mine = mineSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const byId = new Map();
      for (const it of publicItems) byId.set(it.id, it);
      for (const it of mine) byId.set(it.id, it);
      allItems = Array.from(byId.values());

      const toDate = (v) => (v?.toDate?.() ? v.toDate() : v instanceof Date ? v : null);
      allItems.sort((a, b) => (toDate(b.createdAt)?.getTime?.() || 0) - (toDate(a.createdAt)?.getTime?.() || 0));

      const hasMineNonPublic = mine.some((it) => postVisibility(it) !== 'public');
      if (!publicItems.length && mine.length) {
        setMsg('No hay posts públicos aún. Mostrando tus posts.', true);
      } else if (hasMineNonPublic) {
        setMsg('Mostrando posts públicos y tus posts (incluye ocultos/privados).', false);
      }
    } else {
      allItems = publicItems;
      if (!allItems.length) {
        setMsg('No hay posts públicos aún.', true);
      }
    }

    populateTagOptions();
    applyFilters();
    currentPageSize = getPageSize();
    currentPage = 1;
    renderCurrentPage();
  } catch (err) {
    const code = err?.code || '';
    console.error(err);
    if (code === 'failed-precondition') {
      const msgErr = String(err?.message || '');
      const match = msgErr.match(/https:\/\/console\.firebase\.google\.com\S+/);
      if (match?.[0]) {
        console.info('Crea el índice desde este enlace:', match[0]);
      } else {
        console.info('Falta un índice compuesto para la query (published == true + createdAt desc).');
      }
      try {
        const qFallback = query(
          collection(db, 'posts'),
          where('published', '==', true)
        );
        const snap = await getDocs(qFallback);
        allItems = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        currentPageSize = getPageSize();
        currentPage = 1;
        renderCurrentPage();
        setMsg('Falta un índice en Firestore. Mira la consola para el enlace y de momento se muestran sin ordenar.', true);
        return;
      } catch {
        // continue below
      }
    }
    setMsg('Error cargando posts.', true);
  }
}

window.addEventListener('resize', () => {
  const next = getPageSize();
  if (next !== currentPageSize) {
    currentPageSize = next;
    currentPage = 1;
    renderCurrentPage();
  }
});

if (USE_MOCK) {
  renderEstado(null);
  cargarPosts();
} else {
  // Defer Firebase load so it doesn't delay DOMContentLoaded
  const startAuth = async () => {
    try {
      await withTimeout(ensureFirebaseLoaded(), 15000, 'firebase-load');
      onAuthStateChanged(auth, async (user) => {
        renderEstado(user);
        await cargarPosts(user);
      });
    } catch (err) {
      console.error(err);
      renderEstado(null);
      setMsg('No s\'ha pogut carregar Firebase (timeout).', true);
    }
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => void startAuth(), { timeout: 2000 });
  } else {
    setTimeout(() => void startAuth(), 0);
  }
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmittingPost) return;

    const title = form.elements['title']?.value?.trim() || '';
    const content = form.elements['content']?.value?.trim() || '';
    const visibility = normVisibility(form.elements['visibility']?.value);
    const published = visibility === 'public';
    const imageUrlRaw = form.elements['imageUrl']?.value?.trim() || '';
    const rawTags = form.elements['tags']?.value?.trim() || '';
    const tags = rawTags ? uniqTags(rawTags.split(',')).slice(0, 10) : [];
    const slug = slugify(title);

    const user = auth.currentUser;
    if (!user) {
      setMsg('Debes iniciar sesión.', true);
      return;
    }

    if (title.length < 4) {
      setMsg('El títol és obligatori (mínim 4 caràcters).', true);
      return;
    }

    if (content.length < 20) {
      setMsg('El contingut és obligatori (mínim 20 caràcters).', true);
      return;
    }

    let imageUrl = null;
    if (imageUrlRaw) {
      try {
        const u = new URL(imageUrlRaw);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') {
          setMsg("La URL de la imatge ha de començar per http o https.", true);
          return;
        }
        imageUrl = u.toString();
      } catch {
        setMsg("La URL de la imatge no és vàlida.", true);
        return;
      }
    }

    if (!tags.length && rawTags) {
      setMsg('Les etiquetes no són vàlides. Ex: tech, gaming, xarxa', true);
      return;
    }

    try {
      isSubmittingPost = true;
      setPublishUi(true);
      setMsg('Publicant...', false);

      await withTimeout(addDoc(collection(db, 'posts'), {
        title,
        slug,
        content,
        authorUid: user.uid,
        published,
        visibility,
        imageUrl,
        tags,
        createdAt: serverTimestamp()
      }), 15000, 'firestore-addDoc');

      form.reset();
      closeModal();
      setMsg('Post creado.', false);
      await withTimeout(cargarPosts(), 15000, 'reload-posts');
    } catch (err) {
      const code = err?.code ? ` (${err.code})` : '';
      console.error(err);
      const msgErr = String(err?.message || '');
      if (msgErr.startsWith('timeout:firestore-addDoc')) {
        setMsg("Guardant el post s'ha quedat penjat (timeout). Revisa Firestore Rules o la connexió.", true);
      } else if (msgErr.startsWith('timeout:reload-posts')) {
        setMsg('Post creat, però ha fallat recarregar la llista (timeout). Refresca la pàgina.', true);
      } else {
        setMsg(`No s'ha pogut crear el post.${code}`, true);
      }
    } finally {
      isSubmittingPost = false;
      setPublishUi(false);
    }
  });
}
