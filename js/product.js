// Product page JavaScript

async function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        showError('Товар не найден');
        return;
    }
    
    try {
        const response = await fetch('cosmetics_products.json');
        const products = await response.json();
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            showError('Товар не найден');
            return;
        }
        
        renderProduct(product);
    } catch (error) {
        console.error('Error loading product:', error);
        showError('Ошибка загрузки товара');
    }
}

function renderProduct(product) {
    const container = document.getElementById('productContent');
    if (!container) return;
    
    const categories = product.categories || {};
    const categoryBadges = [];
    
    if (categories.skin_type?.length > 0) {
        categories.skin_type.forEach(st => {
            categoryBadges.push(`<span class="category-badge">Тип кожи: ${st}</span>`);
        });
    }
    
    if (categories.skin_problems?.length > 0) {
        categories.skin_problems.forEach(sp => {
            categoryBadges.push(`<span class="category-badge">${sp}</span>`);
        });
    }
    
    if (categories.product_type?.length > 0) {
        categories.product_type.forEach(pt => {
            categoryBadges.push(`<span class="category-badge">${pt}</span>`);
        });
    }
    
    if (categories.special_categories?.length > 0) {
        categories.special_categories.forEach(sc => {
            categoryBadges.push(`<span class="category-badge">${sc}</span>`);
        });
    }
    
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-image">
                <img src="${product.photo_url}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/500x500?text=No+Image'">
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h1 class="product-name">${product.name}</h1>
                <div class="product-price">${product.price.toLocaleString('ru-RU')} ₽</div>
                <div class="product-volume">Объем: ${product.volume}</div>
                ${categoryBadges.length > 0 ? `<div class="product-categories">${categoryBadges.join('')}</div>` : ''}
                <div class="product-actions">
                    <button class="btn-primary" onclick="openConsultationModal()">
                        Связаться для покупки
                    </button>
                </div>
            </div>
        </div>
        <div class="product-description">
            <h3>Описание</h3>
            <p>${product.description || 'Описание отсутствует'}</p>
        </div>
        ${product.composition ? `
        <div class="product-composition">
            <h3>Состав</h3>
            <p>${product.composition}</p>
        </div>
        ` : ''}
        ${product.application_method ? `
        <div class="product-application">
            <h3>Способ применения</h3>
            <p>${product.application_method}</p>
        </div>
        ` : ''}
    `;
    
    // Update page title
    document.title = `${product.name} - Бутик косметики`;
}

function showError(message) {
    const container = document.getElementById('productContent');
    if (container) {
        container.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('productContent');
    if (container) {
        container.innerHTML = '<div class="loading">Загрузка товара...</div>';
    }
    loadProduct();
});


