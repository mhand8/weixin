<?php
require_once __DIR__ . '/../models/Meeting.php';
require_once __DIR__ . '/../utils/Response.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$meeting = new Meeting();

// 获取请求方法
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $result = $meeting->getById($_GET['id']);
            if ($result) {
                // 获取参与者列表
                $participants = $meeting->getParticipants($_GET['id']);
                $result['participants'] = $participants;
                Response::success($result);
            } else {
                Response::error('Meeting not found', 404);
            }
        } else if (isset($_GET['creatorId'])) {
            $result = $meeting->getByCreator($_GET['creatorId']);
            Response::success($result);
        } else {
            $result = $meeting->getAll();
            Response::success($result);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            Response::error('Invalid data');
            break;
        }

        if ($meeting->create($data)) {
            Response::success(null, 'Meeting created successfully');
        } else {
            Response::error('Failed to create meeting');
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['id'])) {
            Response::error('Invalid data');
            break;
        }

        if ($meeting->update($data['id'], $data)) {
            Response::success(null, 'Meeting updated successfully');
        } else {
            Response::error('Failed to update meeting');
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['id'])) {
            Response::error('Invalid data');
            break;
        }

        if ($meeting->delete($data['id'])) {
            Response::success(null, 'Meeting deleted successfully');
        } else {
            Response::error('Failed to delete meeting');
        }
        break;

    default:
        Response::error('Method not allowed', 405);
        break;
} 