// Catalog page JavaScript

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 16;

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('cosmetics_products.json');
        allProducts = await response.json();
        allProducts = shuffleArray([...allProducts]);
        filteredProducts = [...allProducts];
        populateFilters();
        initPriceRange();
        renderProducts();
        updateResultsCount();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
// Initialize price range
function initPriceRange() {
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    
    if (priceMin && priceMax && allProducts.length > 0) {
        const maxPrice = Math.ceil(Math.max(...allProducts.map(p => p.price)));
        const minPrice = Math.floor(Math.min(...allProducts.map(p => p.price)));
        priceMin.min = minPrice;
        priceMin.max = maxPrice;
        priceMax.min = minPrice;
        priceMax.max = maxPrice;
        priceMin.value = minPrice;
        priceMax.value = maxPrice;
        updatePriceValues();
    }
}

// Populate filter options
function populateFilters() {
    // Get unique brands
    const brands = [...new Set(allProducts.map(p => p.brand))].sort();
    const brandFilter = document.getElementById('brandFilter');
    
    if (brandFilter) {
        brandFilter.innerHTML = brands.map(brand => `
            <label><input type="checkbox" value="${brand}" data-filter="brand"> ${brand}</label>
        `).join('');
    }
}

// Toggle filters panel
function toggleFilters() {
    const panel = document.getElementById('filtersPanel');
    if (panel) {
        panel.classList.toggle('active');
    }
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const selectedBrands = Array.from(document.querySelectorAll('#brandFilter input:checked')).map(cb => cb.value);
    const selectedSkinTypes = Array.from(document.querySelectorAll('#skinTypeFilter input:checked')).map(cb => cb.value);
    const selectedSkinProblems = Array.from(document.querySelectorAll('#skinProblemsFilter input:checked')).map(cb => cb.value);
    const selectedProductTypes = Array.from(document.querySelectorAll('#productTypeFilter input:checked')).map(cb => cb.value);
    const selectedSpecialCategories = Array.from(document.querySelectorAll('#specialCategoriesFilter input:checked')).map(cb => cb.value);
    
    const priceMinEl = document.getElementById('priceMin');
    const priceMaxEl = document.getElementById('priceMax');
    const priceMin = priceMinEl ? parseInt(priceMinEl.value) : 0;
    const priceMax = priceMaxEl ? parseInt(priceMaxEl.value) : (allProducts.length > 0 ? Math.ceil(Math.max(...allProducts.map(p => p.price))) : 10000);
    
    filteredProducts = allProducts.filter(product => {
        // Search filter
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm) && !product.brand.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
            return false;
        }
        
        // Skin type filter
        if (selectedSkinTypes.length > 0) {
            const productSkinTypes = product.categories?.skin_type || [];
            if (!selectedSkinTypes.some(st => productSkinTypes.includes(st))) {
                return false;
            }
        }
        
        // Skin problems filter
        if (selectedSkinProblems.length > 0) {
            const productSkinProblems = product.categories?.skin_problems || [];
            if (!selectedSkinProblems.some(sp => productSkinProblems.includes(sp))) {
                return false;
            }
        }
        
        // Product type filter
        if (selectedProductTypes.length > 0) {
            const productTypes = product.categories?.product_type || [];
            if (!selectedProductTypes.some(pt => productTypes.includes(pt))) {
                return false;
            }
        }
        
        // Special categories filter
        if (selectedSpecialCategories.length > 0) {
            const productSpecialCategories = product.categories?.special_categories || [];
            if (!selectedSpecialCategories.some(sc => productSpecialCategories.includes(sc))) {
                return false;
            }
        }
        
        // Price filter
        if (product.price < priceMin || product.price > priceMax) {
            return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    renderProducts();
    updateResultsCount();
}

// Reset filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    const priceMinEl = document.getElementById('priceMin');
    const priceMaxEl = document.getElementById('priceMax');
    if (allProducts.length > 0) {
        const minPrice = Math.floor(Math.min(...allProducts.map(p => p.price)));
        const maxPrice = Math.ceil(Math.max(...allProducts.map(p => p.price)));
        if (priceMinEl) priceMinEl.value = minPrice;
        if (priceMaxEl) priceMaxEl.value = maxPrice;
    } else {
        if (priceMinEl) priceMinEl.value = 0;
        if (priceMaxEl) priceMaxEl.value = 10000;
    }
    
    updatePriceValues();
    filteredProducts = [...allProducts];
    currentPage = 1;
    renderProducts();
    updateResultsCount();
}

// Update price values display
function updatePriceValues() {
    const priceMin = document.getElementById('priceMin')?.value || 0;
    const priceMax = document.getElementById('priceMax')?.value || 10000;
    document.getElementById('priceMinValue').textContent = priceMin;
    document.getElementById('priceMaxValue').textContent = priceMax;
}

// Render products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
        grid.innerHTML = '<p class="no-products">Товары не найдены</p>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    grid.innerHTML = productsToShow.map(product => {
        // Get category color
        const categoryColor = getCategoryColor(product.categories);
        
        return `
            <a href="product.html?id=${product.id}" class="product-card" style="border-top: 4px solid ${categoryColor}">
                <img src="${product.photo_url}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/280x280?text=No+Image'">
                <div class="product-card-content">
                    <div class="product-card-brand">${product.brand}</div>
                    <div class="product-card-name">${product.name}</div>
                    <div class="product-card-price">${product.price.toLocaleString('ru-RU')} ₽</div>
                </div>
            </a>
        `;
    }).join('');
    
    renderPagination();
}

// Get category color for product card
function getCategoryColor(categories) {
    const colors = {
        'акционный товар': '#ff6b6b',
        'новинка': '#4ecdc4',
        'крем': '#95e1d3',
        'сыворотка': '#f38181',
        'гель': '#a8e6cf',
        'маска': '#ffd3a5',
        'флюид': '#fd9853'
    };
    
    if (categories?.special_categories?.length > 0) {
        const special = categories.special_categories[0];
        if (colors[special]) return colors[special];
    }
    
    if (categories?.product_type?.length > 0) {
        const type = categories.product_type[0];
        if (colors[type]) return colors[type];
    }
    
    return '#ddd';
}

// Render pagination
function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = `
        <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    paginationHTML += `
        <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Go to page
function goToPage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update results count
function updateResultsCount() {
    const countEl = document.getElementById('resultsCount');
    if (countEl) {
        countEl.textContent = filteredProducts.length;
    }
}

// Search input event
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFilters();
            }, 300);
        });
    }
    
    // Price range events
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    
    if (priceMin && priceMax) {
        priceMin.addEventListener('input', updatePriceValues);
        priceMax.addEventListener('input', updatePriceValues);
    }
    
    // Filter checkbox events
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Auto-apply filters on change (optional, can be removed if manual apply is preferred)
            // applyFilters();
        });
    });
    
    loadProducts();
});

