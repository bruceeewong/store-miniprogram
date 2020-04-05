import Base from '../../utils/base';

export default class Order extends Base {
  constructor() {
    super();
    this.storageKeyName = 'newOrder';
  }

  /**
   * 下单接口
   * @param {*} param
   */
  doOrder(param) {
    return this.request({
      url: '/order?XDEBUG_SESSION_START=10443',
      method: 'post',
      data: {
        products: param,
      },
    }).then(data => {
      this._setStorage(data);
      return data;
    });
  }

  pay(orderID) {
    return this.request({
      url: '/pay/pre_order?XDEBUG_SESSION_START=10443',
      method: 'post',
      data: { id: orderID },
    }).then(data => {
      if (!data.timeStamp) {
        return Promise.reject(0);
      }

      return new Promise((resolve, reject) => {
        wx.requestPayment({
          timeStamp: data.timeStamp.toString(),
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success: result => {
            resolve(2);
          },
          fail: e => {
            console.error(e);
            reject(1);
          },
        });
      });
    });
  }

  _setStorage(data) {
    wx.setStorageSync(this.storageKeyName, data);
  }
}
