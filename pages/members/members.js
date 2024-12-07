Page({
  data: {
    members: [],
    isAdmin: false
  },

  onLoad() {
    this.checkAdminStatus();
    this.getMembers();
  },

  // 检查是否是管理员
  checkAdminStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    const isAdmin = userInfo && userInfo.isAdmin;
    this.setData({ isAdmin });
  },

  // 获取会员列表
  getMembers() {
    const currentUser = wx.getStorageSync('userInfo');
    if (currentUser) {
      const member = {
        ...currentUser,
        createTime: currentUser.createTime || new Date().toLocaleString(),
        status: currentUser.isAdmin ? 'approved' : 'pending'
      };
      
      this.setData({
        members: [member]
      });
    }
  },

  // 查看会员详情
  viewMemberDetail(e) {
    const { id } = e.currentTarget.dataset;
    const member = this.data.members.find(m => m.id === id);
    if (member) {
      wx.showModal({
        title: '会员信息',
        content: `昵称：${member.nickName}\n电话：${member.phone}\n注册时间：${member.createTime}\n身份：${member.isAdmin ? '管理员' : '普通会员'}`,
        showCancel: false
      });
    }
  },

  // 拨打电话
  makePhoneCall(e) {
    const { phone } = e.currentTarget.dataset;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone,
        fail(err) {
          wx.showToast({
            title: '拨号失败',
            icon: 'none'
          });
        }
      });
    }
  }
}); 