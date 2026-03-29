/* ============================================================
   SCRIPT.JS — Personal Website Main Logic
   Handles: Navbar, Scroll animations, Active nav, Scroll-top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     1. STICKY NAVBAR — scroll shadow effect
  ────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const wipBanner = document.getElementById('wipBanner');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ──────────────────────────────────────────
     2. MOBILE MENU TOGGLE
  ────────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    navLinksContainer.classList.contains('open')
      ? openMenu(spans)
      : closeMenu(spans);
  });

  function openMenu(spans) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  }

  function closeMenu(spans) {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }

  // Close menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer.classList.remove('open');
      closeMenu(navToggle.querySelectorAll('span'));
    });
  });

  /* ──────────────────────────────────────────
     3. ACTIVE NAV LINK on scroll (IntersectionObserver)
  ────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: '-60px 0px 0px 0px'
    }
  );

  sections.forEach(section => sectionObserver.observe(section));

  /* ──────────────────────────────────────────
     4. SCROLL ANIMATIONS (IntersectionObserver)
  ────────────────────────────────────────── */
  const animatedEls = document.querySelectorAll(
    '.animate-fadeUp, .animate-fadeLeft, .animate-fadeRight'
  );

  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animObserver.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  animatedEls.forEach(el => animObserver.observe(el));

  /* ──────────────────────────────────────────
     5. SCROLL TO TOP BUTTON
  ────────────────────────────────────────── */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ──────────────────────────────────────────
     6. SMOOTH SCROLL for anchor links
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ──────────────────────────────────────────
     7. VISITOR COUNTER ANIMATION (number roll)
  ────────────────────────────────────────── */
  window.animateCounter = function (finalValue) {
    const el = document.getElementById('visitorCount');
    if (!el) return;
    const duration = 1200;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * finalValue);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  };

  /* ──────────────────────────────────────────
     8. RENDER SOCIAL LINKS (called from firebase.js)
  ────────────────────────────────────────── */
  window.renderSocialLinks = function (links) {
    const grid = document.getElementById('socialGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!links || links.length === 0) {
      grid.innerHTML = `
        <p style="color:var(--text-muted); text-align:center; grid-column:1/-1; padding:40px 0;">
          No social links added yet.
        </p>`;
      return;
    }

    links.forEach((link, i) => {
      const card = document.createElement('a');
      card.href = link.url || '#';
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.className = 'social-card animate-fadeUp';
      card.style.transitionDelay = `${i * 0.08}s`;

      card.innerHTML = `
        <img
          src="${link.iconUrl || 'https://via.placeholder.com/52x52/1a1a2e/e2e8f0?text=?'}"
          alt="${link.name}"
          class="social-icon-img"
          onerror="this.src='https://via.placeholder.com/52x52/1a1a2e/00ffc8?text=${link.name[0]}'"
        />
        <span class="social-name">${link.name}</span>
        <span class="social-arrow">→ Visit</span>
      `;

      grid.appendChild(card);

      // Trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.classList.add('visible');
        });
      });
    });
  };

  /* ──────────────────────────────────────────
     9. POPULATE PROFILE (called from firebase.js)
  ────────────────────────────────────────── */
  window.renderProfile = function (data) {
    if (!data) return;

    const name = data.name || 'My Name';
    const bio = data.bio || 'Welcome to my personal website!';
    const location = data.location || '';
    const imageUrl = data.imageUrl || null;

    // Navbar brand name
    const navName = document.getElementById('navName');
    if (navName) navName.textContent = name;

    // Footer name
    const footerName = document.getElementById('footerName');
    if (footerName) footerName.textContent = name + "'s Website";

    // Home Section
    const profileName = document.getElementById('profileName');
    if (profileName) profileName.textContent = name;

    const profileBio = document.getElementById('profileBio');
    if (profileBio) profileBio.textContent = bio;

    const locationText = document.getElementById('locationText');
    if (locationText) {
      locationText.textContent = location || 'Somewhere on Earth';
    }

    const profileLocation = document.getElementById('profileLocation');
    if (profileLocation) {
      profileLocation.style.display = location ? 'flex' : 'none';
    }

    if (imageUrl) {
      const profileImage = document.getElementById('profileImage');
      if (profileImage) profileImage.src = imageUrl;

      const aboutProfileImage = document.getElementById('aboutProfileImage');
      if (aboutProfileImage) aboutProfileImage.src = imageUrl;
    }

    // About Section
    const aboutName = document.getElementById('aboutName');
    if (aboutName) aboutName.textContent = name;

    const aboutBio = document.getElementById('aboutBio');
    if (aboutBio) aboutBio.textContent = bio;

    const aboutLocation = document.getElementById('aboutLocation');
    if (aboutLocation) aboutLocation.textContent = location || 'India';
  };

  /* ──────────────────────────────────────────
     10. POPULATE CONTACT (called from firebase.js)
  ────────────────────────────────────────── */
  window.renderContact = function (data) {
    if (!data) return;

    const emailCard = document.getElementById('emailCard');
    const phoneCard = document.getElementById('phoneCard');
    const waCard = document.getElementById('whatsappCard');

    if (data.email) {
      const el = document.getElementById('contactEmail');
      if (el) {
        el.textContent = data.email;
        el.href = `mailto:${data.email}`;
      }
      if (emailCard) emailCard.style.display = 'flex';
    }

    if (data.phone) {
      const el = document.getElementById('contactPhone');
      if (el) {
        el.textContent = data.phone;
        el.href = `tel:${data.phone}`;
      }
      if (phoneCard) phoneCard.style.display = 'flex';
    }

    if (data.whatsapp) {
      const el = document.getElementById('contactWhatsapp');
      const num = data.whatsapp.replace(/\D/g, '');
      if (el) {
        el.textContent = 'Chat on WhatsApp';
        el.href = `https://wa.me/${num}`;
      }
      if (waCard) waCard.style.display = 'flex';
    }
  };

}); // end DOMContentLoaded
