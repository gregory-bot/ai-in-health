<?php
// Enable error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set the content type to application/json
header('Content-Type: application/json');

// Include database configuration
require_once 'config.php'; // Ensure this file contains your DB connection details

// Retrieve the raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Check if the required fields are present
if (isset($data['email']) && isset($data['password'])) {
    $email = $data['email'];
    $password = $data['password'];

    // Create a new MySQLi connection
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

    // Check the connection
    if ($mysqli->connect_error) {
        echo json_encode(['success' => false, 'error' => 'Database connection failed.']);
        exit;
    }

    // Prepare the SQL statement to prevent SQL injection
    $stmt = $mysqli->prepare('SELECT id, username, password_hash FROM users WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();

    // Check if the user exists
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $username, $password_hash);
        $stmt->fetch();

        // Verify the password
        if (password_verify($password, $password_hash)) {
            // Password is correct
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $id,
                    'username' => $username,
                    'email' => $email
                ]
            ]);
        } else {
            // Invalid password
            echo json_encode(['success' => false, 'error' => 'Invalid email or password.']);
        }
    } else {
        // User does not exist
        echo json_encode(['success' => false, 'error' => 'Invalid email or password.']);
    }

    // Close the statement and connection
    $stmt->close();
    $mysqli->close();
} else {
    // Missing email or password
    echo json_encode(['success' => false, 'error' => 'Email and password are required.']);
}
?>
