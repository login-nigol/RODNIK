// app.js
'use strict';

// import { MENU_ITEMS } from "./menu.js";
import { loadPage } from "./router.js";
import { renderProductsPage } from "./pages/productsPage.js";
import { renderCartPage } from "./pages/cartPage.js";

// === константы === //

const DEFAULT_PAGE = 'home';

// === DOM селекторы === // работаем с готовыми контейнерами из index.html

const menuEl = document.querySelector('#menu');
const burgerBtn = document.querySelector('.burger');
const menuListEl = document.querySelector('.menu__list');
const contentEl = document.querySelector('#content');

// открытие/закрытие выпадающего меню по клику
if ( burgerBtn ) {
    burgerBtn.addEventListener('click', () => {
        const isOpen = menuEl.classList.toggle('is-open');
        burgerBtn.setAttribute('aria-expanded', String(isOpen));
    });
}

// === функции === //

// активирую пункт меню (только для табов-<li>), чтобы работала анимация
function setActiveMenuItem(activeItem) {
    if ( !activeItem ) return;

    // снимаю активность со всех табов, чтобы в меню был только один активный пункт
    menuListEl.querySelectorAll('li').forEach(li => {
        li.classList.remove('is-active')
    });

    // включаю активность на выбранной ссылке
    const activeLi = activeItem.closest('li');
    if ( activeLi ) activeLi.classList.add('is-active');
}

// === обработчики === //

// клики по меню (li) + отдельная ссылка "органайзер"
menuEl.addEventListener('click', (event) => {
    // органайзер (обычная ссылка, без анимации)
    const organizer = event.target.closest('a.menu__organizer[data-page]');
    if ( organizer ) {
        event.preventDefault(); // чтобы не прыгал в адресной строке
        setActiveMenuItem(organizer); // подсветка пункта меню
        loadPage( organizer.dataset.page, contentEl );
        return;
    }

    // анимирую кнопки/ссылки и ставлю актив
    const link = event.target.closest('a[data-page]');
    if ( link ) {
        setActiveMenuItem(link);

        if (link.dataset.page === 'products') {
            sessionStorage.removeItem('activeFarmId');
        }

        loadPage( link.dataset.page, contentEl );

        // закрываем меню после выбора пункта
        if ( window.innerWidth <= 768 && burgerBtn ) {
            menuEl.classList.remove('is-open');
            burgerBtn.setAttribute('aria-expanded', 'false');
        }

        return;
    }
});

// клики по ссылкам внутри загруженного контента (например в органайзере)
contentEl.addEventListener('click', (event) => {
    // кнопка добавления в корзину (localStorage)
    const addBtn = event.target.closest('.product-card__add');
    if ( addBtn ) {
        const productId = addBtn.dataset.productId;

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));

        return;
    }

    // кнопка очистки корзины
    const clearBtn = event.target.closest('.cart-bar__clear');
    if ( clearBtn ) {
        localStorage.removeItem('cart'); // очищаем корзину
        loadPage('cart', contentEl); // перерисовываем страницу корзины

        return;
    }

    const farmCard = event.target.closest('.farm[data-farm-id]');
    if ( farmCard ) {
        sessionStorage.setItem('activeFarmId', farmCard.dataset.farmId);
        loadPage('products', contentEl);
        return;
    }

    const link = event.target.closest('a[data-page]');
    if ( !link ) return;    
    
    event.preventDefault(); // чтобы не прыгала страница
    loadPage( link.dataset.page, contentEl );

    // если ссылка ведёт на таб-страницу, подсвечиваю соответствующий пункт меню
    const menuLink = menuEl.querySelector(`[data-page="${link.dataset.page}"]`);
    if ( menuLink ) setActiveMenuItem(menuLink);
});

contentEl.addEventListener('page:loaded', (event) => {
    const { pageId } = event.detail;

    // рендер продуктов
    if ( pageId === 'products') {
        renderProductsPage(contentEl);
    }

    // рендер корзины
    if ( pageId === 'cart') {
        renderCartPage(contentEl);
    }
});

// === старт приложения === //

// устанавливаю активный класс (ссылку) - home
const startItem = menuEl.querySelector(`[data-page="${DEFAULT_PAGE}"]`);
if ( startItem ) setActiveMenuItem (startItem);

// загружаю стартовую страницу в контент
loadPage (DEFAULT_PAGE, contentEl);

