<?php
// ============================================================
// MoonPaw – Register API
// ============================================================
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed');
}

$input = json_decode(file_get_contents('php://input'), true);

$firstname = trim($input['firstname'] ?? '');
$lastname  = trim($input['lastname'] ?? '');
$email     = trim($input['email'] ?? '');
$phone     = trim($input['phone'] ?? '');
$city      = trim($input['city'] ?? '');
$password  = $input['password'] ?? '';

// Validasi
if (empty($firstname) || empty($lastname) || empty($email) || empty($password)) {
    jsonResponse(false, 'Semua kolom wajib diisi');
}

if (strlen($password) < 6) {
    jsonResponse(false, 'Password minimal 6 karakter');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'Format email tidak valid');
}

$db = getDB();

// Cek email sudah ada
$stmt = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonResponse(false, 'Email sudah terdaftar. Silakan login atau gunakan email lain.');
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    // Insert user baru
    $stmt = $db->prepare("INSERT INTO users (firstname, lastname, email, phone, city, password, role, status) VALUES (?, ?, ?, ?, ?, ?, 'user', 'aktif')");
    $stmt->execute([$firstname, $lastname, $email, $phone, $city, $hashedPassword]);

    $newId = $db->lastInsertId();

    jsonResponse(true, 'Registrasi berhasil', [
        'user' => [
            'id' => $newId,
            'name' => $firstname . ' ' . $lastname,
            'email' => $email,
            'role' => 'user'
        ]
    ]);
} catch (PDOException $e) {
    jsonResponse(false, 'Gagal menyimpan data ke database: ' . $e->getMessage());
}
