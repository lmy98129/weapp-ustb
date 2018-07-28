/**
 * @fileOverview 微信小程序的入口文件
 */

var qcloud = require('./vendor/qcloud-weapp-client-sdk/index');
var config = require('./config');

App({
    /**
     * 小程序初始化时执行，我们初始化客户端的登录地址，以支持所有的会话操作
     */
    data: {
      openId: '',
      teacherRealName: '',
      isTeachDataUpdated: false,
      isStuDataUpdated: false,
      classDataStoreStu: '',
      requireDataStoreStu: '',
      isTeachModeGlobal: 0,
      teacherAuthId: 0,
      teachAuthStatus: 0,
      userInfo: {},
      isIpx: false,
      isIp4: false,
      tabStatus: {
        indexActive: true,
        userpageActive: false
      }
    },

    onLaunch() {
        qcloud.setLoginUrl(config.service.loginUrl);
        wx.hideTabBar();
    }
    
});