Page({
  data: {
    meeting: null,
    isParticipant: false
  },

  onLoad(options) {
    const { id } = options;
    this.getMeetingDetail(id);
  },

  // 获取聚会详情
  getMeetingDetail(id) {
    const meetings = wx.getStorageSync('meetings') || [];
    const meeting = meetings.find(m => m.id === parseInt(id));
    
    if (meeting) {
      const userInfo = wx.getStorageSync('userInfo');
      const isParticipant = meeting.participants.some(p => p.nickName === userInfo.nickName);
      
      this.setData({
        meeting,
        isParticipant
      });
    } else {
      wx.showToast({
        title: '聚会不存在',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
    }
  },

  // 参加活动
  joinMeeting() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    let meetings = wx.getStorageSync('meetings') || [];
    const index = meetings.findIndex(m => m.id === this.data.meeting.id);
    
    if (index > -1) {
      // 添加参与者
      meetings[index].participants.push(userInfo);
      wx.setStorageSync('meetings', meetings);

      this.setData({
        'meeting.participants': meetings[index].participants,
        isParticipant: true
      });

      wx.showToast({
        title: '参加成功',
        icon: 'success'
      });
    }
  }
}); 