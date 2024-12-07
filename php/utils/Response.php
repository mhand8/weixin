<?php
class Response {
    public static function json($data, $code = 200, $message = 'success') {
        header('Content-Type: application/json');
        echo json_encode([
            'code' => $code,
            'message' => $message,
            'data' => $data
        ]);
        exit;
    }

    public static function error($message = 'error', $code = 400) {
        self::json(null, $code, $message);
    }

    public static function success($data = null, $message = 'success') {
        self::json($data, 200, $message);
    }
} 