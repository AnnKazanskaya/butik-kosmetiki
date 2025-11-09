// Home page specific JavaScript

// Slider functionality
let currentSlideIndex = 0;
let slides = [];
let dots = [];
let sliderInterval = null;

function showSlide(index) {
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
    }
    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.add('active');
    }
}

function currentSlide(n) {
    showSlide(n - 1);
    resetSliderInterval();
}

function nextSlide() {
    showSlide(currentSlideIndex + 1);
    resetSliderInterval();
}

function previousSlide() {
    showSlide(currentSlideIndex - 1);
    resetSliderInterval();
}

function resetSliderInterval() {
    if (sliderInterval) {
        clearInterval(sliderInterval);
    }
    sliderInterval = setInterval(function() {
        showSlide(currentSlideIndex + 1);
    }, 5000);
}

function initSlider() {
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    
    if (slides.length > 0) {
        showSlide(0);
        resetSliderInterval();
        
        // Pause on hover
        const slider = document.querySelector('.slider');
        if (slider) {
            slider.addEventListener('mouseenter', function() {
                if (sliderInterval) {
                    clearInterval(sliderInterval);
                }
            });
            slider.addEventListener('mouseleave', function() {
                resetSliderInterval();
            });
        }
    }
}

// Parallax effect for slider
function initParallax() {
    const slider = document.querySelector('.slider');
    if (!slider) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const sliderHeight = slider.offsetHeight;
        const sliderTop = slider.offsetTop;
        
        if (scrolled >= sliderTop && scrolled <= sliderTop + sliderHeight) {
            const parallaxSpeed = 0.5;
            const activeSlide = slider.querySelector('.slide.active');
            if (activeSlide) {
                const yPos = -(scrolled - sliderTop) * parallaxSpeed;
                activeSlide.style.transform = `translateY(${yPos}px)`;
            }
        }
    });
}

// Initialize Yandex Map
function initMap() {
    if (typeof ymaps === 'undefined') {
        return;
    }
    
    ymaps.ready(function() {
        const map = new ymaps.Map('map', {
            center: [53.6306, 55.9466], // Стерлитамак координаты
            zoom: 17
        });
        
        const placemark = new ymaps.Placemark([53.6306, 55.9466], {
            balloonContent: 'Бутик косметики<br>просп. Октября, 36, ТРЦ Сити-Молл этаж 1'
        }, {
            preset: 'islands#redDotIcon'
        });
        
        map.geoObjects.add(placemark);
    });
}

// Load popular products
async function loadPopularProducts() {
    try {
        const response = await fetch('cosmetics_products.json');
        const products = await response.json();
        
        // Get first 6 products
        const popularProducts = products.slice(0, 6);
        const container = document.getElementById('popularProducts');
        
        if (container) {
            container.innerHTML = popularProducts.map(product => `
                <a href="product.html?id=${product.id}" class="product-card">
                    <img src="${product.photo_url}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/280x280?text=No+Image'">
                    <div class="product-card-content">
                        <div class="product-card-brand">${product.brand}</div>
                        <div class="product-card-name">${product.name}</div>
                        <div class="product-card-price">${product.price.toLocaleString('ru-RU')} ₽</div>
                    </div>
                </a>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initSlider();
    loadPopularProducts();
    initMap();
    initParallax();
});

