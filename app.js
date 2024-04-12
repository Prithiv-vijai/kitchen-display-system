let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');

openShopping.addEventListener('click', ()=>{
    body.classList.add('active');
})
closeShopping.addEventListener('click', ()=>{
    body.classList.remove('active');
})

let products = [
    {
        id: 1,
        name: 'CHICKEN AND PASTA',
        image: '1.PNG',
        price: 150
    },
    {
        id: 2,
        name: 'TANDOORI',
        image: '2.PNG',
        price: 120
    },
    {
        id: 3,
        name: 'ITALIAN SALAD',
        image: '3.PNG',
        price: 220
    },
    {
        id: 4,
        name: 'BUTTER MASALA',
        image: '4.PNG',
        price: 175
    },
    {
        id: 5,
        name: 'BERRY AND SALAD',
        image: '5.PNG',
        price: 100
    },
    {
        id: 6,
        name: 'PIZZA',
        image: '6.PNG',
        price: 120
    },
    
];

let listCards  = [];
function initApp(){
    products.forEach((value, key) =>{
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="image/${value.image}">
            <div class="title">${value.name}</div>
            <div class="price">${value.price.toLocaleString()}</div>
            <button onclick="addToCard(${key})">Add To Cart</button>`;
        list.appendChild(newDiv);
    })
}

initApp();
function addToCard(key){
    if(listCards[key] == null){
        // copy product form list to list card
        listCards[key] = JSON.parse(JSON.stringify(products[key]));
        listCards[key].quantity = 1;
    }
    reloadCard();
}
function reloadCard() {
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    listCards.forEach((value, key) => {
      totalPrice = totalPrice + (value.price * value.quantity);
      count = count + value.quantity;
      if (value != null) {
        let newDiv = document.createElement('li');
        newDiv.innerHTML = `
          <div><img src="image/${value.image}"/></div>
          <div>${value.name}</div>
          <div>${value.price.toLocaleString()}</div>
          <div>
            <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
            <div class="count">${value.quantity}</div>
            <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
          </div>`;
        listCard.appendChild(newDiv);
      }
    });
    // Add the rupee symbol to the total price
    total.innerText = '₹' + totalPrice.toLocaleString();
    quantity.innerText = count;
  }
  

function changeQuantity(key, quantity){
    if(quantity == 0){
        delete listCards[key];
    }else{
        listCards[key].quantity = quantity;
        listCards[key].price = products[key].price * quantity;
    }
    reloadCard();
}

function sendOrderToPHP(orderData) {
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Define the PHP script URL
    const url = 'save_order.php';

    // Set up the request
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Define the callback function to handle the response
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Request was successful
            console.log('Order successfully saved to database.');
        } else {
            // Error handling
            console.error('Error saving order to database.');
        }
    };

    // Convert orderData to JSON format
    const jsonData = JSON.stringify(orderData);

    // Send the request with the order data
    xhr.send(jsonData);
}

function placeOrder() {
    // Check if the cart is not empty
    if (Object.keys(listCards).length > 0) {
        // Get the current table number (assuming it's selected)
        const selectedTable = document.querySelector('input[name="table"]:checked');
        if (selectedTable) {
            const tableNumber = selectedTable.value;
            // Construct the order data
            const orderData = {
                table_number: tableNumber,
                order_time: new Date().toISOString(),
                order_details: []
            };

            // Extract the name and quantity of each item and add them to orderData
            Object.values(listCards).forEach(item => {
                orderData.order_details.push({
                    name: item.name,
                    quantity: item.quantity
                });
            });

            // Send the order data to PHP for saving to the database
            sendOrderToPHP(orderData);
            // Reset the cart
            
            

            reloadCard();
            alert('Order placed successfully!');
        } else {
            alert('Please select a table before placing the order.');
        }
    } else {
        alert('Your cart is empty. Please add items before placing an order.');
    }
}