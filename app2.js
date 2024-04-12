let orders = [];

function init() {
    fetchOrders();
    // Set interval to fetch orders periodically (every 5 seconds in this example)
    
}


function fetchOrders() {
    fetch('fetch_orders.php')
        .then(response => response.json())
        .then(data => {
            orders = data;
            renderOrders();
            updateOrderCounts(); // Update counts after fetching orders
        })
        .catch(error => console.error('Error fetching orders:', error));
}

function updateOrderStatus(orderId, status) {
    fetch('update_order_status.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `orderId=${orderId}&status=${status}`,
    })
    .then(response => {
        if (response.ok) {
            console.log('Order status updated successfully.');
            fetchOrders(); // Refresh orders after update
        } else {
            console.error('Error updating order status.');
        }
    })
    .catch(error => console.error('Error updating order status:', error));
}

function moveToProgress(orderId) {
    updateOrderStatus(orderId, 'progress');
}

function moveToCompleted(orderId) {
    updateOrderStatus(orderId, 'completed');
}

function deleteOrder(orderId) {
    updateOrderStatus(orderId, 'deleted');
}

function renderOrders() {
    const holdList = document.getElementById('hold-orders');
    const progressList = document.getElementById('progress-orders');
    const completedList = document.getElementById('completed-orders');

    // Clear existing orders
    holdList.innerHTML = '';
    progressList.innerHTML = '';
    completedList.innerHTML = '';

    orders.forEach(order => {
        const orderElement = document.createElement('li');
        orderElement.className = 'order';

        // Get hours and minutes from order time
        const orderTime = new Date(order.order_time);
        const hours = orderTime.getHours();
        const minutes = orderTime.getMinutes();
        const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`; // Format time as "hh:mm"

        orderElement.innerHTML = `
        <div class="order-details">
            <div class="table-time">
                <span>Table - ${order.table_number}</span>
                <span>Time - ${formattedTime}</span>
            </div>
            <div class="order-details-description">
                <span>${order.order_details}</span>
            </div>
        </div>
        <div class="order-actions">
            ${getActionButtons(order)}
        </div>
    `;
    
        // Add order to appropriate list
        if (order.order_status === 'hold') {
            holdList.appendChild(orderElement);
        } else if (order.order_status === 'progress') {
            progressList.appendChild(orderElement);
        } else if (order.order_status === 'completed') {
            completedList.appendChild(orderElement);
        }
    });
}

function getActionButtons(order) {
    if (order.order_status === 'hold') {
        return `
            <button onclick="moveToProgress(${order.order_id})">Start</button>
        `;
    } else if (order.order_status === 'progress') {
        return `
            <button onclick="moveToCompleted(${order.order_id})">Complete</button>
        `;
    } else if (order.order_status === 'completed') {
        return `
            <button onclick="deleteOrder(${order.order_id})">Delete</button>
        `;
    }
}

function updateOrderCounts() {
    const holdCount = orders.filter(order => order.order_status === 'hold').length;
    const progressCount = orders.filter(order => order.order_status === 'progress').length;
    const completedCount = orders.filter(order => order.order_status === 'completed').length;

    document.getElementById('hold-count').textContent = holdCount;
    document.getElementById('progress-count').textContent = progressCount;
    document.getElementById('completed-count').textContent = completedCount;
}


// Initialize the app
init();
