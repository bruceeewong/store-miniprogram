// pages/cart/cart.js
import Cart from './cart-model.js';

const cart = new Cart();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cartData: [],
    selectedCounts: 0,
    selectedTypeCounts: 0,
    amount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const cartData = cart.getCartDataFromStorage();
    const cartInfo = this.calcTotalAmountAndCounts(cartData);

    this.setData({
      cartData,
      selectedCounts: cartInfo.selectedCounts,
      selectedTypeCounts: cartInfo.selectedTypeCounts,
      amount: cartInfo.amount,
    });
  },

  /**
   * 计算购物车内商品的总价格、总数量、总类型数
   * @param {array} data
   * @returns {object}
   */
  calcTotalAmountAndCounts(data) {
    let amount = 0;
    let selectedCounts = 0;
    let selectedTypeCounts = 0;

    // 计算总价格
    data.forEach(item => {
      if (item.selectStatus) {
        amount += item.price * item.counts;
        selectedCounts += item.counts;
        selectedTypeCounts += 1;
      }
    });

    amount = Number(parseFloat(amount.toFixed(2)));

    const result = {
      selectedCounts,
      selectedTypeCounts,
      amount,
    };
    return result;
  },
});
