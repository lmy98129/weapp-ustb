// pages/list/list.js
const config = require('../../config');
const format = require('../../utils/format');
const req = require('../../utils/req');
const utils = require('../../utils/util');

var tunnelStatus = 'closed';
var pageStatus = 'loading';
var isFirstTimeLoad = false;
var curDate = utils.formatTime(new Date());
var curDateFull = new Date();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tunnelUrl: config.service.tunnelUrl,
    classArray: [],
    emptyNote: '',
    isIpx: false,
    isIp4: false,
    isTeachMode: false,
    refreshStatus: false,
    isEmptyClassContent: true,
    navArrayStu: ['预约课程', '预约辅导'],
    navArrayTeach: ['辅导接单', '发布课程'],
    currentNavTab: 0,
    courseName: '',
    coursePlace: '',
    courseIntro: '',
    contentMode: 1,
    timeStartIndex: '08:00',
    timeEndIndex: '10:30',
    dateIndex: '',
    dateLimitStart: '',
    dateLimitEnd: '',
    teacherAuthId: 0,
    nickName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageStatus = 'loading'; 
    isFirstTimeLoad = true; 
    if (getApp().data.isIpx) {
      this.setData({
        isIpx: true
      })
    } else if (getApp().data.isIp4) {
      this.setData({
        isIp4: true
      })
    }
    if (getApp().data.isTeachModeGlobal == 1) {
      this.setData({
        isTeachMode: false,
      })
    } else {
      this.setData({
        isTeachMode: true
      })
    }
    this.setData({
      teacherAuthId: getApp().data.teacherAuthId,
      nickName: wx.getStorageSync('nickName')
    })
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
    pageStatus = 'showing';
    if (isFirstTimeLoad){
      isFirstTimeLoad = false;
      if (getApp().data.classDataStoreStu == '' || getApp().data.isStuDataUpdated){
        getApp().data.isStuDataUpdated = false; 
        if(getApp().data.isTeachModeGlobal == 1) {
          req.initClassDataStu(this);
        } else if (getApp().data.isTeachModeGlobal == 2){
          req.initRequireDataTeach(this);
        }
      } else {
        this.setData({
          classArray: getApp().data.classDataStoreStu
        })
      }
    }
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  bindRefresh() {
    if (getApp().data.isTeachModeGlobal == 1) {
      req.initClassDataStu(this);
    } else if (getApp().data.isTeachModeGlobal == 2) {
      req.initRequireDataTeach(this);
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */

  uploadSelectedData() {
    var currentTime = new Date().toLocaleString('chinese', { hour12: false }).slice(10, 15).replace(/:/g, "");
    var selectedTime = this.data.timeStartIndex.replace(/:/g, "");
    var currentDate = utils.formatTime(new Date()).replace(/-/g, "");
    var selectedDate = this.data.dateIndex.replace(/-/g, "");

    if(getApp().data.isTeachModeGlobal == 1){
      if (new Date(this.data.timeStartIndex.replace(/:/g, "")) > new Date(this.data.timeEndIndex.replace(/:/g, ""))) {
        wx.showModal({
          title: '提示',
          content: '开始时间应小于结束时间',
          showCancel: false,
          confirmColor: '#17abe3',
          confirmText: '好的'
        })
        return;
      }
      if ((currentDate > selectedDate) || ((currentDate == selectedDate) && (currentTime > selectedTime))) {
        wx.showModal({
          title: '提示',
          content: '预约时间应大于当前时间',
          showCancel: false,
          confirmColor: '#17abe3',
          confirmText: '好的'
        })
        return;
      }
      if (this.data.courseName == '') {
        wx.showModal({
          title: '提示',
          content: '科目名称不能为空',
          showCancel: false,
          confirmColor: '#17abe3',
          confirmText: '好的'
        })
        return;
      }

      req.emit({
        'msgType': 'requireDataUpload',
        'userId': getApp().data.openId,
        'userNickName': wx.getStorageSync('nickName'),
        'courseName': this.data.courseName,
        'coursePlace': this.data.coursePlace,
        'courseIntro': this.data.courseIntro,
        'courseDate': this.data.dateIndex,
        'courseTimeStart': this.data.timeStartIndex + ":00",
        'courseTimeEnd': this.data.timeEndIndex + ":00",
      }, this);
    } else {
      if (new Date(this.data.timeStartIndex.replace(/:/g, "")) > new Date(this.data.timeEndIndex.replace(/:/g, ""))) {
        wx.showModal({
          title: '提示',
          content: '开始时间应小于结束时间',
          showCancel: false,
          confirmColor: '#17abe3',
          confirmText: '好的'
        })
        return;
      }
      if ((currentDate > selectedDate) || ((currentDate == selectedDate) && (currentTime > selectedTime))) {
        wx.showModal({
          title: '提示',
          content: '预约时间应大于当前时间',
          showCancel: false,
          confirmColor: '#17abe3',
          confirmText: '好的'
        })
        return;
      }
      if (isNaN(this.data.studentLimit) && !(this.data.studentLimit == undefined)) {
        wx.showModal({
          title: '提示',
          content: '人数上限应输入数字',
          showCancel: false,
          confirmColor: '#17abe3',
          confirmText: '好的'
        })
        return;
      }
      if (this.data.className == '') {
        wx.showModal({
          title: '提示',
          content: '课程名称不能为空',
          showCancel: false,
          confirmColor: '#17abe3',
          confirmText: '好的'
        })
        return;
      }
      var studentLimitFormat;
      if (this.data.studentLimit == '') {
        studentLimitFormat = '0';
      } else {
        studentLimitFormat = this.data.studentLimit;
      }
      req.emit({
        'msgType': 'classDataUpload',
        'teacherAuthId': getApp().data.teacherAuthId,
        'className': this.data.className,
        'classPlace': this.data.classPlace,
        'classIntro': this.data.classIntro,
        'classDate': this.data.dateIndex,
        'classTimeStart': this.data.timeStartIndex + ":00",
        'classTimeEnd': this.data.timeEndIndex + ":00",
        'studentLimit': studentLimitFormat
      }, this);
    }
  },

  bindTimeStartPickerChange: function (e) {
    this.setData({
      timeStartIndex: e.detail.value
    })
  },

  bindTimeEndPickerChange: function (e) {
    this.setData({
      timeEndIndex: e.detail.value
    })
  },

  bindDatePickerChange: function (e) {
    this.setData({
      dateIndex: e.detail.value
    })
  },

  bindCourseName: function (e) {
    this.setData({
      courseName: e.detail.value
    })
  },

  bindCoursePlace: function (e) {
    this.setData({
      coursePlace: e.detail.value
    })
  },

  bindCourseIntro: function (e) {
    this.setData({
      courseIntro: e.detail.value
    })
  },


  bindClassName: function (e) {
    this.setData({
      className: e.detail.value
    })
  },

  bindClassPlace: function (e) {
    this.setData({
      classPlace: e.detail.value
    })
  },

  bindClassIntro: function (e) {
    this.setData({
      classIntro: e.detail.value
    })
  },

  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  goDetailPage(e) {
    var data = e.currentTarget.dataset;
    var typeNum;
    if (data.type == "class") {
      typeNum = '1';
    } else if (data.type == "require") {
      typeNum = '2';
    }
    wx.navigateTo({
      url: '../detail/detail?content_type=' + typeNum + '&class_content=' +
      JSON.stringify(data.content)
    })
  },

  bindReserve(e){
    console.log(e.currentTarget.dataset.content.id);
    req.emit({
      'msgType': 'reserveClass',
      'openId': getApp().data.openId,
      'nickName': wx.getStorageSync('nickName'),
      'classId': e.currentTarget.dataset.content.id
    },this);
  },

  bindCancelReserve(e){
    console.log(e.currentTarget.dataset.content.id);
    req.emit({
      'msgType': 'cancelReserve',
      'openId': getApp().data.openId,
      'classId': e.currentTarget.dataset.content.id
    },this);
  },

  bindTakeOrder(e) {
    var data = e.currentTarget.dataset;
    console.log(data.content.id);
    req.emit({
      'msgType': 'takeOrder',
      'openId': getApp().data.openId,
      'nickName': wx.getStorageSync('nickName'),
      'id': data.content.id
    }, this);
  },

  bindCancelOrder(e) {
    var data = e.currentTarget.dataset;
    console.log(data.content.id);
    req.emit({
      'msgType': 'cancelOrder',
      'openId': getApp().data.openId,
      'id': data.content.id
    }, this);
  },

  bindBack() {
    console.log("返回上一级页面");
    wx.navigateBack({
      delta: 2
    })
  },

  bindStudentLimit: function (e) {
    this.setData({
      studentLimit: e.detail.value
    })
  },


  bindNavbarTap(e) {
    this.setData({
      currentNavTab: e.currentTarget.dataset.index
    })
  }

})