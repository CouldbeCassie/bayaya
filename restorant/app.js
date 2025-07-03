// Selecting Elements
const openShopping = document.querySelector('.shopping');
const closeShopping = document.querySelector('.closeShopping');
const list = document.querySelector('.list');
const listCard = document.querySelector('.listCard');
const body = document.querySelector('body');
const total = document.querySelector('.total');
const quantity = document.querySelector('.quantity');
const categoryButtons = document.querySelectorAll('.category-btn'); // Get category buttons

// Open & Close Cart
openShopping.addEventListener('click', () => {
    body.classList.add('active');
});

closeShopping.addEventListener('click', () => {
    body.classList.remove('active');
});

// Products List with Categories
const products = [
    { id: 1, name: 'Clueless sea', image: '1.png', price: 120, category: 'starters' },
    { id: 2, name: 'Chicken legs', image: '2.png', price: 410, category: 'starters' },
    { id: 3, name: 'Fishsalad', image: '3.png', price: 590, category: 'starters' },
    { id: 4, name: 'Tomateo', image: '4.PNG', price: 150, category: 'starters' },
    { id: 5, name: 'Silly sallad', image: '5.PNG', price: 320, category: 'starters' },
    { id: 6, name: 'Pizza', image: '6.PNG', price: 120, category: 'main course' },
    { id: 7, name: 'Pizza margarita', image: '6.PNG', price: 120, category: 'main course' },
    { id: 8, name: 'The knowing sea', image: '9.png', price: 130, category: 'main course' },
    { id: 9, name: 'Chocolate Cake', image: '18.jpg', price: 250, category: 'desserts' },
    { id: 10, name: 'Ice Cream Sundae', image: '11.PNG', price: 180, category: 'desserts' },
    { id: 11, name: 'Apple Pie', image: '12.PNG', price: 200, category: 'desserts' },
    { id: 12, name: 'Soda', image: '13.PNG', price: 50, category: 'beverages' },
    { id: 13, name: 'Orange Juice', image: '14.PNG', price: 60, category: 'beverages' },
    { id: 14, name: 'Milkshake', image: '15.PNG', price: 100, category: 'beverages' },
    { id: 15, name: 'Mini Pizza', image: '16.PNG', price: 90, category: 'kids menu' },
    { id: 16, name: 'Chicken Nuggets', image: '17.PNG', price: 110, category: 'kids menu' }
];

// Cart Data
let listCards = {};

// Initialize App with Category Filter
function initApp(category = 'all') {
    list.innerHTML = '';

    const listContainer = document.createElement('div');
    listContainer.classList.add('list-container');
    list.appendChild(listContainer);

    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);

    filteredProducts.forEach((product) => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('pro-card'); // Professional card class
        newDiv.innerHTML = `
            <div class="pro-card-img-wrap">
                <img src="images/${product.image}" alt="${product.name}" class="pro-card-img">
            </div>
            <div class="pro-card-body">
                <div class="pro-card-title">${product.name}</div>
                <div class="pro-card-price">${product.price.toLocaleString()} <span class="pro-card-currency">KR</span></div>
                <button class="pro-card-btn" onclick="addToCart(${product.id})">Add To Cart</button>
            </div>
        `;
        listContainer.appendChild(newDiv);
    });
}

// Event Listener for Category Buttons
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category; // Use data attribute for exact matching
        initApp(category); // Filter and display selected category
    });
});

// Show all products initially
initApp('all');

// Add Product to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!listCards[product.id]) {
        listCards[product.id] = { ...product, quantity: 1 };
    } else {
        listCards[product.id].quantity++;
    }
    
    reloadCart();
}

// Reload Cart (Ensuring Correct Structure)
function reloadCart() {
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;

    Object.values(listCards).forEach((product) => {
        totalPrice += product.price * product.quantity;
        count += product.quantity;

        const newDiv = document.createElement('li');
        newDiv.classList.add('cart-item-pro');
        newDiv.innerHTML = `
        <div class="cart-item-pro-img-wrap">
            <img src="images/${product.image}" alt="${product.name}" class="cart-item-pro-img">
        </div>
        <div class="cart-item-pro-details">
            <div class="cart-item-pro-title">${product.name}</div>
            <div class="cart-item-pro-price">${product.price.toLocaleString()} KR</div>
            <div class="cart-item-pro-controls">
                <button onclick="changeQuantity(${product.id}, -1)">-</button>
                <span class="count">${product.quantity}</span>
                <button onclick="changeQuantity(${product.id}, 1)">+</button>
            </div>
        </div>
        `;
        listCard.appendChild(newDiv);
    });

    total.innerHTML = `<span class="cart-total-label">Total:</span> <span class="cart-total-value">${totalPrice.toLocaleString()} KR</span>`;
    quantity.innerText = count;
}

// Change Product Quantity
function changeQuantity(productId, change) {
    if (listCards[productId]) {
        listCards[productId].quantity += change;

        if (listCards[productId].quantity <= 0) {
            delete listCards[productId];
        }

        reloadCart();
    }
}

// Close cart when clicking outside the cart
window.addEventListener('click', function(e) {
    const card = document.querySelector('.card');
    const shopping = document.querySelector('.shopping');
    if (
        body.classList.contains('active') &&
        !card.contains(e.target) &&
        !shopping.contains(e.target)
    ) {
        body.classList.remove('active');
    }
});
