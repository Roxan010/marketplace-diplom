let products = []; 
let cart = [];    

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        
        const catalog = document.getElementById('catalog');
        catalog.innerHTML = ''; 

        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <div class="price-tag">${p.price} ₽</div>
                <button class="buy-button" onclick="addToCart(${p.id})">В корзину</button>
            `;
            catalog.appendChild(card);
        });
    } catch (err) {
        console.error("Ошибка загрузки товаров:", err);
        document.getElementById('catalog').innerHTML = '<p>Ошибка связи с сервером</p>';
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    cartCount.innerText = `Корзина: ${cart.length}`;
}

async function checkout() {
    if (cart.length === 0) {
        alert("Сначала добавьте товары в корзину!");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
  
    const itemIds = cart.map(item => item.id);

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemIds, total })
        });

        if (response.ok) {
            alert(`Заказ успешно создан на сумму ${total} руб.!`);
            cart = [];
            updateCartUI();
        }
    } catch (err) {
        alert("Не удалось отправить заказ");
    }
}


loadProducts();