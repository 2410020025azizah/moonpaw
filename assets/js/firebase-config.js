// firebase-config.js — Tidak aktif (Firebase belum dikonfigurasi)
// Autentikasi sekarang menggunakan localStorage session (auth-handler.js)
// Untuk mengaktifkan Firebase: isi konfigurasi dari Firebase Console

export const auth = null;
export const googleProvider = null;
export function signInWithPopup() { return Promise.reject(new Error('Firebase belum dikonfigurasi')); }
export function signOut() { return Promise.resolve(); }
export function onAuthStateChanged() { return () => {}; }
