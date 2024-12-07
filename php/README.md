# 社区小程序后端API

这是一个基于PHP的后端API系统，用于支持社区小程序的数据存储和管理功能。

## 系统要求

- PHP 7.4+
- MySQL 5.7+
- Apache/Nginx Web服务器
- PHP PDO扩展
- PHP GD扩展（用于图片处理）

## 目录结构

```
php/
├── api/            # API接口文件
├── config/         # 配置文件
├── models/         # 数据模型
├── utils/          # 工具类
├── uploads/        # 文件上传目录
│   ├── images/     # 图片存储
│   └── temp/       # 临时文件
└── README.md       # 说明文档
```

## 安装步骤

1. 配置数据库
   - 修改 `config/database.php` 中的数据库连接信息
   - 导入 `config/init.sql` 到MySQL数据库中

2. 配置Web服务器
   - 将整个php目录放置在Web服务器的根目录下
   - 确保 `uploads` 目录具有写入权限

3. 配置URL重写（可选）
   如果使用Apache，在根目录创建 `.htaccess` 文件：
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ index.php [QSA,L]
   ```

## API接口说明

### 用户接口 (/api/user.php)
- GET /?phone={phone} - 获取用户信息
- POST / - 创建新用户
- PUT / - 更新用户信息

### 文件上传 (/api/upload.php)
- POST / - 上传文件
  - 支持的文件类型：jpg, jpeg, png, gif
  - 文件大小限制：10MB

## 安全配置

1. 确保php.ini中设置：
   ```ini
   file_uploads = On
   upload_max_filesize = 10M
   post_max_size = 10M
   ```

2. 设置目录权限：
   ```bash
   chmod 755 php
   chmod 777 php/uploads/images
   chmod 777 php/uploads/temp
   ```

## 注意事项

1. 在生产环境中，请务必：
   - 修改数据库默认密码
   - 配置SSL证书
   - 设置适当的文件上传限制
   - 添加请求频率限制
   - 实现用户认证机制

2. 定期备份：
   - 数据库备份
   - 上传的文件备份 