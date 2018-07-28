// pages/detail/detail.js

var classItem;
var courseItem;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classId: '',
    className: '',
    classIntro: '',
    classDate: '',
    classPlace: '',
    classTimeEnd: '',
    classTimeStart: '',
    submissionDate: '',
    studentLimit:'',
    teacherRealname: '',
    studentSum: '',
    courseName: '',
    courseIntro: '',
    courseDate: '',
    coursePlace: '',
    courseTimeEnd: '',
    courseTimeStart: '',
    teacherNickname: '',
    userNickname: '',
    teacherTelenum: '',
    contentMode: 1,
    isTeachMode: false,
    isTeacherTakeOrder: false,
    isIpx: false,
    isIp4: false,
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
    if(options.content_type == 1) {

      this.setData({
        contentMode: 1
      })
      classItem = JSON.parse(options.class_content);
      if (classItem.student_limit == '0') {
        this.setData({
          studentLimit: '无上限'
        })
      } else {
        this.setData({
          studentLimit: classItem.student_limit
        })
      }
      if (classItem.student_sum == null) {
        this.setData({
          studentSum: '0'
        })
      } else {
        this.setData({
          studentSum: classItem.student_sum
        })
      }
      if (getApp().data.isTeachModeGlobal == 1) {
        this.setData({
          isTeachMode: false,
          teacherRealname: classItem.teacher_realname
        })
      } else {
        this.setData({
          isTeachMode: true
        })
      }
      if (classItem.class_intro == "undefined") {
        classItem.class_intro = "无";
      }
      this.setData({
        classId: classItem.id,
        className: classItem.class_name,
        classIntro: classItem.class_intro,
        classDate: classItem.class_date,
        classPlace: classItem.class_place,
        classTimeEnd: classItem.class_timend,
        classTimeStart: classItem.class_timestart,
        submissionDate: classItem.submission_date
      })
    } else if (options.content_type == 2) {
      this.setData({
        contentMode: 2
      });
      courseItem = JSON.parse(options.class_content);
      if (getApp().data.isTeachModeGlobal == 1) {
        this.setData({
          isTeachMode: false,
          teacherRealname: courseItem.teacher_realname
        })
      } else {
        this.setData({
          isTeachMode: true,
          userNickname: courseItem.user_nickname
        })
      }
      if(courseItem.teacher_realname == null) {
        this.setData({
          isTeacherTakeOrder: false
        });
      } else {
        this.setData({
          isTeacherTakeOrder: true,
          teacherRealname: courseItem.teacher_realname,
          teacherNickname: courseItem.teacher_nickname,
          teacherTelenum: courseItem.teacher_telenum,
        })
      }
      this.setData({
        courseName: courseItem.course_name,
        courseIntro: courseItem.course_intro,
        courseDate: courseItem.course_date,
        coursePlace: courseItem.course_place,
        courseTimeEnd: courseItem.course_timend,
        courseTimeStart: courseItem.course_timestart,
        submissionDate: courseItem.submission_date
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

  bindBack() {
    console.log("返回上一级页面");
    wx.navigateBack({
      delta: 1
    })
  }
})