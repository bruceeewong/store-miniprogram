import Base from '../../utils/base.js';

class Home extends Base {
  constructor() {
    super();
  }

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
