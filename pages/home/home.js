// pages/home/home.js
import Print from '../../utils/print.js';
import Validate from '../../utils/validate.js';
import Home from './home-model.js';

const home = new Home();

Page({
  data: {
    banners: [],
    themes: [],
    products: [],
  },

  /**
   * 生命周期函数
   */
  onLoad() {
    this.getBanner();
    this.getThemes();
    this.getRecentProducts();
  },

  /**
   * 获取Banner
   */
  getBanner() {
    home
      .getBanner(1)
      .then(res => {
        console.log(res);
        this.setData({
          banners: res.items,
        });
      })
      .catch(err => {
        Print.showToast('获取Banners失败');
      });
  },

  /**
   * 获取精选主题
   */
  getThemes() {
    home
      .getThemes('1,2,3')
      .then(res => {
        this.setData({
          themes: res,
        });
      })
      .catch(err => {
        Print.showToast('获取Themes失败');
      });
  },

  /**
   * 获取最近新品
   */
  getRecentProducts() {
    home
      .getRecentProducts()
      .then(res => {
        this.setData({
          products: res,
        });
      })
      .catch(err => {
        Print.showToast('获取Products失败');
      });
  },

  /**
   * 事件响应函数
   */
  hTapProduct(event) {
    const id = home.getDataSet(event, 'id');
    if ((Validate.isString(id) && id !== '') || (Validate.isNumber(id) && id >= 0)) {
      wx.navigateTo({
        url: `../product/product?id=${id}`,
      });
    } else {
      throw new Error('缺少product id参数');
    }
  },

  hTapTheme(event) {
    const id = home.getDataSet(event, 'id');
    const name = home.getDataSet(event, 'name');

    if ((Validate.isString(id) && id !== '') || (Validate.isString(name) && name !== '')) {
      wx.navigateTo({
        url: `../theme/theme?id=${id}&name=${name}`,
      });
    } else {
      throw new Error('缺少theme id或name参数');
    }
  },
});
