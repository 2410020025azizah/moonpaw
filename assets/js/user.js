/* ============================================================
   MoonPaw – Shared JS for User Pages (Fixed)
   ============================================================ */

'use strict';

// Apply saved theme immediately to prevent flash
(function() {
  const theme = localStorage.getItem('moonpaw-theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {

  // ── Page Transition Loader ──────────────────────────────────
  const transLoader = document.createElement('div');
  transLoader.id = 'page-transition-loader';
  transLoader.innerHTML = `
    <div class="loader-paw-bounce">🐾</div>
    <div style="font-family:'Poppins',sans-serif;font-weight:700;color:white;font-size:1.25rem;letter-spacing:1.1px">Loading MoonPaw...</div>
  `;
  document.body.appendChild(transLoader);
  
  setTimeout(() => {
    transLoader.classList.add('hidden');
  }, 600);

  // Transition on clicking links
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.startsWith('#') && !link.href.startsWith('javascript:') && !link.target && !e.ctrlKey && !e.metaKey && link.id !== 'sidebarLogoutBtn' && !link.href.includes('mailto:') && !link.href.includes('tel:')) {
      e.preventDefault();
      const url = link.href;
      transLoader.classList.remove('hidden');
      setTimeout(() => {
        window.location.href = url;
      }, 400);
    }
  });

  // ── Dark mode toggle ─────────────────────────────────────────
  document.querySelectorAll('[data-dark-toggle]').forEach(btn => {
    const icon = btn.querySelector('i');
    const update = () => {
      const t = document.documentElement.getAttribute('data-theme');
      if (icon) icon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    };
    update();
    btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('moonpaw-theme', next);
      update();
    });
  });

  // ── Mobile sidebar ───────────────────────────────────────────
  const sidebar  = document.querySelector('.sidebar');
  const overlay  = document.querySelector('.sidebar-overlay');
  const toggleBtn = document.getElementById('sidebarToggle');

  function openSidebar()  { if(sidebar) sidebar.classList.add('open'); if(overlay) overlay.classList.add('show'); }
  function closeSidebar() { if(sidebar) sidebar.classList.remove('open'); if(overlay) overlay.classList.remove('show'); }

  if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
  if (overlay)   overlay.addEventListener('click', closeSidebar);

  // close sidebar when any nav link clicked on mobile
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    a.addEventListener('click', () => { if (window.innerWidth < 1024) closeSidebar(); });
  });

  // ── Wishlist toggle ──────────────────────────────────────────
  document.querySelectorAll('.pet-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        showUserToast('❤️', 'Ditambahkan ke wishlist!');
      } else {
        icon.className = 'far fa-heart';
        showUserToast('💔', 'Dihapus dari wishlist');
      }
    });
  });

  // ── Adopt buttons redirect ───────────────────────────────────
  document.querySelectorAll('.btn-pet-adopt').forEach(btn => {
    btn.addEventListener('click', () => { window.location.href = 'pet-detail.html'; });
  });

  // ── Pagination buttons ───────────────────────────────────────
  document.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.querySelector('i')) return; // prev/next arrows
      document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// ── Toast notification ────────────────────────────────────────
function showUserToast(icon, msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${msg}</span>`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2500);
}

// ── Build Sidebar HTML ────────────────────────────────────────
function buildUserSidebar(active) {
  const links = [
    { href:'dashboard.html',  icon:'🏠', label:'Dashboard',         key:'dashboard' },
    { href:'pets.html',       icon:'🐾', label:'Explore Pets',      key:'pets' },
    { href:'smart-match.html',icon:'🤖', label:'Smart Match',       key:'smart-match' },
    { href:'wishlist.html',   icon:'❤️', label:'Wishlist',          key:'wishlist', badge:'3' },
  ];
  const adoptLinks = [
    { href:'adoptions.html',  icon:'📋', label:'Pengajuan Adopsi',  key:'adoptions' },
    { href:'visits.html',     icon:'📅', label:'Jadwal Kunjungan',  key:'visits' },
    { href:'history.html',    icon:'📜', label:'Riwayat Adopsi',    key:'history' },
  ];
  const otherLinks = [
    { href:'events.html',           icon:'🎪', label:'Event Adopsi',     key:'events' },
    { href:'donasi.html',           icon:'💖', label:'Donasi',           key:'donasi' },
    { href:'blog.html',             icon:'📚', label:'Blog',             key:'blog' },
    { href:'success-stories.html',  icon:'🌟', label:'Success Stories',  key:'stories' },
    { href:'notifications.html',    icon:'🔔', label:'Notifikasi',       key:'notifications', badge:'4', badgeRed:true },
    { href:'profile.html',          icon:'👤', label:'Profil',           key:'profile' },
  ];

  const navItem = ({href,icon,label,key,badge,badgeRed}) =>
    `<a href="${href}" class="${active===key?'active':''}">
      <span class="nav-icon">${icon}</span> ${label}
      ${badge ? `<span class="nav-badge" style="${badgeRed?'background:#EF4444;color:white':''}">${badge}</span>` : ''}
    </a>`;

  return `
  <div class="sidebar-overlay" id="sidebarOverlay"></div>
  <div class="sidebar" id="sidebar">
    <a href="index.html" class="sidebar-logo">
      <div class="logo-icon" style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#0F172A,#1E293B);display:flex;align-items:center;justify-content:center;box-shadow:0 0 15px rgba(250,204,21,0.2);flex-shrink:0">
        <svg viewBox="0 0 32 32" fill="none" width="22" height="22">
          <path d="M20 6C14.477 6 10 10.477 10 16C10 21.523 14.477 26 20 26C16.686 26 14 23.314 14 20C14 16.686 16.686 14 20 14C23.314 14 26 16.686 26 20C26 14.477 21.523 10 16 10" fill="#FACC15"/>
          <ellipse cx="16" cy="19" rx="3" ry="3.5" fill="#FACC15" opacity="0.9"/>
          <ellipse cx="12.5" cy="17" rx="1.5" ry="2" fill="#FACC15" opacity="0.7"/>
          <ellipse cx="19.5" cy="17" rx="1.5" ry="2" fill="#FACC15" opacity="0.7"/>
          <ellipse cx="11" cy="20.5" rx="1.3" ry="1.8" fill="#FACC15" opacity="0.7"/>
          <ellipse cx="21" cy="20.5" rx="1.3" ry="1.8" fill="#FACC15" opacity="0.7"/>
        </svg>
      </div>
      <span class="logo-text">Moon<span>Paw</span></span>
    </a>
    <div class="sidebar-user">
      <div class="sidebar-avatar">A</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">Amanda Putri</div>
        <div class="sidebar-user-role"><span class="role-dot"></span> Adopter</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="sidebar-section-label">Menu Utama</div>
      ${links.map(navItem).join('')}
      <div class="sidebar-section-label">Adopsi</div>
      ${adoptLinks.map(navItem).join('')}
      <div class="sidebar-section-label">Lainnya</div>
      ${otherLinks.map(navItem).join('')}
    </nav>
    <div class="sidebar-footer">
      <a href="index.html"><span class="nav-icon">🌙</span> Kembali ke Beranda</a>
      <a href="#" id="sidebarLogoutBtn" style="color:#EF4444!important"><span class="nav-icon">🚪</span> Keluar</a>
    </div>
  </div>`;
}

// ── Inject Auth Handler ───────────────────────────────────────
const authScript = document.createElement('script');
authScript.src = 'assets/js/auth-handler.js';
document.body.appendChild(authScript);
