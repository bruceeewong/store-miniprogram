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
    loadedData: {},
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
    this.initData();
  },

  /**
   * 初始化数据
   */
  initData() {
    category
      .getAllCategories()
      .then(categories => {
        if (!Validate.isArray(categories)) {
          throw new Error('参数错误，类型应为数组');
        }
        if (categories.length === 0) {
          throw new Error('分类为空');
        }
        this.setData({
          categories,
          templateData: {
            headImg: categories[0].img.url,
            title: categories[0].name,
          },
        });
        return category.getProductsByCategory(categories[0].id);
      })
      .then(products => {
        this.setData({
          templateData: Object.assign(this.data.templateData, {
            products,
          }),
        });
      })
      .catch(err => {
        Print.showToast(err.message);
        console.error(err);
      });
  },

  /**
   * 点击左栏的分类的响应事件
   * @param {object} event
   */
  hTapCategory(event) {
    const index = category.getDataSet(event, 'index');
    const id = category.getDataSet(event, 'id');

    this.setData({
      activeCategoryID: id,
      activeCategoryIndex: index,
    });

    // 如果缓存变量中有数据，直接拿，不发请求
    if (this.checkIsLoadedData(index)) {
      this.loadDataFromCache(index);
      return;
    }

    // 请求分类下的商品
    category
      .getProductsByCategory(id)
      .then(data => {
        const newTemplateData = {
          title: this.data.categories[index].name,
          headImg: this.data.categories[index].img.url,
          products: data,
        };

        this.setData({
          templateData: newTemplateData,
        });

        // 将当前数据放到缓存变量，避免频繁访问服务器
        this.saveDataToCache(index, newTemplateData);
      })
      .catch(err => {
        Print.showToast('切换分类失败');
        console.error(err);
      });
  },

  /**
   * 点击具体产品的响应事件
   * @param {object} event
   */
  hTapProduct(event) {
    const id = category.getDataSet(event, 'id');
    if ((Validate.isString(id) && id !== '') || (Validate.isNumber(id) && id >= 0)) {
      wx.navigateTo({
        url: `../product/product?id=${id}`,
      });
    } else {
      throw new Error('缺少product id参数');
    }
  },

  /**
   * 判断当前分类的数据是否已经被加载
   * @param {string} key
   * @returns {boolean}
   */
  checkIsLoadedData(key) {
    if (this.data.loadedData[key]) {
      return true;
    }
    return false;
  },

  /**
   * 将右侧模板（头图、产品）等信息存入缓存变量中
   * @param {string} key
   * @param {object} data
   */
  saveDataToCache(key, data) {
    this.data.loadedData[key] = data;
  },

  /**
   * 从缓存变量中获取右侧模板所需数据，更新变量
   * @param {string} index
   */
  loadDataFromCache(index) {
    this.setData({
      templateData: this.data.loadedData[index],
    });
  },
});
