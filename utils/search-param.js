export default class SearchParam {
  _params = [];
  constructor(str = '') {
    if (!str) {
      return;
    }
    if (typeof str !== 'string') {
      throw new Error('需为字符类型');
    }
    this._params = this.changeStringToArray(str);
  }

  /**
   * 处理形如 q=sasda&p=dzcz
   * 转换为 [ ['q', 'sasda'], ['p', 'dzcz'] ]
   * @param {*} str
   */
  changeStringToArray(str = '') {
    const items = str.split('&');
    return items.map(item => {
      if (!/^={1}$/.test(item)) {
        return item;
      }
      return item.split('=');
    });
  }

  /**
   * 添加键值对
   * @param {*} key
   * @param {*} value
   */
  append(key = '', value = '') {
    this._params.push([key, value]);
  }

  /**
   * 将内部的所有键值对输出如 q=sasda&p=dzcz
   * @returns {string}
   */
  toString() {
    let result = '';
    const len = this._params.length;
    for (let i = 0; i < len; i += 1) {
      const item = this._params[i];
      result += `${item[0]}=${item[1]}`;
      if (i !== len - 1) {
        result += '&';
      }
    }
    return result;
  }
}
