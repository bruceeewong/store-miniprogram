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
    id: null,
    amount: 0,
    products: [],
    orderStatus: 0,
    addressInfo: null,
    basicInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { from } = options;
    if (from === 'cart') {
      this._initFromCart(options.amount);
    } else {
      this.setData({
        id: options.id,
      });
      this._initFromOrder(options.id);
    }
  },

  /**
   * 更新订单详情
   */
  onShow() {
    this._initFromOrder(this.data.id);
  },

  hEditAddress() {
    // 调用微信小程序获取收货地址API
    AddressModel.chooseAddress().then(data => {
      addressModel.submitAddress(data).catch(e => {
        Print.showToast('地址信息更新失败');
      });
      const addressInfo = {
        name: data.userName,
        mobile: data.telNumber,
        fullAddress: addressModel.concatAddress(data),
      };
      this._bindAddressInfo(addressInfo);
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

  _initFromCart(amount) {
    const products = cartModel.getCartDataFromStorage(true);

    this.setData({
      products,
      amount,
      orderStatus: 0,
    });

    addressModel.getAddress().then(data => {
      this._bindAddressInfo(data);
    });
  },

  _initFromOrder(id) {
    if (!id) {
      return;
    }
    orderModel.getOrderInfoById(id).then(data => {
      this.setData({
        orderStatus: data['status'],
        products: data['snap_items'],
        amount: data['total_price'],
        basicInfo: {
          orderTime: data['create_time'],
          orderNo: data['order_no'],
        },
      });

      data['snap_address'].fullAddress = addressModel.concatAddress(data['snap_address']);
      this._bindAddressInfo(data['snap_address']);
    });
  },

  _bindAddressInfo(addressInfo) {
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
        // statusCode为1或2，此时订单已经生成了
        this._deleteCartProducts();

        const search = new SearchParam();
        search.append('id', id);
        search.append('from', 'order');

        if (statusCode === 1) {
          search.append('flag', false);
          wx.navigateTo({
            url: `../pay-result/pay-result?${search.toString()}`,
          });
        }

        search.append('flag', true);
        wx.navigateTo({
          url: `../pay-result/pay-result?${search.toString()}`,
        });
      })
      .catch(e => {
        if (e === 0) {
          Print.showToast('生成预订单失败');
          return;
        }
        throw e;
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

  _oneMoreTryPay() {
    this._execPay(this.data.id);
  },
});
