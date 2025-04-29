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

document.getElementById('menu-toggle').addEventListener('click', () => {
  document.querySelector('.menu').classList.toggle('show');
});