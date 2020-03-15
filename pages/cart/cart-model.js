import Base from '../../utils/base';

export default class Cart extends Base {
  constructor() {
    super();

    this.storageKey = 'cart';
  }

  /**
   * 加入购物车方法
   * 如果之前没有这样的商品，则直接添加一条新的记录，数量为counts
   * 如果有，则只将相应数量 + counts
   * @param {object} item
   * @param {number}
   */
  addToCart(item, counts) {
    const cartData = this.getCartDataFromStorage();
    const info = this.findItem(item.id, cartData); // 根据 item.id 去找缓存中的数据

    // 不存在即为新商品
    if (info.index === -1) {
      item.counts = counts;
      item.selectStatus = true; // 添加进来的时候默认选中

      cartData.push(item);
    } else {
      cartData[info.index].counts += counts;
    }

    // 更新storage
    wx.setStorageSync(this.storageKey, cartData);
  }

  /**
   * 从storage中获取购物车数据
   * @returns {array}
   */
  getCartDataFromStorage() {
    let result = wx.getStorageSync(this.storageKey);
    if (!result) {
      result = [];
    }
    return result;
  }

  setCartDataToStorage(data) {
    wx.setStorageSync(this.storageKey, data);
  }

  /**
   * 判断当前id项是否在arr中, 返回一个对象
   * @param {string} id
   * @param {array} arr
   * @returns {{index:number}}
   */
  findItem(id, arr) {
    const index = arr.findIndex(item => item.id === id);
    const result = {
      index,
    };
    return result;
  }

  /**
   * 获取购物车内所有商品总数量
   * flag为true, 只筛选被选中商品的数量
   * @param {boolean} flag
   * @returns {number}
   */
  getCartTotalCounts(flag = false) {
    let counts = 0;
    let dataList = this.getCartDataFromStorage();
    if (flag) {
      dataList = dataList.filter(item => item.selectStatus === true);
    }
    dataList.forEach(item => (counts += item.counts));
    return counts;
  }
}
