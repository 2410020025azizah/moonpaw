/* ============================================================
   MoonPaw – JavaScript Main
   ============================================================ */

'use strict';

// ── Loader ────────────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 2000);
  }
});

// ── Dark Mode ─────────────────────────────────────────────────
const themeKey = 'moonpaw-theme';

function initTheme() {
  const saved = localStorage.getItem(themeKey);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  updateToggleIcon(theme);
}

function updateToggleIcon(theme) {
  const toggles = document.querySelectorAll('.dark-toggle');
  toggles.forEach(toggle => {
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(themeKey, next);
  updateToggleIcon(next);
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.querySelectorAll('.dark-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
});

// ── Navbar scroll effect ──────────────────────────────────────
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Mobile Nav ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', closeMobileNav);
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    function closeMobileNav() {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

// ── Stars Generator ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const starsContainer = document.querySelector('.stars');
  if (!starsContainer) return;

  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.width = (Math.random() * 2 + 1) + 'px';
    star.style.height = star.style.width;
    star.style.animationDelay = (Math.random() * 4) + 's';
    star.style.animationDuration = (Math.random() * 3 + 2) + 's';
    starsContainer.appendChild(star);
  }
});

// ── Counter Animation ─────────────────────────────────────────
function animateCounter(element, target, duration = 2000, suffix = '') {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);
    element.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ── Scroll Reveal ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Counter animation
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const suffix = counter.dataset.suffix || '';
        animateCounter(counter, target, 2000, suffix);
      });

      // Match bars
      const matchBars = entry.target.querySelectorAll('.match-bar[data-width]');
      matchBars.forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });

      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  // Stats counters observe
  const statsSection = document.getElementById('statistics');
  if (statsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('[data-count]');
          counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const suffix = counter.dataset.suffix || '';
            animateCounter(counter, target, 2200, suffix);
          });
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(statsSection);
  }
});

// ── FAQ Accordion ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
});

// ── Testimonial Slider ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoPlay;

  function getVisible() {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function getMax() {
    return Math.max(0, cards.length - getVisible());
  }

  function goTo(index) {
    const max = getMax();
    current = Math.max(0, Math.min(index, max));
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1 > getMax() ? 0 : current + 1); }
  function prev() { goTo(current - 1 < 0 ? getMax() : current - 1); }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAutoPlay(); });
  });

  function resetAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(next, 4500);
  }

  resetAutoPlay();

  window.addEventListener('resize', () => goTo(current), { passive: true });
});

// ── Wishlist Toggle ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.pet-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        showToast('❤️', 'Added to wishlist!');
      } else {
        icon.className = 'far fa-heart';
        showToast('💔', 'Removed from wishlist');
      }
    });
  });
});

// ── Toast Notification ────────────────────────────────────────
function showToast(icon, message) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${message}</span>`;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// ── Back to Top ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ── Smooth scroll for anchor links ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// ── Active nav link on scroll ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => observer.observe(section));
});

// ── Contact form ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
      showToast('✅', 'Pesan berhasil dikirim!');
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        form.reset();
      }, 2000);
    }, 1500);
  });
});

// ── Adopt button ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-pet-adopt').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('🐾', 'Silakan login untuk mengadopsi!');
    });
  });
});

// ── Smart Match CTA ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const matchBtn = document.getElementById('startMatchBtn');
  if (matchBtn) {
    matchBtn.addEventListener('click', () => {
      showToast('🤖', 'Fitur ini membutuhkan login terlebih dahulu!');
    });
  }
});

// ── Partners infinite scroll ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.partners-track');
  if (!track) return;

  // Duplicate items for seamless loop
  const items = track.innerHTML;
  track.innerHTML = items + items;
});

// ── Values strip duplicate ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const valuesTrack = document.querySelector('.values-track');
  if (!valuesTrack) return;
  const content = valuesTrack.innerHTML;
  valuesTrack.innerHTML = content + content;
});

// ── Typing effect for hero ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const tagline = document.getElementById('heroTagline');
  if (!tagline) return;

  const phrases = ['Find Your Perfect Companion.', 'Adopsi dengan Kasih Sayang.', 'Setiap Hewan Layak Dicinta.'];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      tagline.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      tagline.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 2000);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    const speed = isDeleting ? 40 : 70;
    setTimeout(type, speed);
  }

  type();
});

// ── Newsletter form ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('📧', 'Berhasil berlangganan newsletter!');
    newsletterForm.reset();
  });
});

console.log('%cMoonPaw 🌙🐾', 'color: #FACC15; font-size: 20px; font-weight: bold;');
console.log('%cSmart Pet Adoption Platform', 'color: #94A3B8; font-size: 12px;');

// Live Chat Logic
document.addEventListener('DOMContentLoaded', () => {
  const chatHTML = `
    <div class="chat-widget" id="chatWidget">
      <button class="chat-btn" id="chatBtn" aria-label="Buka Live Chat"><i class="fas fa-comment-dots"></i></button>
      <div class="chat-panel" id="chatPanel">
        <div class="chat-header">
          <h3>MoonPaw Support</h3>
          <button class="chat-close" id="chatClose"><i class="fas fa-times"></i></button>
        </div>
        <div class="chat-body" id="chatBody">
          <div class="chat-msg bot">Halo! Ada yang bisa kami bantu seputar adopsi atau donasi hari ini? 🐾</div>
        </div>
        <form class="chat-input" id="chatForm">
          <input type="text" id="chatInput" placeholder="Ketik pesan..." autocomplete="off" />
          <button type="submit"><i class="fas fa-paper-plane"></i></button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', chatHTML);

  const chatBtn = document.getElementById('chatBtn');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');

  chatBtn.addEventListener('click', () => {
    chatPanel.classList.add('active');
    chatInput.focus();
  });
  
  chatClose.addEventListener('click', () => {
    chatPanel.classList.remove('active');
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if (!msg) return;
    
    // User message
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-msg user';
    userDiv.textContent = msg;
    chatBody.appendChild(userDiv);
    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // Bot reply
    setTimeout(() => {
      const botDiv = document.createElement('div');
      botDiv.className = 'chat-msg bot';
      botDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengetik...';
      chatBody.appendChild(botDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
      
      setTimeout(() => {
        botDiv.textContent = "Terima kasih atas pesannya! Tim support kami sedang offline saat ini (Mode Simulasi). Silakan tinggalkan email Anda dan kami akan segera membalasnya.";
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 1500);
    }, 500);
  });
});

// ── Hero Stats Counter Animation ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.hero-stat-number');
  const speed = 200; 

  const startCounters = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        if (!target) return;
        
        const updateCount = () => {
          const count = +counter.innerText.replace(/\D/g, '');
          const inc = target / speed;
          
          if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 15);
          } else {
            counter.innerText = target;
          }
        };
        
        updateCount();
        observer.unobserve(counter);
      }
    });
  };

  if (counters.length > 0) {
    const observer = new IntersectionObserver(startCounters, { threshold: 0.5 });
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }
});
