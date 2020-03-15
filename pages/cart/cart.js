// pages/cart/cart.js
import Cart from './cart-model.js';
import Print from '../../utils/print.js';

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
    isAllSelect: false, // 全选状态
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
    this.setPageData(cartData);
  },

  /**
   * 生命周期函数--离开页面时
   */
  onHide() {
    cart.setCartDataToStorage(this.data.cartData); // 更新购物车数据缓存
  },

  /**
   * 购物车中的选中的状态控制
   */
  hToggleSelect(event) {
    const id = cart.getDataSet(event, 'id');
    const status = cart.getDataSet(event, 'status');

    const index = this.getProductIndexByID(id);
    const cartData = [...this.data.cartData];
    const item = cartData[index];

    item.selectStatus = !status; // 切换点击项的选中状态

    this.setPageData(cartData); // 更新页面数据
  },

  hToggleSelectAll() {
    const toggleStatus = !this.data.isAllSelect;
    const cartData = [...this.data.cartData];
    cartData.forEach(item => {
      item.selectStatus = toggleStatus;
    });
    this.setPageData(cartData); // 更新页面数据
  },

  /**
   * 计算购物车内选中商品的总价格、总数量、总类型数
   * @param {array} data
   * @returns {object}
   */
  calcTotalAmountAndCounts(data) {
    // 选中总价格
    let amount = 0;
    // 选中的商品总数
    let selectedCounts = 0;
    // 选中商品类型的数量
    let selectedTypeCounts = 0;

    // 计算总价格
    data.forEach(item => {
      if (item.selectStatus) {
        amount += item.price * item.counts;
        selectedCounts += item.counts;
        selectedTypeCounts += 1;
      }
    });

    amount = parseFloat(amount.toFixed(2)); // 解决浮点数位数问题

    return {
      selectedCounts,
      selectedTypeCounts,
      amount,
    };
  },

  /**
   * 根据id获取对应商品在cartData中的下标
   * @param {*} id
   * @param {array} data
   * @returns {number}
   * @throws
   */
  getProductIndexByID(id) {
    const data = this.data.cartData;
    const len = data.length;

    for (let i = 0; i < len; i += 1) {
      if (id === data[i].id) {
        return i;
      }
    }
    // 找不到就抛出错误
    throw new Error('找不到id对应的商品对象');
  },

  /**
   * 根据购物车数据设置页面的所有绑定值
   * @param {array} cartData
   */
  setPageData(cartData) {
    const cartInfo = this.calcTotalAmountAndCounts(cartData);
    const { selectedCounts, selectedTypeCounts, amount } = cartInfo;

    this.setData({
      selectedCounts,
      selectedTypeCounts,
      amount,
      cartData,
    });
    this.setIsAllSelect(); // 根据选中的情况设置全选状态
  },

  /**
   * 根据已选商品类型数量与总数量比较，设置全选的状态
   */
  setIsAllSelect() {
    const currentStatus = this.data.selectedTypeCounts === this.data.cartData.length;
    if (currentStatus !== this.data.isAllSelect) {
      this.setData({
        isAllSelect: currentStatus,
      });
    }
  },

  hAddCounts(event) {
    const id = cart.getDataSet(event, 'id');
    this.updateCounts(id, 1);
  },

  hReduceCounts(event) {
    const id = cart.getDataSet(event, 'id');
    this.updateCounts(id, -1);
  },

  hRemoveItem(event) {
    const id = cart.getDataSet(event, 'id');
    this.removeItems(id);
  },

  /**
   * 更新选中商品数量
   */
  updateCounts(id, offset) {
    try {
      const index = this.getProductIndexByID(id);
      const cartData = [...this.data.cartData];
      const item = cartData[index];

      const currentCounts = item.counts;
      if (currentCounts + parseInt(offset) < 1) {
        Print.showToast('商品数量至少为1');
        return; // 终止更新操作
      }

      item.counts += parseInt(offset);
      this.setPageData(cartData); // 更新页面
    } catch (err) {
      throw err;
    }
  },

  /**
   *
   * @param {number|array} ids
   */
  removeItems(ids) {
    if (typeof ids !== 'number' && !Array.isArray(ids)) {
      throw new Error('参数ids应为数字或数组类型');
    }

    const cartData = [...this.data.cartData];
    let index = -1;
    if (typeof ids === 'number') {
      index = this.getProductIndexByID(ids);
      cartData.splice(index, 1);
    }

    if (Array.isArray(ids)) {
      ids.forEach(id => {
        index = this.getProductIndexByID(ids);
        cartData.splice(index, 1);
      });
    }

    this.setPageData(cartData);
    return;
  },
});
