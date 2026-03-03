import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

import { auth } from './firebase.js';

const navAuthChip = document.getElementById('navAuthChip');
const navAuthAvatar = document.getElementById('navAuthAvatar');
const navAuthLogged = document.getElementById('navAuthLogged');
const navAuthGuest = document.getElementById('navAuthGuest');
const navAvatarFallback = document.getElementById('navAvatarFallback');
const navAuthMenu = document.getElementById('navAuthMenu');
const btnNavLogout = document.getElementById('btnNavLogout');

function normalizeDisplayName(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';

  if (raw.includes('@')) return raw;

  const words = raw
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const lower = w.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    });

  return words.join(' ');
}

function updateNavForUser(user) {
  if (navAuthChip) navAuthChip.hidden = false;
  if (navAuthAvatar) navAuthAvatar.hidden = false;

  if (user) {
    if (navAuthMenu) navAuthMenu.removeAttribute('hidden');
    if (navAuthLogged) {
      navAuthLogged.hidden = false;
      navAuthLogged.textContent = normalizeDisplayName(user.displayName) || user.email || 'Perfil';
    }
    if (navAuthGuest) navAuthGuest.hidden = true;
  } else {
    if (navAuthMenu) navAuthMenu.setAttribute('hidden', '');
    if (navAuthLogged) navAuthLogged.hidden = true;
    if (navAuthGuest) navAuthGuest.hidden = false;
    if (navAvatarFallback) navAvatarFallback.hidden = false;
  }
}

if (btnNavLogout) {
  btnNavLogout.addEventListener('click', async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  });
}

if (auth) {
  onAuthStateChanged(auth, (user) => updateNavForUser(user));
}
