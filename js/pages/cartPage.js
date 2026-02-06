// js/pages/cartPage.js
'use strict';

import { PRODUCTS } from "../data/products.js";

// читаю корзину из localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// рендер страницы корзины в контейнере #cartContent
// групирую одинаковые товары (id -> qty)
// считаю итоговую сумму
export function renderCartPage(contentEl) {
    const root = contentEl.querySelector('#cartContent');
    if ( !root ) return;

    const cart = getCart();

    // пустая корхина
    if ( cart.length === 0 ) {
        root.innerHTML = '<p>Корзина пуста</p>';
        return;
    }

    // считаю количество по id
    const counts = cart.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});

    // собираю список товаров с qty
    const items = Object.entries(counts)
    .map(([id, qty]) => {
        const prod = PRODUCTS.find(p => p.id === id);
        if ( !prod ) return null; // защита, если в корзине лежит неизвестный id
        return { ...prod, qty };
    })
    .filter(Boolean);

    // итоговая сумма
    const total = items.reduce((sum, item) => {
        return sum + item.price * item.qty;
    }, 0);

    // рендер
    root.innerHTML = `
        <div class="cart-list">
            ${items.map(p => `
                <article class="cart-item">
                    <img src="${p.img}" alt="${p.title}" title="${p.title}">
                    <div class="cart-item__info">
                        <h4>${p.title}</h4>

                        <p>${p.price} BYN / ${p.unit}</p>

                        <p>Количество: <strong>${p.qty}</strong></p>

                        <p>Сумма: <strong>${p.price * p.qty} BYN</strong></p>
                    </div>
                </article>
                `).join('')}
        </div>

        <!-- фикс-бар: итоговая сумма и управление товарами -->
        <div class="cart-bar">
            <p class="cart-bar__total">
            <strong>Итого:</strong> ${total.toFixed(2)} BYN
            </p>

            <button class="cart-bar__clear" type="button" data-cart-action="clear">
                Очистить корзину
            </button>
        </div>
    `;
}