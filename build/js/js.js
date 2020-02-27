"use strict";
document.addEventListener("DOMContentLoaded", () => {
    let cart = {};
    const miniCart = {};
    const productWrapper = document.querySelector(".wrapper-product");
    const category = document.querySelector(".category");
    const searchForm = document.querySelector(".head-form");
    const nothingFound = document.querySelector(".nothing-found");
    const countGoods = document.querySelector(".count-goods");
    const priceGoods = document.querySelector(".head-basket-price");
    

    //вывожу товары из localStorage в мине корзину на странице
    const minCartPage = () => {
        let length = 0;
        let formatter = new Intl.NumberFormat("ru");
        let goods = JSON.parse(localStorage.getItem("miniCart"));
        let price = 0;
        for(let key in goods){
            price += goods[key];
            length++;
        }
        countGoods.textContent = `${length} товаров`;
        priceGoods.textContent = `${formatter.format(price)}р`
        console.log(JSON.parse(localStorage.getItem("miniCart")));
    }
    //Получаю товары из базы данных
    const getGoods = (handler, filter) => {
        fetch('./products.json')
            .then((response) => response.json())
            .then(filter)
            .then(handler); 
    }
    const createCardGoods = (id, desc, price, img, units) =>{
        const card = document.createElement('div');
        card.className = "product";
        card.innerHTML = `
                <span class="product-code">код: ${id}</span>
                <div class="product-foto">
                    <img  src="${img}" alt="product-foto" />
                </div>
                <p class="product-desc">${desc}</p>
                <p class="product-price">${price}р</p>
                <p class="product-units">${units}<p/>
                <div class="basket">
                    <input id="count" type="number" value ="1">
                    <button class="basket-btn" data-id-goods="${id}" data-price-goods="${price}">
                        <span class="icon-cart_78585 basket-ico"></span>
                            в корзину
                    </button>
                </div>`
        return card;
    }

    const renderCard = (item) => {
        productWrapper.textContent = " ";
        if(item.length){
            nothingFound.style.display = "none";
            item.forEach((element) => {
                const { id, desc, price, image, units } = element;
                productWrapper.append(createCardGoods(id,desc,price,image,units));
            });
        }else
        {
            nothingFound.style.display = "block";
        }
    }
    //Рандомный вывод товаров
    const randomSort = (item) => {
        return item.sort(() => Math.random() - 0.5);
    }
    //Вывод товаров по категориям
    const choiceCategory = (event) => {
        event.preventDefault();
        const target = event.target;
        if(target.classList.contains('category-item')){
            const category = target.dataset.category;
            getGoods(renderCard, goods => {
                const newGoods = goods.filter((item) => {
                    return item.category.includes(category);
                })
                return newGoods;
            });
        }
    }
    //Поиск товаров
    const searchGoods = (event) => {
        event.preventDefault();
        const input = event.target.elements.searchGoods;
        const inputValue = event.target.elements.searchGoods.value.trim();
        if(inputValue !== ""){
            const searchString = new RegExp(inputValue, "i")
            getGoods(renderCard, goods => {
                const newGoods = goods.filter((item) => {
                    return searchString.test(item.name);
                })
                return newGoods;
            });
        }
    }
    //Добавляю корзины в LocalStorage
    const storageQuery = () => {
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("miniCart", JSON.stringify(miniCart));
    }
    //Добавляю товары в корзину
    const addToCart = (event) => {
        const target = event.target;
        if(target.classList =="basket-btn"){
            const count = target.previousElementSibling.value;
            const goodsId = target.dataset.idGoods;
            const price = target.dataset.priceGoods;
            cart[goodsId] = count;
            miniCart[goodsId] = count * price;
            storageQuery();
            minCartPage();
            //console.log(cart);
            //console.log(miniCart);
        }
        else if(target.parentNode.classList == "basket-btn"){
            const count = target.parentNode.previousElementSibling.value;
            const goodsId = target.parentNode.dataset.idGoods;
            const price = target.parentNode.dataset.priceGoods;
            cart[goodsId] = count;
            miniCart[goodsId] = count * price;
            storageQuery();
            minCartPage();
        }
    }
    getGoods(renderCard, randomSort);
    minCartPage();
    category.addEventListener("click", choiceCategory);
    productWrapper.addEventListener("click",addToCart);
    searchForm.addEventListener("submit", searchGoods);
})