// pages/order/order.js
import CartModel from '../cart/cart-model';
import AddressModel from '../../utils/address';
import Print from '../../utils/print';

const cartModel = new CartModel();
const addressModel = new AddressModel();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    amount: 0,
    products: [],
    orderStatus: 0,
    addressInfo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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

  _bindAddresInfo(addressInfo) {
    this.setData({
      addressInfo,
    });
  },
});
