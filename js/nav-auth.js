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
  return String(value || '').trim();
}

function isAuthMenuOpen() {
  return !!navAuthMenu && !navAuthMenu.hasAttribute('hidden');
}

function openAuthMenu() {
  if (!navAuthMenu) return;
  navAuthMenu.removeAttribute('hidden');
}

function closeAuthMenu() {
  if (!navAuthMenu) return;
  navAuthMenu.setAttribute('hidden', '');
}

function toggleAuthMenu() {
  if (isAuthMenuOpen()) closeAuthMenu();
  else openAuthMenu();
}

function updateNavForUser(user) {
  if (navAuthChip) navAuthChip.hidden = false;
  if (navAuthAvatar) navAuthAvatar.hidden = false;

  if (user) {
    if (navAuthLogged) {
      navAuthLogged.hidden = false;
      navAuthLogged.textContent = normalizeDisplayName(user.displayName) || user.email || 'Perfil';
    }
    if (navAuthGuest) navAuthGuest.hidden = true;
  } else {
    if (navAuthLogged) navAuthLogged.hidden = true;
    if (navAuthGuest) navAuthGuest.hidden = false;
    if (navAvatarFallback) navAvatarFallback.hidden = false;
  }

  closeAuthMenu();
}

if (navAuthChip) {
  navAuthChip.addEventListener('click', (e) => {
    const user = auth?.currentUser;
    if (!user) return;

    const target = e.target;
    if (navAuthGuest && navAuthGuest.contains(target)) return;
    if (target instanceof HTMLElement && target.closest('#navAuthMenu')) return;

    e.preventDefault();
    toggleAuthMenu();
  });
}

document.addEventListener('click', (e) => {
  if (!isAuthMenuOpen()) return;
  const t = e.target;
  if (!(t instanceof Node)) return;
  if (navAuthChip && navAuthChip.contains(t)) return;
  closeAuthMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closeAuthMenu();
});

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
