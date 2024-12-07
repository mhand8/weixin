// pages/album/detail.js
Page({
  data: {
    album: null,
    isAdmin: false,
    isCreator: false
  },

  onLoad(options) {
    const { id } = options;
    const userInfo = wx.getStorageSync('userInfo');
    
    // 获取相册信息
    const albums = wx.getStorageSync('albums') || [];
    const album = albums.find(a => a.id == id);

    if (album) {
      this.setData({
        album,
        isAdmin: userInfo.isAdmin,
        isCreator: album.creator.nickName === userInfo.nickName
      });
    } else {
      wx.showToast({
        title: '相册不存在',
        icon: 'error',
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
    }
  },

  // 预览图片
  previewImage(e) {
    const { url } = e.currentTarget.dataset;
    wx.previewImage({
      current: url,
      urls: this.data.album.images
    });
  },

  // 添加照片
  addPhotos() {
    wx.chooseImage({
      count: 9,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        
        // 更新相册数据
        let albums = wx.getStorageSync('albums') || [];
        const index = albums.findIndex(a => a.id === this.data.album.id);
        
        if (index > -1) {
          albums[index].images = [...albums[index].images, ...tempFilePaths];
          wx.setStorageSync('albums', albums);
          
          this.setData({
            'album.images': albums[index].images
          });

          wx.showToast({
            title: '添加成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 删除相册
  deleteAlbum() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个相册吗？',
      success: (res) => {
        if (res.confirm) {
          let albums = wx.getStorageSync('albums') || [];
          albums = albums.filter(a => a.id !== this.data.album.id);
          wx.setStorageSync('albums', albums);
          
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            success: () => {
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
            }
          });
        }
      }
    });
  },

  // 删除单张照片
  deletePhoto(e) {
    const { index } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这张照片吗？',
      success: (res) => {
        if (res.confirm) {
          // 更新相册数据
          let albums = wx.getStorageSync('albums') || [];
          const albumIndex = albums.findIndex(a => a.id === this.data.album.id);
          
          if (albumIndex > -1) {
            // 删除指定索引的照片
            albums[albumIndex].images.splice(index, 1);
            wx.setStorageSync('albums', albums);
            
            // 更新页面数据
            this.setData({
              'album.images': albums[albumIndex].images
            });

            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
          }
        }
      }
    });
  }
}); 