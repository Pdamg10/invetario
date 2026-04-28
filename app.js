// ──────────────── DATA ────────────────
let products = JSON.parse(localStorage.getItem('inv_products') || '[]');
let deleteTarget = null;
let editId = null;

const CAT_LABELS = {
  electronics: 'Electrónica',
  ropa: 'Ropa',
  hogar: 'Hogar',
  alimentos: 'Alimentos',
  otros: 'Otros'
};

const STATUS_COLORS = {
  activo: '#2ecc71',
  inactivo: '#ffab47',
  descontinuado: '#ff4757'
};

/**
 * Guarda el array actual de productos en el localStorage del navegador.
 * Convierte el array de objetos a un string JSON antes de guardar.
 */
function save() {
  localStorage.setItem('inv_products', JSON.stringify(products));
}

/**
 * Genera un identificador único alfanumérico para cada producto.
 * Utiliza la fecha actual y un número aleatorio para asegurar unicidad.
 * @returns {string} ID generado
 */
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}

// ──────────────── RENDER ────────────────
/**
 * Filtra la lista de productos basada en los criterios de búsqueda,
 * categoría y estado seleccionados por el usuario en la interfaz.
 * @returns {Array} Array de productos que coinciden con los filtros
 */
function getFiltered() {
  const q = document.getElementById('search').value.toLowerCase();
  const cat = document.getElementById('filter-cat').value;
  const status = document.getElementById('filter-status').value;

  return products.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.supplier || '').toLowerCase().includes(q);
    const matchCat = !cat || p.category === cat;
    const matchStatus = !status || p.status === status;
    return matchQ && matchCat && matchStatus;
  });
}

/**
 * Renderiza o actualiza la tabla de productos en el DOM.
 * Genera el HTML para cada fila de la tabla basándose en los productos filtrados,
 * y actualiza los contadores y estadísticas en la cabecera.
 */
function render() {
  const filtered = getFiltered();
  const tbody = document.getElementById('product-list');
  const emptyState = document.getElementById('empty-state');
  const count = document.getElementById('prod-count');

  count.textContent = `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
    tbody.innerHTML = filtered.map(p => {
      const isLow = p.stock <= (p.minstock || 5);
      return `
        <tr>
          <td>
            <div class="prod-name">${esc(p.name)}</div>
            <div class="prod-code">${esc(p.sku)}</div>
          </td>
          <td><span class="cat-badge cat-${p.category}">${CAT_LABELS[p.category] || p.category}</span></td>
          <td class="price-cell">$${Number(p.price).toFixed(2)}</td>
          <td class="stock-cell ${isLow ? 'stock-low' : 'stock-ok'}">${p.stock} uds.</td>
          <td>${esc(p.supplier || '—')}</td>
          <td>
            <span style="display:inline-flex;align-items:center;font-size:.75rem;font-weight:600">
              <span class="status-dot" style="background:${STATUS_COLORS[p.status] || '#999'}"></span>
              ${p.status.charAt(0).toUpperCase() + p.status.slice(1)}
            </span>
          </td>
          <td>
            <div class="actions-cell">
              <button class="icon-btn edit" onclick="startEdit('${p.id}')" title="Editar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="icon-btn del" onclick="askDelete('${p.id}')" title="Eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Update header stats
  document.getElementById('hdr-total').textContent = products.length;
  const total = products.reduce((s, p) => s + p.price * p.stock, 0);
  document.getElementById('hdr-valor').textContent = '$' + (total >= 1000 ? (total/1000).toFixed(1)+'k' : total.toFixed(0));
  const low = products.filter(p => p.stock <= (p.minstock || 5)).length;
  document.getElementById('hdr-low').textContent = low;
}

/**
 * Escapa caracteres HTML especiales en un string para prevenir ataques XSS (Cross-Site Scripting).
 * @param {string} s - El string a escapar
 * @returns {string} El string con los caracteres especiales escapados
 */
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ──────────────── FORM ────────────────
document.getElementById('product-form').addEventListener('submit', e => {
  e.preventDefault();

  const data = {
    id: editId || genId(),
    name: document.getElementById('f-name').value.trim(),
    sku: document.getElementById('f-sku').value.trim().toUpperCase(),
    category: document.getElementById('f-cat').value,
    price: parseFloat(document.getElementById('f-price').value),
    stock: parseInt(document.getElementById('f-stock').value),
    supplier: document.getElementById('f-supplier').value.trim(),
    description: document.getElementById('f-desc').value.trim(),
    status: document.getElementById('f-status').value,
    minstock: parseInt(document.getElementById('f-minstock').value) || 5,
    updatedAt: new Date().toISOString()
  };

  if (editId) {
    const idx = products.findIndex(p => p.id === editId);
    if (idx !== -1) products[idx] = data;
    toast('Producto actualizado correctamente', 'info');
  } else {
    // Check duplicate SKU
    if (products.some(p => p.sku === data.sku)) {
      toast('Ya existe un producto con ese SKU', 'danger');
      return;
    }
    data.createdAt = data.updatedAt;
    products.unshift(data);
    toast('Producto registrado exitosamente');
  }

  save();
  resetForm();
  render();
});

document.getElementById('btn-cancel').addEventListener('click', resetForm);

/**
 * Limpia todos los campos del formulario, resetea el modo a "NUEVO"
 * y elimina cualquier ID de producto que se estuviera editando.
 */
function resetForm() {
  editId = null;
  document.getElementById('edit-id').value = '';
  document.getElementById('product-form').reset();
  document.getElementById('mode-badge').textContent = 'NUEVO';
  document.getElementById('mode-badge').classList.remove('edit-mode');
  document.getElementById('f-name').focus();
}

/**
 * Prepara el formulario para editar un producto existente.
 * Carga los datos del producto en los campos correspondientes y cambia el modo a "EDITAR".
 * @param {string} id - El ID del producto a editar
 */
function startEdit(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  editId = id;

  document.getElementById('f-name').value = p.name;
  document.getElementById('f-sku').value = p.sku;
  document.getElementById('f-cat').value = p.category;
  document.getElementById('f-price').value = p.price;
  document.getElementById('f-stock').value = p.stock;
  document.getElementById('f-supplier').value = p.supplier || '';
  document.getElementById('f-desc').value = p.description || '';
  document.getElementById('f-status').value = p.status;
  document.getElementById('f-minstock').value = p.minstock || 5;

  document.getElementById('mode-badge').textContent = 'EDITAR';
  document.getElementById('mode-badge').classList.add('edit-mode');

  document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('f-name').focus();
}

// ──────────────── DELETE ────────────────
/**
 * Muestra el modal de confirmación antes de eliminar un producto.
 * Guarda temporalmente el ID del producto que se desea eliminar.
 * @param {string} id - El ID del producto a eliminar
 */
function askDelete(id) {
  deleteTarget = id;
  document.getElementById('confirm-overlay').classList.add('show');
}

document.getElementById('confirm-del').addEventListener('click', () => {
  products = products.filter(p => p.id !== deleteTarget);
  save();
  render();
  toast('Producto eliminado', 'danger');
  closeModal();
  if (editId === deleteTarget) resetForm();
});

document.getElementById('cancel-del').addEventListener('click', closeModal);
document.getElementById('confirm-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

/**
 * Cierra el modal de confirmación de eliminación y limpia la variable temporal de ID a eliminar.
 */
function closeModal() {
  document.getElementById('confirm-overlay').classList.remove('show');
  deleteTarget = null;
}

// ──────────────── SEARCH ────────────────
let searchTimeout;
document.getElementById('search').addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(render, 300);
});
document.getElementById('filter-cat').addEventListener('change', render);
document.getElementById('filter-status').addEventListener('change', render);

// ──────────────── TOAST ────────────────
/**
 * Muestra una notificación temporal (toast) en la pantalla.
 * La notificación desaparece automáticamente después de 3 segundos.
 * @param {string} msg - El mensaje a mostrar
 * @param {string} type - El tipo de notificación (success, danger, info)
 */
function toast(msg, type = 'success') {
  const wrap = document.getElementById('toast-wrap');
  const el = document.createElement('div');
  el.className = `toast${type === 'danger' ? ' danger' : type === 'info' ? ' info' : ''}`;

  const icon = type === 'danger' ? '🗑️' : type === 'info' ? '✏️' : '✅';
  el.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  wrap.appendChild(el);

  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

// ──────────────── SEED ────────────────
if (products.length === 0) {
  products = [
    { id: genId(), name: 'Laptop HP Pavilion 15', sku: 'ELEC-001', category: 'electronics', price: 799.99, stock: 12, supplier: 'HP México', description: 'Procesador Intel i5, 8GB RAM, 256GB SSD', status: 'activo', minstock: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: genId(), name: 'Auriculares Sony WH-1000XM5', sku: 'ELEC-002', category: 'electronics', price: 349.00, stock: 4, supplier: 'Sony Distribuciones', description: 'Cancelación de ruido activa', status: 'activo', minstock: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: genId(), name: 'Camiseta Polo Premium', sku: 'ROPA-001', category: 'ropa', price: 29.99, stock: 80, supplier: 'TextilMex S.A.', description: 'Algodón 100% peinado, varios colores', status: 'activo', minstock: 10, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: genId(), name: 'Cafetera Expresso Delonghi', sku: 'HOG-001', category: 'hogar', price: 189.50, stock: 2, supplier: 'Delonghi MX', description: '15 bares de presión, tanque 1.8L', status: 'activo', minstock: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
  save();
}

render();
