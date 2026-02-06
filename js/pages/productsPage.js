// js/pages/productsPage.js
'use strict';

import { PRODUCTS } from '../data/products.js';

// const farmId = sessionStorage.getItem('activeFarmId');


// филтрация
export function renderProductsPage(contentEl) {
    // хлебные крошки
    const breadcrumbsEl = contentEl.querySelector('#breadcrumbs');
    const farmId = sessionStorage.getItem('activeFarmId');
    
    if ( breadcrumbsEl ) {
        if ( farmId ) {
            breadcrumbsEl.innerHTML = `
            <a href="#farms" data-page="farms" class="breadcrumbs__back">
                К фермам
            </a>
            `;
        } else {
            breadcrumbsEl.innerHTML = '';
        }
    }
    
    const grid = contentEl.querySelector('#productsGrid');
    if ( !grid ) return;

    const list = farmId ? PRODUCTS.filter(prod => prod.farmId === farmId) : PRODUCTS;

    // инфо о товаре и кнопка добавить в корзину
    grid.innerHTML = list.map(prod => `
        <article class="product-card">
            <img src="${prod.img}" alt="${prod.title}" title="${prod.title}">

            <div class="product-card__header">
                <div class="product-card__text">
                    <h4 class="product-card__title">${prod.title}</h4>

                    <p class="product-card__price">${prod.price} BYN/${prod.unit}</p>
                </div>

                <button class="product-card__add" data-product-id="${prod.id}">
                    В корзину
                </button>
            </div>
        </article>
        `).join('');
}