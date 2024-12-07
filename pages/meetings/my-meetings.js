Page({
  data: {
    myMeetings: []
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '我的活动'
    });
    this.getMyMeetings();
  },

  getMyMeetings() {
    const meetings = wx.getStorageSync('meetings') || [];
    const userInfo = wx.getStorageSync('userInfo');
    
    // 筛选我创建的和参与的活动
    const myMeetings = meetings.filter(m => 
      m.creator.nickName === userInfo.nickName || 
      m.participants.some(p => p.nickName === userInfo.nickName)
    );

    this.setData({
      myMeetings
    });
  },

  // 查看活动详情
  viewMeetingDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/meetings/detail?id=${id}`
    });
  }
}); 