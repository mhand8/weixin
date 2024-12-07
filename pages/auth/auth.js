Page({
  data: {
    userInfo: null,
    formData: {
      name: '',
      phone: '',
      idCard: ''
    },
    isSubmitting: false
  },

  onLoad() {
    this.checkAuthStatus();
  },

  // 检查认证状态
  async checkAuthStatus() {
    try {
      const db = wx.cloud.database();
      const userInfo = await db.collection('users').where({
        _openid: wx.getStorageSync('openid')
      }).get();
      
      if (userInfo.data.length > 0) {
        this.setData({
          userInfo: userInfo.data[0]
        });
      }
    } catch (error) {
      console.error('获取用户信息失败', error);
    }
  },

  // 获取用户OpenID
  async getOpenId() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getOpenId'
      });
      wx.setStorageSync('openid', result.openid);
      return result.openid;
    } catch (error) {
      console.error('获取OpenID失败', error);
      return null;
    }
  },

  // 输入框变化处理
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 提交认证
  async submitAuth() {
    if (this.data.isSubmitting) return;

    const { name, phone, idCard } = this.data.formData;
    if (!name || !phone || !idCard) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    this.setData({ isSubmitting: true });

    try {
      // 确保有openid
      if (!wx.getStorageSync('openid')) {
        await this.getOpenId();
      }

      const db = wx.cloud.database();
      
      // 检查是否已提交过
      const existUser = await db.collection('users').where({
        _openid: wx.getStorageSync('openid')
      }).get();

      if (existUser.data.length > 0) {
        wx.showToast({
          title: '您已提交过认证',
          icon: 'none'
        });
        return;
      }

      // 提交认证信息
      await db.collection('users').add({
        data: {
          ...this.data.formData,
          status: 'pending', // pending, approved, rejected
          createTime: db.serverDate()
        }
      });

      wx.showToast({
        title: '提交成功，等待审核',
        icon: 'success'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (error) {
      console.error('提交认证失败', error);
      wx.showToast({
        title: '提交失败，请重试',
        icon: 'none'
      });
    }

    this.setData({ isSubmitting: false });
  }
}); 