<?php
// ============================================================
// MoonPaw – Login API
// ============================================================
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed');
}

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    jsonResponse(false, 'Email dan password harus diisi');
}

$db = getDB();
$stmt = $db->prepare("SELECT * FROM users WHERE email = ? AND status = 'aktif' LIMIT 1");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(false, 'Email tidak ditemukan atau akun tidak aktif');
}

if (!password_verify($password, $user['password'])) {
    jsonResponse(false, 'Password salah');
}

// Login berhasil
jsonResponse(true, 'Login berhasil', [
    'user' => [
        'id' => $user['id'],
        'name' => $user['firstname'] . ' ' . $user['lastname'],
        'email' => $user['email'],
        'role' => $user['role'],
        'phone' => $user['phone'],
        'city' => $user['city']
    ]
]);
