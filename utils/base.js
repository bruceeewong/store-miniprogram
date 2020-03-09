import Config from './config.js';
import Print from './print.js';
import Validate from './validate.js';

class Base {
  constructor() {
    this.baseUrl = Config.BASE_URL;
  }

  /**
   * 微信请求封装，携带token
   * @param {Object} params
   */
  request(params) {
    const { url = '', data = null, method = 'GET' } = params;

    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseUrl + url,
        data,
        method,
        header: {
          'content-type': 'application/json',
          token: wx.getStorageSync('token'), // 令牌
        },
        success(res) {
          if (res.statusCode >= 400) {
            // 因为HTTP响应为4xx的不会走fail，这里统一处理
            reject(res.data);
          }
          resolve(res.data);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  /**
   * 获取小程序wxml的dataset中的参数
   * @param {Object} event
   * @param {String} key
   */
  getDataSet(event, key) {
    if ('currentTarget' in event) {
      const result = event.currentTarget.dataset[key];
      if (!Validate.isUndefined(result)) {
        return result;
      }
    }
    return '';
  }

  setBarTitle(name) {
    let nameToSet = '';
    if (Validate.isString(name) && name !== '') {
      nameToSet = name;
    } else {
      nameToSet = '导航栏';
    }
    wx.setNavigationBarTitle({
      title: nameToSet,
    });
  }

  toPage(url) {
    const id = theme.getDataSet(event, 'id');
    if ((Validate.isString(id) && id !== '') || (Validate.isNumber(id) && id >= 0)) {
      wx.navigateTo({
        url: `../product/product?id=${id}`,
      });
    } else {
      throw new Error('缺少product id参数');
    }
  }
}

export default Base;
