Page({
  data: {
    albums: [],
    isAdmin: false,
    userInfo: null
  },

  onLoad() {
    // 检查登录状态和管理员权限
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
      return;
    }

    this.setData({
      isAdmin: userInfo.isAdmin,
      userInfo: userInfo
    });
  },

  onShow() {
    this.getAlbums();
  },

  // 获取相册列表
  getAlbums() {
    const albums = wx.getStorageSync('albums') || [];
    this.setData({ albums });
  },

  // 查看相册详情
  viewAlbumDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/album/detail?id=${id}`
    });
  },

  // 创建相册
  createAlbum() {
    wx.chooseImage({
      count: 9,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        wx.showModal({
          title: '创建相册',
          editable: true,
          placeholderText: '请输入相册名称',
          success: (res) => {
            if (res.confirm && res.content) {
              const newAlbum = {
                id: Date.now(),
                title: res.content,
                coverUrl: tempFilePaths[0],
                images: tempFilePaths,
                creator: this.data.userInfo,
                createTime: new Date().toLocaleString(),
                viewCount: 0
              };

              // 保存到本地存储
              let albums = wx.getStorageSync('albums') || [];
              albums.unshift(newAlbum);
              wx.setStorageSync('albums', albums);

              // 更新页面数据
              this.setData({
                albums: albums
              });

              wx.showToast({
                title: '创建成功',
                icon: 'success'
              });
            }
          }
        });
      }
    });
  },

  // 编辑相册
  editAlbum(e) {
    const { id } = e.currentTarget.dataset;
    const album = this.data.albums.find(a => a.id === id);
    
    if (album) {
      wx.showModal({
        title: '编辑相册',
        editable: true,
        content: album.title,
        success: (res) => {
          if (res.confirm && res.content) {
            let albums = this.data.albums;
            const index = albums.findIndex(a => a.id === id);
            
            if (index > -1) {
              albums[index].title = res.content;
              wx.setStorageSync('albums', albums);
              this.setData({ albums });
              
              wx.showToast({
                title: '修改成功',
                icon: 'success'
              });
            }
          }
        }
      });
    }
  },

  // 删除相册
  deleteAlbum(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个相册吗？',
      success: (res) => {
        if (res.confirm) {
          let albums = this.data.albums;
          albums = albums.filter(a => a.id !== id);
          wx.setStorageSync('albums', albums);
          this.setData({ albums });
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  }
}); 