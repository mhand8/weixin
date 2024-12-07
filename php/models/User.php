<?php
require_once __DIR__ . '/../utils/Database.php';

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($data) {
        $sql = "INSERT INTO users (nickName, avatarUrl, phone, isAdmin, createTime) 
                VALUES (:nickName, :avatarUrl, :phone, :isAdmin, :createTime)";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':nickName' => $data['nickName'],
            ':avatarUrl' => $data['avatarUrl'],
            ':phone' => $data['phone'],
            ':isAdmin' => isset($data['isAdmin']) ? $data['isAdmin'] : 0,
            ':createTime' => date('Y-m-d H:i:s')
        ]);
    }

    public function getByPhone($phone) {
        $sql = "SELECT * FROM users WHERE phone = :phone";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':phone' => $phone]);
        return $stmt->fetch();
    }

    public function update($id, $data) {
        $sql = "UPDATE users SET 
                nickName = :nickName,
                avatarUrl = :avatarUrl,
                phone = :phone
                WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':nickName' => $data['nickName'],
            ':avatarUrl' => $data['avatarUrl'],
            ':phone' => $data['phone']
        ]);
    }

    public function getAll() {
        $sql = "SELECT * FROM users ORDER BY createTime DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }
} 