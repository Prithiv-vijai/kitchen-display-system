<?php
// Retrieve POST data sent from JavaScript
$orderData = json_decode(file_get_contents('php://input'), true);

// Debug: Output the received data
error_log('Received order data: ' . print_r($orderData, true));

// Check if the orderData is null or not an array
if (!$orderData || !is_array($orderData)) {
    die('Invalid order data.');
}

// Establish connection to the database
$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'kds';

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    die('Connection failed: ' . mysqli_connect_error());
}

// Check if table number is set
if (!isset($orderData['table_number']) || empty($orderData['table_number'])) {
    die('Table number is required.');
}

// Set the default timezone to IST
date_default_timezone_set('Asia/Kolkata');

// Get the current time in IST
$orderTime = date('Y-m-d H:i:s');

// Extract the order time from the received data, if provided
if (isset($orderData['order_time'])) {
    $orderTime = $orderData['order_time'];
}

$tableNumber = $orderData['table_number'];
$orderDetails = '';
foreach ($orderData['order_details'] as $item) {
    $orderDetails .= $item['name'] . ': ' . $item['quantity'] . ', ';
}
$orderDetails = rtrim($orderDetails, ', ');

// Add order_status column and set it to 'hold'
$orderStatus = 'hold';

// Insert order data into the database with the new order_status column
$sql = "INSERT INTO orders (table_number, order_details, order_time, order_status) VALUES (?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, 'isss', $tableNumber, $orderDetails, $orderTime, $orderStatus);

// Execute the prepared statement
if (mysqli_stmt_execute($stmt)) {
    // Check if the order was successfully inserted
    if (mysqli_stmt_affected_rows($stmt) > 0) {
        echo 'Order successfully saved to database.';
    } else {
        echo 'Error: Order not inserted into database.';
    }
} else {
    echo 'Error executing SQL statement: ' . mysqli_error($conn);
}

// Close statement and connection
mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
