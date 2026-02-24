import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

import { auth, db } from './../../js/firebase.js';

const estado = document.getElementById('estadoAuth');
const lista = document.getElementById('listaPosts');
const form = document.getElementById('formPost');
const msg = document.getElementById('msgPost');

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
    if (form) form.style.display = 'block';
  } else {
    estado.textContent = 'Inicia sesión para crear posts.';
    if (form) form.style.display = 'none';
  }
}

function renderPosts(docs) {
  if (!lista) return;
  lista.innerHTML = '';

  if (!docs.length) {
    const p = document.createElement('p');
    p.textContent = 'No hay posts aún.';
    lista.appendChild(p);
    return;
  }

  for (const d of docs) {
    const data = d.data();

    const art = document.createElement('article');
    const h = document.createElement('h3');
    const body = document.createElement('p');

    h.textContent = data.title || '(Sin título)';
    body.textContent = data.content || '';

    art.appendChild(h);
    art.appendChild(body);
    lista.appendChild(art);
  }
}

async function cargarPosts() {
  try {
    const q = query(
      collection(db, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );

    const snap = await getDocs(q);
    renderPosts(snap.docs);
  } catch (err) {
    const code = err?.code || '';
    if (code === 'failed-precondition') {
      try {
        const qFallback = query(
          collection(db, 'posts'),
          where('published', '==', true)
        );
        const snap = await getDocs(qFallback);
        renderPosts(snap.docs);
        setMsg('Falta un índice en Firestore. Mostrando posts sin ordenar.', true);
        return;
      } catch {
        // continue below
      }
    }
    setMsg('Error cargando posts.', true);
  }
}

onAuthStateChanged(auth, async (user) => {
  renderEstado(user);
  await cargarPosts();
});

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = form.elements['title']?.value?.trim() || '';
    const content = form.elements['content']?.value?.trim() || '';
    const published = form.elements['published']?.checked || false;

    const user = auth.currentUser;
    if (!user) {
      setMsg('Debes iniciar sesión.', true);
      return;
    }

    if (!title || !content) {
      setMsg('Título y contenido son obligatorios.', true);
      return;
    }

    try {
      setMsg('Publicando...', false);
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        authorUid: user.uid,
        published,
        createdAt: serverTimestamp()
      });

      form.reset();
      setMsg('Post creado.', false);
      await cargarPosts();
    } catch (err) {
      setMsg('No se pudo crear el post.', true);
    }
  });
}
