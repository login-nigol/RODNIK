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

// кнопка авторизации (inline SVG)
const loginLink = document.querySelector('.header__login-link');

if ( loginLink ) {
    loginLink.innerHTML = `
        <svg class="login-icon"
              viewbox="0 0 32 32"
              aria-hidden="true">
            <path
                d="M31.317 9.82l-3.16-3.159c-0.775-0.775-2.043-2.043-2.818-2.818l-3.16-3.159c-0.775-0.775-2.155-0.911-3.067-0.304l-8.639 5.759c-0.912 0.608-1.257 1.907-0.767 2.887l2.203 4.405c0.067 0.135 0.145 0.278 0.231 0.427l-11.142 11.142-1 7h6v-2h4v-4h4v-4h4v-2.225c0.2 0.119 0.392 0.226 0.569 0.314l4.405 2.203c0.98 0.49 2.279 0.145 2.887-0.767l5.759-8.639c0.608-0.912 0.471-2.292-0.304-3.066zM4.707 26.707l-1.414-1.414 9.737-9.737 1.414 1.414-9.737 9.737zM28.657 13.243l-1.414 1.414c-0.389 0.389-1.025 0.389-1.414 0l-8.485-8.485c-0.389-0.389-0.389-1.025 0-1.414l1.414-1.414c0.389-0.389 1.025-0.389 1.414 0l8.485 8.485c0.389 0.389 0.389 1.025 0 1.414z">
            </path>
        </svg>
    `;

    loginLink.setAttribute('aria-label', 'Вход');
}
