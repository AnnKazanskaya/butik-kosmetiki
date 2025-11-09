# 💄 Бутик косметики

Современный сайт магазина косметики в Стерлитамаке.

## 🚀 Быстрый старт для деплоя на GitHub Pages

### 1. Создайте репозиторий на GitHub
- Зайдите на https://github.com
- Создайте новый публичный репозиторий

### 2. Выполните команды в PowerShell:

```bash
# Перейдите в папку проекта
cd "C:\Users\kazan\OneDrive\Рабочий стол\agni"

# Инициализируйте Git
git init
git add .
git commit -m "Initial commit"

# Подключите к GitHub (замените YOUR_USERNAME и REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### 3. Включите GitHub Pages
- Откройте Settings → Pages в вашем репозитории
- Выберите branch: **main**, folder: **/ (root)**
- Сохраните

### 4. Ваш сайт будет доступен по адресу:
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

Подробная инструкция: см. файл `GITHUB_PAGES_DEPLOY.md`

## 📁 Структура проекта

```
agni/
├── index.html          # Главная страница
├── about.html          # О нас
├── catalog.html        # Каталог
├── product.html        # Страница товара
├── blog.html           # Блог
├── contacts.html       # Контакты
├── css/                # Стили
├── js/                 # JavaScript
└── cosmetics_products.json  # Данные товаров
```

## 🛠 Технологии

- HTML5
- CSS3 (Glassmorphism эффекты)
- JavaScript (Vanilla JS)
- Font Awesome иконки
- Yandex Maps API

## 📝 Примечания

- Все пути к файлам относительные (работают на GitHub Pages)
- Сайт полностью адаптивный
- Поддерживает современные браузеры

