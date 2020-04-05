import Base from '../../utils/base';

export default class My extends Base {
  getUserInfo() {
    return new Promise(resolve => {
      wx.getUserInfo({
        success(res) {
          resolve(res);
        },
        fail(e) {
          resolve({
            avatarUrl: '../../images/icon/user@default.png',
            nickName: '零食小贩',
          });
        },
      });
    });
  }
}
