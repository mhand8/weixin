Page({
  data: {
    payment: null,
    members: [],
    currentUser: null
  },

  onLoad(options) {
    this.getPaymentDetail(options.id);
  },

  // 获取收款详情
  async getPaymentDetail(id) {
    try {
      const db = wx.cloud.database();
      const payment = await db.collection('payments').doc(id).get();
      const members = await db.collection('users')
        .where({
          _id: db.command.in(payment.data.participants)
        })
        .field({
          _id: true,
          name: true,
          avatar: true
        })
        .get();

      this.setData({
        payment: payment.data,
        members: members.data,
        currentUser: wx.getStorageSync('openid')
      });
    } catch (error) {
      console.error('获取收款详情失败', error);
    }
  },

  // 确认支付
  async confirmPayment() {
    try {
      const db = wx.cloud.database();
      const _ = db.command;
      
      await db.collection('payments').doc(this.data.payment._id).update({
        data: {
          paidMembers: _.push(wx.getStorageSync('openid'))
        }
      });

      wx.showToast({
        title: '支付成功',
        icon: 'success'
      });

      this.getPaymentDetail(this.data.payment._id);
    } catch (error) {
      console.error('支付失败', error);
      wx.showToast({
        title: '支付失败，请重试',
        icon: 'none'
      });
    }
  }
}); 