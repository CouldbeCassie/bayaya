<?php
// Database connection
$conn = new mysqli("localhost", "username", "password", "database");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['status' => 'success', 'message' => 'User registered successfully']);
}
?>
