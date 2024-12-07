<?php
require_once __DIR__ . '/../utils/Database.php';

class Album {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($data) {
        $sql = "INSERT INTO albums (title, description, coverUrl, creatorId) 
                VALUES (:title, :description, :coverUrl, :creatorId)";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':title' => $data['title'],
            ':description' => isset($data['description']) ? $data['description'] : '',
            ':coverUrl' => isset($data['coverUrl']) ? $data['coverUrl'] : '',
            ':creatorId' => $data['creatorId']
        ]);
    }

    public function update($id, $data) {
        $sql = "UPDATE albums SET 
                title = :title,
                description = :description,
                coverUrl = :coverUrl
                WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':title' => $data['title'],
            ':description' => isset($data['description']) ? $data['description'] : '',
            ':coverUrl' => isset($data['coverUrl']) ? $data['coverUrl'] : ''
        ]);
    }

    public function delete($id) {
        // 首先删除相册中的所有照片
        $sql = "DELETE FROM album_photos WHERE albumId = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);

        // 然后删除相册
        $sql = "DELETE FROM albums WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    public function getById($id) {
        $sql = "SELECT a.*, u.nickName as creatorName, u.avatarUrl as creatorAvatar 
                FROM albums a 
                LEFT JOIN users u ON a.creatorId = u.id 
                WHERE a.id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $album = $stmt->fetch();

        if ($album) {
            // 获取相册中的照片
            $album['photos'] = $this->getPhotos($id);
        }

        return $album;
    }

    public function getAll() {
        $sql = "SELECT a.*, u.nickName as creatorName, u.avatarUrl as creatorAvatar 
                FROM albums a 
                LEFT JOIN users u ON a.creatorId = u.id 
                ORDER BY a.createTime DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $albums = $stmt->fetchAll();

        // 获取每个相册的照片数量
        foreach ($albums as &$album) {
            $album['photos'] = $this->getPhotos($album['id']);
        }

        return $albums;
    }

    public function getByCreator($creatorId) {
        $sql = "SELECT a.*, u.nickName as creatorName, u.avatarUrl as creatorAvatar 
                FROM albums a 
                LEFT JOIN users u ON a.creatorId = u.id 
                WHERE a.creatorId = :creatorId 
                ORDER BY a.createTime DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':creatorId' => $creatorId]);
        $albums = $stmt->fetchAll();

        // 获取每个相册的照片数量
        foreach ($albums as &$album) {
            $album['photos'] = $this->getPhotos($album['id']);
        }

        return $albums;
    }

    public function addPhoto($albumId, $photoUrl, $uploaderId) {
        $sql = "INSERT INTO album_photos (albumId, photoUrl, uploaderId) 
                VALUES (:albumId, :photoUrl, :uploaderId)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':albumId' => $albumId,
            ':photoUrl' => $photoUrl,
            ':uploaderId' => $uploaderId
        ]);
    }

    public function removePhoto($id) {
        $sql = "DELETE FROM album_photos WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    public function getPhotos($albumId) {
        $sql = "SELECT ap.*, u.nickName as uploaderName, u.avatarUrl as uploaderAvatar 
                FROM album_photos ap 
                LEFT JOIN users u ON ap.uploaderId = u.id 
                WHERE ap.albumId = :albumId 
                ORDER BY ap.createTime DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':albumId' => $albumId]);
        return $stmt->fetchAll();
    }
} 