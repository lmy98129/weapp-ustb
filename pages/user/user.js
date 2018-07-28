// pages/user/user.js
const tabbar = require('../../utils/tabbar');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    tabStatus: {
      indexActive: false,
      userpageActive: true
    },
    isIpx: false,
    isIp4: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (getApp().data.isIpx) {
      this.setData({
        isIpx: true
      })
    } else if (getApp().data.isIp4) {
      this.setData({
        isIp4: true
      })
    }    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var avatarUrl = wx.getStorageSync('avatarUrl');
    this.setData({
      avatarUrl: avatarUrl,
      tabStatus: getApp().data.tabStatus
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  goAuthPage: function(){
    wx.navigateTo({
      url: '../auth/auth',
    })
  },

  goAboutPage: function () {
    wx.navigateTo({
      url: '../about/about',
    })
  },

  tabbarRoute(e) {
    tabbar.route(e, this);
  },

})