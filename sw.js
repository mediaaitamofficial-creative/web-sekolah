if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('Service Worker berhasil didaftarkan'))
      .catch((err) => console.log('Gagal daftar Service Worker:', err));
  });
}