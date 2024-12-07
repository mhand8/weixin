Page({
  data: {
    formData: {
      title: '',
      date: '',
      time: '',
      location: '',
      reason: '',
      notes: ''
    },
    isSubmitting: false
  },

  // 日期选择
  bindDateChange(e) {
    this.setData({
      'formData.date': e.detail.value
    });
  },

  // 时间选择
  bindTimeChange(e) {
    this.setData({
      'formData.time': e.detail.value
    });
  },

  // 输入处理
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 提交聚会信息
  submitMeeting() {
    if (this.data.isSubmitting) return;

    const { title, date, time, location, reason } = this.data.formData;
    if (!title || !date || !time || !location || !reason) {
      wx.showToast({
        title: '请填写必要信息',
        icon: 'none'
      });
      return;
    }

    this.setData({ isSubmitting: true });

    try {
      // 从本地存储获取现有的聚会列表
      let meetings = wx.getStorageSync('meetings') || [];
      
      // 创建新的聚会记录
      const newMeeting = {
        id: Date.now(),
        ...this.data.formData,
        creator: wx.getStorageSync('userInfo'),
        createTime: new Date().toISOString(),
        participants: []
      };

      // 添加到列表
      meetings.push(newMeeting);
      
      // 保存回本地存储
      wx.setStorageSync('meetings', meetings);

      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (error) {
      console.error('发布失败', error);
      wx.showToast({
        title: '发布失败，请重试',
        icon: 'none'
      });
    }

    this.setData({ isSubmitting: false });
  }
}); 