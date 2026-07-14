<?php
// ============================================================
// MoonPaw – Users CRUD API
// ============================================================
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    // Ambil semua users
    try {
        $stmt = $db->query("SELECT id, firstname, lastname, email, status, created_at FROM users ORDER BY id DESC");
        $users = $stmt->fetchAll();
        jsonResponse(true, 'Data users berhasil diambil', ['users' => $users]);
    } catch (PDOException $e) {
        jsonResponse(false, 'Gagal mengambil data: ' . $e->getMessage());
    }
}

$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    // Tambah user baru
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $status = $input['status'] ?? 'aktif';

    if (empty($name) || empty($email) || empty($password)) {
        jsonResponse(false, 'Nama, email, dan password wajib diisi');
    }

    // Pisah nama depan & belakang
    $parts = explode(' ', $name, 2);
    $firstname = $parts[0];
    $lastname = $parts[1] ?? '';

    try {
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            jsonResponse(false, 'Email sudah terdaftar');
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $db->prepare("INSERT INTO users (firstname, lastname, email, password, role, status) VALUES (?, ?, ?, ?, 'user', ?)");
        $stmt->execute([$firstname, $lastname, $email, $hashedPassword, $status]);

        jsonResponse(true, 'User berhasil ditambahkan');
    } catch (PDOException $e) {
        jsonResponse(false, 'Gagal menambah user: ' . $e->getMessage());
    }
}

if ($method === 'PUT') {
    // Update user
    $id = $input['id'] ?? null;
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $status = $input['status'] ?? 'aktif';

    if (!$id || empty($name) || empty($email)) {
        jsonResponse(false, 'ID, Nama, dan Email wajib diisi');
    }

    // Pisah nama depan & belakang
    $parts = explode(' ', $name, 2);
    $firstname = $parts[0];
    $lastname = $parts[1] ?? '';

    try {
        // Cek email duplikat di user lain
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1");
        $stmt->execute([$email, $id]);
        if ($stmt->fetch()) {
            jsonResponse(false, 'Email sudah digunakan oleh user lain');
        }

        $stmt = $db->prepare("UPDATE users SET firstname = ?, lastname = ?, email = ?, status = ? WHERE id = ?");
        $stmt->execute([$firstname, $lastname, $email, $status, $id]);

        jsonResponse(true, 'User berhasil diperbarui');
    } catch (PDOException $e) {
        jsonResponse(false, 'Gagal memperbarui user: ' . $e->getMessage());
    }
}

if ($method === 'DELETE') {
    // Hapus user
    $id = $input['id'] ?? null;
    if (!$id) {
        jsonResponse(false, 'ID wajib diisi');
    }

    try {
        $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(true, 'User berhasil dihapus');
    } catch (PDOException $e) {
        jsonResponse(false, 'Gagal menghapus user: ' . $e->getMessage());
    }
}

if ($method === 'PATCH') {
    // Verifikasi / ubah status aktif
    $id = $input['id'] ?? null;
    if (!$id) {
        jsonResponse(false, 'ID wajib diisi');
    }

    try {
        $stmt = $db->prepare("UPDATE users SET status = 'aktif' WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(true, 'User berhasil diverifikasi');
    } catch (PDOException $e) {
        jsonResponse(false, 'Gagal verifikasi user: ' . $e->getMessage());
    }
}
