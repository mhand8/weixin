<?php
require_once __DIR__ . '/../models/Album.php';
require_once __DIR__ . '/../utils/Response.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$album = new Album();

// 获取请求方法
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $result = $album->getById($_GET['id']);
            if ($result) {
                Response::success($result);
            } else {
                Response::error('Album not found', 404);
            }
        } else if (isset($_GET['creatorId'])) {
            $result = $album->getByCreator($_GET['creatorId']);
            Response::success($result);
        } else {
            $result = $album->getAll();
            Response::success($result);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            Response::error('Invalid data');
            break;
        }

        if ($album->create($data)) {
            Response::success(null, 'Album created successfully');
        } else {
            Response::error('Failed to create album');
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['id'])) {
            Response::error('Invalid data');
            break;
        }

        if ($album->update($data['id'], $data)) {
            Response::success(null, 'Album updated successfully');
        } else {
            Response::error('Failed to update album');
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['id'])) {
            Response::error('Invalid data');
            break;
        }

        if ($album->delete($data['id'])) {
            Response::success(null, 'Album deleted successfully');
        } else {
            Response::error('Failed to delete album');
        }
        break;

    default:
        Response::error('Method not allowed', 405);
        break;
} 