// pages/home/home.js
import Print from '../../utils/print.js';
import Home from './home-model.js';
const home = new Home();

Page({
  data: {
    banners: [],
    themes: [],
  },

  onLoad: function(options) {
    this.getBannerData();
    this.getThemeData();
  },

  getBannerData() {
    home
      .getBannerData(1)
      .then(res => {
        this.setData({
          banners: res.items,
        });
      })
      .catch(err => {
        Print.showToast('获取Banners失败');
      });
  },

  getThemeData() {
    home
      .getThemeData('1,2,3')
      .then(res => {
        this.setData({
          themes: res,
        });
      })
      .catch(err => {
        Print.showToast('获取Themes失败');
      });
  },
});
