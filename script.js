const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

dropdownTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.parentElement;
    const shouldOpen = !item.classList.contains('open');
    document.querySelectorAll('.has-dropdown.open').forEach((openItem) => {
      openItem.classList.remove('open');
      const openTrigger = openItem.querySelector('.dropdown-trigger');
      if (openTrigger) {
        openTrigger.setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.toggle('open', shouldOpen);
    trigger.setAttribute('aria-expanded', String(shouldOpen));
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.has-dropdown')) {
    document.querySelectorAll('.has-dropdown.open').forEach((item) => {
      item.classList.remove('open');
      const trigger = item.querySelector('.dropdown-trigger');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

document.querySelectorAll('.dropdown-menu a, .primary-nav > .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    if (primaryNav) {
      primaryNav.classList.remove('open');
    }
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('Service Worker berhasil didaftarkan'))
      .catch((err) => console.log('Gagal daftar Service Worker:', err));
  });
}

const authModal = document.getElementById('auth-modal');
const authTitle = document.getElementById('auth-title');
const loginButton = document.querySelector('.login-button');
const authCloseButton = document.querySelector('.auth-close');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');

function openAuthModal(mode = 'login') {
  if (!authModal) return;
  authModal.hidden = false;
  authModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const activeTab = document.querySelector(`.auth-tab[data-auth-tab="${mode}"]`);
  if (activeTab) {
    authTabs.forEach((tab) => tab.classList.toggle('is-active', tab === activeTab));
  }

  authForms.forEach((form) => {
    const isActive = form.id === (mode === 'login' ? 'form-login' : 'form-register');
    form.classList.toggle('is-active', isActive);
  });

  if (authTitle) {
    authTitle.textContent = mode === 'login' ? 'Masuk' : 'Daftar';
  }
}

function closeAuthModal() {
  if (!authModal) return;
  authModal.hidden = true;
  authModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

if (loginButton) {
  loginButton.addEventListener('click', (event) => {
    event.preventDefault();
    openAuthModal('login');
  });
}

if (authCloseButton) {
  authCloseButton.addEventListener('click', closeAuthModal);
}

authModal?.addEventListener('click', (event) => {
  if (event.target === authModal) {
    closeAuthModal();
  }
});

authTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    openAuthModal(tab.dataset.authTab);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && authModal && !authModal.hidden) {
    closeAuthModal();
  }
});

if (formLogin) {
  formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const pesanEl = document.getElementById('login-pesan');

    if (!email || !password) {
      pesanEl.textContent = 'Email dan password harus diisi.';
      pesanEl.style.color = 'red';
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        pesanEl.textContent = data.error || 'Login gagal.';
        pesanEl.style.color = 'red';
        return;
      }

      pesanEl.textContent = `Login berhasil! Selamat datang, ${data.user.nama}`;
      pesanEl.style.color = 'green';
      console.log('Role user:', data.user.role);

      setTimeout(() => closeAuthModal(), 1000);
    } catch (error) {
      pesanEl.textContent = 'Terjadi kesalahan, coba lagi.';
      pesanEl.style.color = 'red';
      console.error(error);
    }
  });
}

if (formRegister) {
  formRegister.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nama = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const role = document.getElementById('register-role').value;
    const pesanEl = document.getElementById('register-pesan');

    if (!nama || !email || !password || !role) {
      pesanEl.textContent = 'Semua data harus diisi.';
      pesanEl.style.color = 'red';
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password, role })
      });

      const data = await response.json();

      if (!response.ok) {
        pesanEl.textContent = data.error || 'Registrasi gagal.';
        pesanEl.style.color = 'red';
        return;
      }

      pesanEl.textContent = 'Akun berhasil didaftarkan. Silakan masuk.';
      pesanEl.style.color = 'green';
      formRegister.reset();
      setTimeout(() => openAuthModal('login'), 1200);
    } catch (error) {
      pesanEl.textContent = 'Terjadi kesalahan saat daftar.';
      pesanEl.style.color = 'red';
      console.error(error);
    }
  });
}
