const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');

menuToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

dropdownTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.parentElement;
    const shouldOpen = !item.classList.contains('open');
    document.querySelectorAll('.has-dropdown.open').forEach((openItem) => {
      openItem.classList.remove('open');
      openItem.querySelector('.dropdown-trigger').setAttribute('aria-expanded', 'false');
    });
    item.classList.toggle('open', shouldOpen);
    trigger.setAttribute('aria-expanded', String(shouldOpen));
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.has-dropdown')) {
    document.querySelectorAll('.has-dropdown.open').forEach((item) => {
      item.classList.remove('open');
      item.querySelector('.dropdown-trigger').setAttribute('aria-expanded', 'false');
    });
  }
});

document.querySelectorAll('.dropdown-menu a, .primary-nav > .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});