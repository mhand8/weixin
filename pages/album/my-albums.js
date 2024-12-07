Page({
  data: {
    albums: [],
    userInfo: null
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo });
    this.getMyAlbums();
  },

  onShow() {
    this.getMyAlbums();
  },

  // 获取我的相册列表
  getMyAlbums() {
    const albums = wx.getStorageSync('albums') || [];
    const userInfo = wx.getStorageSync('userInfo');
    
    // 筛选我的相册
    const myAlbums = albums.filter(album => album.creator.nickName === userInfo.nickName);
    
    this.setData({
      albums: myAlbums
    });
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
              const userInfo = wx.getStorageSync('userInfo');
              const newAlbum = {
                id: Date.now(),
                title: res.content,
                coverUrl: tempFilePaths[0],
                images: tempFilePaths,
                creator: userInfo,
                createTime: new Date().toLocaleString()
              };

              // 保存到本地存储
              let albums = wx.getStorageSync('albums') || [];
              albums.push(newAlbum);
              wx.setStorageSync('albums', albums);

              // 更新页面数据
              this.getMyAlbums();

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
            let albums = wx.getStorageSync('albums') || [];
            const index = albums.findIndex(a => a.id === id);
            
            if (index > -1) {
              albums[index].title = res.content;
              wx.setStorageSync('albums', albums);
              
              // 更新页面数据
              this.getMyAlbums();

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
          let albums = wx.getStorageSync('albums') || [];
          albums = albums.filter(a => a.id !== id);
          wx.setStorageSync('albums', albums);
          
          // 更新页面数据
          this.getMyAlbums();

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  }
}); 