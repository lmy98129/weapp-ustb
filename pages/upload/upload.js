const config = require('../../config');
const format = require('../../utils/format');
const req = require('../../utils/req');
const utils = require('../../utils/util');

var classItem;
var courseItem;
var isEdit;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    className: '',
    classPlace: '',
    classIntro: '',
    timeStartIndex: '08:00',
    timeEndIndex: '10:30',
    studentLimit: '',
    dateIndex: '',
    dateLimitStart: '',
    dateLimitEnd: '',
    courseName: '',
    coursePlace: '',
    courseIntro: '',
    contentMode: 1,
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
    isEdit = (JSON.parse(options.edit) == 1);
    if (options.content_type == 1) {
      this.setData({
        contentMode: 1
      })
      classItem = format.dateFormat(options, this, "class");
    } else if (options.content_type == 2) {
      this.setData({
        contentMode: 2
      })
      courseItem = format.dateFormat(options, this, "require");
    }
  },

  uploadSelectedData() {
    var currentTime = new Date().toLocaleString('chinese', { hour12: false }).slice(10, 15).replace(/:/g, "");
    var selectedTime = this.data.timeStartIndex.replace(/:/g, "");
    var currentDate = utils.formatTime(new Date()).replace(/-/g, "");
    var selectedDate = this.data.dateIndex.replace(/-/g, "");

    if(this.data.contentMode == 1){
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
      if (isEdit) {
        req.emit({
          'msgType': 'editClass',
          'classIdToEdit': classItem.id,
          'className': this.data.className,
          'classPlace': this.data.classPlace,
          'classIntro': this.data.classIntro,
          'classDate': this.data.dateIndex,
          'classTimeStart': this.data.timeStartIndex + ":00",
          'classTimeEnd': this.data.timeEndIndex + ":00",
          'studentLimit': studentLimitFormat
        }, this);
      } else {
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
    } else if(this.data.contentMode == 2) {

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

      if ((currentDate > selectedDate) || ((currentDate == selectedDate ) &&(currentTime > selectedTime))) {
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
        'msgType': 'editRequire',
        'id': courseItem.id,
        'courseName': this.data.courseName,
        'coursePlace': this.data.coursePlace,
        'courseIntro': this.data.courseIntro,
        'courseDate': this.data.dateIndex,
        'courseTimeStart': this.data.timeStartIndex + ":00",
        'courseTimeEnd': this.data.timeEndIndex + ":00",
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

  bindClassName: function(e) {
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


  bindStudentLimit: function (e) {
    this.setData({
      studentLimit: e.detail.value
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
  
  onShow: function () {

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

  bindBack() {
    console.log("返回上一级页面");
    wx.switchTab({
      url: '../index/index',
    })
  },
})