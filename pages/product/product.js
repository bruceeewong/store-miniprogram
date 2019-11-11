// pages/product/product.js
import Print from '../../utils/print.js';
import Product from './product-model.js';
const product = new Product();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '',
    price: 0,
    mainImg: '',
    detailImgs: [],
    properties: [],
    cartIcon: '../../images/icon/cart@top.png',
    addToCartIcon: '../../images/icon/cart.png',
    countIcon: '../../images/icon/arrow@down.png',
    stock: 0,
    counts: [1, 2, 3, 4],
    countSelected: 1,
    tabs: ['商品详情', '产品参数', '售后保障'],
    tabActive: 0,
    saleText: '七天无理由退货',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { id = '' } = options;
    console.log(id);
    this.setData({
      id,
    });

    this.getProduct();
  },

  getProduct() {
    product
      .getProduct(this.data.id)
      .then(res => {
        console.log(res);

        this.setData({
          name: res.name,
          mainImg: res.main_img_url,
          counts: Object.keys(Array.from({ length: res.stock })),
          price: res.price,
          stock: res.stock,
          detailImgs: res.imgs.sort((a, b) => a.order - b.order),
          properties: res.properties,
        });
      })
      .catch(err => {
        Print.showToast('获取产品信息失败');
      });
  },

  // 获取所选数量
  hPickerChange(event) {
    const index = event.detail.value;
    const item = this.data.counts[index];
    this.setData({
      countSelected: item,
    });
  },

  hTapTab(event) {
    const index = product.getDataSet(event, 'index');
    this.setData({
      tabActive: index,
    });
  },
});
