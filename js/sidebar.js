async function loadCategories() {
    try {
        const res = await fetch(`${API_PATH}products_api.php?action=categories`);
        const data = await res.json();
        if(data.success) {
            categoriesData = data.data;
            catLabels = {};
            categoriesData.forEach(c => catLabels[c.id] = c.name);
            renderCategories();
        }
    } catch(e) { console.error(e); }
}

function renderCategories() {
    const categoryMenu = document.getElementById('categoryMenu');
    if (!categoryMenu) return;

    categoryMenu.innerHTML = categoriesData.map(cat => `
        <button class="category-item ${cat.id === currentCategory ? 'active' : ''}" data-id="${cat.id}">
            <i class="fa-solid ${cat.icon || 'fa-box'}"></i>
            ${cat.name}
        </button>
    `).join('');

    const categoryButtons = categoryMenu.querySelectorAll('.category-item');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.getAttribute('data-id');
            renderCategories();
            filterAndRenderProducts();
        });
    });
}
