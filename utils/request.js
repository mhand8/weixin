const BASE_URL = 'https://www.chenyutv.com/weixin';

// 统一请求方法
const request = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}${url}`,
      ...options,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: reject
    });
  });
};

// API方法
module.exports = {
  // 用户相关
  user: {
    // 创建用户
    create: (data) => {
      return request('/api/user.php', {
        method: 'POST',
        data
      });
    },
    // 更新用户信息
    update: (id, data) => {
      return request('/api/user.php', {
        method: 'PUT',
        data: { id, ...data }
      });
    },
    // 获取用户信息
    getByPhone: (phone) => {
      return request('/api/user.php?phone=' + phone);
    }
  },

  // 活动相关
  meetings: {
    // 获取活动列表
    getList: () => {
      return request('/api/meetings.php');
    },
    // 创建活动
    create: (data) => {
      return request('/api/meetings.php', {
        method: 'POST',
        data
      });
    },
    // 更新活动
    update: (id, data) => {
      return request('/api/meetings.php', {
        method: 'PUT',
        data: { id, ...data }
      });
    },
    // 删除活动
    delete: (id) => {
      return request('/api/meetings.php', {
        method: 'DELETE',
        data: { id }
      });
    },
    // 参加活动
    join: (meetingId, userId) => {
      return request('/api/meeting_participants.php', {
        method: 'POST',
        data: { meetingId, userId }
      });
    }
  },

  // 相册相关
  albums: {
    // 获取相册列表
    getList: () => {
      return request('/api/albums.php');
    },
    // 创建相册
    create: (data) => {
      return request('/api/albums.php', {
        method: 'POST',
        data
      });
    },
    // 更新相册
    update: (id, data) => {
      return request('/api/albums.php', {
        method: 'PUT',
        data: { id, ...data }
      });
    },
    // 删除相册
    delete: (id) => {
      return request('/api/albums.php', {
        method: 'DELETE',
        data: { id }
      });
    }
  },

  // 相册照片相关
  photos: {
    // 上传照片
    upload: (filePath) => {
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: `${BASE_URL}/api/upload.php`,
          filePath: filePath,
          name: 'file',
          success: (res) => {
            if (res.statusCode === 200) {
              resolve(JSON.parse(res.data));
            } else {
              reject(res);
            }
          },
          fail: reject
        });
      });
    },
    // 添加照片到相册
    addToAlbum: (albumId, photoUrl, uploaderId) => {
      return request('/api/album_photos.php', {
        method: 'POST',
        data: { albumId, photoUrl, uploaderId }
      });
    },
    // 从相册删除照片
    removeFromAlbum: (id) => {
      return request('/api/album_photos.php', {
        method: 'DELETE',
        data: { id }
      });
    }
  }
}; 