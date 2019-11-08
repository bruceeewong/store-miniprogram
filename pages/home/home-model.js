import Base from '../../utils/base.js';

class Home extends Base {
  constructor() {
    super();
  }

  getBannerData(id = 0) {
    return this.request({
      url: `/banner/${id}`,
    });
  }

  getThemeData(ids = '') {
    return this.request({
      url: `/theme`,
      method: 'GET',
      data: {
        ids,
      },
    });
  }
}

export default Home;
