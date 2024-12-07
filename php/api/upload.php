<?php
require_once __DIR__ . '/../utils/Response.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

if (!isset($_FILES['file'])) {
    Response::error('No file uploaded');
}

$file = $_FILES['file'];
$fileName = $file['name'];
$fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

// 允许的文件类型
$allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];

if (!in_array($fileType, $allowedTypes)) {
    Response::error('Invalid file type');
}

// 生成唯一文件名
$newFileName = uniqid() . '.' . $fileType;
$uploadPath = __DIR__ . '/../uploads/images/' . $newFileName;

if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
    Response::success([
        'url' => '/uploads/images/' . $newFileName,
        'fileName' => $newFileName
    ], 'File uploaded successfully');
} else {
    Response::error('Failed to upload file');
} 