import Base from './base';

export default class AddressModel extends Base {
  static chooseAddress() {
    return new Promise((resolve, reject) => {
      wx.chooseAddress({
        success: result => {
          resolve(result);
        },
        fail: e => {
          reject(e);
        },
      });
    });
  }

  /**
   * 将微信API返回的地址信息 或 数据库存储的地址信息
   * 拼接成完整的地址
   *
   * @param {object} res
   */
  concatAddress(res) {
    const province = res.provinceName || res.province; // 国标收货地址第一级地址
    const city = res.cityName || res.city; // 国标收货地址第二级地址
    const county = res.countyName || res.county; // 国标收货地址第三级地址
    const detail = res.detailInfo || res.detail; // 详细收货地址信息

    let fullAddress = city + county + detail;

    if (!this._isCenterCity(province)) {
      // 非直辖市要加省名，否则不用
      fullAddress = province + fullAddress;
    }
    return fullAddress;
  }

  submitAddress(data) {
    const formatAddress = this._formatAddress(data);
    return this.request({
      url: '/address',
      method: 'post',
      data: formatAddress,
    });
  }

  getAddress() {
    return this.request({
      url: '/address',
      method: 'get',
    });
  }

  /**
   * 判断省份是否是直辖市
   * @param {*} name
   */
  _isCenterCity(name) {
    const centerCities = ['北京市', '天津市', '上海市', '重庆市'];
    return centerCities.indexOf(name) !== -1;
  }

  /**
   * 微信的收货地址与数据库名称的转换
   * @param {*} res
   */
  _formatAddress(res) {
    return {
      name: res.userName,
      province: res.provinceName, // 国标收货地址第一级地址
      city: res.cityName, // 国标收货地址第二级地址
      county: res.countyName, // 国标收货地址第三级地址
      detail: res.detailInfo, // 详细收货地址信息
      mobile: res.telNumber,
    };
  }
}
