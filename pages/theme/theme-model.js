import Base from '../../utils/base.js';

class Theme extends Base {
  constructor() {
    super();
  }

  /**
   * 获取对应主题的产品列表
   * @param {*} id
   */
  getProducts(id) {
    return this.request({
      url: `/theme/${id}`,
    });
  }
}

export default Theme;
