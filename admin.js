(function () {
  const cfg = window.SITE_CONFIG || {};
  const statusMsg = document.getElementById('status-msg');

  function showStatus(message, type) {
    if (!statusMsg) {
      return;
    }
    statusMsg.textContent = message;
    statusMsg.classList.remove('hidden', 'error', 'success');
    if (type) {
      statusMsg.classList.add(type);
    }
  }

  function clearStatus() {
    if (!statusMsg) {
      return;
    }
    statusMsg.classList.add('hidden');
    statusMsg.textContent = '';
    statusMsg.classList.remove('error', 'success');
  }

  const statusError = (message) => showStatus(message, 'error');

  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !window.supabase) {
    statusError('config.js дээр Supabase тохиргоо хийгээгүй байна.');
    return;
  }

  const client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');

  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');

  const heroForm = document.getElementById('hero-form');

  const productForm = document.getElementById('product-form');
  const productList = document.getElementById('product-list');
  const newProductBtn = document.getElementById('new-product');
  const deleteProductBtn = document.getElementById('delete-product');
  const productSearch = document.getElementById('product-search');
  const productFilterActive = document.getElementById('product-filter-active');
  const productSummary = document.getElementById('product-summary');
  const productImageInput = document.getElementById('product-image');
  const productImagePreview = document.getElementById('product-image-preview');

  const newsForm = document.getElementById('news-form');
  const newsList = document.getElementById('news-list');
  const newNewsBtn = document.getElementById('new-news');
  const deleteNewsBtn = document.getElementById('delete-news');
  const newsSearch = document.getElementById('news-search');
  const newsFilterActive = document.getElementById('news-filter-active');
  const newsSummaryText = document.getElementById('news-summary-text');
  const newsImageInput = document.getElementById('news-image');
  const newsImagePreview = document.getElementById('news-image-preview');

  const settingsForm = document.getElementById('settings-form');

  let productsCache = [];
  let newsCache = [];

  function setAuthView(isLoggedIn) {
    loginView.classList.toggle('hidden', isLoggedIn);
    dashboardView.classList.toggle('hidden', !isLoggedIn);
  }

  function toBool(value) {
    return Boolean(value);
  }

  function setImagePreview(url, previewEl) {
    if (!previewEl) {
      return;
    }

    const value = (url || '').trim();
    if (!value) {
      previewEl.src = '';
      previewEl.classList.add('hidden');
      return;
    }

    previewEl.src = value;
    previewEl.classList.remove('hidden');
  }

  function applyActiveFilter(items, searchTerm, filterValue, titleKey) {
    const term = (searchTerm || '').trim().toLowerCase();

    return items.filter((item) => {
      const title = String(item[titleKey] || '').toLowerCase();
      const matchSearch = !term || title.includes(term);
      const matchActive =
        filterValue === 'all' ||
        (filterValue === 'active' && item.is_active) ||
        (filterValue === 'inactive' && !item.is_active);

      return matchSearch && matchActive;
    });
  }

  function resetProductForm() {
    productForm.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-order').value = 1;
    document.getElementById('product-active').checked = true;
    deleteProductBtn.disabled = true;
    setImagePreview('', productImagePreview);
  }

  function resetNewsForm() {
    newsForm.reset();
    document.getElementById('news-id').value = '';
    document.getElementById('news-link').value = '#';
    document.getElementById('news-order').value = 1;
    document.getElementById('news-active').checked = true;
    deleteNewsBtn.disabled = true;
    setImagePreview('', newsImagePreview);
  }

  async function loadHero() {
    const { data, error } = await client
      .from('hero_panels')
      .select('image_url, sort_order')
      .order('sort_order', { ascending: true });

    if (error) {
      statusError(error.message);
      return;
    }

    const padded = [1, 2, 3, 4, 5].map((idx) => {
      const row = (data || []).find((item) => item.sort_order === idx);
      return row ? row.image_url : '';
    });

    heroForm.panel1.value = padded[0];
    heroForm.panel2.value = padded[1];
    heroForm.panel3.value = padded[2];
    heroForm.panel4.value = padded[3];
    heroForm.panel5.value = padded[4];
  }

  async function saveHero(event) {
    event.preventDefault();

    const payload = [
      heroForm.panel1.value,
      heroForm.panel2.value,
      heroForm.panel3.value,
      heroForm.panel4.value,
      heroForm.panel5.value
    ].map((url, index) => ({
      sort_order: index + 1,
      image_url: url,
      is_active: true
    }));

    const delRes = await client.from('hero_panels').delete().gte('id', 0);
    if (delRes.error) {
      statusError(delRes.error.message);
      return;
    }

    const { error } = await client.from('hero_panels').insert(payload);
    if (error) {
      statusError(error.message);
      return;
    }

    showStatus('Hero panels хадгалагдлаа.', 'success');
  }

  function renderListRow(text, onEdit, isActive) {
    const wrap = document.createElement('div');
    wrap.className = 'list-item';
    if (!isActive) {
      wrap.classList.add('is-inactive');
    }

    const left = document.createElement('div');
    left.textContent = text;

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Edit';
    button.addEventListener('click', onEdit);

    wrap.appendChild(left);
    wrap.appendChild(button);
    return wrap;
  }

  async function loadProducts() {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      statusError(error.message);
      return;
    }

    productsCache = data || [];
    renderProducts();
  }

  function renderProducts() {
    productList.innerHTML = '';

    const filtered = applyActiveFilter(
      productsCache,
      productSearch.value,
      productFilterActive.value,
      'title'
    );

    productSummary.textContent = 'Нийт: ' + productsCache.length + ' | Харагдаж буй: ' + filtered.length;

    filtered.forEach((item) => {
      const row = renderListRow(
        item.sort_order + '. ' + item.title + (item.is_active ? '' : ' (inactive)'),
        () => {
          document.getElementById('product-id').value = item.id;
          document.getElementById('product-title').value = item.title || '';
          document.getElementById('product-image').value = item.image_url || '';
          document.getElementById('product-badge').value = item.badge || '';
          document.getElementById('product-order').value = item.sort_order || 1;
          document.getElementById('product-active').checked = toBool(item.is_active);
          deleteProductBtn.disabled = false;
          setImagePreview(item.image_url, productImagePreview);
        },
        toBool(item.is_active)
      );
      productList.appendChild(row);
    });
  }

  async function saveProduct(event) {
    event.preventDefault();

    const id = document.getElementById('product-id').value;
    const payload = {
      title: document.getElementById('product-title').value,
      image_url: document.getElementById('product-image').value,
      badge: document.getElementById('product-badge').value,
      sort_order: Number(document.getElementById('product-order').value),
      is_active: document.getElementById('product-active').checked
    };

    let result;
    if (id) {
      result = await client.from('products').update(payload).eq('id', id);
    } else {
      result = await client.from('products').insert(payload);
    }

    if (result.error) {
      statusError(result.error.message);
      return;
    }

    resetProductForm();
    await loadProducts();
    showStatus('Бүтээгдэхүүн хадгалагдлаа.', 'success');
  }

  async function deleteProduct() {
    const id = document.getElementById('product-id').value;
    if (!id) {
      statusError('Устгах бүтээгдэхүүнээ сонгоно уу.');
      return;
    }

    if (!window.confirm('Энэ бүтээгдэхүүнийг устгах уу?')) {
      return;
    }

    const { error } = await client.from('products').delete().eq('id', id);
    if (error) {
      statusError(error.message);
      return;
    }

    resetProductForm();
    await loadProducts();
    showStatus('Бүтээгдэхүүн устгагдлаа.', 'success');
  }

  async function loadNews() {
    const { data, error } = await client
      .from('news')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      statusError(error.message);
      return;
    }

    newsCache = data || [];
    renderNews();
  }

  function renderNews() {
    newsList.innerHTML = '';

    const filtered = applyActiveFilter(newsCache, newsSearch.value, newsFilterActive.value, 'title');

    newsSummaryText.textContent = 'Нийт: ' + newsCache.length + ' | Харагдаж буй: ' + filtered.length;

    filtered.forEach((item) => {
      const row = renderListRow(
        item.sort_order + '. ' + item.title + (item.is_active ? '' : ' (inactive)'),
        () => {
          document.getElementById('news-id').value = item.id;
          document.getElementById('news-title').value = item.title || '';
          document.getElementById('news-image').value = item.image_url || '';
          document.getElementById('news-date').value = item.date_text || '';
          document.getElementById('news-summary').value = item.summary || '';
          document.getElementById('news-link').value = item.link_url || '#';
          document.getElementById('news-order').value = item.sort_order || 1;
          document.getElementById('news-active').checked = toBool(item.is_active);
          deleteNewsBtn.disabled = false;
          setImagePreview(item.image_url, newsImagePreview);
        },
        toBool(item.is_active)
      );
      newsList.appendChild(row);
    });
  }

  async function saveNews(event) {
    event.preventDefault();

    const id = document.getElementById('news-id').value;
    const payload = {
      title: document.getElementById('news-title').value,
      image_url: document.getElementById('news-image').value,
      date_text: document.getElementById('news-date').value,
      summary: document.getElementById('news-summary').value,
      link_url: document.getElementById('news-link').value,
      sort_order: Number(document.getElementById('news-order').value),
      is_active: document.getElementById('news-active').checked
    };

    let result;
    if (id) {
      result = await client.from('news').update(payload).eq('id', id);
    } else {
      result = await client.from('news').insert(payload);
    }

    if (result.error) {
      statusError(result.error.message);
      return;
    }

    resetNewsForm();
    await loadNews();
    showStatus('Мэдээ хадгалагдлаа.', 'success');
  }

  async function deleteNews() {
    const id = document.getElementById('news-id').value;
    if (!id) {
      statusError('Устгах мэдээгээ сонгоно уу.');
      return;
    }

    if (!window.confirm('Энэ мэдээг устгах уу?')) {
      return;
    }

    const { error } = await client.from('news').delete().eq('id', id);
    if (error) {
      statusError(error.message);
      return;
    }

    resetNewsForm();
    await loadNews();
    showStatus('Мэдээ устгагдлаа.', 'success');
  }

  async function loadSettings() {
    const { data, error } = await client
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      statusError(error.message);
      return;
    }

    if (data) {
      document.getElementById('mission-text-input').value = data.mission_text || '';
      document.getElementById('address-text-input').value = data.address_text || '';
      document.getElementById('phone-text-input').value = data.phone_text || '';
      document.getElementById('map-url-input').value = data.map_embed_url || '';
    }
  }

  async function saveSettings(event) {
    event.preventDefault();

    const payload = {
      id: 1,
      mission_text: document.getElementById('mission-text-input').value,
      address_text: document.getElementById('address-text-input').value,
      phone_text: document.getElementById('phone-text-input').value,
      map_embed_url: document.getElementById('map-url-input').value
    };

    const { error } = await client.from('site_settings').upsert(payload);
    if (error) {
      statusError(error.message);
      return;
    }

    showStatus('Footer мэдээлэл хадгалагдлаа.', 'success');
  }

  async function bootDashboard() {
    await Promise.all([loadHero(), loadProducts(), loadNews(), loadSettings()]);
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearStatus();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      statusError(error.message);
      return;
    }

    setAuthView(true);
    showStatus('Амжилттай нэвтэрлээ.', 'success');
    await bootDashboard();
  });

  logoutBtn.addEventListener('click', async () => {
    await client.auth.signOut();
    setAuthView(false);
    clearStatus();
  });

  heroForm.addEventListener('submit', saveHero);

  productForm.addEventListener('submit', saveProduct);
  newProductBtn.addEventListener('click', resetProductForm);
  deleteProductBtn.addEventListener('click', deleteProduct);

  newsForm.addEventListener('submit', saveNews);
  newNewsBtn.addEventListener('click', resetNewsForm);
  deleteNewsBtn.addEventListener('click', deleteNews);

  settingsForm.addEventListener('submit', saveSettings);

  productSearch.addEventListener('input', renderProducts);
  productFilterActive.addEventListener('change', renderProducts);
  newsSearch.addEventListener('input', renderNews);
  newsFilterActive.addEventListener('change', renderNews);

  productImageInput.addEventListener('input', () => {
    setImagePreview(productImageInput.value, productImagePreview);
  });

  newsImageInput.addEventListener('input', () => {
    setImagePreview(newsImageInput.value, newsImagePreview);
  });

  client.auth.getSession().then(async ({ data }) => {
    const isLoggedIn = Boolean(data.session);
    setAuthView(isLoggedIn);
    if (isLoggedIn) {
      await bootDashboard();
      showStatus('Dashboard ачааллаа.', 'success');
    }
  });

  resetProductForm();
  resetNewsForm();
})();
