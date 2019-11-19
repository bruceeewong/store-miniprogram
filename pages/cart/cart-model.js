import { Base } from '../../utils/base';

class Cart extends Base {
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
    const info = this._findItem(item.id, cartData);

    // 不存在即为新商品
    if (info.index === -1) {
      item.counts = counts;
      item.selectStatus = true; // 添加进来的时候默认选中

      cartData.push(item);
    } else {
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
  _findItem(id, arr) {
    let result = {
      index: -1,
    };

    const target = arr.find(item => item.id === id);
    if (target) {
      result = {
        index: target.id,
        data: target,
      };
    }
    return result;
  }
}
