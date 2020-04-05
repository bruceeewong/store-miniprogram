// pages/pay-result/pay-result.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    from: '',
    payResult: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      from: options.from,
      payResult: options.flag === 'true' ? true : false,
    });
  },

  hViewOrder() {
    //返回上一级
    wx.navigateBack({
      delta: 1,
    });
  },
});
