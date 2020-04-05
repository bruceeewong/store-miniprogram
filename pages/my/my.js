// pages/my/my.js
import MyModel from './my-model';
import AddressModel from '../../utils/address';
import OrderModel from '../order/order-model';
import SearchParam from '../../utils/search-param';
import Print from '../../utils/print';

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
    pageIndex: 1,
    orders: [],
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

  /**
   * 防止Tab切换频繁发请求，只在有新订单时刷新页面
   */
  onShow() {
    const hasNewOrder = orderModel.getNewOrderFlagFromStorage();
    if (hasNewOrder) {
      this._refresh();
      orderModel.setNewOrderFlagToStorage(false); // 刷新后将新订单标志置false
    }
  },

  _refresh() {
    this.setData({
      pageIndex: 1,
      orders: [],
      isLoadAll: false,
    });
    this._getOrder();
  },

  onReachBottom() {
    this.setData({
      pageIndex: this.data.pageIndex + 1,
    });
    this._getOrder();
  },

  hPay(event) {
    const id = myModel.getDataSet(event, 'id');
    orderModel
      .pay(id)
      .then(statusCode => {
        const searchParam = new SearchParam();
        searchParam.append('id', id);
        searchParam.append('flag', statusCode === 2); // 2是支付成功
        searchParam.append('from', 'my');
        // 跳转结果页
        wx.navigateTo({
          url: `../pay-result/pay-result?${searchParam.toString()}`,
        });
      })
      .catch(e => {
        if (e === 0) {
          Print.showTips('支付失败', '商品已下架或库存不足');
          return;
        }
        throw e;
      });
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

  toOrder(event) {
    const id = orderModel.getDataSet(event, 'id');
    const searchParam = new SearchParam();
    searchParam.append('from', 'my');
    searchParam.append('id', id);
    wx.navigateTo({
      url: `../order/order?${searchParam.toString()}`,
    });
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
