<?php
require_once __DIR__ . '/../models/Meeting.php';
require_once __DIR__ . '/../utils/Response.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$meeting = new Meeting();

// 获取请求方法
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (!isset($_GET['meetingId'])) {
            Response::error('Meeting ID is required');
            break;
        }

        $result = $meeting->getParticipants($_GET['meetingId']);
        Response::success($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['meetingId']) || !isset($data['userId'])) {
            Response::error('Invalid data');
            break;
        }

        if ($meeting->addParticipant($data['meetingId'], $data['userId'])) {
            Response::success(null, 'Participant added successfully');
        } else {
            Response::error('Failed to add participant');
        }
        break;

    default:
        Response::error('Method not allowed', 405);
        break;
} 