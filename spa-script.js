// SPA (Single Page Application) для сайта goggi
// Музыка играет непрерывно при переходах между страницами

const SPA = (() => {
  // Состояние приложения
  const state = {
    currentPage: 'home',
    audio: null,
    isPlaying: false,
    terminalMessages: [
      'CPU.............. READY',
      'GPU.............. READY',
      'MEMORY........... READY',
      'NETWORK.......... READY',
      '> SYSTEM READY',
      '> Hi! Я goggi, это мое био.',
      '> SYNCHRONIZATION ACTIVE',
      '> PROTOCOL MONITORING'
    ],
    pages: {
      home: null,
      about: null,
      socials: null
    }
  };

  // ========== ОСНОВНЫЕ ФУНКЦИИ ==========

  // Инициализация всего приложения
  function init() {
    console.log('SPA инициализируется...');
    
    // Загружаем шаблоны страниц
    loadTemplates();
    
    // Инициализируем аудиоплеер
    initAudioPlayer();
    
    // Инициализируем навигацию
    initNavigation();
    
    // Загружаем домашнюю страницу
    loadPage('home');
    
    // Обновляем год в футере
    updateYear();
    
    // Инициализируем другие компоненты
    initComponents();
    
    console.log('SPA готово к работе!');
  }

  // Загрузка шаблонов страниц
  function loadTemplates() {
    state.pages.home = `
      <section id="hero" class="hero page-content">
        <div class="hero-grid">
          <div class="hero-left">
            <h1 class="title"><span class="geass">goggi</span> • <span class="nerv">гогги</span></h1>
            <p class="subtitle">bio</p>

            <div class="terminal-area">
              <div class="terminal" id="terminal" aria-live="polite">
                <div class="terminal-lines" id="terminalLines"></div>
                <div class="terminal-cursor" id="terminalCursor">▌</div>
              </div>

              <div class="logo-gear" id="logoGear" aria-hidden="true">
                <div class="nerv-wrap">
                  <div class="nerv-rotator">
                    <img src="assets/bogdan_stepan.jpg" alt="Bogdan Stepan" class="nerv-badge" />
                  </div>
                </div>
              </div>
            </div>

            <a class="btn" href="#" data-page="about">Узнать больше</a>
          </div>
        </div>
      </section>
    `;

    state.pages.about = `
      <section class="about container page-content" style="padding:4rem 0;">
        <h2>about</h2>
        <p class="typewriter" id="typewriterText">Я — гогги, хочу стать разработчиком JavaScript, мне 15 лет. Вдохновляюсь аниме-культурой и промышленной эстетикой.</p>

        <div class="cards">
          <article class="card reveal">CSS</article>
          <article class="card reveal">HTML</article>
          <article class="card reveal">JAVASCRIPT</article>
        </div>

        <p style="margin-top:2rem;"><a class="btn" href="#" data-page="home">← назад</a></p>
      </section>
    `;

    state.pages.socials = `
      <section class="socials container page-content" style="padding:4rem 0;">
        <img src="assets/cc.gif" alt="Animated decoration" class="links-gif">
        <h2>links</h2>
        <ul class="social-list">
          <li>
            <a class="social" href="https://t.me/avalleywithoutwind" data-service="telegram" target="_blank" rel="noopener" aria-label="Telegram">
              <i class="fab fa-telegram"></i>
            </a>
          </li>
          <li>
            <a class="social" href="https://steamcommunity.com/id/goggisnajpep/" data-service="steam" target="_blank" rel="noopener" aria-label="Steam">
              <i class="fab fa-steam"></i>
            </a>
          </li>
          <li>
            <a class="social" href="https://www.youtube.com/@ex3m22" data-service="youtube" target="_blank" rel="noopener" aria-label="YouTube">
              <i class="fab fa-youtube"></i>
            </a>
          </li>
          <li>
            <a class="social" href="https://github.com/goggi22" data-service="github" target="_blank" rel="noopener" aria-label="GitHub">
              <i class="fab fa-github"></i>
            </a>
          </li>
        </ul>

        <div class="back-button-container">
          <a class="btn" href="#" data-page="home">← назад</a>
        </div>
      </section>
    `;
  }

  // Инициализация навигации
  function initNavigation() {
    // Клики по ссылкам в навигации
    document.querySelectorAll('.main-nav a, .logo-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.getAttribute('data-page') || 'home';
        
        if (page !== state.currentPage) {
          loadPage(page);
          
          // Обновляем URL в браузере без перезагрузки
          history.pushState({ page }, '', `#${page}`);
          
          // Обновляем активную ссылку
          updateActiveLink(page);
        }
      });
    });
    
    // Обработка кнопок "Назад"/"Вперед" в браузере
    window.addEventListener('popstate', function(e) {
      const page = e.state?.page || 'home';
      loadPage(page);
      updateActiveLink(page);
    });
  }

  // Загрузка страницы
  function loadPage(page) {
    console.log(`Загружаем страницу: ${page}`);
    
    // Показываем анимацию загрузки
    const mainContent = document.getElementById('main-content');
    mainContent.style.opacity = '0.5';
    
    // Загружаем контент страницы
    setTimeout(() => {
      if (state.pages[page]) {
        mainContent.innerHTML = state.pages[page];
        state.currentPage = page;
        
        // Инициализируем компоненты для загруженной страницы
        initPageComponents(page);
        
        // Показываем контент с анимацией
        mainContent.style.opacity = '1';
        mainContent.style.transition = 'opacity 0.3s ease';
      } else {
        console.error(`Страница "${page}" не найдена`);
        loadPage('home'); // Fallback на домашнюю страницу
      }
    }, 50);
  }

  // Обновление активной ссылки в навигации
  function updateActiveLink(page) {
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-page') === page);
    });
  }

  // ========== АУДИОПЛЕЕР ==========

  function initAudioPlayer() {
    const audio = document.getElementById('auraAudio');
    const playBtn = document.getElementById('playAuraBtn');
    const progress = document.getElementById('auraProgress');
    const progressContainer = document.getElementById('auraProgressContainer');
    const timeDisplay = document.getElementById('auraTime');
    const volumeSlider = document.getElementById('auraVolume');
    
    state.audio = audio;
    
    // ========== УСТАНАВЛИВАЕМ НАЧАЛЬНУЮ ГРОМКОСТЬ ==========
    const INITIAL_VOLUME = 0.3; // 30% громкости (измените на нужное значение)
    audio.volume = INITIAL_VOLUME;
    if (volumeSlider) volumeSlider.value = INITIAL_VOLUME;
    // ======================================================
    
    // Пытаемся начать воспроизведение автоматически
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Успех - меняем кнопку на паузу
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.classList.add('playing');
        state.isPlaying = true;
        console.log('Аудио воспроизводится автоматически');
      }).catch(error => {
        // Автовоспроизведение заблокировано
        console.log('Автовоспроизведение заблокировано, ждем клика пользователя');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        state.isPlaying = false;
        
        // Разрешаем воспроизведение по клику на любую часть страницы
        document.addEventListener('click', function enableAudio() {
          audio.play().then(() => {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playBtn.classList.add('playing');
            state.isPlaying = true;
            console.log('Аудио запущено после клика пользователя');
          });
          document.removeEventListener('click', enableAudio);
        }, { once: true });
      });
    }
    
    // Форматирование времени
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    // Обновление времени при загрузке
    audio.addEventListener('loadedmetadata', () => {
      if (timeDisplay) {
        timeDisplay.textContent = `0:00 / ${formatTime(audio.duration)}`;
      }
    });
    
    // Обновление прогресса и времени
    audio.addEventListener('timeupdate', () => {
      if (audio.duration && !isNaN(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        
        if (progress) {
          progress.style.width = `${percent}%`;
        }
        
        if (timeDisplay) {
          timeDisplay.textContent = 
            `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        }
      }
    });
    
    // Кнопка play/pause
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.classList.add('playing');
        state.isPlaying = true;
      } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.classList.remove('playing');
        state.isPlaying = false;
      }
    });
    
    // Перемотка по клику на прогресс-бар
    if (progressContainer) {
      progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        if (duration && !isNaN(duration)) {
          audio.currentTime = (clickX / width) * duration;
        }
      });
    }
    
    // Регулировка громкости
    if (volumeSlider) {
      volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
      });
    }
    
    // При завершении трека - начинаем заново (трек на loop)
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play();
    });
    
    // Обработка ошибок
    audio.addEventListener('error', (e) => {
      console.error('Ошибка аудио:', e);
      playBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
      playBtn.style.background = '#ff0000';
      if (timeDisplay) {
        timeDisplay.textContent = 'Ошибка загрузки';
      }
    });
  }

  // ========== КОМПОНЕНТЫ СТРАНИЦ ==========

  // Инициализация компонентов для конкретной страницы
  function initPageComponents(page) {
    switch(page) {
      case 'home':
        initTerminal();
        initParallax();
        break;
      case 'about':
        initTypewriter();
        initScrollReveal();
        break;
      case 'socials':
        initSocialLinks();
        break;
    }
    
    // Общие компоненты для всех страниц
    initGearRotation();
    initButtons();
  }

  // Терминал (главная страница)
  function initTerminal() {
    const lines = document.getElementById('terminalLines');
    const cursor = document.getElementById('terminalCursor');
    
    if (!lines) return;
    
    // Очищаем предыдущие сообщения
    lines.innerHTML = '';
    
    // Добавляем сообщения по очереди
    state.terminalMessages.forEach((message, index) => {
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'term-line';
        line.textContent = message;
        lines.appendChild(line);
        
        // Прокручиваем вниз
        lines.scrollTop = lines.scrollHeight;
        
        // Мигание курсора
        if (cursor) {
          cursor.style.animation = 'blink 1s steps(2, start) infinite';
        }
      }, index * 600);
    });
  }

  // Печатная машинка (страница about)
  function initTypewriter() {
    const element = document.getElementById('typewriterText');
    if (!element) return;
    
    const text = element.textContent;
    element.textContent = '';
    
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, 30);
      }
    }
    
    // Начинаем с небольшой задержкой
    setTimeout(type, 300);
  }

  // Параллакс эффект
  function initParallax() {
    const hero = document.getElementById('hero');
    const gear = document.getElementById('logoGear');
    
    if (!hero || !gear) return;
    
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      gear.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0)`;
    });
    
    hero.addEventListener('mouseleave', () => {
      gear.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  // Вращение шестеренки
  function initGearRotation() {
    const gearImages = document.querySelectorAll('.nerv-rotator img, .logo-rotator img');
    
    gearImages.forEach(img => {
      img.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.3s ease';
        this.style.transform = 'rotate(15deg)';
      });
      
      img.addEventListener('mouseleave', function() {
        this.style.transform = 'rotate(0deg)';
      });
    });
  }

  // Социальные ссылки
  function initSocialLinks() {
    document.querySelectorAll('.social').forEach(link => {
      link.addEventListener('click', function(e) {
        // Для внешних ссылок открываем в новой вкладке
        if (this.getAttribute('href') && this.getAttribute('href').startsWith('http')) {
          e.preventDefault();
          window.open(this.getAttribute('href'), '_blank');
        }
      });
    });
  }

  // Появление элементов при скролле
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Обработка кнопок
  function initButtons() {
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') {
          e.preventDefault();
          const page = this.getAttribute('data-page') || 'home';
          loadPage(page);
          history.pushState({ page }, '', `#${page}`);
          updateActiveLink(page);
        }
      });
    });
  }

  // Общие компоненты
  function initComponents() {
    // Matrix фон
    initMatrixBackground();
  }

  // Matrix фон (из оригинального скрипта)
  function initMatrixBackground() {
    if (window.innerWidth < 600) return;
    
    const canvas = document.createElement('canvas');
    canvas.id = 'matrixCanvas';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let fontSize = 14;
    let columns;
    let drops = [];
    
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      fontSize = Math.max(12, Math.floor(width / 120));
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    }
    
    const chars = '01';
    
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 255, 120, 0.9)';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < columns; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      
      requestAnimationFrame(draw);
    }
    
    resize();
    window.addEventListener('resize', resize);
    draw();
  }

  // Обновление года в футере
  function updateYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  // ========== ПУБЛИЧНЫЕ МЕТОДЫ ==========
  
  // Функция для переключения музыки извне
  function toggleMusic() {
    if (state.audio) {
      if (state.audio.paused) {
        state.audio.play();
        state.isPlaying = true;
      } else {
        state.audio.pause();
        state.isPlaying = false;
      }
      return state.isPlaying;
    }
    return false;
  }
  
  // Функция для получения текущей страницы
  function getCurrentPage() {
    return state.currentPage;
  }
  
  // Функция для получения состояния музыки
  function isMusicPlaying() {
    return state.isPlaying;
  }

  return {
    init,
    toggleMusic,
    getCurrentPage,
    isMusicPlaying
  };
})();

// Запускаем приложение когда страница загрузится
document.addEventListener('DOMContentLoaded', () => {
  SPA.init();
  
  // Обработка хэша в URL при загрузке
  const hash = window.location.hash.substring(1);
  if (hash && ['home', 'about', 'socials'].includes(hash)) {
    SPA.loadPage(hash);
    SPA.updateActiveLink(hash);
  }
});

// Экспортируем SPA для отладки в консоли
window.SPA = SPA;