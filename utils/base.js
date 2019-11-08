import Config from './config.js';
import Print from './print.js';

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
}

export default Base;
