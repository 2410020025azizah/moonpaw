// ============================================================
// MoonPaw – Auth Handler (localStorage-based, tanpa Firebase)
// ============================================================

(function () {
  const session = JSON.parse(localStorage.getItem('moonpaw_session') || 'null');
  const currentPage = window.location.pathname.replace(/\\/g, '/').split('/').pop() || 'index.html';
  const publicPages = ['login.html', 'register.html', 'index.html', ''];

  if (!session) {
    // Tidak ada sesi — redirect ke login jika bukan halaman publik
    if (!publicPages.includes(currentPage)) {
      window.location.href = 'login.html';
    }
    return;
  }

  // Sesi ada — update tampilan profil di sidebar
  document.addEventListener('DOMContentLoaded', () => {
    const nameEl = document.querySelector('.sidebar-user-name');
    const avatarEl = document.querySelector('.sidebar-avatar');

    if (nameEl) nameEl.textContent = session.name || session.email;
    if (avatarEl) {
      avatarEl.textContent = (session.name || session.email || 'U').charAt(0).toUpperCase();
    }
  });

  // Handle tombol Logout
  document.addEventListener('click', (e) => {
    const logoutBtn = e.target.closest('#sidebarLogoutBtn, .logout-btn, [data-logout]');
    if (logoutBtn) {
      e.preventDefault();
      localStorage.removeItem('moonpaw_session');
      window.location.href = 'login.html';
    }
  });
})();
