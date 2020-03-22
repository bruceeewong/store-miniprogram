import TokenModel from './utils/token';

//app.js
App({
  onLaunch() {
    const tokenModel = new TokenModel();
    tokenModel.verify(); // 进入 app 时就获取 token
  },
});
