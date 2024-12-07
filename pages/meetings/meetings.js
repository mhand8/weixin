Page({
  data: {
    meetings: [],
    isAdmin: false
  },

  onLoad() {
    // 检查是否是管理员
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      isAdmin: userInfo && userInfo.isAdmin
    });
  },

  onShow() {
    this.getMeetings();
  },

  // 获取聚会列表
  getMeetings() {
    const meetings = wx.getStorageSync('meetings') || [];
    const userInfo = wx.getStorageSync('userInfo');

    // 为每个聚会添加参与状态
    const processedMeetings = meetings.map(meeting => ({
      ...meeting,
      isParticipant: meeting.participants.some(p => p.nickName === userInfo.nickName)
    }));

    this.setData({
      meetings: processedMeetings
    });
  },

  // 查看活动详情
  viewMeetingDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/meetings/detail?id=${id}`
    });
  },

  // 参加活动
  joinMeeting(e) {
    const { id } = e.currentTarget.dataset;
    const userInfo = wx.getStorageSync('userInfo');
    
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    let meetings = wx.getStorageSync('meetings') || [];
    const index = meetings.findIndex(m => m.id === id);
    
    if (index > -1) {
      const meeting = meetings[index];
      
      // 检查是否已经参加
      if (meeting.participants.some(p => p.nickName === userInfo.nickName)) {
        wx.showToast({
          title: '您已参加该活动',
          icon: 'none'
        });
        return;
      }

      // 添加参与者
      meetings[index].participants.push(userInfo);
      wx.setStorageSync('meetings', meetings);

      // 更新页面数据
      this.getMeetings();

      wx.showToast({
        title: '参加成功',
        icon: 'success'
      });
    }
  },

  // 编辑活动
  editMeeting(e) {
    const { id } = e.currentTarget.dataset;
    const meeting = this.data.meetings.find(m => m.id === id);
    
    if (meeting) {
      // 将要编辑的会议信息存储到本地
      wx.setStorageSync('editMeeting', meeting);
      wx.navigateTo({
        url: `/pages/meetings/edit?id=${id}`
      });
    }
  },

  // 删除活动
  deleteMeeting(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个活动吗？',
      success: (res) => {
        if (res.confirm) {
          let meetings = wx.getStorageSync('meetings') || [];
          meetings = meetings.filter(m => m.id !== id);
          wx.setStorageSync('meetings', meetings);
          
          // 更新页面数据
          this.getMeetings();

          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 发布活动
  navigateToPublish() {
    wx.navigateTo({
      url: '/pages/meetings/publish'
    });
  }
}); 