// pages/order/order.js
import CartModel from '../cart/cart-model';
import OrderModel from '../order/order-model';
import AddressModel from '../../utils/address';
import Print from '../../utils/print';
import SearchParam from '../../utils/search-param';

const cartModel = new CartModel();
const orderModel = new OrderModel();
const addressModel = new AddressModel();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    amount: 0,
    products: [],
    orderStatus: 0,
    addressInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { amount, from } = options;
    const products = cartModel.getCartDataFromStorage(true);

    this.setData({
      products,
      amount,
      orderStatus: 0,
    });

    addressModel.getAddress().then(res => {
      const fullAddress = addressModel.concatAddress(res);
      const addressInfo = {
        name: res.name,
        mobile: res.mobile,
        fullAddress,
      };
      this._bindAddresInfo(addressInfo);
    });
  },

  hEditAddress() {
    // 调用微信小程序获取收货地址API
    AddressModel.chooseAddress().then(res => {
      const fullAddress = addressModel.concatAddress(res);
      const addressInfo = {
        name: res.userName,
        mobile: res.telNumber,
        fullAddress,
      };

      addressModel.submitAddress(res).catch(e => {
        Print.showToast('地址信息更新失败');
      });

      this._bindAddresInfo(addressInfo);
    });
  },

  hPay() {
    if (!this.data.addressInfo) {
      Print.showTips('下单提示', '请先填写您的收货地址');
    }

    if (this.data.orderStatus === 0) {
      this._firstTimePay();
      return;
    }
    this._oneMoreTryPay();
  },

  _bindAddresInfo(addressInfo) {
    this.setData({
      addressInfo,
    });
  },

  /**
   * 第一次支付
   * 分为两步：1 生成订单号；2 根据订单号支付
   */
  _firstTimePay() {
    const orderInfo = [];

    this.data.products.forEach(item => {
      orderInfo.push({
        product_id: item.id,
        count: item.counts,
      });
    });

    orderModel.doOrder(orderInfo).then(data => {
      if (!data.pass) {
        this._handleOrderFail(data);
        return;
      }

      const id = data.order_id;
      this.setData({ id });
      this._execPay(id);
    });
  },

  _execPay(id) {
    orderModel
      .pay(id)
      .then(statusCode => {
        if (statusCode === 0) {
          Print.showToast('生成预订单失败');
        }
        // statusCode为1或2，此时订单已经生成了
        this._deleteCartProducts();

        const search = new SearchParam();
        search.append('id', id);
        search.append('flag', statusCode === 2);
        search.append('from', 'order');

        wx.navigateTo({
          url: `../pay-result/pay-result?${search.toString()}`,
        });
      })
      .catch(e => {
        Print.showToast('');
      });
  },

  _deleteCartProducts() {
    const ids = this.data.products.map(item => {
      return item.id;
    });
    cartModel.delete(ids);
  },

  _handleOrderFail(data) {
    const productStatusArr = data['products_status'];
    const problemProducts = [];
    productStatusArr.forEach(item => {
      if (problemProducts.length > 2) {
        return;
      }
      if (!item['have_stock']) {
        problemProducts.push(this._ellipsisName(item.name));
      }
    });
    let result = problemProducts.join('、');
    if (problemProducts.length > 2) {
      result += '等';
    }
    result += ' 缺货';
    Print.showTips('下单失败', result);
  },

  _ellipsisName(name = '') {
    if (name.length > 15) {
      return name.slice(0, 12) + '...';
    }
    return name;
  },

  _oneMoreTryPay() {},
});
