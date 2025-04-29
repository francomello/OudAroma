// Scroll animations
const hiddenElements = document.querySelectorAll('.hidden');
const whatsappBtn = document.querySelector('.whatsapp');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  }
);

hiddenElements.forEach((el) => observer.observe(el));


// Show WhatsApp button after load
window.addEventListener('load', () => {
  setTimeout(() => whatsappBtn.classList.add('show'), 500);
  const sided = document.querySelectorAll('.feature-left, .feature-right');
  sided.forEach((el) => setTimeout(() => el.classList.add('show'), 200));
});

// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
  } else {
    console.warn('No se encontró el botón o el menú en el DOM');
  }
});

