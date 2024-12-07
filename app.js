// app.js
App({
  onLaunch: function () {
    // 检查用户登录状态
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.hasUserInfo = true;
    }

    // 登录
    wx.login({
      success: res => {
        // 可以将 res.code 发送给后台，换取 openId, sessionKey, unionId
        console.log('登录成功:', res.code);
      }
    });
  },

  globalData: {
    userInfo: null,
    hasUserInfo: false
  }
});
