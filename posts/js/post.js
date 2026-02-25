import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

import { auth, db } from './../../js/firebase.js';

const detalle = document.getElementById('postDetalle');
const msg = document.getElementById('msgPost');
const volver = document.getElementById('volverPosts');

function setMsg(texto, esError) {
  if (!msg) return;
  msg.textContent = texto;
  msg.dataset.tipo = esError ? 'error' : 'ok';
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

const params = new URLSearchParams(window.location.search);
const id = params.get('id') || '';
const isMock = params.has('mock');

if (volver) {
  volver.href = isMock ? './posts.html?mock=1' : './posts.html';
}

const MOCK_BY_ID = {
  'mock-1': {
    title: 'Guía rápida: montar un PC en 2026',
    author: 'Hans',
    tags: ['hardware', 'pc', 'guía'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=60',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
  },
  'mock-2': {
    title: 'Nuevas GPUs: qué mirar antes de comprar',
    author: 'Fran',
    tags: ['gpu', 'benchmark', 'compra'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=60',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.'
  },
  'mock-3': {
    title: 'RAM DDR5: latencias, perfiles XMP y recomendaciones',
    author: 'Unax',
    tags: ['ram', 'ddr5', 'xmp'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1400&q=60',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.\n\nSed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.'
  }
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (typeof text === 'string') node.textContent = text;
  return node;
}

function renderPost(data) {
  if (!detalle) return;
  detalle.innerHTML = '';

  if (data.imageUrl) {
    const img = el('img', 'post-cover');
    img.src = data.imageUrl;
    img.alt = '';
    img.loading = 'lazy';
    detalle.appendChild(img);
  }

  const h = el('h2', 'post-titulo', data.title || '(Sin título)');
  const meta = el('p', 'post-meta');

  const fecha = data.createdAt?.toDate?.() || (data.createdAt instanceof Date ? data.createdAt : null);
  const fechaTxt = fecha
    ? fecha.toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })
    : '';
  const autor = (data.author || data.authorName || '').trim();
  meta.textContent = [autor ? `Por ${autor}` : '', fechaTxt].filter(Boolean).join(' · ');

  const tagsWrap = el('div', 'post-tags');
  const tagList = Array.isArray(data.tags) ? data.tags : [];
  for (const t of tagList.slice(0, 12)) {
    const s = el('span', 'post-tag');
    const limpio = String(t || '').trim();
    if (!limpio) continue;
    s.textContent = limpio.startsWith('#') ? limpio : `#${limpio}`;
    tagsWrap.appendChild(s);
  }

  const contenido = (data.content || '').trim();
  const p = el('p', 'post-contenido');
  p.textContent = contenido;
  p.style.whiteSpace = 'pre-wrap';

  detalle.appendChild(h);
  if (meta.textContent) detalle.appendChild(meta);
  if (tagsWrap.childNodes.length) detalle.appendChild(tagsWrap);
  detalle.appendChild(p);
}

async function main(user) {
  if (!id) {
    setMsg('Falta el id del post.', true);
    return;
  }

  if (isMock) {
    const data = MOCK_BY_ID[id];
    if (!data) {
      setMsg('Post mock no encontrado.', true);
      return;
    }
    renderPost(data);
    return;
  }

  try {
    const ref = doc(db, 'posts', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      setMsg('Post no encontrado.', true);
      return;
    }
    const data = { id: snap.id, ...snap.data() };
    const vis = postVisibility(data);
    if (vis === 'private') {
      const uid = user?.uid || '';
      if (!uid || data.authorUid !== uid) {
        setMsg('Este post es privado.', true);
        return;
      }
    }
    renderPost(data);
  } catch {
    setMsg('Error cargando el post.', true);
  }
}

onAuthStateChanged(auth, async (user) => {
  await main(user);
});
