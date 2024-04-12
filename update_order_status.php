<?php
$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'kds';

// Check if orderId and status are provided in the POST request
if (isset($_POST['orderId'], $_POST['status'])) {
    $orderId = $_POST['orderId'];
    $status = $_POST['status'];

    $conn = mysqli_connect($servername, $username, $password, $dbname);

    if (!$conn) {
        die('Connection failed: ' . mysqli_connect_error());
    }

    $sql = "UPDATE orders SET order_status='$status' WHERE order_id=$orderId";

    if (mysqli_query($conn, $sql)) {
        echo 'Order status updated successfully.';
    } else {
        echo 'Error updating order status: ' . mysqli_error($conn);
    }

    mysqli_close($conn);
} else {
    echo 'Error: orderId and status parameters are missing in the POST request.';
}
?>
