'use strict';
(() => {
  const config = window.PSALTIS_CONFIG || {};
  const safePhone = String(config.phone || '').replace(/[^+\d]/g, '');
  const usablePhone = /^\+?\d{7,15}$/.test(safePhone);
  const bookingEmail = String(config.bookingEmail || '').trim();
  const usableEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingEmail);
  const placeholders = { address: '[Shop address]', location: '[Location]', hours: '[Opening days & hours]', phone: '[Phone number]' };
  Object.entries(placeholders).forEach(([key, placeholder]) => {
    document.querySelectorAll('[data-business="' + key + '"]').forEach(el => {
      el.textContent = config[key] || placeholder;
      if (key === 'phone' && usablePhone) {
        const link = document.createElement('a');
        link.href = 'tel:' + safePhone;
        link.textContent = config.phone;
        el.replaceChildren(link);
      }
    });
  });
  if (['address', 'location', 'hours', 'phone'].every(key => config[key])) {
    document.getElementById('details-note').hidden = true;
  }
  if (usablePhone) {
    const mobileCall = document.getElementById('mobile-call');
    mobileCall.href = 'tel:' + safePhone;
    mobileCall.lastChild.textContent = 'Call us';
  }
  if (usableEmail) {
    document.getElementById('booking-note').textContent = 'Prepare your enquiry, then send it using your email app. The workshop will confirm availability before your visit.';
    document.getElementById('result-description').textContent = 'Review your details, then open your email app to send this enquiry. Your booking is only confirmed when the workshop replies.';
    document.getElementById('email-enquiry').hidden = false;
  }
  document.getElementById('year').textContent = new Date().getFullYear();
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenu = () => {
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };
  menuButton.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    mobileMenu.hidden = !opening;
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  });
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuButton.focus(); }
  });
  document.addEventListener('click', event => {
    if (!mobileMenu.hidden && !event.target.closest('.site-header')) closeMenu();
  });
  const desktopQuery = window.matchMedia('(min-width: 951px)');
  desktopQuery.addEventListener('change', event => { if (event.matches) closeMenu(); });
  const form = document.getElementById('booking-form');
  const result = document.getElementById('enquiry-result');
  const serviceSelect = document.getElementById('service');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const vehicleInput = document.getElementById('vehicle');
  const summary = document.getElementById('enquiry-summary');
  const copyStatus = document.getElementById('copy-status');
  let enquiryText = '';
  function showForm() { form.hidden = false; result.hidden = true; copyStatus.textContent = ''; }
  document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
    showForm();
    serviceSelect.value = link.dataset.service;
    serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
  }));
  [nameInput, phoneInput, vehicleInput].forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
  form.addEventListener('submit', event => {
    event.preventDefault();
    nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'Please enter your name.');
    vehicleInput.setCustomValidity(vehicleInput.value.trim() ? '' : 'Please enter your vehicle make and model.');
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    const phoneValid = /^[+\d\s().-]+$/.test(phoneInput.value) && phoneDigits.length >= 7 && phoneDigits.length <= 15;
    phoneInput.setCustomValidity(phoneValid ? '' : 'Please enter a valid contact number with 7–15 digits.');
    if (!form.reportValidity()) return;
    const message = document.getElementById('message').value.trim();
    enquiryText = [
      'Paint & bodywork enquiry — Psaltis Car Paintings', '',
      'Name: ' + nameInput.value.trim(),
      'Phone: ' + phoneInput.value.trim(),
      'Vehicle: ' + vehicleInput.value.trim(),
      'Service: ' + serviceSelect.value,
      ...(message ? ['', 'Notes: ' + message] : []),
      '', 'Please contact me to discuss availability and an estimate.'
    ].join('\n');
    summary.textContent = enquiryText;
    if (usableEmail) {
      document.getElementById('email-enquiry').href = 'mailto:' + encodeURIComponent(bookingEmail) + '?subject=' + encodeURIComponent('Paint & bodywork enquiry: ' + vehicleInput.value.trim()) + '&body=' + encodeURIComponent(enquiryText);
    }
    form.hidden = true;
    result.hidden = false;
    copyStatus.textContent = '';
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  });
  document.getElementById('edit-enquiry').addEventListener('click', () => { showForm(); nameInput.focus({ preventScroll: true }); });
  document.getElementById('copy-enquiry').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(enquiryText);
      copyStatus.textContent = 'Enquiry copied. Nothing has been sent to the workshop.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(summary);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = 'Your browser could not copy automatically. The enquiry is selected; use Copy from your device’s menu.';
    }
  });
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => {
      // Content in the initial viewport stays visible even before the observer runs.
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('will-reveal');
        observer.observe(el);
      }
    });
    motion.addEventListener('change', event => {
      if (event.matches) {
        document.querySelectorAll('.will-reveal').forEach(el => el.classList.add('is-visible'));
        observer.disconnect();
      }
    });
  }
})();
