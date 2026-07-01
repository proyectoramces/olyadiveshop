// ============================================================
// OLYA DIVE — script.js
// Catálogo dinámico + WhatsApp + menú móvil + animaciones
// ============================================================
(() => {
  'use strict';

  /* ----------------------------------------------------------
     1) CONFIGURACIÓN — edita aquí tu número y tus productos
     ---------------------------------------------------------- */

  // Número de WhatsApp en formato internacional SIN "+" ni espacios
  // 624 039 211 (España) -> 34624039211
  const WHATSAPP_NUMBER = '34624039211';
  const WHATSAPP_DISPLAY = '624 039 211';

  // Catálogo: añade, quita o edita productos aquí y las tarjetas
  // se generan solas, con su propio botón de WhatsApp.
  const PRODUCTS = [
    {
      id: 'vision-pro',
      name: 'OLYA Vision Pro',
      price: '89,90 €',
      description: 'Máscara panorámica de cristal templado con visión amplia y diseño ergonómico.',
      icon: 'mask'
    },
    {
      id: 'neptune-x',
      name: 'OLYA Neptune X',
      price: '249,90 €',
      description: 'Regulador profesional con rendimiento estable para exploraciones profundas.',
      icon: 'regulator'
    },
    {
      id: 'triton',
      name: 'OLYA Tritón',
      price: '119,90 €',
      description: 'Aletas de alto rendimiento inspiradas en la fuerza del océano.',
      icon: 'fins'
    },
    {
      id: 'abyss',
      name: 'OLYA Abyss',
      price: '399,90 €',
      description: 'Ordenador de buceo avanzado para controlar cada detalle de tu inmersión.',
      icon: 'watch'
    }
  ];

  /* ----------------------------------------------------------
     2) Iconos de línea (SVG) para cada tipo de producto.
        Sustituye <div class="product-media"> por una <img>
        con tu foto real cuando la tengas.
     ---------------------------------------------------------- */
  const ICONS = {
    mask: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 24c0-8 6-14 14-14h16c8 0 14 6 14 14v10c0 8-6 14-14 14h-3l-5 8-5-8h-3c-8 0-14-6-14-14V24z"/><circle cx="24" cy="27" r="5"/><circle cx="40" cy="27" r="5"/><path d="M29 27h6"/></svg>`,
    regulator: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="24" r="12"/><path d="M32 12V6M24 36l-6 10M40 36l6 10M26 46h12"/><circle cx="32" cy="24" r="4"/></svg>`,
    fins: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8c10 4 14 14 12 26-8 2-16-2-20-10C8 16 12 10 20 8z"/><path d="M44 8c-10 4-14 14-12 26 8 2 16-2 20-10 4-8 0-14-8-16z"/><path d="M28 40l4 16M36 40l-4 16"/></svg>`,
    watch: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="18" width="32" height="28" rx="6"/><path d="M24 18v-6h16v6M24 46v6h16v-6"/><path d="M26 26h12v12H26z"/><path d="M32 29v3l2 2"/></svg>`
  };

  /* ----------------------------------------------------------
     3) Helpers de WhatsApp
     ---------------------------------------------------------- */
  function waLink(message) {
    const base = `https://wa.me/${WHATSAPP_NUMBER}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }

  function wireWhatsAppLinks() {
    document.querySelectorAll('.wa-link').forEach((el) => {
      const msg = el.getAttribute('data-wa-message') || '';
      el.setAttribute('href', waLink(msg));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    });
    document.querySelectorAll('.wa-number-slot').forEach((el) => {
      el.textContent = WHATSAPP_DISPLAY;
    });
  }

  /* ----------------------------------------------------------
     4) Render del catálogo
     ---------------------------------------------------------- */
  function renderCatalog() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = PRODUCTS.map((p, i) => `
      <article class="product-card reveal" style="--delay:${i * 0.08}s">
        <div class="product-media">${ICONS[p.icon] || ''}</div>
        <div class="product-body">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-price">${p.price}</p>
          <p class="product-desc">${p.description}</p>
          <a class="btn btn-gold wa-link"
             data-wa-message="Hola OLYA DIVE, quiero pedir: ${p.name} (${p.price})."
             href="#">
            <svg class="icon-wa" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.3.6 4.5 1.8 6.4L4 29l7.8-1.7c1.9 1 4 1.6 6.2 1.6 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-2 0-3.9-.5-5.6-1.5l-.4-.2-4.6 1 1-4.5-.3-.4C4.9 17.8 4.3 16 4.3 15 4.3 9 9 4.3 16 4.3c6.4 0 12 5.4 12 10.7S22.4 24.8 16 24.8zm6.1-8.1c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-1 1.3-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.2-.2.2-.3.3-.6.1-.2 0-.5 0-.6-.1-.2-.7-1.8-1-2.4-.3-.7-.5-.6-.7-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.7 5.8 5.1.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 2-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z"/></svg>
            Pedir ahora
          </a>
        </div>
      </article>
    `).join('');
  }

  /* ----------------------------------------------------------
     5) Header: fondo sólido al hacer scroll
     ---------------------------------------------------------- */
  function wireHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 30);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------------------------------------
     6) Menú móvil
     ---------------------------------------------------------- */
  function wireMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----------------------------------------------------------
     7) Animación de aparición al hacer scroll (respeta reduced motion)
     ---------------------------------------------------------- */
  function wireScrollReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = document.querySelectorAll('.reveal');

    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach((el) => observer.observe(el));
  }

  /* ----------------------------------------------------------
     8) Año dinámico en el footer
     ---------------------------------------------------------- */
  function wireFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     Init
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    wireWhatsAppLinks();
    wireHeaderScroll();
    wireMobileNav();
    wireScrollReveal();
    wireFooterYear();
  });
})();