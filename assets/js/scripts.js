// Scroll animations
const hiddenElements = document.querySelectorAll('.hidden');
const whatsappBtn = document.querySelector('.whatsapp');
const icons = document.querySelector('.intro-icons');
const fadeUpElements = document.querySelectorAll('.fade-up'); // nuevo grupo para animación personalizada

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

// Animaciones para .hidden
hiddenElements.forEach((el) => observer.observe(el));

// Animación para .intro-icons (si existe)
if (icons) observer.observe(icons);

// Animaciones para .fade-up
fadeUpElements.forEach((el) => observer.observe(el));

// Mostrar botón de WhatsApp y animaciones laterales
window.addEventListener('load', () => {
  setTimeout(() => whatsappBtn?.classList.add('show'), 500);
  const sided = document.querySelectorAll('.feature-left, .feature-right');
  sided.forEach((el) => setTimeout(() => el.classList.add('show'), 200));
});

// Menú hamburguesa
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
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
