import SearchParam from '../../utils/search-param';

// pages/pay-result/pay-result.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    from: '',
    payResult: false,
    from: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      from: options.from,
      payResult: options.flag === 'true' ? true : false,
      from: options.from,
    });
  },

  hViewOrder() {
    if (this.data.from === 'order') {
      //返回上一级
      wx.navigateBack({
        delta: 1,
      });
    } else {
      const searchParam = new SearchParam();
      searchParam.append('id', this.data.id);
      searchParam.append('from', 'my');

      wx.navigateTo({
        url: `../order/order?${searchParam.toString()}`,
      });
    }
  },
});
