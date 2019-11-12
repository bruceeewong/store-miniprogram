// pages/category/category.js
import Category from './category-model.js';
import Print from '../../utils/print.js';
import Validate from '../../utils/validate.js';
const category = new Category();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    activeCategoryID: '',
    activeCategoryIndex: 0,
    templateData: {
      headImg: '',
      title: '',
      name: '',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    category
      .getAllCategories()
      .then(res => {
        if (Validate.isArray(res) && res.length > 0) {
          this.setData({
            categories: res,
          });
          return Promise.resolve(res[0]);
        } else {
          return Promise.reject('分类为空');
        }
      })
      .then(data => {
        this.setData({
          templateData: {
            headImg: data.img.url,
            title: data.name,
          },
        });
        return category.getProductsByCategory(data.id);
      })
      .then(res => {
        this.setData({
          templateData: Object.assign(this.data.templateData, {
            products: res,
          }),
        });
      })
      .catch(err => {
        Print.showToast('初始化失败');
      });
  },

  getAllCategories() {
    category
      .getAllCategories()
      .then(res => {
        console.log(res);
        this.setData({
          categories: res,
        });
        return res;
      })
      .catch(err => {
        Print.showToast('获取所有分类失败');
      });
  },

  getProductsByCategory() {
    category
      .getProductsByCategory(this.data.activeCategoryID)
      .then(res => {
        console.log(res);
        this.setData({
          products: res,
        });
      })
      .catch(err => {
        Print.showToast('获取分类下商品失败');
      });
  },

  hTapCategory(event) {
    const index = category.getDataSet(event, 'index');
    const id = category.getDataSet(event, 'id');

    this.setData({
      activeCategoryID: id,
      activeCategoryIndex: index,
      templateData: Object.assign(this.data.templateData, {
        title: this.data.categories[index].name,
        headImg: this.data.categories[index].img.url,
      }),
    });

    category
      .getProductsByCategory(id)
      .then(res => {
        this.setData({
          templateData: Object.assign(this.data.templateData, {
            products: res,
          }),
        });
      })
      .catch(err => {
        Print.showToast('获取分类下商品失败');
      });
  },
});
