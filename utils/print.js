class Print {
  constructor() {}

  static showToast(title = '提示', icon = 'none', duration = 2000) {
    return new Promise((resolve, reject) => {
      wx.showToast({
        title,
        icon,
        duration,
        success() {
          resolve();
        },
        fail() {
          reject();
        },
      });
    });
  }

  static showTips(title, content) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title,
        content: content,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: result => {
          if (result.confirm) {
            resolve();
          } else {
            reject();
          }
        },
      });
    });
  }
}

export default Print;
