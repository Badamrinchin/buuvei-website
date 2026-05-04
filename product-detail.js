(function () {
  const ui = {
    mn: {
      back: '← Буцах',
      notFoundTitle: 'Бүтээгдэхүүн олдсонгүй',
      notFoundName: 'Мэдээлэл олдсонгүй',
      notFoundDesc: 'Уучлаарай, энэ бүтээгдэхүүний мэдээлэл олдсонгүй. Буцах холбоосоор ангилал руу буцаж орно уу.',
      toggleAria: 'Англи хэл рүү шилжүүлэх',
      customizeTitle: 'Зураг оруулах',
      customizeHint: '4-5 зураг оруулах боломжтой.',
      customizeLabel: 'Нэмэлт тайлбар',
      customizePlaceholder: 'Тайлбар, нэр, хүссэн өнгө эсвэл нэмэлт шаардлагаа бичнэ үү...',
      selectedCount: 'Сонгосон зураг: ',
      tooMany: '5-аас их зураг сонгох боломжгүй. Эхний 5 зураг үлдээлээ.',
      quote: 'Энэ бүтээгдэхүүн маш зөөлөн мэдрэмжтэй, өдөр тутам хэрэглэхэд эвтэйхэн бөгөөд байгалийн материалтай тул хэрэглэхэд таатай.',
      bullet1: 'Хонины нэхий, Акрил хослол.',
      bullet2: 'Та дугаараа өгөөд захиалгаар хийлгүүлээрэй.',
      bullet3: '1-2 хоногт бэлэн болно.',
      gift: 'Захиалга бүрт жижиг бэлэг дагалдана',
      reviews: '★★★★★ 10 сэтгэгдэл',
      miniSubtitle: 'Бүх захиалгад үнэгүй хүргэлттэй',
      addCart: 'Сагсанд нэмэх • 39,000₮',
      buy: 'Шууд худалдаж авах',
      morePayment: 'Бусад төлбөрийн сонголт'
    },
    en: {
      back: '← Back',
      notFoundTitle: 'Product Not Found',
      notFoundName: 'No Information',
      notFoundDesc: 'Sorry, this product information could not be found. Use the back link to return to the category.',
      toggleAria: 'Switch to Mongolian',
      customizeTitle: 'Upload Images',
      customizeHint: 'You can upload 4-5 images.',
      customizeLabel: 'Additional Notes',
      customizePlaceholder: 'Write details such as name, preferred color, or extra requirements...',
      selectedCount: 'Selected images: ',
      tooMany: 'You can select up to 5 images. Keeping the first 5 files.',
      quote: 'This product feels soft and premium, easy for daily use, and comfortable thanks to natural materials.',
      bullet1: 'Sheepskin and acrylic combination.',
      bullet2: 'Provide your number and order it.',
      bullet3: 'Ready in 1-2 days.',
      gift: 'A small gift is included with every order',
      reviews: '★★★★★ 10 reviews',
      miniSubtitle: 'Free shipping on all orders',
      addCart: 'ADD TO CART • $14.00',
      buy: 'Buy Now',
      morePayment: 'More payment options'
    }
  };

  const params = new URLSearchParams(window.location.search);
  const catalog = window.PRODUCT_CATALOG || {};

  let slug = (params.get('cat') || '').trim();
  let itemId = (params.get('item') || '').trim();

  function findItemLocationById(targetId) {
    const keys = Object.keys(catalog);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const current = catalog[key];
      if (!current || !Array.isArray(current.items)) {
        continue;
      }
      const found = current.items.find(function (entry) {
        return entry && entry.id === targetId;
      });
      if (found) {
        return { slug: key, item: found };
      }
    }
    return null;
  }

  if (!slug && !itemId) {
    const rememberedSlug = window.localStorage.getItem('last-selected-category') || '';
    if (rememberedSlug && catalog[rememberedSlug] && Array.isArray(catalog[rememberedSlug].items) && catalog[rememberedSlug].items.length) {
      slug = rememberedSlug;
      itemId = window.localStorage.getItem('last-selected-item:' + rememberedSlug) || catalog[rememberedSlug].items[0].id;
    }
  }

  if (!slug && itemId) {
    const location = findItemLocationById(itemId);
    if (location) {
      slug = location.slug;
    }
  }

  if (slug && !itemId && catalog[slug] && Array.isArray(catalog[slug].items) && catalog[slug].items.length) {
    itemId = window.localStorage.getItem('last-selected-item:' + slug) || catalog[slug].items[0].id;
  }

  let category = catalog[slug];
  let item = category && Array.isArray(category.items)
    ? category.items.find(function (entry) { return entry.id === itemId; })
    : null;

  if (!item && itemId) {
    const location = findItemLocationById(itemId);
    if (location) {
      slug = location.slug;
      category = catalog[slug];
      item = location.item;
    }
  }

  if (slug) {
    window.localStorage.setItem('last-selected-category', slug);
    if (itemId) {
      window.localStorage.setItem('last-selected-item:' + slug, itemId);
    }
  }

  if (slug && itemId) {
    const canonical = 'cat=' + encodeURIComponent(slug) + '&item=' + encodeURIComponent(itemId);
    if (window.location.search.replace(/^\?/, '') !== canonical) {
      window.history.replaceState({}, '', 'product-detail.html?' + canonical);
    }
  }

  const title = document.getElementById('detail-title');
  const name = document.getElementById('detail-name');
  const description = document.getElementById('detail-description');
  const image = document.getElementById('detail-image');
  const detailCard = document.getElementById('detail-card');
  const back = document.getElementById('back-to-category');
  const toggleButton = document.getElementById('page-lang-toggle');
  const toggleLabel = document.getElementById('page-lang-label');
  const showcaseLayout = document.getElementById('showcase-layout');
  const showcaseMainImage = document.getElementById('showcase-main-image');
  const showcaseThumbs = document.getElementById('showcase-thumbs');
  const showcaseQuote = document.getElementById('showcase-quote');
  const showcaseBullets = document.getElementById('showcase-bullets');
  const showcaseGift = document.getElementById('showcase-gift');
  const showcaseReviews = document.getElementById('showcase-reviews');

  const galleryPrev = document.getElementById('gallery-prev');
  const galleryNext = document.getElementById('gallery-next');
  const customizeSection = document.getElementById('customize-section');
  const customizeTitle = document.getElementById('customize-title');
  const customizeHint = document.getElementById('customize-hint');
  const customizeInput = document.getElementById('customize-images');
  const customizeStatus = document.getElementById('customize-status');
  const customizePreview = document.getElementById('customize-preview');
  const customizeNoteLabel = document.getElementById('customize-note-label');
  const customizeNote = document.getElementById('customize-note');
  const showcaseProductName = document.getElementById('showcase-product-name');
  const showcasePriceEl = document.getElementById('showcase-price');
  const showcaseSizesWrap = document.getElementById('showcase-sizes-wrap');
  const showcaseSizesEl = document.getElementById('showcase-sizes');
  const showcaseSizeLabel = document.getElementById('showcase-size-label');
  const showcaseColorsWrap = document.getElementById('showcase-colors-wrap');
  const showcaseColorsEl = document.getElementById('showcase-colors');
  const showcaseColorLabel = document.getElementById('showcase-color-label');
  const showcasePatternsWrap = document.getElementById('showcase-patterns-wrap');
  const showcasePatternsEl = document.getElementById('showcase-patterns');
  const showcasePatternLabel = document.getElementById('showcase-pattern-label');

  let language = window.localStorage.getItem('site-language') || 'mn';
  let selectedFiles = [];
  let galleryImages = [];
  let galleryIndex = 0;

  function isAccessoryCustomItem() {
    if (!category || !item) {
      return false;
    }
    if (slug !== 'aksesuar') {
      return false;
    }
    return item.id === 'acc-carnumber' || item.id === 'acc-ger-tavag';
  }

  function isShowcaseItem() {
    if (!category || !item) {
      return false;
    }
    if (isAccessoryCustomItem()) {
      return true;
    }
    return item.useShowcase === true;
  }

  function syncPreviews() {
    if (!customizePreview || !customizeStatus) {
      return;
    }

    const copy = ui[language] || ui.mn;
    customizePreview.innerHTML = '';

    selectedFiles.forEach(function (file) {
      const imageNode = document.createElement('img');
      imageNode.alt = file.name;
      imageNode.src = URL.createObjectURL(file);
      imageNode.addEventListener('load', function () {
        URL.revokeObjectURL(imageNode.src);
      });
      customizePreview.appendChild(imageNode);
    });

    customizeStatus.textContent = copy.selectedCount + selectedFiles.length;
  }

  function updateShowcaseGallery() {
    if (!showcaseMainImage || !showcaseThumbs || !galleryImages.length) {
      return;
    }

    showcaseMainImage.src = galleryImages[galleryIndex];
    showcaseMainImage.alt = pickText(item, 'name', 'name_en');

    showcaseThumbs.innerHTML = galleryImages.map(function (src, index) {
      return (
        '<button class="thumb-btn' + (index === galleryIndex ? ' active' : '') + '" type="button" data-index="' + index + '">' +
          '<img src="' + src + '" alt="thumbnail ' + (index + 1) + '">' +
        '</button>'
      );
    }).join('');

    const thumbButtons = showcaseThumbs.querySelectorAll('.thumb-btn');
    thumbButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const nextIndex = Number(button.dataset.index || 0);
        if (!Number.isNaN(nextIndex)) {
          galleryIndex = nextIndex;
          updateShowcaseGallery();
        }
      });
    });
  }

  function renderShowcase(copy) {
    if (!showcaseLayout || !item) {
      return;
    }

    const itemTitle = pickText(item, 'name', 'name_en');
    const gallerySource = Array.isArray(item.gallery) && item.gallery.length ? item.gallery : [item.image];
    galleryImages = gallerySource.slice(0, 5);
    galleryIndex = 0;

    showcaseLayout.classList.remove('hidden');
    if (detailCard) {
      detailCard.classList.add('hidden');
    }

    // product name & price
    if (showcaseProductName) {
      showcaseProductName.textContent = itemTitle;
    }
    if (showcasePriceEl) {
      const priceText = language === 'en' ? (item.price_en || item.price || '') : (item.price || '');
      showcasePriceEl.textContent = priceText;
      showcasePriceEl.classList.toggle('hidden', !priceText);
    }

    // sizes
    if (showcaseSizesWrap && showcaseSizesEl) {
      const sizes = Array.isArray(item.sizes) ? item.sizes : [];
      if (sizes.length) {
        showcaseSizesEl.innerHTML = sizes.map(function (s, i) {
          return '<button class="size-pill' + (i === 0 ? ' active' : '') + '" type="button">' + s + '</button>';
        }).join('');
        if (showcaseSizeLabel) {
          showcaseSizeLabel.textContent = language === 'en' ? 'Size:' : 'Хэмжээ:';
        }
        showcaseSizesWrap.classList.remove('hidden');
        showcaseSizesEl.querySelectorAll('.size-pill').forEach(function (btn) {
          btn.addEventListener('click', function () {
            showcaseSizesEl.querySelectorAll('.size-pill').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
          });
        });
      } else {
        showcaseSizesWrap.classList.add('hidden');
      }
    }

    // colors
    if (showcaseColorsWrap && showcaseColorsEl) {
      const colors = Array.isArray(item.colors) ? item.colors : [];
      const colorImages = Array.isArray(item.colorImages) ? item.colorImages : [];
      if (colors.length) {
        showcaseColorsEl.innerHTML = colors.map(function (c, i) {
          const img = colorImages[i] || '';
          if (img) {
            return '<button class="color-swatch' + (i === 0 ? ' active' : '') + '" type="button" title="' + c + '" aria-label="' + c + '"><img src="' + img + '" alt="' + c + '"><span class="color-swatch-label">' + c + '</span></button>';
          }
          return '<button class="color-pill' + (i === 0 ? ' active' : '') + '" type="button">' + c + '</button>';
        }).join('');
        if (showcaseColorLabel) {
          showcaseColorLabel.textContent = language === 'en' ? 'Color:' : 'Өнгө:';
        }
        showcaseColorsWrap.classList.remove('hidden');
        showcaseColorsEl.querySelectorAll('.color-pill, .color-swatch').forEach(function (btn) {
          btn.addEventListener('click', function () {
            showcaseColorsEl.querySelectorAll('.color-pill, .color-swatch').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
          });
        });
      } else {
        showcaseColorsWrap.classList.add('hidden');
      }
    }

    // patterns
    if (showcasePatternsWrap && showcasePatternsEl) {
      const patterns = Array.isArray(item.patterns) ? item.patterns : [];
      if (patterns.length) {
        showcasePatternsEl.innerHTML = patterns.map(function (p, i) {
          return '<button class="color-pill' + (i === 0 ? ' active' : '') + '" type="button">' + p + '</button>';
        }).join('');
        if (showcasePatternLabel) {
          showcasePatternLabel.textContent = language === 'en' ? 'Pattern:' : 'Хээ:';
        }
        showcasePatternsWrap.classList.remove('hidden');
        showcasePatternsEl.querySelectorAll('.color-pill').forEach(function (btn) {
          btn.addEventListener('click', function () {
            showcasePatternsEl.querySelectorAll('.color-pill').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
          });
        });
      } else {
        showcasePatternsWrap.classList.add('hidden');
      }
    }

    // bullets — use item-level bullets if present, else fall back to global copy
    const customBullets = [1, 2, 3, 4].map(function (index) {
      return pickText(item, 'item_bullet' + index, 'item_bullet' + index + '_en');
    }).filter(Boolean);

    const fallbackBullets = [copy.bullet1, copy.bullet2, copy.bullet3].filter(Boolean);
    const bullets = customBullets.length ? customBullets : fallbackBullets;

    showcaseBullets.innerHTML = bullets.map(function (line) {
      return '<li>' + line + '</li>';
    }).join('');
    updateShowcaseGallery();
  }

  function hideShowcase() {
    if (showcaseLayout) {
      showcaseLayout.classList.add('hidden');
    }
    if (detailCard) {
      detailCard.classList.remove('hidden');
    }
  }

  function pickText(entry, mnKey, enKey) {
    if (language === 'en') {
      return entry[enKey] || entry[mnKey] || '';
    }
    return entry[mnKey] || entry[enKey] || '';
  }

  function render() {
    const copy = ui[language] || ui.mn;
    document.documentElement.lang = language;

    if (toggleLabel) {
      toggleLabel.textContent = language === 'mn' ? 'EN' : 'MN';
    }

    if (toggleButton) {
      toggleButton.setAttribute('aria-label', copy.toggleAria);
    }

    back.textContent = copy.back;
    back.href = category ? ('category.html?cat=' + encodeURIComponent(slug)) : 'index.html';

    if (!category || !item) {
      hideShowcase();
      title.textContent = copy.notFoundTitle;
      name.textContent = copy.notFoundName;
      description.textContent = copy.notFoundDesc;
      image.src = 'images/nehii-olbog.jpg';
      image.alt = copy.notFoundName;
      if (customizeSection) {
        customizeSection.classList.add('hidden');
      }
      return;
    }

    title.textContent = pickText(category, 'title', 'title_en');
    name.textContent = pickText(item, 'name', 'name_en');
    description.textContent = pickText(item, 'description', 'description_en');
    image.src = item.image;
    image.alt = pickText(item, 'name', 'name_en');

    if (isShowcaseItem()) {
      renderShowcase(copy);
    } else {
      hideShowcase();
    }

    if (customizeSection) {
      customizeSection.classList.add('hidden');
    }
  }

  if (customizeInput) {
    customizeInput.addEventListener('change', function (event) {
      const files = Array.prototype.slice.call(event.target.files || []);
      const copy = ui[language] || ui.mn;

      if (files.length > 5) {
        selectedFiles = files.slice(0, 5);
        if (customizeStatus) {
          customizeStatus.textContent = copy.tooMany;
        }
      } else {
        selectedFiles = files;
      }

      syncPreviews();
    });
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', function () {
      language = language === 'mn' ? 'en' : 'mn';
      window.localStorage.setItem('site-language', language);
      render();
    });
  }

  if (galleryPrev) {
    galleryPrev.addEventListener('click', function () {
      if (!galleryImages.length) {
        return;
      }
      galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
      updateShowcaseGallery();
    });
  }

  if (galleryNext) {
    galleryNext.addEventListener('click', function () {
      if (!galleryImages.length) {
        return;
      }
      galleryIndex = (galleryIndex + 1) % galleryImages.length;
      updateShowcaseGallery();
    });
  }

  render();
})();
