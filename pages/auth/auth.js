// pages/auth/auth.js
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');
var config = require('../../config');
var utils = require('../../utils/util');
const req = require('../../utils/req');
var tunnelStatus = 'closed';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    realName: '',
    isTeachMode: 0,
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
    if (getApp().data.teachAuthStatus != 2 && getApp().data.teachAuthStatus != null){
      this.setData({
        isTeachMode: -1
      })
    } else {
      switch (getApp().data.isTeachModeGlobal) {
        case 1:
          this.setData({
            isTeachMode: 0
          })
          break;
        case 2:
          this.setData({
            isTeachMode: 1
          })
          break;
      }
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

  uploadAuthData: function() {
    if (isNaN(this.data.phoneNumber)) {
      wx.showModal({
        title: '提示',
        content: '手机号码应输入数字',
        showCancel: false,
        confirmColor: '#17abe3',
        confirmText: '好的'
      })
      return;
    }
    if (this.data.realName == '' || this.data.phoneNumber == '') {
      wx.showModal({
        title: '提示',
        content: '姓名或手机号不能为空',
        showCancel: false,
        confirmColor: '#17abe3',
        confirmText: '好的'
      })
      return;
    } 
    req.teachAuthAdmit(this.data.realName, this.data.phoneNumber, this);
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

  bindPhoneNumber: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  bindRealName: function (e) {
    this.setData({
      realName: e.detail.value
    })
  },

  bindBack() {
    console.log("返回上一级页面");
    wx.switchTab({
      url: '../user/user',
    })
  },

})