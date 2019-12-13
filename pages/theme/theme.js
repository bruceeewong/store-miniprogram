// pages/theme/theme.js

import Print from '../../utils/print.js';
import Validate from '../../utils/validate.js';
import Theme from './theme-model.js';
const theme = new Theme();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '',
    headImg: '',
    products: [],
  },

  /**
   * 生命周期函数
   */
  onLoad: function(options) {
    const { id, name } = options;
    this.setData({
      id,
      name,
    });

    this.getProducts();
  },

  onReady() {
    theme.setBarTitle(this.data.name);
  },

  getProducts() {
    theme
      .getProducts(this.data.id)
      .then(res => {
        this.setData({
          products: res.products,
          headImg: res.head_img.url,
        });
      })
      .catch(err => {
        Print.showToast('获取主题信息失败');
      });
  },

  hTapProduct(event) {
    const id = theme.getDataSet(event, 'id');
    if ((Validate.isString(id) && id !== '') || (Validate.isNumber(id) && id >= 0)) {
      wx.navigateTo({
        url: `../product/product?id=${id}`,
      });
    } else {
      throw new Error('缺少product id参数');
    }
  },
});
