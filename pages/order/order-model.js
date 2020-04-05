import Base from '../../utils/base';

export default class Order extends Base {
  constructor() {
    super();
    this.storageKeyName = 'newOrder';
  }

  getOrderInfoById(id) {
    return this.request({
      url: `/order/${id}`,
      method: 'get',
    });
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

  /**
   * 向后台创建预订单，并拉起微信支付
   * @param {*} orderID
   */
  pay(orderID) {
    return this.request({
      url: '/pay/pre_order?XDEBUG_SESSION_START=10443',
      method: 'post',
      data: { id: orderID },
    })
      .then(data => {
        if (!data.timeStamp) {
          return Promise.reject(0);
        }
        return data;
      })
      .then(data => {
        return new Promise(resolve => {
          wx.requestPayment({
            timeStamp: data.timeStamp.toString(),
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: result => {
              // 成功拉起微信支付
              console.log(result);
              resolve(2);
            },
            fail: e => {
              // 用户取消微信支付
              resolve(1);
            },
          });
        });
      });
  }

  getOrder(pageIndex) {
    return this.request({
      url: '/order/by_user?XDEBUG_SESSION_START=12663',
      method: 'get',
      data: { page: pageIndex },
    });
  }

  _setStorage(data) {
    wx.setStorageSync(this.storageKeyName, data);
  }
}
