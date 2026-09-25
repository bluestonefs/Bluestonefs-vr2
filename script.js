/* ==========================================================
   Bluestone Commercial Cleaning
   Small, dependency-free script: mobile menu, header shadow,
   footer year, and the quote form.
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Settings you may want to change ---------- */
  var CONTACT = {
    email: 'Bluestonefs.va@gmail.com',
    phone: '(540) 421-5360'
  };

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header shadow after scrolling ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setNav(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
  }

  /* ---------- Quote form ---------- */
  var form = document.getElementById('quote-form');
  var statusEl = document.getElementById('form-status');

  function say(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'form-status' + (type ? ' ' + type : '');
  }

  function buildMailto(data) {
    var lines = [
      'Name: ' + (data.get('name') || ''),
      'Business: ' + (data.get('company') || ''),
      'Email: ' + (data.get('email') || ''),
      'Phone: ' + (data.get('phone') || ''),
      'Type of space: ' + (data.get('space_type') || ''),
      'How often: ' + (data.get('frequency') || ''),
      'Square footage: ' + (data.get('square_footage') || ''),
      '',
      (data.get('message') || '')
    ];
    return 'mailto:' + CONTACT.email +
      '?subject=' + encodeURIComponent('Walkthrough request from ' + (data.get('company') || 'a new client')) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);

      // Spam trap: real visitors never fill this in.
      if (data.get('_gotcha')) return;

      var action = form.getAttribute('action') || '';
      var formIsConfigured = action && action.indexOf('YOUR_FORM_ID') === -1;

      // Until a Formspree ID is added, open the visitor's email app instead.
      if (!formIsConfigured) {
        say('Opening your email app to send your request.');
        window.location.href = buildMailto(data);
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      say('Sending your request...');

      fetch(action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed');
          form.reset();
          say('Thank you. We received your request and will be in touch soon.', 'success');
        })
        .catch(function () {
          say('Your request did not send. Please call ' + CONTACT.phone + ' or email ' + CONTACT.email + '.', 'error');
        })
        .then(function () {
          if (button) button.disabled = false;
        });
    });
  }
})();
