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

  // Инициализация навигации (оптимизировано с делегированием событий)
  function initNavigation() {
    // Используем делегирование событий для лучшей производительности
    document.addEventListener('click', function(e) {
      const link = e.target.closest('.main-nav a, .logo-link');
      if (!link) return;
      
        e.preventDefault();
      const page = link.getAttribute('data-page') || 'home';
        
        if (page !== state.currentPage) {
          loadPage(page);
          history.pushState({ page }, '', `#${page}`);
          updateActiveLink(page);
        }
    });
    
    // Обработка кнопок "Назад"/"Вперед" в браузере
    window.addEventListener('popstate', function(e) {
      const page = e.state?.page || 'home';
      loadPage(page);
      updateActiveLink(page);
    });
  }

  // Применение анимаций появления элементов
  function applyPageAnimations() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    // Перетаскиваемое изображение всегда видимо (проверяем до скрытия других элементов)
    const draggableImg = mainContent.querySelector('img[src="assets/bogdan_stepan.jpg"]');
    
    // Устанавливаем начальное состояние для всех элементов (кроме перетаскиваемого изображения)
    const allAnimatedElements = mainContent.querySelectorAll('h1, h2, .btn, .card, img, .social, .terminal, .logo-gear, .typewriter, .links-gif, .subtitle, .social-list');
    allAnimatedElements.forEach(el => {
      // Пропускаем перетаскиваемое изображение
      if (el === draggableImg || (el.querySelector && el.querySelector('img[src="assets/bogdan_stepan.jpg"]'))) {
        return;
      }
      el.style.opacity = '0';
      el.style.visibility = 'hidden';
    });
    
    // Перетаскиваемое изображение всегда видимо
    if (draggableImg) {
      draggableImg.style.visibility = 'visible';
      draggableImg.style.opacity = '1';
      draggableImg.style.setProperty('opacity', '1', 'important');
      draggableImg.style.setProperty('visibility', 'visible', 'important');
    }
    
    // Анимация для заголовков
    const titles = mainContent.querySelectorAll('h1, h2');
    titles.forEach((title, index) => {
      title.style.visibility = 'visible';
      title.classList.add('animate-slide-top');
      title.style.animationDelay = `${index * 0.12}s`;
    });
    
    // Анимация для кнопок
    const buttons = mainContent.querySelectorAll('.btn');
    buttons.forEach((btn, index) => {
      btn.style.visibility = 'visible';
      btn.classList.add('animate-slide-bottom');
      btn.style.animationDelay = `${0.3 + index * 0.1}s`;
    });
    
    // Анимация для карточек
    const cards = mainContent.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.visibility = 'visible';
      const direction = index % 2 === 0 ? 'animate-slide-left' : 'animate-slide-right';
      card.classList.add(direction);
      card.style.animationDelay = `${0.2 + index * 0.15}s`;
    });
    
    // Анимация для изображений (кроме перетаскиваемого)
    const images = mainContent.querySelectorAll('img:not([src="assets/bogdan_stepan.jpg"])');
    images.forEach((img, index) => {
      img.style.visibility = 'visible';
      img.classList.add('animate-scale');
      img.style.animationDelay = `${0.25 + index * 0.15}s`;
    });
    
    // Специальная анимация для bogdan_stepan.jpg на первоначальной позиции
    if (draggableImg) {
      // Убеждаемся, что изображение видимо и имеет правильные стили
      draggableImg.style.visibility = 'visible';
      draggableImg.style.opacity = '1';
      draggableImg.classList.add('animate-scale');
      draggableImg.style.animationDelay = '0.25s';
    }
    
    // Анимация для социальных ссылок (с предотвращением мигания иконок)
    const socialLinks = mainContent.querySelectorAll('.social');
    socialLinks.forEach((link, index) => {
      link.style.visibility = 'visible';
      link.classList.add('animate-scale');
      link.style.animationDelay = `${0.2 + index * 0.08}s`;
      
      // Предотвращаем мигание иконок - скрываем до загрузки
      const icon = link.querySelector('i');
      if (icon) {
        icon.style.opacity = '0';
        icon.style.transition = 'opacity 0.5s ease';
        
        // Ждем загрузки шрифтов и DOM перед показом
        const showIcon = () => {
          // Двойная проверка для надежности
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              icon.style.opacity = '1';
            });
          });
        };
        
        // Проверяем загрузку шрифтов
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => {
            setTimeout(showIcon, 200);
          });
        } else {
          setTimeout(showIcon, 400);
        }
      }
    });
    
    // Анимация для терминала
    const terminal = mainContent.querySelector('.terminal');
    if (terminal) {
      terminal.style.visibility = 'visible';
      terminal.classList.add('animate-slide-left');
      terminal.style.animationDelay = '0.15s';
    }
    
    // Анимация для logo-gear (но не для перетаскиваемого изображения)
    const logoGear = mainContent.querySelector('.logo-gear');
    if (logoGear) {
      const hasDraggableImg = logoGear.querySelector('img[src="assets/bogdan_stepan.jpg"]');
      if (!hasDraggableImg) {
        logoGear.style.visibility = 'visible';
        logoGear.classList.add('animate-slide-right');
        logoGear.style.animationDelay = '0.2s';
      }
    }
    
    // Анимация для typewriter
    const typewriter = mainContent.querySelector('.typewriter');
    if (typewriter) {
      typewriter.style.visibility = 'visible';
      typewriter.classList.add('animate-slide-left');
      typewriter.style.animationDelay = '0.15s';
    }
    
    // Анимация для links-gif
    const linksGif = mainContent.querySelector('.links-gif');
    if (linksGif) {
      linksGif.style.visibility = 'visible';
      linksGif.classList.add('animate-scale');
      linksGif.style.animationDelay = '0.2s';
    }
    
    // Анимация для subtitle
    const subtitle = mainContent.querySelector('.subtitle');
    if (subtitle) {
      subtitle.style.visibility = 'visible';
      subtitle.classList.add('animate-slide-top');
      subtitle.style.animationDelay = '0.18s';
    }
    
    // Анимация для social-list
    const socialList = mainContent.querySelector('.social-list');
    if (socialList) {
      socialList.style.visibility = 'visible';
      socialList.classList.add('animate-slide-bottom');
      socialList.style.animationDelay = '0.25s';
    }
  }

  // Загрузка страницы
  function loadPage(page) {
    console.log(`Загружаем страницу: ${page}`);
    
    const mainContent = document.getElementById('main-content');
    
    // Плавное скрытие текущего контента
    mainContent.style.transition = 'opacity 0.2s ease-out';
    mainContent.style.opacity = '0';
    
    // Загружаем контент страницы после скрытия
    setTimeout(() => {
      if (state.pages[page]) {
        // Скрываем элементы перед загрузкой для плавного появления
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'none';
        
        mainContent.innerHTML = state.pages[page];
        state.currentPage = page;
        
        // Инициализируем компоненты для загруженной страницы
        initPageComponents(page);
        
        // Применяем анимации появления элементов через requestAnimationFrame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            applyPageAnimations();
            // Плавно показываем контент
            mainContent.style.transition = 'opacity 0.3s ease-in';
            mainContent.style.opacity = '1';
          });
        });
      } else {
        console.error(`Страница "${page}" не найдена`);
        loadPage('home'); // Fallback на домашнюю страницу
      }
    }, 200);
  }

  // Кэш для навигационных ссылок
  let navLinksCache = null;
  
  // Обновление активной ссылки в навигации (оптимизировано)
  function updateActiveLink(page) {
    if (!navLinksCache) {
      navLinksCache = document.querySelectorAll('.main-nav a');
    }
    navLinksCache.forEach(link => {
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
        initDraggableImage();
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

  // Параллакс эффект (оптимизирован)
  function initParallax() {
    const hero = document.getElementById('hero');
    const gear = document.getElementById('logoGear');
    
    if (!hero || !gear) return;
    
    // Проверяем, есть ли перетаскиваемое изображение в этом контейнере
    const draggableImg = gear.querySelector('img[src="assets/bogdan_stepan.jpg"]');
    if (draggableImg) {
      // Отключаем parallax для контейнера с перетаскиваемым изображением
      return;
    }
    
    // Throttle для оптимизации производительности
    let rafId = null;
    const handleMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gear.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0)`;
        rafId = null;
    });
    };
    
    hero.addEventListener('mousemove', handleMouseMove, { passive: true });
    hero.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      gear.style.transform = 'translate3d(0, 0, 0)';
    }, { passive: true });
  }

  // Вращение шестеренки
  function initGearRotation() {
    const gearImages = document.querySelectorAll('.nerv-rotator img, .logo-rotator img');
    
    gearImages.forEach(img => {
      // Пропускаем перетаскиваемое изображение
      if (img.src.includes('bogdan_stepan.jpg') || img.classList.contains('draggable-image')) {
        return;
      }
      
      img.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.3s ease';
        this.style.transform = 'rotate(15deg)';
      });
      
      img.addEventListener('mouseleave', function() {
        this.style.transform = 'rotate(0deg)';
      });
    });
  }

  // Перетаскивание изображения bogdan_stepan.jpg
  function initDraggableImage() {
    // Добавляем задержку, чтобы изображение успело отрисоваться и другие эффекты инициализировались
    setTimeout(() => {
      const img = document.querySelector('img[src="assets/bogdan_stepan.jpg"]');
      if (!img) {
        console.warn('Изображение bogdan_stepan.jpg не найдено');
        return;
      }

      // Отключаем parallax для контейнера этого изображения
      const gearContainer = img.closest('.logo-gear');
      if (gearContainer) {
        gearContainer.style.transform = 'none !important';
        gearContainer.style.pointerEvents = 'none';
        const nervWrap = gearContainer.querySelector('.nerv-wrap');
        if (nervWrap) {
          nervWrap.style.transform = 'none !important';
        }
      }

      // Отключаем hover-эффекты для этого изображения
      img.style.pointerEvents = 'auto';
      img.onmouseenter = null;
      img.onmouseleave = null;
      // Удаляем все обработчики событий hover
      const newImg = img.cloneNode(true);
      img.parentNode.replaceChild(newImg, img);
      const imgElement = newImg;

      // Добавляем класс для стилизации
      imgElement.classList.add('draggable-image');
      imgElement.style.cursor = 'grab';
      imgElement.style.zIndex = '100';
      imgElement.style.willChange = 'transform';
      imgElement.style.transition = 'none'; // Отключаем все переходы
      
      let isDragging = false;
      let startX = 0;
      let startY = 0;
      let translateX = 0;
      let translateY = 0;
      let animationFrameId = null;
      let lastX = 0;
      let lastY = 0;
      let lastTime = 0;

      // Всегда начинаем с исходной позиции (не загружаем из localStorage)
      translateX = 0;
      translateY = 0;
      
      // Очищаем старую позицию из localStorage при инициализации
      localStorage.removeItem('bogdan_stepan_position');
      
      // Убеждаемся, что изображение видимо
      imgElement.style.setProperty('opacity', '1', 'important');
      imgElement.style.setProperty('visibility', 'visible', 'important');
      
      // Применяем анимацию появления
      imgElement.classList.add('animate-scale');
      imgElement.style.animationDelay = '0.3s';
      
      // Устанавливаем исходную позицию (без transform)
      imgElement.style.setProperty('transform', 'translate(0, 0)', 'important');

      // Wobble эффект (как у плеера)
      function applyWobble(dx, dy) {
        const maxTilt = 3;        // максимальный наклон (меньше чем у плеера для изображения)
        const maxStretch = 0.04;  // максимум растягивания 4%
        const speed = Math.sqrt(dx * dx + dy * dy);
        const power = Math.min(speed / 20, 1);
        const scaleX = 1 + maxStretch * power;
        const scaleY = 1 - maxStretch * power;
        const angle = maxTilt * power * (dx > 0 ? 1 : -1);
        return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY}) rotate(${angle}deg)`;
      }

      function resetWobble() {
        imgElement.style.setProperty('transition', 'transform 0.25s ease', 'important');
        imgElement.style.setProperty('transform', `translate(${translateX}px, ${translateY}px) scale(1) rotate(0deg)`, 'important');
        setTimeout(() => {
          imgElement.style.setProperty('transition', 'none', 'important');
        }, 250);
      }

      function updateTransform(applyWobbleEffect = false) {
        let transformValue;
        if (applyWobbleEffect && isDragging) {
          const now = performance.now();
          const dx = translateX - lastX;
          const dy = translateY - lastY;
          transformValue = applyWobble(dx, dy);
          lastX = translateX;
          lastY = translateY;
          lastTime = now;
        } else {
          transformValue = `translate(${translateX}px, ${translateY}px)`;
        }
        imgElement.style.setProperty('transform', transformValue, 'important');
        // НЕ сохраняем позицию в localStorage - при перезагрузке возвращаемся на исходное место
      }

      // Применяем позицию еще раз через небольшую задержку для защиты от перезаписи
      setTimeout(() => {
        updateTransform();
      }, 100);

      function startDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Сохраняем начальную позицию курсора и текущий transform
        startX = clientX;
        startY = clientY;
        
        // Получаем текущий transform
        const current = getCurrentTransform();
        translateX = current.x;
        translateY = current.y;
        lastX = translateX;
        lastY = translateY;
        lastTime = performance.now();
        
        imgElement.style.cursor = 'grabbing';
        imgElement.style.setProperty('transition', 'none', 'important');
        document.body.style.userSelect = 'none';
      }

      function moveDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Вычисляем смещение от начальной точки
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        
        // Добавляем смещение к текущей позиции
        translateX += deltaX;
        translateY += deltaY;
        
        // Обновляем начальную позицию для следующего кадра
        startX = clientX;
        startY = clientY;
        
        // Плавно обновляем через requestAnimationFrame с wobble эффектом
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        
        animationFrameId = requestAnimationFrame(() => {
          updateTransform(true); // Применяем wobble эффект
        });
      }

      function endDrag() {
        if (!isDragging) return;
        
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        
        isDragging = false;
        imgElement.style.cursor = 'grab';
        // Сбрасываем wobble эффект с плавной анимацией
        resetWobble();
        document.body.style.userSelect = '';
      }

      // События для мыши
      imgElement.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', moveDrag);
      document.addEventListener('mouseup', endDrag);

      // События для сенсорных экранов
      imgElement.addEventListener('touchstart', startDrag, { passive: false });
      document.addEventListener('touchmove', moveDrag, { passive: false });
      document.addEventListener('touchend', endDrag);
    }, 500); // Увеличена задержка для рендеринга
  }

  // Социальные ссылки (оптимизировано с делегированием событий)
  let socialLinksInitialized = false;
  function initSocialLinks() {
    if (socialLinksInitialized) return;
    socialLinksInitialized = true;
    
    // Используем делегирование событий
    document.addEventListener('click', function(e) {
      const link = e.target.closest('.social');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (href && href.startsWith('http')) {
          e.preventDefault();
        window.open(href, '_blank', 'noopener,noreferrer');
        }
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

  // Обработка кнопок (оптимизировано с делегированием событий)
  // Используем единый обработчик для всех кнопок через делегирование
  let buttonsInitialized = false;
  function initButtons() {
    if (buttonsInitialized) return;
    buttonsInitialized = true;
    
    // Используем делегирование событий для лучшей производительности
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      
      if (btn.getAttribute('href') === '#') {
          e.preventDefault();
        const page = btn.getAttribute('data-page') || 'home';
          loadPage(page);
          history.pushState({ page }, '', `#${page}`);
          updateActiveLink(page);
        }
    });
  }

  // Общие компоненты
  function initComponents() {
    // Matrix фон
    initMatrixBackground();
  }

  // Matrix фон (оптимизирован)
  function initMatrixBackground() {
    if (window.innerWidth < 600) return;
    
    const canvas = document.createElement('canvas');
    canvas.id = 'matrixCanvas';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d', { alpha: false }); // Отключаем альфа-канал для производительности
    let width, height;
    let fontSize = 14;
    let columns;
    let drops = [];
    let animationId = null;
    
    // Кэшируем строку для производительности
    const chars = '01';
    const charLength = chars.length;
    
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      fontSize = Math.max(12, Math.floor(width / 120));
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    }
    
    function draw() {
      // Используем более эффективный способ очистки
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 255, 120, 0.9)';
      ctx.font = `${fontSize}px monospace`;
      
      // Оптимизированный цикл
      for (let i = 0; i < columns; i++) {
        const y = drops[i] * fontSize;
        const charIndex = Math.floor(Math.random() * charLength);
        ctx.fillText(chars[charIndex], i * fontSize, y);
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      
      animationId = requestAnimationFrame(draw);
    }
    
    resize();
    // Debounce для resize
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (animationId) cancelAnimationFrame(animationId);
        resize();
        draw();
      }, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });
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
    loadPage,
    updateActiveLink,
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
// === DRAGGABLE PLAYER WITH LINUX-LIKE WOBBLE EFFECT ===
const player = document.querySelector('.audio-player-container');

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

let lastX = 0;
let lastY = 0;
let lastTime = 0;

// Элементы, по которым drag НЕ запускается
const blockDragSelectors = [
    ".play-btn",
    ".progress-container",
    ".volume-slider",
    ".time-display"
];

function canStartDrag(e) {
    return !blockDragSelectors.some(sel => e.target.closest(sel));
}

// Ограничиваем только по X, но НЕ ограничиваем по Y
function clamp(x, y) {
    const rect = player.getBoundingClientRect();

    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    return {
        x: Math.min(Math.max(0, x), maxX),
        y: Math.min(Math.max(0, y), maxY)
    };
}


// ========= LINUX “WOBBLE” ==========
function applyWobble(dx, dy) {
    // dx/dy = разница между текущей и предыдущей позицией
    const maxTilt = 4;        // максимальный наклон
    const maxStretch = 0.06;  // максимум растягивания 6%

    // Рассчитываем скорость
    const speed = Math.sqrt(dx*dx + dy*dy);

    // Нормируем от 0 до 1
    const power = Math.min(speed / 25, 1);

    // Растяжение
    const scaleX = 1 + maxStretch * power;
    const scaleY = 1 - maxStretch * power;

    // Наклон в сторону движения
    const angle = maxTilt * power * (dx > 0 ? 1 : -1);

    player.style.transform = `scale(${scaleX}, ${scaleY}) rotate(${angle}deg)`;
}

// Сбрасываем эффект
function resetWobble() {
    player.style.transition = "transform .25s ease";
    player.style.transform = "scale(1) rotate(0deg)";
    setTimeout(() => player.style.transition = "", 250);
}

// START
function startDrag(cx, cy, e) {
    if (!canStartDrag(e)) return;

    const rect = player.getBoundingClientRect();

    offsetX = cx - rect.left;
    offsetY = cy - rect.top;

    lastX = rect.left;
    lastY = rect.top;
    lastTime = performance.now();
    player.style.bottom = "auto";
    player.style.right = "auto";
    player.style.position = "fixed";


    isDragging = true;

    document.body.style.userSelect = "none";

    // ВАЖНО: отключаем bottom/right чтобы не тянуло вверх
    player.style.bottom = "auto";
    player.style.right = "auto";
    player.style.position = "fixed";

    // эффект при начале движения
    player.style.transform = "scale(1.07)";
}


// MOVE
function moveDrag(cx, cy) {
    if (!isDragging) return;

    const newX = cx - offsetX;
    const newY = cy - offsetY;

    const pos = clamp(newX, newY);

    // Скорость движения
    const now = performance.now();
    const dt = now - lastTime || 1;

    const dx = pos.x - lastX;
    const dy = pos.y - lastY;

    // Применяем wobble-анимацию
    applyWobble(dx, dy);

    player.style.left = pos.x + "px";
    player.style.top = pos.y + "px";

    lastX = pos.x;
    lastY = pos.y;
    lastTime = now;
}

// END
function endDrag() {
    if (!isDragging) return;

    isDragging = false;
    document.body.style.userSelect = "";

    resetWobble();
}

// DESKTOP
player.addEventListener("mousedown", e => {
    startDrag(e.clientX, e.clientY, e);
});
document.addEventListener("mousemove", e => moveDrag(e.clientX, e.clientY));
document.addEventListener("mouseup", endDrag);

// MOBILE
player.addEventListener("touchstart", e => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY, e);
}, { passive: true });

document.addEventListener("touchmove", e => {
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
}, { passive: true });

document.addEventListener("touchend", endDrag);



