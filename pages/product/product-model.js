import Base from '../../utils/base.js';

class Product extends Base {
  constructor() {
    super();
  }

  /**
   * 获取对应id的产品
   * @param {String} id
   */
  getProduct(id) {
    return this.request({
      url: `/product/${id}`,
    });
  }
}

export default Product;
