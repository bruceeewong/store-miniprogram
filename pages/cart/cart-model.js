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
   * @param {int} counts
   */
  addToCart(item, counts) {
    const cartData = this.getCartDataFromStorage();
    const info = this.findItem(item.id, cartData);

    // 不存在即为新商品
    if (info.index === -1) {
      item.counts = counts;
      item.selectStatus = true; // 添加进来的时候默认选中

      cartData.push(item);
    } else {
      console.log(info);
      cartData[info.index].counts += counts;
    }

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

  /**
   * 判断当前id项是否在arr中, 返回一个对象
   * @param {string} id
   * @param {array} arr
   * @returns {object}
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
   * flag为true, 考虑商品的选择状态
   * @param {boolean} flag
   * @returns {number} counts
   */
  getCartTotalCounts(flag = false) {
    let dataList = this.getCartDataFromStorage();
    let counts = 0;
    if (flag) {
      dataList = dataList.filter(item => item.selectStatus === true);
    }
    dataList.forEach(item => (counts += item.counts));
    return counts;
  }
}
