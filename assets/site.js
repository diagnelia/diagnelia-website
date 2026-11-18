/* Diagnelia site script: contents menu, the case file, switchers, pricing period, contact form. No tracking. */
(() => {
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- every page opens at its top (no carried-over scroll), unless a link points inside it ---- */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const toTop = () => { if (!location.hash) scrollTo(0, 0); };
  toTop(); addEventListener('pageshow', toTop);

  /* ---- on a phone the section strip scrolls the current page into view ---- */
  const curLink = document.querySelector('.mast__sections a[aria-current]');
  if (curLink) { const strip = curLink.closest('.mast__sections'); strip.scrollLeft = curLink.offsetLeft - 16; }

  /* ---- menu ---- */
  const toggle = document.querySelector('.mast__contents');
  const menu = document.getElementById('menu');
  if (toggle && menu) {
    const label = toggle.querySelector('.mast__contents-label');
    const set = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      label.textContent = open ? toggle.dataset.close : toggle.dataset.open;
      document.documentElement.classList.toggle('is-contents', open);
    };
    toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); toggle.focus(); } });
  }

  /* ---- the case file: loose records fold into one ordered page ---- */
  $$('[data-casefile]').forEach((root) => {
    const btn = root.querySelector('[data-assemble]');
    const cap = root.querySelector('[data-cap]');
    const items = $$('.casefile__item', root);
    const apply = (loose) => {
      const first = reduce ? null : items.map((el) => el.getBoundingClientRect());
      root.classList.toggle('is-loose', loose);
      btn.textContent = loose ? btn.dataset.a : btn.dataset.s;
      btn.setAttribute('aria-pressed', String(!loose));
      cap.textContent = loose ? cap.dataset.loose : cap.dataset.ordered;
      if (!first) return;
      items.forEach((el, i) => {
        const last = el.getBoundingClientRect();
        const dx = first[i].left - last.left, dy = first[i].top - last.top;
        if (!dx && !dy) return;
        el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 520, delay: i * 30, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'backwards' });
      });
    };
    btn.hidden = false;
    btn.addEventListener('click', () => apply(!root.classList.contains('is-loose')));
    apply(true);
    // the first time the file is seen, the AI puts it in order by itself
    if (!reduce) {
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return; io.disconnect();
        setTimeout(() => { if (root.classList.contains('is-loose')) { apply(false); root.classList.add('is-found'); } }, 1400);
      }, { threshold: 0.5 });
      io.observe(root);
    }
  });

  /* ---- email addresses: a small chooser, the page never leaves ---- */
  const pop = document.querySelector('[data-mailpop]');
  if (pop) {
    let opener = null;
    const close = () => { pop.hidden = true; if (opener) opener.setAttribute('aria-expanded', 'false'); };
    $$('a[data-mail]').forEach((a) => {
      a.setAttribute('aria-haspopup', 'dialog'); a.setAttribute('aria-expanded', 'false');
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        if (!pop.hidden && opener === a) { close(); return; }
        opener = a; pop.hidden = false; a.setAttribute('aria-expanded', 'true');
        const r = a.getBoundingClientRect(); const w = pop.offsetWidth; const h = pop.offsetHeight;
        let left = Math.min(Math.max(8, r.left), innerWidth - w - 8);
        let top = r.bottom + 8; if (top + h > innerHeight - 8) top = Math.max(8, r.top - h - 8);
        pop.style.left = `${left + scrollX}px`; pop.style.top = `${top + scrollY}px`;
        pop.querySelector('.mailpop__item').focus();
      });
    });
    pop.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setTimeout(close, 100)));
    const cp = pop.querySelector('[data-mailpop-copy]'); const label = cp.textContent;
    cp.addEventListener('click', async () => {
      const addr = pop.querySelector('.mailpop__addr').textContent;
      try { await navigator.clipboard.writeText(addr); } catch (_) { const r = document.createRange(); r.selectNodeContents(pop.querySelector('.mailpop__addr')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand('copy'); }
      cp.textContent = cp.dataset.done; setTimeout(() => { cp.textContent = label; close(); }, 1200);
    });
    document.addEventListener('click', (ev) => { if (!pop.hidden && !pop.contains(ev.target) && !ev.target.closest('a[data-mail]')) close(); });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && !pop.hidden) { close(); if (opener) opener.focus(); } });
  }

  /* ---- motion: reveal on scroll, counters, the header on scroll ---- */
  const mast = document.querySelector('.mast');
  if (mast) {
    const onScroll = () => mast.classList.toggle('is-scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
  if (!reduce && 'IntersectionObserver' in window) {
    const sel = '.shead, .toc li, .figures li, .statement > *, .ledger__row, .stages > li, .switch, .flow__step, .ern, .table-wrap, .pipe__node, .promise__item, .s2 > *, .steps li, .plan, .rules li, .team > *, .road__item, .qa, .legal-doc__item, .closing__grid > *, .colophon__grid > *';
    const els = $$(sel).filter((el) => el.getBoundingClientRect().top > innerHeight * 0.9);
    const seen = new IntersectionObserver((list) => list.forEach((en) => {
      if (!en.isIntersecting) return; seen.unobserve(en.target); en.target.classList.add('is-in');
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => {
      const sib = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
      el.style.setProperty('--d', `${Math.min(sib, 5) * 70}ms`);
      el.classList.add('rv'); seen.observe(el);
    });
    const count = new IntersectionObserver((list) => list.forEach((en) => {
      if (!en.isIntersecting) return; count.unobserve(en.target);
      const el = en.target; const raw = el.dataset.count; const m = raw.match(/[\d.,]+/); if (!m) return;
      const end = parseFloat(m[0].replace(/,/g, '')); const dec = (m[0].split('.')[1] || '').length; const sep = m[0].includes(',');
      const fmt = (v) => { let x = v.toFixed(dec); if (sep) x = Number(x).toLocaleString('en-US'); return raw.replace(m[0], x); };
      const t0 = performance.now(); const dur = 1400;
      const tick = (t) => { const k = Math.min(1, (t - t0) / dur); el.textContent = fmt(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); else el.textContent = raw; };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    $$('[data-count]').forEach((el) => count.observe(el));
  }
  /* the conversation sample plays once it is on screen */
  $$('[data-chat]').forEach((c) => {
    if (reduce || !('IntersectionObserver' in window)) { c.classList.add('is-live'); return; }
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { c.classList.add('is-live'); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(c);
  });

  /* ---- switchers (tabs) ---- */
  $$('[data-switch]').forEach((sw) => {
    const tabs = $$('[role="tab"]', sw);
    const panels = $$('[role="tabpanel"]', sw);
    const select = (i, focus) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const k = e.key;
        if (k === 'ArrowRight' || k === 'ArrowLeft' || k === 'Home' || k === 'End') {
          e.preventDefault();
          const n = k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : (i + (k === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
          select(n, true);
        }
      });
    });
    select(0);
  });

  /* ---- questions: open without script, closed once it runs ---- */
  $$('[data-qa]').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const set = (open) => { btn.setAttribute('aria-expanded', String(open)); panel.hidden = !open; };
    set(false);
    btn.closest('[data-qa-row]').querySelector('.qa__row').addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  });

  /* ---- pricing period ---- */
  $$('[data-period]').forEach((fs) => {
    const apply = () => {
      const v = fs.querySelector('input:checked').value;
      $$('[data-m][data-y]').forEach((el) => { el.textContent = el.dataset[v]; });
    };
    fs.addEventListener('change', apply);
  });

  /* ---- contact form: composes an email, sends nothing by itself ---- */
  const form = document.querySelector('form[data-mailto]');
  if (form) {
    const topic = new URLSearchParams(location.search).get('topic');
    const radios = $$('input[name="topic"]', form);
    if (topic !== null && radios[+topic]) radios[+topic].checked = true;
    const fields = ['name', 'email', 'consent'].map((n) => form.elements[n]);
    const check = (el) => {
      const ok = el.checkValidity();
      const help = document.getElementById(`${el.id}-help`);
      el.toggleAttribute('aria-invalid', !ok);
      if (!ok) { el.setAttribute('aria-describedby', help.id); help.textContent = el.dataset.error; } else { el.removeAttribute('aria-describedby'); help.textContent = ''; }
      return ok;
    };
    fields.forEach((el) => el.addEventListener('blur', () => { if (el.hasAttribute('aria-invalid')) check(el); }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = fields.filter((el) => !check(el));
      if (bad.length) { bad[0].focus(); return; }
      const t = form.querySelector('input[name="topic"]:checked').value;
      const body = `${form.elements.message.value.trim()}\n\n${form.elements.name.value.trim()}\n${t}\n${form.elements.email.value.trim()}`;
      const subject = `${form.dataset.subject}: ${t}`;
      const out = document.querySelector('[data-mailout]');
      out.querySelector('[data-mo-app]').href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      out.querySelector('[data-mo-gmail]').href = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(form.dataset.mailto)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      out.querySelector('[data-mo-text]').textContent = `${subject}\n\n${body}`;
      form.hidden = true; out.hidden = false; out.focus();
    });
    const out = document.querySelector('[data-mailout]');
    if (out) {
      out.querySelector('[data-mo-edit]').addEventListener('click', () => { out.hidden = true; form.hidden = false; form.elements.message.focus(); });
      const cp = out.querySelector('[data-mo-copy]'); const label = cp.textContent;
      cp.addEventListener('click', async () => {
        const pre = out.querySelector('[data-mo-text]');
        try { await navigator.clipboard.writeText(pre.textContent); } catch (_) { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand('copy'); }
        cp.textContent = cp.dataset.done; setTimeout(() => { cp.textContent = label; }, 2000);
      });
    }
  }

})();
