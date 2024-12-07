Page({
  data: {
    userInfo: null
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
  },

  // 编辑资料
  editProfile() {
    wx.showActionSheet({
      itemList: ['修改头像', '修改昵称', '修改电话'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 修改头像
          wx.chooseImage({
            count: 1,
            success: (res) => {
              const avatarUrl = res.tempFilePaths[0];
              const userInfo = wx.getStorageSync('userInfo');
              userInfo.avatarUrl = avatarUrl;
              wx.setStorageSync('userInfo', userInfo);
              this.setData({
                userInfo
              });
              
              // 更新首页
              this.updateIndexPage();
            }
          });
        } else if (res.tapIndex === 1) {
          // 修改昵称
          wx.showModal({
            title: '修改昵称',
            editable: true,
            placeholderText: '请输入新昵称',
            success: (res) => {
              if (res.confirm && res.content) {
                const userInfo = wx.getStorageSync('userInfo');
                userInfo.nickName = res.content;
                userInfo.isAdmin = res.content === 'Admin';
                wx.setStorageSync('userInfo', userInfo);
                this.setData({
                  userInfo
                });
                
                // 更新首页
                this.updateIndexPage();

                if (userInfo.isAdmin) {
                  wx.showToast({
                    title: '已获得管理员权限',
                    icon: 'success'
                  });
                }
              }
            }
          });
        } else {
          // 修改电话
          wx.showModal({
            title: '修改电话',
            editable: true,
            placeholderText: '请输入新手机号',
            success: (res) => {
              if (res.confirm && res.content) {
                // 验证手机号格式
                if (!/^1[3-9]\d{9}$/.test(res.content)) {
                  wx.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none'
                  });
                  return;
                }

                const userInfo = wx.getStorageSync('userInfo');
                userInfo.phone = res.content;
                wx.setStorageSync('userInfo', userInfo);
                this.setData({
                  userInfo
                });
                
                // 更新首页
                this.updateIndexPage();

                wx.showToast({
                  title: '电话修改成功',
                  icon: 'success'
                });
              }
            }
          });
        }
      }
    });
  },

  // 更新首页
  updateIndexPage() {
    const pages = getCurrentPages();
    const indexPage = pages.find(page => page.route === 'pages/index/index');
    if (indexPage) {
      const userInfo = wx.getStorageSync('userInfo');
      indexPage.setData({
        userInfo,
        hasUserInfo: true
      });
    }
  },

  // 我的活动
  myMeetings() {
    wx.navigateTo({
      url: '/pages/meetings/my-meetings'
    });
  },

  // 我的相册
  myAlbums() {
    wx.navigateTo({
      url: '/pages/album/my-albums'
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除用户信息
          wx.removeStorageSync('userInfo');
          // 返回首页
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      }
    });
  }
}); 