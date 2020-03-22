import Config from './config';
import Print from './print';

export default class Token {
  _verifyURL;
  _tokenURL;
  constructor() {
    this._verifyURL = Config.BASE_URL + '/token/verify';
    this._tokenURL = Config.BASE_URL + '/token/user';
  }

  /**
   * 校验 Token 有效性
   */
  verify() {
    const token = wx.getStorageSync('token');
    // 如果没有token去获取
    if (!token) {
      this.getTokenFromServer();
    }
    // 校验 Token 有效
    this.verifyFromServer(token);
  }

  getTokenFromServer() {
    const that = this;
    return new Promise(resolve => {
      // 先调用微信登录的API，拿到code
      wx.login({
        success(res) {
          // 成功拿到code后，再请求后端获取token
          wx.request({
            url: that._tokenURL,
            method: 'post',
            data: {
              code: res.code,
            },
            success(res) {
              // 存到 storage 中
              wx.setStorageSync('token', res.data.token);
              resolve(res.data.token);
            },
            fail(e) {
              Print.showToast('获取令牌失败');
              console.error(e);
            },
          });
        },
        fail(e) {
          Print.showToast('微信登录失败');
          console.error(e);
        },
      });
    });
  }

  verifyFromServer(token) {
    const that = this;
    return new Promise(resolve => {
      wx.request({
        url: that._verifyURL,
        method: 'post',
        data: {
          token,
        },
        success(res) {
          // 如果token失效，要重新获取token
          if (!res.data.isValid) {
            that.getTokenFromServer();
            return;
          }
          resolve(res.data.isValid);
        },
        fail(e) {
          Print.showToast('校验令牌失败');
          console.error(e);
        },
      });
    });
  }
}
