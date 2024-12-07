// index.js
const request = require('../../utils/request');

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    tempUserInfo: {
      avatarUrl: '',
      nickName: '',
      phone: ''
    }
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      });
    }
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      });
    }
  },

  // 选择头像
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      'tempUserInfo.avatarUrl': avatarUrl
    });
  },

  // 输入昵称
  onInputNickname(e) {
    const nickName = e.detail.value;
    this.setData({
      'tempUserInfo.nickName': nickName
    });
  },

  // 输入手机号
  onInputPhone(e) {
    const phone = e.detail.value;
    this.setData({
      'tempUserInfo.phone': phone
    });
  },

  // 获取手机号
  getPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 这里需要将加密数据发送到服务器解密
      // 为了演示，这里直接使用一个模拟的手机号
      this.setData({
        'tempUserInfo.phone': e.detail.code // 这里使用code，服务端可以用它换取手机号
      });
    } else {
      wx.showToast({
        title: '获取手机号失败',
        icon: 'none'
      });
    }
  },

  // 确认登录
  confirmLogin() {
    const { tempUserInfo } = this.data;
    if (!tempUserInfo.avatarUrl || !tempUserInfo.nickName || !tempUserInfo.phone) {
      wx.showToast({
        title: '请完善信息',
        icon: 'none'
      });
      return;
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(tempUserInfo.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    // 获取管理员手机号
    const adminPhone = wx.getStorageSync('adminPhone');
    
    // 如果还没有管理员，则将当前用户设为管理员
    if (!adminPhone) {
      tempUserInfo.isAdmin = true;
      // 保存管理员手机号
      wx.setStorageSync('adminPhone', tempUserInfo.phone);
    } else {
      // 如果是管理员的手机号，则恢复管理员身份
      tempUserInfo.isAdmin = (tempUserInfo.phone === adminPhone);
    }

    // 保存用户信息
    wx.setStorageSync('userInfo', tempUserInfo);
    this.setData({
      userInfo: tempUserInfo,
      hasUserInfo: true
    });

    wx.showToast({
      title: tempUserInfo.isAdmin ? '管理员登录成功' : '登录成功',
      icon: 'success'
    });
  },

  // 页面导航函数
  navigateToMeetings() {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/meetings/meetings'
    });
  },

  navigateToMembers() {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/members/members'
    });
  },

  navigateToAlbum() {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/album/album'
    });
  },

  navigateToProfile() {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },

  // 获取用户信息
  onGetUserInfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      const { nickName } = e.detail.userInfo;
      this.setData({
        'tempUserInfo.nickName': nickName
      });
    }
  }
});
