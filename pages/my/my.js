// pages/my/my.js
import MyModel from './my-model';
import AddressModel from '../../utils/address';
import OrderModel from '../order/order-model';

const myModel = new MyModel();
const addressModel = new AddressModel();
const orderModel = new OrderModel();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    addressInfo: null,
    orders: [],
    pageIndex: 1,
    isLoadAll: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this._getUserInfo();
    this._getAddressInfo();
    this._getOrder();
  },

  onReachBottom() {
    this.setData({
      pageIndex: this.data.pageIndex + 1,
    });
    this._getOrder();
  },

  _getUserInfo() {
    myModel.getUserInfo().then(data => {
      this.setData({
        userInfo: data,
      });
    });
  },

  _getAddressInfo() {
    addressModel.getAddress().then(addressInfo => {
      this._bindAddressInfo(addressInfo);
    });
  },

  _getOrder() {
    orderModel.getOrder(this.data.pageIndex).then(res => {
      const { data } = res;
      if (data.length === 0) {
        this.setData({
          isLoadAll: true,
        });
        return;
      }
      const localOrders = [...this.data.orders];
      this.setData({
        orders: localOrders.concat(data),
      });
    });
  },

  _bindAddressInfo(addressInfo) {
    this.setData({
      addressInfo,
    });
  },
});
