<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Response.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$user = new User();

// 获取请求方法
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (isset($_GET['phone'])) {
            $result = $user->getByPhone($_GET['phone']);
            if ($result) {
                Response::success($result);
            } else {
                Response::error('User not found', 404);
            }
        } else {
            $result = $user->getAll();
            Response::success($result);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            Response::error('Invalid data');
            break;
        }

        if ($user->create($data)) {
            Response::success(null, 'User created successfully');
        } else {
            Response::error('Failed to create user');
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['id'])) {
            Response::error('Invalid data');
            break;
        }

        if ($user->update($data['id'], $data)) {
            Response::success(null, 'User updated successfully');
        } else {
            Response::error('Failed to update user');
        }
        break;

    default:
        Response::error('Method not allowed', 405);
        break;
} 