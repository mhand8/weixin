Page({
  data: {
    amount: '',
    members: [],
    selectedMembers: [],
    perPersonAmount: '0.00'
  },

  onLoad() {
    // 检查登录状态
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
      return;
    }

    this.getMembers();
  },

  // 获取成员列表（模拟数据）
  getMembers() {
    const mockMembers = [
      {
        id: 1,
        name: '张三',
        avatar: '/images/default-avatar.png'
      },
      {
        id: 2,
        name: '李四',
        avatar: '/images/default-avatar.png'
      }
      // 可以添加更多模拟数据
    ];

    this.setData({
      members: mockMembers
    });
  },

  // 金额输入处理
  onAmountInput(e) {
    const amount = e.detail.value;
    this.setData({ amount });
    this.calculatePerPersonAmount();
  },

  // 选择成员
  onMemberSelect(e) {
    const { id } = e.currentTarget.dataset;
    const { selectedMembers } = this.data;
    
    const index = selectedMembers.indexOf(id);
    if (index > -1) {
      selectedMembers.splice(index, 1);
    } else {
      selectedMembers.push(id);
    }
    
    this.setData({ selectedMembers });
    this.calculatePerPersonAmount();
  },

  // 计算每人金额
  calculatePerPersonAmount() {
    const { amount, selectedMembers } = this.data;
    if (!amount || selectedMembers.length === 0) {
      this.setData({ perPersonAmount: '0.00' });
      return;
    }

    const perPerson = (parseFloat(amount) / selectedMembers.length).toFixed(2);
    this.setData({ perPersonAmount: perPerson });
  },

  // 发起支付
  startPayment() {
    if (!this.data.amount || this.data.selectedMembers.length === 0) {
      wx.showToast({
        title: '请填写金额并选择成员',
        icon: 'none'
      });
      return;
    }

    // 保存收款记录到本地存储
    const paymentRecord = {
      id: Date.now(),
      amount: parseFloat(this.data.amount),
      perPersonAmount: parseFloat(this.data.perPersonAmount),
      participants: this.data.selectedMembers,
      status: 'pending',
      createTime: new Date().toISOString(),
      paidMembers: []
    };

    let payments = wx.getStorageSync('payments') || [];
    payments.push(paymentRecord);
    wx.setStorageSync('payments', payments);

    // 跳转到支付详情页
    wx.navigateTo({
      url: `/pages/payment/detail?id=${paymentRecord.id}`
    });
  }
}); 