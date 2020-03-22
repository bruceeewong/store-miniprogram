import Config from './config.js';
import Validate from './validate.js';
import TokenModel from './token';

class Base {
  constructor() {
    this.baseUrl = Config.BASE_URL;
  }

  /**
   * 微信请求封装，携带token
   * @param {Object} params
   * @param {boolean} noRefetch // 指示是否执行重试机制，默认执行
   */
  request(params, noRefetch = false) {
    const that = this;
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
          const { statusCode, data } = res;
          if (statusCode >= 400) {
            // 因为HTTP响应为4xx的不会走fail，这里统一处理

            if (statusCode === 401) {
              // 如果是令牌失效导致的错误，触发重试机制
              // 重新获取令牌并再次重新发送相同请求
              if (!noRefetch) {
                // 这里默认是会重试
                // 而重试的结果必须在这里处理，否则外界调用者捕获不到成功与错误的回调
                that
                  ._refetch(params)
                  .then(res => resolve(res))
                  .catch(e => reject(e));
                return; // 重试就不急着触发报错
              }
            }
            // 其他错误直接报错
            reject(new Error(data.msg));
          }
          // 成功回调
          resolve(data);
        },
        fail(err) {
          reject(err);
        },
      });
    });
  }

  /**
   * 当请求时发现令牌失效，自动执行重新获取令牌并再次请求数据的操作
   * @param {*} params
   */
  _refetch(params) {
    const tokenModel = new TokenModel();
    const promise = tokenModel.getTokenFromServer().then(() => {
      // 这里防止无限重试，加上标志位，noRefetch为true意味着这次请求失败后就不再重试
      return this.request(params, true); // 返回promise链
    });
    return promise; // 返回promise链
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
