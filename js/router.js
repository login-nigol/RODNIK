// router.js
'use strict';

const ROUTES = {
    home: './pages/home.html',
    farms: './pages/farms.html',
    products: './pages/products.html',
    cart: './pages/cart.html',
    contact: './pages/contact.html',
    organizer: './pages/organizer.html',
};

const TITLES = {
    home: 'РОДНИКЪ - Главная',
    farms: 'РОДНИКЪ - Фермы',
    products: 'РОДНИКЪ - Продукты',
    cart: 'РОДНИКЪ - Корзина',
    contact: 'РОДНИКЪ - Контакт',
    organizer: 'РОДНИКЪ - Органайзер проекта',
};

// загружает HTML-фрагмент и вставляет его в контейнер контента
export async function loadPage(pageId, contentEl) {
    const url = ROUTES[pageId];
    if ( !url ) return; // защита от неизвестных страниц

    // меняю title при навигации (SPA)
    document.title = TITLES[pageId] || 'РОДНИКЪ';

    // запускаем fade-out
    contentEl.classList.add('is-fade');

    // грузим страницу
    const response = await fetch(url);
    const html = await response.text(); // превращаем ответ в строку HTML

    // подменяем HTML, пока контейнер "прозрачный"
    // contentEl.innerHTML = html;

    // ждём окончания fade-out
    setTimeout(() => {
        contentEl.innerHTML = html;    

    // сообщаю приложению, что страница загружена (для инициализации логики страницы)
    contentEl.dispatchEvent(new CustomEvent('page:loaded', {
        detail: { pageId }
    }));

    // fade-in
    requestAnimationFrame(() => {
        contentEl.classList.remove('is-fade');
    });
    }, 400); // появление новой страницы
}