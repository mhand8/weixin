<?php
require_once __DIR__ . '/../models/Album.php';
require_once __DIR__ . '/../utils/Response.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$album = new Album();

// 获取请求方法
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (!isset($_GET['albumId'])) {
            Response::error('Album ID is required');
            break;
        }

        $result = $album->getPhotos($_GET['albumId']);
        Response::success($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['albumId']) || !isset($data['photoUrl']) || !isset($data['uploaderId'])) {
            Response::error('Invalid data');
            break;
        }

        if ($album->addPhoto($data['albumId'], $data['photoUrl'], $data['uploaderId'])) {
            Response::success(null, 'Photo added successfully');
        } else {
            Response::error('Failed to add photo');
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['id'])) {
            Response::error('Invalid data');
            break;
        }

        if ($album->removePhoto($data['id'])) {
            Response::success(null, 'Photo removed successfully');
        } else {
            Response::error('Failed to remove photo');
        }
        break;

    default:
        Response::error('Method not allowed', 405);
        break;
} 