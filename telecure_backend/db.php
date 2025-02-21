<?php
// db.php
$host = 'localhost';
$db = 'telecure_db';
$user = 'root'; // Default XAMPP MySQL username
$pass = '';     // Default XAMPP MySQL password is empty

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected to the database $db successfully.";
} catch (PDOException $e) {
    die("Could not connect to the database $db: " . $e->getMessage());
}
