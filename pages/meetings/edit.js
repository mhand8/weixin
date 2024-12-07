Page({
  data: {
    id: '',
    formData: {
      title: '',
      date: '',
      time: '',
      location: '',
      reason: '',
      notes: ''
    }
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '编辑聚会'
    });

    const { id } = options;
    console.log('接收到的ID:', id);
    
    const meeting = wx.getStorageSync('editMeeting');
    console.log('缓存中的会议:', meeting);
    
    if (meeting) {
      this.setData({
        id: id,
        formData: {
          title: meeting.title || '',
          date: meeting.date || '',
          time: meeting.time || '',
          location: meeting.location || '',
          reason: meeting.reason || '',
          notes: meeting.notes || ''
        }
      });
    }
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

  // 提交修改
  submitEdit() {
    const { title, date, time, location, reason } = this.data.formData;
    if (!title || !date || !time || !location || !reason) {
      wx.showToast({
        title: '请填写必要信息',
        icon: 'none'
      });
      return;
    }

    try {
      let meetings = wx.getStorageSync('meetings') || [];
      console.log('当前ID:', this.data.id);
      console.log('所有会议:', meetings);
      
      const index = meetings.findIndex(m => m.id == this.data.id);
      console.log('找到的索引:', index);
      
      if (index > -1) {
        // 保留原有的创建者和参与者信息
        const originalMeeting = meetings[index];
        meetings[index] = {
          ...originalMeeting,
          title: this.data.formData.title,
          date: this.data.formData.date,
          time: this.data.formData.time,
          location: this.data.formData.location,
          reason: this.data.formData.reason,
          notes: this.data.formData.notes,
          updateTime: new Date().toISOString()
        };
        
        wx.setStorageSync('meetings', meetings);
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        });

        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: '找不到该聚会',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('修改失败', error);
      wx.showToast({
        title: '修改失败，请重试',
        icon: 'none'
      });
    }
  }
}); 