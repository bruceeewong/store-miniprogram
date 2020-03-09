import Base from '../../utils/base.js';

class Home extends Base {
  constructor() {
    super();
  }

  /**
   * 获取Banner栏的信息
   * @param {number} id
   */
  getBanner(id = 0) {
    return this.request({
      url: `/banner/${id}`,
    });
  }

  getThemes(ids = '') {
    return this.request({
      url: `/theme`,
      method: 'GET',
      data: {
        ids,
      },
    });
  }

  getRecentProducts() {
    return this.request({
      url: `/product/recent`,
    });
  }
}

export default Home;
