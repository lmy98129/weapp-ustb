const tabRoute = (e, that) => {
  console.log("tabbar跳转到页面：", e.currentTarget.dataset.index);
  var index = e.currentTarget.dataset.index;
  switch (index) {
    case "0":
      wx.switchTab({
        url: '../index/index'
      });
      that.setData({
        tabStatus: {
          indexActive: true,
          userpageActive: false
        }
      });
      getApp().data.tabStatus = {
        indexActive: true,
        userpageActive: false
      }
      break;
    case "1":
      wx.navigateTo({
        url: '../list/list',
      })
      break;
    case "2":
      wx.switchTab({
        url: '../user/user'
      });
      that.setData({
        tabStatus: {
          indexActive: false,
          userpageActive: true
        }
      });
      getApp().data.tabStatus = {
        indexActive: false,
        userpageActive: true
      }
      break;
  }
} 

module.exports = {
  route: tabRoute
}