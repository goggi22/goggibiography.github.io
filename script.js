// Модульная структура: все функции в этом модуле
const App = (() => {
  const state = {};
  state.parallaxDisabled = false;

  // Audio: lazy AudioContext + simple synths for "geass" and click feedback
  function initAudio(){
    if (state.audioCtx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return; // no audio support
    state.audioCtx = new AC();
  }

  function resumeAudioIfNeeded(){
    if (!state.audioCtx) return;
    if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
  }

  // Geass-like descending sound
  function playGeass(){
    initAudio(); if (!state.audioCtx) return;
    resumeAudioIfNeeded();
    const ctx = state.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter(); filter.type = 'lowpass';
    // vibrato LFO
    const lfo = ctx.createOscillator(); lfo.type = 'sine';
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 6; // cents-ish via frequency

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const dur = 1.1;
    osc.frequency.setValueAtTime(780, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + dur);
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(600, now + dur*0.9);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    lfo.frequency.setValueAtTime(6.5, now);
    osc.start(now); lfo.start(now);
    osc.stop(now + dur + 0.02); lfo.stop(now + dur + 0.02);
  }

  // short click-pop sound
  function playClick(){
    initAudio(); if (!state.audioCtx) return;
    resumeAudioIfNeeded();
    const ctx = state.audioCtx; const now = ctx.currentTime;
    const o = ctx.createOscillator(); o.type='triangle';
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(880, now);
    o.frequency.exponentialRampToValueAtTime(440, now + 0.08);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    o.start(now); o.stop(now + 0.14);
  }

  function playSound(kind){
    try{
      if (kind === 'geass') playGeass();
      else playClick();
    }catch(e){
      // silence any audio errors
      // console.warn(e);
    }
  }

  function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // Typewriter для секции "Обо мне"
  function initTypewriter() {
    const el = document.querySelector('.typewriter');
    if (!el) return;
    const txt = el.dataset.text || el.textContent.trim();
    el.textContent = '';
    let i = 0;
    const speed = 28;
    function step(){
      if (i <= txt.length) {
        el.textContent = txt.slice(0, i);
        i++;
        setTimeout(step, speed);
      }
    }
    step();
  }

  // Простая утилита sleep
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Терминал с ULTRAKILL-подобными сообщениями загрузки
  async function initTerminal(){
    const lines = document.getElementById('terminalLines');
    const cursor = document.getElementById('terminalCursor');
    if (!lines) return;
    // final terminal sequence: stop after these lines (no infinite loop)
    const messages = [
      'CPU.............. READY',
      'GPU.............. READY',
      'MEMORY........... READY',
      'NETWORK.......... READY',
      '> SYSTEM READY',
      '> Hi! Я goggi, это мое био.',
      '> SYNCHRONIZATION ACTIVE',
      '> PROTOCOL MONITORING'
    ];

    // type messages one by one and then stop
    for (let m of messages){
      await typeLine(lines, m);
      await sleep(200 + Math.random()*300);
    }

    // helper
    async function typeLine(container, text, short=false){
      const p = document.createElement('div');
      p.className = 'term-line';
      container.appendChild(p);
      for (let i=0;i<text.length;i++){
        p.textContent = text.slice(0,i+1);
        await sleep(18 + Math.random()*22);
      }
      if (!short) await sleep(120);
      container.scrollTop = container.scrollHeight;
    }
  }

  // IntersectionObserver для появления при скролле
  function initScrollReveal(){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if (ent.isIntersecting) ent.target.classList.add('visible');
      });
    },{threshold:0.12});
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  }

  // Parallax эффект для hero
  function initParallax(){
    const hero = document.getElementById('hero');
    const gear = document.getElementById('logoGear');
    if (!hero || !gear) return;
    hero.addEventListener('mousemove', (e)=>{
      if (state.parallaxDisabled) return;
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left)/r.width - 0.5;
      const y = (e.clientY - r.top)/r.height - 0.5;
      // apply only translate for parallax; rotation is handled by inner rotator to avoid transform conflicts
      gear.style.transform = `translate3d(${x*8}px, ${y*6}px, 0)`;
    });
    hero.addEventListener('mouseleave', ()=>{gear.style.transform='translate3d(0,0,0)'});

    // disable parallax while user hovers over the logo to avoid jerky interactions
    gear.addEventListener('mouseenter', ()=>{ state.parallaxDisabled = true; });
    gear.addEventListener('mouseleave', ()=>{ state.parallaxDisabled = false; });
  }

  // Непрерывная анимация шестерни
  function initGearRotation(){
    // Disable continuous rotation: keep logo static
    const gearImg = document.querySelector('#logoGear img');
    if (!gearImg) return;
    // ensure it's positioned correctly but not rotated
    gearImg.style.transform = '';
  }

  // Социальные ссылки — места для вставки реальных URL
  function initSocials(){
    document.querySelectorAll('.social').forEach(a=>{
      a.addEventListener('click', (ev)=>{
        const svc = a.dataset.service;
        playSound('social');
        const href = a.getAttribute('href') || '';
        // если ссылки нет или это заглушка — отменяем переход и показываем сообщение в терминале
        if (!href || href === '#' || href.trim() === ''){
          ev.preventDefault();
          const lines = document.getElementById('terminalLines');
          if (lines) {
            const el = document.createElement('div'); el.textContent = `OPEN: ${svc.toUpperCase()} — ссылка не установлена`;
            lines.appendChild(el); lines.scrollTop = lines.scrollHeight;
          }
        } else {
          // внешние ссылки открываются сами (target=_blank). Убедимся, что аудио-контекст резюмирован.
          resumeAudioIfNeeded();
        }
      });
    });
  }

  // Инициализация
  function init(){
    setYear();
    initTypewriter();
    initTerminal();
    initScrollReveal();
    initParallax();
    initGearRotation();
    initSocials();
    initInteractions();
    initPageTransitions();
    initMatrixBackground();
  }

  // Matrix-style falling code background using a full-screen canvas
  function initMatrixBackground(){
    // disable on small screens to save battery
    if (window.innerWidth < 600) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'matrixCanvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let width, height;
    let fontSize = 14;
    let columns;
    let drops = [];

    function resize(){
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      fontSize = Math.max(12, Math.floor(width / 120));
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    }

    const chars = '01';

    function draw(){
      // translucent black to slowly fade previous frame
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 255, 120, 0.9)';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < columns; i++){
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    }

    let raf;
    resize();
    window.addEventListener('resize', ()=>{ cancelAnimationFrame(raf); resize(); });
    draw();
  }
  

  // Плавная прокрутка (fallback, если native behavior не работает)
  function smoothScrollTo(targetY, duration = 650){
    const start = window.scrollY || window.pageYOffset;
    const diff = targetY - start;
    if (!diff) return;
    let startTime = null;
    function easeInOutQuad(t){ return t<0.5 ? 2*t*t : -1 + (4-2*t)*t }
    function step(time){
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutQuad(t);
      window.scrollTo(0, Math.round(start + diff * eased));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Взаимодействия: навигация и кнопки звуковая обратная связь
  function initInteractions(){
    // main-nav: перехват кликов для плавной прокрутки и звуковой обратной связи
    document.querySelectorAll('.main-nav a').forEach(a=>{
      a.addEventListener('click', (ev)=>{
        const href = a.getAttribute('href') || '';
        // внутренние якоря — плавная прокрутка
        if (href.startsWith('#')){
          ev.preventDefault();
          const target = document.querySelector(href);
          const header = document.querySelector('.site-header');
          const headerOffset = header ? header.offsetHeight + 12 : 12;
          const targetY = target ? target.getBoundingClientRect().top + window.scrollY - headerOffset : 0;
          // звук: особый для About
          if (href === '#about') playSound('geass'); else playSound('click');
          // немного задержим звук, но не слишком, чтобы ощущение было синхронным
          setTimeout(()=>{
            // попробуем native, если он не работает — используем fallback
            try{ window.scrollTo({top: targetY, behavior: 'smooth'}); }
            catch(e){ smoothScrollTo(targetY, 650); }
            // ещё вызвать fallback на случай, если browser игнорирует опцию
            setTimeout(()=>{
              if (Math.abs((window.scrollY || window.pageYOffset) - targetY) > 8) smoothScrollTo(targetY, 600);
            }, 350);
          }, 40);
        } else {
          playSound('click');
        }
      });
    });

    // крупная кнопка
    document.querySelectorAll('.btn').forEach(b=>{
      b.addEventListener('click', ()=>{
        playSound('click');
      });
    });
  }

  // Simple page transition: fade out on internal navigation, then follow link
  function initPageTransitions(){
    // enter animation
    try{
      document.body.style.opacity = '0';
      requestAnimationFrame(()=>{
        document.body.style.transition = 'opacity 260ms ease';
        document.body.style.opacity = '1';
      });
    }catch(e){/* ignore */}

    document.addEventListener('click', (ev)=>{
      const a = ev.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      // skip hashes, external links, targets that open new tabs and mailto/tel
      if (!href || href.startsWith('#') || a.target === '_blank' || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const url = new URL(href, location);
      if (url.origin !== location.origin) return; // external
      ev.preventDefault();
      // fade out then navigate
      document.body.style.transition = 'opacity 260ms ease';
      document.body.style.opacity = '0';
      setTimeout(()=>{ location.href = url.href; }, 260);
    }, false);
  }

  return {init};
})();

document.addEventListener('DOMContentLoaded', ()=>App.init());
