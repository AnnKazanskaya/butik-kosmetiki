// Contacts page JavaScript

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

document.addEventListener('DOMContentLoaded', function() {
    initMap();
});


