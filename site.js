(function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const siteHeader = document.querySelector('.site-header');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const searchButtons = document.querySelectorAll('.header-search');
  const langToggle = document.getElementById('lang-toggle');
  const langToggleLabel = document.getElementById('lang-toggle-label');

  const state = {
    language: 'mn',
    products: [],
    news: [],
    settings: null
  };

  const defaults = {
    products: [
      { title_mn: 'Нэхий олбог', title_en: 'Sheepskin Seat Pad', image_url: 'images/nehii-olbog.jpg', badge: '' },
      { title_mn: 'Буйдангийн бүтээлэг', title_en: 'Sofa Cover', image_url: 'images/18060.png', badge: '' },
      { title_mn: 'Үхрийн хөм', title_en: 'Cowhide Rug', image_url: 'images/cow-hide.jpg', badge: '' },
      { title_mn: 'Аксессуар', title_en: 'Accessories', image_url: 'images/mousepad.jpg', badge: '' },
      { title_mn: 'Машины суудлын бүрээс', title_en: 'Car Seat Cover', image_url: 'images/seatcover.jpg', badge: '' },
      { title_mn: 'Бэлгийн багц', title_en: 'Gift Set', image_url: 'images/gift.jpg', badge: '' }
    ],
    news: [
      {
        title_mn: 'Монголын хамгийн том нэхий олбог',
        title_en: 'Mongolia\'s Largest Sheepskin Rug',
        date_text: '2026.05.14',
        summary_mn: '7*10м-ийн хэмжээтэй хонины нэхий олбог.',
        summary_en: 'A 7*10m size sheepskin rug.',
        image_url: 'images/NEWS2.jpg',
        link_url: 'news-sheepskin-video-reel.html'
      },
      {
        title_mn: 'Хонины нэхийний ач тус',
        title_en: 'Benefits of Sheepskin',
        date_text: '2026.03.28',
        summary_mn: 'Шинээр төрсөн хүүхдийг яагаад нэхий өлгийнд өлгийддөг байсан бэ?',
        summary_en: 'Why were newborn babies traditionally swaddled in sheepskin cradles?',
        image_url: 'images/achtus.jpg',
        link_url: 'news-sheepskin-benefits.html'
      },
      {
        title_mn: 'Хонины нэхийг хэрхэн гоё болгодог вэ?',
        title_en: 'How Is Sheepskin Beautified?',
        date_text: '2026.04.26',
        summary_mn: 'Хонины нэхийг хэрхэн гоё болгодог вэ?',
        summary_en: 'How is sheepskin beautified?',
        image_url: 'images/news1.jpg',
        link_url: 'news-sheepskin-video.html'
      }
    ],
    settings: {
      mission_text_mn: 'Үеэс үед өвлөгдөх үслэг бүтээгдэхүүнийг урлана.',
      mission_text_en: 'We craft fur products that can be cherished across generations.',
      address_text_mn: 'Улаанбаатар хот, Хан-Уул дүүрэг, 20-р хороо, Мишээл экспо, Little Venice худалдааны төв, R6 тоот',
      address_text_en: 'R6, Little Venice Trade Center, Misheel Expo, 20th khoroo, Khan-Uul district, Ulaanbaatar'
    }
  };

  const translations = {
    mn: {
      navAbout: 'Бидний тухай',
      navCare: 'Цэвэрлэгээний заавар',
      mobileContact: 'Холбоо барих',
      productsTitle: 'Бүтээгдэхүүн',
      newsTitle: 'Сүүлийн мэдээ',
      missionHeading: 'Бидний зорилго',
      contactHeading: 'Холбоо барих',
      mapHeading: 'Google Map байршил',
      phoneLabel: 'Утас: ',
      hoursLabel: 'Цагийн хуваарь',
      hoursValue: 'Өдөр бүр 11:00-19:00 цаг',
      readMore: 'Дэлгэрэнгүй →',
      menuAria: 'Цэс нээх',
      categoryAriaSuffix: 'ангилал руу орох'
    },
    en: {
      navAbout: 'About Us',
      navCare: 'Care Guide',
      mobileContact: 'Contact',
      productsTitle: 'Products',
      newsTitle: 'Latest News',
      missionHeading: 'Our Mission',
      contactHeading: 'Contact',
      mapHeading: 'Google Map Location',
      phoneLabel: 'Phone: ',
      hoursLabel: 'Opening Hours',
      hoursValue: 'Every day 11:00-19:00',
      readMore: 'Read more →',
      menuAria: 'Open menu',
      categoryAriaSuffix: 'open category'
    }
  };

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  }

  function runSearch() {
    const searchPrompt = state.language === 'en' ? 'Search on this page' : 'Энэ хуудсаас хайх';
    const notFoundText = state.language === 'en' ? 'No matching text was found.' : 'Тохирох мэдээлэл олдсонгүй.';
    const query = window.prompt(searchPrompt, '');
    if (!query) {
      return;
    }

    let found = false;
    if (typeof window.find === 'function') {
      found = window.find(query, false, false, true, false, false, false);
    }

    if (!found) {
      window.alert(notFoundText);
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getCategorySlugByTitle(title) {
    const normalized = String(title || '').trim().toLowerCase();
    if (normalized.includes('буйдангийн бүтээлэг') || normalized.includes('sofa cover')) {
      return 'buidangiin-buteeleg';
    }
    if (normalized.includes('нэхий олбог') || normalized.includes('sheepskin')) {
      return 'nehii-olbog';
    }
    const map = {
      'Нэхий олбог': 'nehii-olbog',
      'Sheepskin Seat Pad': 'nehii-olbog',
      'Буйдангийн бүтээлэг': 'buidangiin-buteeleg',
      'Sofa Cover': 'buidangiin-buteeleg',
      'Үхрийн шир': 'ukhriin-khom',
      'Үхрийн хөм': 'ukhriin-khom',
      'Cowhide Rug': 'ukhriin-khom',
      'Аксессуар': 'aksesuar',
      'Accessories': 'aksesuar',
      'Аксесуар': 'aksesuar',
      'Аксесор': 'aksesuar',
      'Accessory': 'aksesuar',
      'Машины суудлын бүрээс': 'mashiny-suudal-burees',
      'Car Seat Cover': 'mashiny-suudal-burees',
      'Бэлгийн багц': 'belgiin-bagts',
      'Gift Set': 'belgiin-bagts'
    };
    if (map[title]) {
      return map[title];
    }

    for (const key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key) && key.toLowerCase() === normalized) {
        return map[key];
      }
    }

    return null;
  }

  function getCategorySlugFallback(item) {
    const image = String(item.image_url || item.image || '').toLowerCase();
    if (image.includes('mousepad') || image.includes('carnumber') || image.includes('ger')) {
      return 'aksesuar';
    }
    if (image.includes('seatcover') || image.includes('car-seat')) {
      return 'mashiny-suudal-burees';
    }
    if (image.includes('sofa') || image.includes('18060') || image.includes('shootoi')) {
      return 'buidangiin-buteeleg';
    }
    if (image.includes('cow-hide') || image.includes('cowhide')) {
      return 'ukhriin-khom';
    }
    if (image.includes('nehii')) {
      return 'nehii-olbog';
    }
    return null;
  }

  function mergeProductsWithDefaults(rows) {
    const incoming = Array.isArray(rows) ? rows.slice() : [];
    const hasByTitle = new Set(
      incoming.map((item) => {
        const mn = (item.title_mn || item.title || '').trim();
        const en = (item.title_en || '').trim();
        return mn + '|' + en;
      })
    );

    defaults.products.forEach((baseItem) => {
      const key = (baseItem.title_mn || '').trim() + '|' + (baseItem.title_en || '').trim();
      if (!hasByTitle.has(key)) {
        incoming.push(baseItem);
      }
    });

    return incoming;
  }

  function mergeNewsWithDefaults(rows) {
    const incoming = Array.isArray(rows) ? rows.slice() : [];
    const hasByLink = new Set(
      incoming.map((item) => String(item.link_url || '').trim().toLowerCase()).filter(Boolean)
    );

    defaults.news.forEach((baseItem) => {
      const key = String(baseItem.link_url || '').trim().toLowerCase();
      if (!key || !hasByLink.has(key)) {
        incoming.push(baseItem);
      }
    });

    return incoming;
  }

  function pickLocalized(item, mnKey, enKey) {
    if (state.language === 'en') {
      return item[enKey] || item[mnKey] || '';
    }
    return item[mnKey] || item[enKey] || '';
  }

  function renderProducts(rows) {
    const target = document.getElementById('products-grid');
    if (!target || !rows.length) {
      return;
    }

    const copy = translations[state.language];

    target.innerHTML = rows.map((item) => {
      const displayTitle = pickLocalized(item, 'title_mn', 'title_en') || item.title || '';
      const title = escapeHtml(displayTitle);
      const rawImage = item.image_url || item.image || '';
      const isMainSofaCover = /Буйдангийн бүтээлэг|Sofa Cover/i.test(displayTitle) || /Буйдангийн бүтээлэг|Sofa Cover/i.test(item.title || '');
      const resolvedImage = isMainSofaCover ? 'images/18060.png' : (rawImage || 'images/nehii-olbog.jpg');
      const image = escapeHtml(resolvedImage);
      const badgeValue = pickLocalized(item, 'badge_mn', 'badge_en') || item.badge || '';
      const badge = badgeValue ? '<span class="badge">' + escapeHtml(badgeValue) + '</span>' : '';
      const slug = getCategorySlugByTitle(displayTitle) || getCategorySlugByTitle(item.title || '') || getCategorySlugFallback(item);
      const link = slug ? ('category.html?cat=' + encodeURIComponent(slug)) : '#';

      return (
        '<div class="card">' +
          '<a href="' + link + '" class="product-card-link" aria-label="' + title + ' ' + escapeHtml(copy.categoryAriaSuffix) + '">' +
            '<div class="card-media">' +
              '<img src="' + image + '" alt="' + title + '">' +
              '<h3>' + title + '</h3>' +
            '</div>' +
          '</a>' +
          badge +
        '</div>'
      );
    }).join('');
  }

  function renderNews(rows) {
    const target = document.getElementById('news-grid');
    if (!target || !rows.length) {
      return;
    }

    const copy = translations[state.language];

    target.innerHTML = rows.filter((item) => {
      const title = String(item.title_mn || item.title_en || item.title || '');
      return !/Интерьер тренд 2026|Interior Trend 2026|Шинэ коллекц танилцуулга|New Collection Launch/i.test(title);
    }).map((item) => {
      const displayTitle = pickLocalized(item, 'title_mn', 'title_en') || item.title || '';
      const displaySummary = pickLocalized(item, 'summary_mn', 'summary_en') || item.summary || '';
      const rawImage = item.image_url || '';
      const isPlaceholderImage = rawImage.indexOf('via.placeholder.com') !== -1;
      const isNewCollectionTitle = /Шинэ коллекц танилцуулга|New Collection Launch/i.test(displayTitle) || /Шинэ коллекц танилцуулга|New Collection Launch/i.test(item.title || '');
      const isSheepskinBenefits = /Нэхий арчлах зөвлөгөө|Sheepskin Care Tips|Хонины нэхийний ач тус|Benefits of Sheepskin/i.test(displayTitle) || /Нэхий арчлах зөвлөгөө|Sheepskin Care Tips|Хонины нэхийний ач тус|Benefits of Sheepskin/i.test(item.title || '');
      let normalizedTitle = displayTitle;
      if (isNewCollectionTitle) {
        normalizedTitle = state.language === 'en' ? 'New Collection Launch' : 'Шинэ коллекц танилцуулга';
      }
      if (isSheepskinBenefits) {
        normalizedTitle = state.language === 'en' ? 'Benefits of Sheepskin' : 'Хонины нэхийний ач тус';
      }
      const title = escapeHtml(normalizedTitle);
      const hasVideoEmbed = Boolean(item.video_embed_url);
      const resolvedImage = isNewCollectionTitle && (!rawImage || isPlaceholderImage)
        ? 'images/newcollection.jpg'
        : (isSheepskinBenefits ? 'images/achtus.jpg' : (rawImage || 'https://via.placeholder.com/400x250'));
      const image = escapeHtml(resolvedImage);
      let normalizedSummary = displaySummary;
      if (isNewCollectionTitle) {
        normalizedSummary = state.language === 'en'
          ? 'Our new natural design collection is now available.'
          : 'Байгалийн шинэ загварууд танилцуулагдлаа.';
      }
      if (isSheepskinBenefits) {
        normalizedSummary = state.language === 'en'
          ? 'Why were newborn babies traditionally swaddled in sheepskin cradles?'
          : 'Шинээр төрсөн хүүхдийг яагаад нэхий өлгийнд өлгийддөг байсан бэ?';
      }
      const summary = escapeHtml(normalizedSummary);
      const date = escapeHtml(item.date_text || '');
      const hasCustomLink = item.link_url && item.link_url !== '#';
      const fallbackLink = isSheepskinBenefits
        ? 'news-sheepskin-benefits.html'
        : (isNewCollectionTitle
          ? 'news-new-collection.html'
          : '#');
      const resolvedLink = hasCustomLink
        ? item.link_url
        : fallbackLink;
      const link = escapeHtml(resolvedLink);
      const embedUrl = escapeHtml(item.video_embed_url || '');
      const mediaHtml = hasVideoEmbed
        ? ('<div class="news-embed">' +
            '<iframe src="' + embedUrl + '" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>' +
          '</div>')
        : ('<a href="' + link + '" class="news-media-link" aria-label="' + title + '">' +
            '<img src="' + image + '" alt="' + title + '">' +
          '</a>');
      const readMoreHtml = resolvedLink !== '#'
        ? ('<a href="' + link + '">' + escapeHtml(copy.readMore) + '</a>')
        : '';
      return (
        '<div class="news-card">' +
          mediaHtml +
          '<h3>' + title + '</h3>' +
          '<p class="date">' + date + '</p>' +
          '<p>' + summary + '</p>' +
          readMoreHtml +
        '</div>'
      );
    }).join('');
  }

  function renderSettings(row) {
    const missionText = document.getElementById('mission-text');
    const addressText = document.getElementById('address-text');
    const phoneLink = document.getElementById('phone-link');
    const mapFrame = document.getElementById('map-frame');
    const copy = translations[state.language];

    const mission = pickLocalized(row || {}, 'mission_text_mn', 'mission_text_en') || row.mission_text || defaults.settings.mission_text_mn;
    const address = pickLocalized(row || {}, 'address_text_mn', 'address_text_en') || row.address_text || defaults.settings.address_text_mn;

    if (missionText) {
      missionText.textContent = mission;
    }
    if (addressText) {
      addressText.textContent = address;
    }
    if (phoneLink) {
      const currentNumber = phoneLink.dataset.phone || phoneLink.href.replace('tel:', '').trim() || '72884488';
      phoneLink.dataset.phone = currentNumber;
      phoneLink.textContent = copy.phoneLabel + currentNumber;
      phoneLink.href = 'tel:' + currentNumber;
    }
    if (mapFrame && row && row.map_embed_url) {
      mapFrame.src = row.map_embed_url;
    }
  }

  function applyLanguage(lang) {
    const safeLang = translations[lang] ? lang : 'mn';
    const copy = translations[safeLang];
    state.language = safeLang;

    document.documentElement.lang = safeLang;
    setText('nav-about', copy.navAbout);
    setText('nav-care', copy.navCare);
    setText('mobile-about', copy.navAbout);
    setText('mobile-care', copy.navCare);
    setText('mobile-contact', copy.mobileContact);
    setText('products-title', copy.productsTitle);
    setText('news-title', copy.newsTitle);
    setText('mission-heading', copy.missionHeading);
    setText('contact-heading', copy.contactHeading);
    setText('map-heading', copy.mapHeading);
    setText('hours-label', copy.hoursLabel);
    setText('hours-value', copy.hoursValue);

    if (menuToggle) {
      menuToggle.setAttribute('aria-label', copy.menuAria);
    }

    renderProducts(state.products.length ? state.products : defaults.products);
    renderNews(state.news.length ? state.news : defaults.news);
    renderSettings(state.settings || defaults.settings);

    if (langToggleLabel) {
      langToggleLabel.textContent = safeLang === 'mn' ? 'EN' : 'MN';
    }

    if (langToggle) {
      langToggle.setAttribute('aria-label', safeLang === 'mn' ? 'Switch to English' : 'Монгол хэл рүү шилжүүлэх');
    }

    window.localStorage.setItem('site-language', safeLang);
  }

  function setupMobilePanelCycle() {
    if (window.innerWidth > 768) return;
    const heroStrip = document.getElementById('hero-strip');
    if (!heroStrip) return;
    const panels = Array.from(heroStrip.querySelectorAll('.panel'));
    if (panels.length < 4) return;

    const groupSize = 3;
    const totalGroups = Math.ceil(panels.length / groupSize);

    // Эхний groupSize панелийн клон нэмж infinite loop хийнэ
    for (var c = 0; c < groupSize; c++) {
      var clone = panels[c].cloneNode(true);
      heroStrip.appendChild(clone);
    }

    const totalCols = panels.length + groupSize;
    heroStrip.style.gridTemplateColumns = 'repeat(' + totalCols + ', 1fr)';
    heroStrip.style.width = (totalCols / groupSize * 100) + '%';
    heroStrip.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
    heroStrip.style.transform = 'translateX(0)';

    const heroEl = heroStrip.parentElement;
    heroEl.style.overflow = 'hidden';
    heroEl.style.position = 'relative';

    let current = 0;

    setInterval(function() {
      current++;
      var offset = -(current * (100 / totalCols) * groupSize);
      heroStrip.style.transform = 'translateX(' + offset + '%)';

      // Клон дээр хүрэхэд transition-гүйгээр буцаана
      if (current === totalGroups) {
        setTimeout(function() {
          heroStrip.style.transition = 'none';
          heroStrip.style.transform = 'translateX(0)';
          current = 0;
          setTimeout(function() {
            heroStrip.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
          }, 50);
        }, 700);
      }
    }, 3000);
  }

  function setupCardAnimation() {
    const cards = document.querySelectorAll('.card');
    if (!cards.length) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('fade-in');
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach((card) => observer.observe(card));
  }

  function renderHeroPanels(rows) {
    const heroStrip = document.getElementById('hero-strip');
    if (!heroStrip || !rows.length) {
      return;
    }

    heroStrip.style.gridTemplateColumns = 'repeat(' + rows.length + ', 1fr)';
    heroStrip.innerHTML = rows.map((item) => {
      const image = escapeHtml(item.image_url);
      return '<div class="panel" style="background-image:url(\'' + image + '\')"></div>';
    }).join('');
  }

  async function loadDynamicContent() {
    const cfg = window.SITE_CONFIG || {};
    if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !window.supabase) {
      setupCardAnimation();
      setupMobilePanelCycle();
      return;
    }

    const client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

    try {
      const [heroRes, productRes, newsRes, settingsRes] = await Promise.all([
        client.from('hero_panels').select('image_url, sort_order').eq('is_active', true).order('sort_order', { ascending: true }),
        client.from('products').select('title, title_mn, title_en, image_url, badge, badge_mn, badge_en, sort_order').eq('is_active', true).order('sort_order', { ascending: true }),
        client.from('news').select('title, title_mn, title_en, image_url, summary, summary_mn, summary_en, date_text, link_url, sort_order').eq('is_active', true).order('sort_order', { ascending: true }),
        client.from('site_settings').select('mission_text, mission_text_mn, mission_text_en, address_text, address_text_mn, address_text_en, phone_text, map_embed_url').limit(1).maybeSingle()
      ]);

      if (!heroRes.error && heroRes.data) {
        renderHeroPanels(heroRes.data);
      }
      if (!productRes.error && productRes.data) {
        state.products = mergeProductsWithDefaults(productRes.data);
      }
      if (!newsRes.error && newsRes.data) {
        state.news = mergeNewsWithDefaults(newsRes.data);
      }
      if (!settingsRes.error && settingsRes.data) {
        state.settings = settingsRes.data;
        if (settingsRes.data.phone_text) {
          const normalizedPhone = settingsRes.data.phone_text.replace(/\s+/g, '');
          const phoneLink = document.getElementById('phone-link');
          if (phoneLink) {
            phoneLink.dataset.phone = normalizedPhone;
          }
        }
      }

      applyLanguage(state.language);
    } catch (err) {
      console.error('Failed to load Supabase content:', err);
    } finally {
      setupCardAnimation();
      setupMobilePanelCycle();
    }
  }

  if (menuToggle && siteHeader) {
    menuToggle.addEventListener('click', () => {
      const isOpen = siteHeader.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        siteHeader.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      applyLanguage(state.language === 'mn' ? 'en' : 'mn');
    });
  }

  searchButtons.forEach((button) => {
    button.addEventListener('click', runSearch);
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="category.html?cat="]');
    if (!link) {
      return;
    }

    const href = link.getAttribute('href') || '';
    const queryIndex = href.indexOf('?');
    if (queryIndex === -1) {
      return;
    }

    const params = new URLSearchParams(href.slice(queryIndex + 1));
    const slug = params.get('cat');
    if (slug) {
      window.localStorage.setItem('last-selected-category', slug);
    }
  });

  applyLanguage(window.localStorage.getItem('site-language') || 'mn');
  loadDynamicContent();
})();
