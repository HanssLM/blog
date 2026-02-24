import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyAjwFzt5h5lbjjOzhG0TtFHfbstsna98NI",
  authDomain: "blog-68913.firebaseapp.com",
  projectId: "blog-68913",
  storageBucket: "blog-68913.firebasestorage.app",
  messagingSenderId: "735969933987",
  appId: "1:735969933987:web:a10854bb9f67c8fbd51d16",
  measurementId: "G-98QJJPP1Q0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById('formLogin');
const mensaje = document.getElementById('mensajeLogin');

function setMensaje(texto, esError) {
  if (!mensaje) return;
  mensaje.textContent = texto;
  mensaje.dataset.tipo = esError ? 'error' : 'ok';
}

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const captchaToken = window.grecaptcha?.getResponse?.() || '';
    if (!captchaToken) {
      setMensaje('Completa el reCAPTCHA.', true);
      return;
    }

    const email = form.elements['email']?.value?.trim() || '';
    const password = form.elements['password']?.value || '';

    try {
      setMensaje('Iniciando sesión...', false);
      await signInWithEmailAndPassword(auth, email, password);
      window.grecaptcha?.reset?.();
      setMensaje('Sesión iniciada.', false);
      window.location.href = './../index.html';
    } catch (err) {
      const code = err?.code || '';
      let texto = 'Error al iniciar sesión.';
      if (code === 'auth/invalid-credential') texto = 'Email o contraseña incorrectos.';
      if (code === 'auth/invalid-email') texto = 'Email no válido.';
      window.grecaptcha?.reset?.();
      setMensaje(texto, true);
    }
  });
}