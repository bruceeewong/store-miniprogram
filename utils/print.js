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
}

export default Print;
