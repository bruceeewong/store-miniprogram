// pages/product/product.js
import Product from './product-model.js';
import Cart from '../cart/cart-model.js';
import Print from '../../utils/print.js';
import Util from '../../utils/util.js';

const product = new Product();
const cart = new Cart();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    product: {
      id: '',
      name: '',
      price: 0,
      mainImg: '',
      detailImgs: [],
      properties: [],
      stock: 0,
      detailImgs: [],
      properties: null,
    },
    cart: {
      icon: '../../images/icon/cart@top.png',
      totalCounts: 0, // 显示当前购物车中的所有商品数量
    },
    addToCartIcon: '../../images/icon/cart.png',
    countIcon: '../../images/icon/arrow@down.png',
    counts: [],
    countSelected: 1,
    tabs: ['商品详情', '产品参数', '售后保障'],
    tabActive: 0,
    saleText: '七天无理由退货',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { id = '' } = options;
    const cartTotalCounts = cart.getCartTotalCounts();

    this.setData({
      'product.id': id,
      'cart.totalCounts': cartTotalCounts,
    });

    this.getProduct();
  },

  //
  /**
   * 获取picker控件的购买数量值
   * @param {*} event
   */
  hPickerChange(event) {
    const index = event.detail.value;
    const value = this.data.counts[index];
    this.setData({
      countSelected: value,
    });
  },

  /**
   * 点击商品信息Tab的响应函数
   * @param {object} event
   */
  hTapTab(event) {
    const index = product.getDataSet(event, 'index');
    this.setData({
      tabActive: index,
    });
  },

  /**
   * 点击产品的添加到购物车
   * @param {object} event
   */
  hTapAddToCart(event) {
    const { id, name, main_img_url, price } = this.data.product;
    const productItem = { id, name, main_img_url, price };

    cart.addToCart(productItem, this.data.countSelected);

    this.setData({
      'cart.totalCounts': cart.getCartTotalCounts(),
    });
  },

  /**
   * 跳转购物车页面
   */
  hTapToCart() {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },

  getProduct() {
    product
      .getProduct(this.data.product.id)
      .then(res => {
        this.setData({
          product: res,
          counts: Util.range(1, res.stock),
        });
      })
      .catch(err => {
        Print.showToast('获取产品信息失败');
        console.error(err);
      });
  },
});
