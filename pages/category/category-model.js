import Base from '../../utils/base.js';

class Category extends Base {
  constructor() {
    super();
  }

  /**
   * 获取所有分类
   * @param {String} id
   */
  getAllCategories() {
    return this.request({
      url: `/category/all`,
    });
  }

  /**
   * 获取分类下的产品
   * @param {String} id
   */
  getProductsByCategory(id) {
    return this.request({
      url: `/product/by_category?id=${id}`,
    });
  }
}

export default Category;
