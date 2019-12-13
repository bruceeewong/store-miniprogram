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
    console.log(cartData);

    const selectedCounts = cart.getCartTotalCounts(true);
    console.log(selectedCounts);

    this.setData({
      cartData,
      selectedCounts,
    });

    this.calcTotalAmountAndCounts(cartData);
  },

  calcTotalAmountAndCounts(data) {
    const len = data.length;
    let amount = 0;
    let selectedCounts = 0;
    let selectedTypeCounts = 0;
    let multiple = 100;

    // 计算总价格
    data.forEach(item => {
      if (item.selectStatus) {
        amount += item.price * item.counts;
        selectedCounts += item.counts;
        selectedTypeCounts += 1;
      }
    });

    amount = parseFloat(amount.toFixed(2));
    console.log(amount);
  },
});
