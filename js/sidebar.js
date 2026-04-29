/**
 * FreshPOS – sidebar.js
 * Logika untuk merender kategori di sidebar
 */

function renderCategories() {
    const categoryMenu = document.getElementById('categoryMenu');
    if (!categoryMenu) return;

    categoryMenu.innerHTML = categories.map(cat => `
        <button class="category-item ${cat.id === currentCategory ? 'active' : ''}" data-id="${cat.id}">
            <i class="fa-solid ${cat.icon}"></i>
            ${cat.name}
        </button>
    `).join('');

    // Re-attach listeners after render
    const categoryButtons = categoryMenu.querySelectorAll('.category-item');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.getAttribute('data-id');
            renderCategories(); // update active state
            filterAndRenderProducts(); // filter the grid
        });
    });
}
