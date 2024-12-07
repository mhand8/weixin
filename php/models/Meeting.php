<?php
require_once __DIR__ . '/../utils/Database.php';

class Meeting {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($data) {
        $sql = "INSERT INTO meetings (title, content, location, meetingTime, creatorId, status) 
                VALUES (:title, :content, :location, :meetingTime, :creatorId, :status)";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':title' => $data['title'],
            ':content' => $data['content'],
            ':location' => $data['location'],
            ':meetingTime' => $data['meetingTime'],
            ':creatorId' => $data['creatorId'],
            ':status' => isset($data['status']) ? $data['status'] : 1
        ]);
    }

    public function update($id, $data) {
        $sql = "UPDATE meetings SET 
                title = :title,
                content = :content,
                location = :location,
                meetingTime = :meetingTime,
                status = :status
                WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':title' => $data['title'],
            ':content' => $data['content'],
            ':location' => $data['location'],
            ':meetingTime' => $data['meetingTime'],
            ':status' => isset($data['status']) ? $data['status'] : 1
        ]);
    }

    public function delete($id) {
        // 首先删除相关的参与者记录
        $sql = "DELETE FROM meeting_participants WHERE meetingId = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);

        // 然后删除活动
        $sql = "DELETE FROM meetings WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    public function getById($id) {
        $sql = "SELECT m.*, u.nickName as creatorName, u.avatarUrl as creatorAvatar 
                FROM meetings m 
                LEFT JOIN users u ON m.creatorId = u.id 
                WHERE m.id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function getAll() {
        $sql = "SELECT m.*, u.nickName as creatorName, u.avatarUrl as creatorAvatar 
                FROM meetings m 
                LEFT JOIN users u ON m.creatorId = u.id 
                ORDER BY m.createTime DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getByCreator($creatorId) {
        $sql = "SELECT m.*, u.nickName as creatorName, u.avatarUrl as creatorAvatar 
                FROM meetings m 
                LEFT JOIN users u ON m.creatorId = u.id 
                WHERE m.creatorId = :creatorId 
                ORDER BY m.createTime DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':creatorId' => $creatorId]);
        return $stmt->fetchAll();
    }

    public function addParticipant($meetingId, $userId) {
        // 检查是否已经参加
        $sql = "SELECT id FROM meeting_participants 
                WHERE meetingId = :meetingId AND userId = :userId";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':meetingId' => $meetingId,
            ':userId' => $userId
        ]);
        
        if ($stmt->fetch()) {
            return false; // 已经参加过
        }

        // 添加参与者
        $sql = "INSERT INTO meeting_participants (meetingId, userId) 
                VALUES (:meetingId, :userId)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':meetingId' => $meetingId,
            ':userId' => $userId
        ]);
    }

    public function getParticipants($meetingId) {
        $sql = "SELECT u.* 
                FROM meeting_participants mp 
                JOIN users u ON mp.userId = u.id 
                WHERE mp.meetingId = :meetingId";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':meetingId' => $meetingId]);
        return $stmt->fetchAll();
    }
} 