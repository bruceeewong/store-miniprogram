import Config from './config.js';
import Print from './print.js';
import Validate from './validate.js';

class Base {
  constructor() {
    this.baseUrl = Config.baseUrl;
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
          token: wx.getStorageSync('token'),
        },
        success(res) {
          if (res.statusCode >= 400) {
            // 因为HTTP响应为4xx的不会走fail，这里统一处理
            Print.showToast('请求不合法');
            console.error(`请求不合法, 错误信息: ${JSON.stringify(res.data)}`);
          }
          resolve(res.data);
        },
        fail(err) {
          reject(err);
          console.error('请求错误:', err);
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
    console.log(`key: ${key} `, `event: `, event);
    if ('currentTarget' in event) {
      const result = event.currentTarget.dataset[key];
      console.log(`result: ${result}, type: ${typeof result}`);
      if (!Validate.isUndefined(result)) {
        return result;
      }
    }
    console.log(`key: ${key} not found in dataset`);
    return '';
  }
}

export default Base;
