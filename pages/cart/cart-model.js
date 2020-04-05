import Base from '../../utils/base';
import Validate from '../../utils/validate';

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
    const index = this.findItem(item.id, cartData); // 根据 item.id 去找缓存中的数据

    // 不存在即为新商品
    if (index === -1) {
      item.counts = counts;
      item.selectStatus = true; // 添加进来的时候默认选中

      cartData.push(item);
    } else {
      cartData[index].counts += counts;
    }

    // 更新storage
    wx.setStorageSync(this.storageKey, cartData);
  }

  /**
   * 从storage中获取购物车数据
   * 根据标志位为判断是拿全部还是只是选中的商品数据
   * @returns {array}
   */
  getCartDataFromStorage(isJustSelect = false) {
    let result = wx.getStorageSync(this.storageKey);
    if (!result) {
      return [];
    }
    if (isJustSelect) {
      return result.filter(item => item.selectStatus === true);
    }
    return result;
  }

  /**
   * 根据id数组删除storage中的数据
   * @param {*} ids
   */
  delete(ids) {
    if (!Validate.isArray(ids)) {
      return;
    }

    let cartData = wx.getStorageSync(this.storageKey);
    ids.forEach(id => {
      const index = this.findItem(id, cartData);
      cartData.splice(index, 1);
    });
    // 删除ids数值中对应的数据，更新storage
    this.setCartDataToStorage(cartData);
  }

  setCartDataToStorage(data) {
    wx.setStorageSync(this.storageKey, data);
  }

  /**
   * 判断当前id项是否在arr中, 返回一个含index的对象
   * @param {string} id
   * @param {array} arr
   * @returns {{index:number}}
   */
  findItem(id, arr) {
    return arr.findIndex(item => item.id === id);
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
    dataList.forEach(item => {
      counts += item.counts;
    });
    return counts;
  }
}
