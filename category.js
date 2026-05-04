(function () {
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const ui = {
    mn: {
      backHome: '← Нүүр хуудас',
      itemSuffix: 'бүтээгдэхүүн',
      notFoundTitle: 'Ангилал олдсонгүй',
      notFoundText: 'Уучлаарай, энэ ангиллын мэдээлэл олдсонгүй. Нүүр хуудас руу буцаж дахин сонгоно уу.',
      toggleAria: 'Англи хэл рүү шилжүүлэх'
    },
    en: {
      backHome: '← Home',
      itemSuffix: 'items',
      notFoundTitle: 'Category Not Found',
      notFoundText: 'Sorry, this category could not be found. Please return to the home page and try again.',
      toggleAria: 'Switch to Mongolian'
    }
  };

  function resolveSlug() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('cat') || params.get('category') || '';
    if (fromQuery) {
      const querySlug = decodeURIComponent(fromQuery).trim();
      if (querySlug) {
        window.localStorage.setItem('last-selected-category', querySlug);
      }
      return querySlug;
    }

    const hash = (window.location.hash || '').replace(/^#/, '').trim();
    if (hash) {
      return decodeURIComponent(hash);
    }

    const parts = window.location.pathname.split('/').filter(Boolean);
    const last = parts.length ? parts[parts.length - 1] : '';
    if (last && last !== 'category' && last !== 'category.html') {
      const pathSlug = decodeURIComponent(last);
      if (pathSlug) {
        window.localStorage.setItem('last-selected-category', pathSlug);
      }
      return pathSlug;
    }

    // Fallback for clean URL like /category with no query.
    return window.localStorage.getItem('last-selected-category') || 'nehii-olbog';
  }

  const slug = resolveSlug();
  const catalog = window.PRODUCT_CATALOG || {};
  const category = catalog[slug];

  const titleEl = document.getElementById('category-title');
  const subtitleEl = document.getElementById('category-subtitle');
  const grid = document.getElementById('poster-grid');
  const backLink = document.getElementById('back-home-link');
  const toggleButton = document.getElementById('page-lang-toggle');
  const toggleLabel = document.getElementById('page-lang-label');

  let language = window.localStorage.getItem('site-language') || 'mn';

  function pickText(entry, mnKey, enKey) {
    if (language === 'en') {
      return entry[enKey] || entry[mnKey] || '';
    }
    return entry[mnKey] || entry[enKey] || '';
  }

  function render() {
    const copy = ui[language] || ui.mn;
    document.documentElement.lang = language;

    if (backLink) {
      backLink.textContent = copy.backHome;
    }

    if (toggleLabel) {
      toggleLabel.textContent = language === 'mn' ? 'EN' : 'MN';
    }

    if (toggleButton) {
      toggleButton.setAttribute('aria-label', copy.toggleAria);
    }

    if (!category || !Array.isArray(category.items)) {
      titleEl.textContent = copy.notFoundTitle;
      subtitleEl.textContent = '';
      grid.innerHTML = '<div class="notice">' + escapeHtml(copy.notFoundText) + '</div>';
      return;
    }

    const categoryName = pickText(category, 'title', 'title_en');
    titleEl.textContent = categoryName;
    subtitleEl.textContent = category.items.length + ' ' + copy.itemSuffix;

    grid.innerHTML = category.items.map(function (item) {
      const name = escapeHtml(pickText(item, 'name', 'name_en'));
      const image = escapeHtml(item.image);
      const href = 'product-detail.html?cat=' + encodeURIComponent(slug) + '&item=' + encodeURIComponent(item.id);
      const itemId = escapeHtml(item.id);

      return (
        '<a class="poster-card" data-slug="' + escapeHtml(slug) + '" data-item-id="' + itemId + '" href="' + href + '">' +
          '<img src="' + image + '" alt="' + name + '">' +
          '<h3>' + name + '</h3>' +
        '</a>'
      );
    }).join('');
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', function () {
      language = language === 'mn' ? 'en' : 'mn';
      window.localStorage.setItem('site-language', language);
      render();
    });
  }

  if (grid) {
    grid.addEventListener('click', function (event) {
      const link = event.target.closest('a.poster-card[data-slug][data-item-id]');
      if (!link) {
        return;
      }

      const selectedSlug = link.getAttribute('data-slug') || '';
      const selectedItemId = link.getAttribute('data-item-id') || '';
      if (selectedSlug) {
        window.localStorage.setItem('last-selected-category', selectedSlug);
      }
      if (selectedSlug && selectedItemId) {
        window.localStorage.setItem('last-selected-item:' + selectedSlug, selectedItemId);
      }
    });
  }

  render();
})();
