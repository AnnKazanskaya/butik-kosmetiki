@echo off
echo ========================================
echo   Деплой сайта на GitHub Pages
echo ========================================
echo.

REM Проверка наличия Git
git --version >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Git не установлен!
    echo Скачайте Git с https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [Шаг 1] Проверка статуса Git...
git status

echo.
echo [Шаг 2] Добавление всех файлов...
git add .

echo.
echo [Шаг 3] Введите описание изменений:
set /p commit_message="Сообщение коммита: "

if "%commit_message%"=="" set commit_message=Update website

echo.
echo [Шаг 4] Создание коммита...
git commit -m "%commit_message%"

echo.
echo [Шаг 5] Отправка на GitHub...
git push

echo.
echo ========================================
echo   Готово! Изменения отправлены на GitHub
echo ========================================
echo.
echo Ваш сайт обновится через 1-2 минуты на:
echo https://YOUR_USERNAME.github.io/REPO_NAME/
echo.
echo (Замените YOUR_USERNAME и REPO_NAME на ваши данные)
echo.
pause

