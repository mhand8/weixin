-- 创建数据库
CREATE DATABASE IF NOT EXISTS community CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE community;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickName VARCHAR(50) NOT NULL,
    avatarUrl VARCHAR(255),
    phone VARCHAR(20) NOT NULL UNIQUE,
    isAdmin TINYINT(1) DEFAULT 0,
    createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateTime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 活动表
CREATE TABLE IF NOT EXISTS meetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    location VARCHAR(255),
    meetingTime DATETIME,
    creatorId INT,
    status TINYINT(1) DEFAULT 1,
    createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateTime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creatorId) REFERENCES users(id)
);

-- 活动参与者表
CREATE TABLE IF NOT EXISTS meeting_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meetingId INT,
    userId INT,
    createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meetingId) REFERENCES meetings(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- 相册表
CREATE TABLE IF NOT EXISTS albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    coverUrl VARCHAR(255),
    creatorId INT,
    createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    updateTime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creatorId) REFERENCES users(id)
);

-- 相册照片表
CREATE TABLE IF NOT EXISTS album_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    albumId INT,
    photoUrl VARCHAR(255) NOT NULL,
    uploaderId INT,
    createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (albumId) REFERENCES albums(id),
    FOREIGN KEY (uploaderId) REFERENCES users(id)
); 