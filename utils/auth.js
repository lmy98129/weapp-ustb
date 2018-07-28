
const showAuthPage = that => {
  if(wx.getSetting) {
    wx.getSetting({
      success: res => {
        var auth = res.authSetting,
          nickName = wx.getStorageSync('nickName'),
          hasUserInfo;
        console.log("授权情况：", auth);

        if (auth['scope.userInfo'] && nickName)
          hasUserInfo = true;
        else 
          hasUserInfo = false;
          
        console.log("授权标记：", hasUserInfo);                    
        that.setData({
          hasUserInfo: hasUserInfo
        })
      }
    })
  }
}

module.exports = {
  showAuthPage: showAuthPage
}