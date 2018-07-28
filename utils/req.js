const qcloud = require('../vendor/qcloud-weapp-client-sdk/index');
const config = require('../config');
const format = require('./format');
const auth = require('./auth');

var welcomeQuote = '欢迎！';
var userWelcomeIntro = '请点击下方的加号按钮创建预约';
var teacherWelcomeIntro = '请点击下方的加号按钮创建课程/辅导';

const post = (obj) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.service.testUrl,
      data: obj,
      success: res => {
        if(res.data.results) {
          resolve(res.data.results);
        } else {
          reject(res.data.error);
        }
      },
      error: error => {
          reject('网络出错');
      }
    });
  });
}

const initUserInfo = (that) => {
  wx.login({
    success: res => {
      if(res.code) {
        that.setData({
          refreshStatus: true
        });
        console.log('获取用户登录凭证：', res.code);

        post({
          'msgType': 'wxAuth', 
          "code": res.code
        }).then(res => {

          console.log("收到消息：", res);
          getApp().data.openId = res;

          return post({
            'msgType': 'checkIsTeachAuth',
            'openId': getApp().data.openId
          })

        }).then(res => {

          console.log("收到消息：", res);
          if (res.isTeachAuth == true) {

            getApp().data.isTeachModeGlobal = 2;
            getApp().data.teacherRealName = res.realName;
            getApp().data.teacherAuthId = res.teacherId;
            getApp().data.teachAuthStatus = res.status;

            that.setData({
              isTeachMode: 2
            })

            return post({
              'msgType': 'getClassDataTeach',
              'openId': getApp().data.openId
            })

          } else {

            getApp().data.isTeachModeGlobal = 1;
            getApp().data.teachAuthStatus = res.status;
            that.setData({
              isTeachMode: 1
            })

            return post({
              'msgType': 'getReservedClass',
              'openId': getApp().data.openId
            })

          }

        }).then(res => {

          console.log("收到消息：", res);
          if (getApp().data.isTeachModeGlobal == 1){

            that.setData({
              reserveArray: format.timeFormat(res, 'class').reverse(),
              emptyClassNote: '',
              emptyClassIntro: '',
              emptyClassUserName: true,
              isEmptyClassContent: false
            })
            if (res[0] == null) {
              that.setData({
                emptyClassNote: welcomeQuote,
                emptyClassIntro: userWelcomeIntro,
                emptyClassUserName: false,
                isEmptyClassContent: true
              })
            }

            return post({
              'msgType': 'getRequireDataStu',
              'openId': getApp().data.openId
            })

          } else {

            that.setData({
              classArray: format.timeFormat(res, 'class').reverse(),
              emptyClassNote: '',
              emptyClassIntro: '',
              emptyUserName: true,
              isEmptyClassContent: false              
            })
            if (res[0] == null) {
              that.setData({
                emptyClassNote: getApp().data.teacherRealName + " 欢迎！",
                emptyClassIntro: teacherWelcomeIntro,
                emptyUserName: false,
                isEmptyClassContent: true                
              })
            }

            return post({
              'msgType': 'getTakenOrder',
              'openId': getApp().data.openId
            })

          }

        }).then(res => {
          console.log("收到消息：", res);
          if (getApp().data.isTeachModeGlobal == 1) {

            that.setData({
              courseArray: format.timeFormat(res, 'course').reverse(),
              emptyCourseNote: '',
              emptyCourseIntro: '',
              emptyCourseUserName: true,
              isEmptyCourseContent: false
            })
            if (res[0] == null) {
              that.setData({
                emptyCourseNote: welcomeQuote,
                emptyCourseIntro: userWelcomeIntro,
                emptyCourseUserName: false,
                isEmptyCourseContent: true
              })
            }

          } else {

            that.setData({
              takenOrderArray: format.timeFormat(res, 'course').reverse(),
              emptyCourseNote: '',
              emptyCourseIntro: '',
              emptyUserName: true,
              isEmptyCourseContent: false
            })
            if (res[0] == null) {
              that.setData({
                emptyCourseNote: getApp().data.teacherRealName + " 欢迎！",
                emptyCourseIntro: teacherWelcomeIntro,
                emptyUserName: false,
                isEmptyCourseContent: true
              })
            }
          }

          setTimeout(() => {
            that.setData({
              refreshStatus: false
            });
          }, 1000);
        }).catch(error => {
            console.log('发生错误：', error);
        })
      } else {
        console.log('获取用户登录态失败：', res.errMsg);        
      }
    }
  })
}

const initClassDataStu = (that) => {
  that.setData({
    refreshStatus: true
  });
  post({
    'msgType': 'getClassDataStu',
    'openId': getApp().data.openId
  }).then(res => {

    that.setData({
      classArray: format.timeFormat(res, 'class').reverse(),
      emptyClassNote: '',
      isEmptyClassContent: false
    })
    console.log('收到消息：', res);
    if (res[0] == null) {
      that.setData({
        emptyClassNote: '当前课程列表为空',
        isEmptyClassContent: true
      })
    }
    getApp().data.classDataStoreStu = res;
    setTimeout(() => {
      that.setData({
        refreshStatus: false
      });
    }, 1000)

  }).catch(error => {
    console.log('发生错误：', error);    
  })
}

const initRequireDataTeach = (that) => {
  that.setData({
    refreshStatus: true
  });
  post({
    'msgType': 'getRequireDataTeach',
    'openId': getApp().data.openId
  }).then(res => {

    that.setData({
      classArray: format.timeFormat(res, 'course').reverse(),
      emptyClassNote: '',
      isEmptyClassContent: false
    })
    console.log('收到消息：', res);
    if (res[0] == null) {
      that.setData({
        emptyCourseNote: '当前辅导需求列表为空',
        isEmptyCourseContent: true
      })
    }
    getApp().data.requireDataStoreStu = res;
    setTimeout(() => {
      that.setData({
        refreshStatus: false
      });
    }, 1000)

  }).catch(error => {
    console.log('发生错误：', error);
  })
}

const emit = (obj,that) => {
  post(obj).then(res => {
    console.log('收到消息：', res);
    if (getApp().data.isTeachModeGlobal == 2)
      getApp().data.isTeachDataUpdated = true;
    else
      getApp().data.isStuDataUpdated = true;
    if (obj.msgType == 'reserveClass' || obj.msgType == 'editClass' 
      || obj.msgType == 'classDataUpload' || obj.msgType == 'requireDataUpload' || obj.msgType == 'editRequire') {
      wx.showToast({
        icon: 'success',
        title: '数据上传成功',
        duration: 3000
      })
    }
    that.bindRefresh();
  }).catch(error => {
      console.log('发生错误：', error);
  })
}

const teachAuthAdmit = (realName, phoneNumber, that) => {
  post({
    'msgType': 'teachAuthAdmit',
    'openId': getApp().data.openId,
    'nickName': wx.getStorageSync('nickName'),
    'realName': that.data.realName,
    'phoneNumber': that.data.phoneNumber
  }).then(res => {

    console.log('收到消息：', res);
    wx.showToast({
      icon: 'success',
      title: '数据上传成功',
      duration: 3000
    })
    getApp().data.teachAuthStatus = 1;
    that.setData({
      isTeachMode: -1
    })
    
  }).catch(error => {
    console.log('发生错误：', error);
  })

}

module.exports = {
  post: post,
  initUserInfo: initUserInfo,
  initClassDataStu: initClassDataStu,
  initRequireDataTeach: initRequireDataTeach,
  emit: emit,
  teachAuthAdmit: teachAuthAdmit,
}