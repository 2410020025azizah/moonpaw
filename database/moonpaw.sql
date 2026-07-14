-- ============================================================
-- MoonPaw Database Setup
-- ============================================================

CREATE DATABASE IF NOT EXISTS moonpaw CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE moonpaw;

-- Tabel Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(100),
  city VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') DEFAULT 'user',
  status ENUM('aktif','nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Insert Admin default (password: admin123)
INSERT INTO users (id, firstname, lastname, email, phone, city, password, role, status) VALUES
(1, 'Admin', 'MoonPaw', 'moonpawpet@gmail.com', '08123456789', 'Banjarmasin', '$2y$12$uCvBs92DbP6z5bpwxgzOQOb75duiqiuRnIDp4KSWINL25DPuFfLPG', 'admin', 'aktif')
ON DUPLICATE KEY UPDATE password=VALUES(password);

-- Insert User demo / Customer Amanda (password: customer123)
INSERT INTO users (id, firstname, lastname, email, phone, city, password, role, status) VALUES
(2, 'Amanda', 'Putri', 'amanda@moonpaw.com', '08199887766', 'Banjarbaru', '$2y$12$MQZIJvyj8TEZzmbjt86f4OVLANdL6EpmcfGhKvMUzRyCI/UNMXoum', 'user', 'aktif')
ON DUPLICATE KEY UPDATE firstname=VALUES(firstname), lastname=VALUES(lastname), email=VALUES(email), password=VALUES(password);
