const config = require('../../config');
const req = require('../../utils/req');
const auth = require('../../utils/auth');
const tabbar = require('../../utils/tabbar');

const isCancelArray = ['确定取消该预约？','确定取消该课程？取消后可以恢复课程或彻底删除课程'];

var isFirstTimeLoad = false;
var isFirstTimeLoadList = false;

/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

    /**
     * 初始数据，我们把服务地址显示在页面上
     */
    data: {
        hasUserInfo: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        reserveArray: [],
        classArray: [],
        courseArray: [],
        takenOrderArray: [],
        emptyClassNote: '',
        emptyClassIntro: '',
        emptyCourseNote: '',
        emptyCourseIntro: '',
        emptyClassUserName: true,
        emptyCourseUserName: true,        
        isTeachMode: 0,
        isIpx: false,
        isIp4: false,
        tabStatus: {
          indexActive: true,
          userpageActive: false
        },
        navArrayStu: ['我的课程', '我的辅导'],
        navArrayTeach: ['讲师课程', '辅导预约'],
        currentNavTab: 0,
        refreshStatus: false,
        isEmptyClassContent: true,
        isEmptyCourseContent: true
        
    },

    onLoad: function () {    
      isFirstTimeLoad = true;
      var that = this;
      wx.getSystemInfo({
        success: function(res) {
          if(res.model == 'iPhone X'){
            getApp().data.isIpx = true;
            that.setData({
              isIpx: getApp().data.isIpx
            })
          } else if(res.model == 'iPhone 5' || res.model == 'iPhone 4'){
            getApp().data.isIp4 = true;
            that.setData({
              isIp4: getApp().data.isIp4
            })
          }
        },
      })
    },

    onShow: function () {
      wx.hideTabBar();
      this.setData({
        tabStatus: getApp().data.tabStatus
      })
      var isTeachDataUpdated = getApp().data.isTeachDataUpdated, 
        isStuDataUpdated = getApp().data.isStuDataUpdated;
      console.log(isFirstTimeLoad, isTeachDataUpdated, isStuDataUpdated)
      if (isFirstTimeLoad || isTeachDataUpdated || isStuDataUpdated){
        req.initUserInfo(this);
      }
      if (isFirstTimeLoad || isTeachDataUpdated || isStuDataUpdated){
        isFirstTimeLoad = false;
        getApp().data.isTeachDataUpdated = false;
        getApp().data.isStuDataUpdated = false;    
      }
      auth.showAuthPage(this);
    },

    bindGetUserInfo: function (e) {
      if(e.detail.userInfo){

        var userInfo = e.detail.userInfo;
        console.log('用户授权：', userInfo);

        wx.setStorageSync('nickName',userInfo.nickName);
        wx.setStorageSync('avatarUrl', userInfo.avatarUrl);
        auth.showAuthPage(this);   

        wx.showToast({
          title: "正在登录",
          icon: "loading",
          duration: 1500,
          mask: true
        })

      } else {
        console.log('用户授权：拒绝');
      }
    },
    
    onHide: function () {

    },

    onUnload: function () {
      
    },

    onPullDownRefresh: function () {

    },

    bindRefresh() {
      req.initUserInfo(this); 
    },

    postUserCancelData(id, dataType) {
      if(dataType == "class") {
        req.emit({
          'msgType': 'cancelClass',
          'classId': id,
          'openId': getApp().data.openId
        }, this);
      } else if (dataType == "require") {
        req.emit({
          'msgType': 'cancelRequire',
          'id': id,
          'openId': getApp().data.openId
        }, this);
      }
    },

    postUserRestoreData(id, dataType) {
      if (dataType == "class") {
        req.emit({
          'msgType': 'restoreClass',
          'classId': id,
          'openId': getApp().data.openId
        }, this);
      } else if (dataType == "require") {
        req.emit({
          'msgType': 'restoreRequire',
          'id': id,
          'openId': getApp().data.openId
        }, this);
      }
    },

    postUserDeleteData(id, dataType) {

      if (dataType == "class") {
        req.emit({
          'msgType': 'deleteClass',
          'classId': id,
          'openId': getApp().data.openId
        }, this);
      } else if (dataType == "require") {
        req.emit({
          'msgType': 'deleteRequire',
          'id': id,
          'openId': getApp().data.openId
        }, this);
      }


    },

    cancelItem(e) {
      var that = this;
      var data = e.currentTarget.dataset;
      var typeName;
      if (data.type == "class") {
        typeName = "课程"
      } else if (data.type == "require") {
        typeName = "预约"
      }
      wx.showModal({
        title: '提示',
        content: "确定取消该"+typeName+"？取消后可以恢复"+typeName+"或彻底删除"+typeName,
        confirmColor: '#ff0000',
        cancelText: '返回',
        success: function (res) {
          if (res.confirm) {
            console.log(data.content.id);
            that.postUserCancelData(data.content.id, data.type);
          }
        }
      })
    },

    restoreItem(e) {
      var that = this;
      var data = e.currentTarget.dataset;
      var typeName;
      if (data.type == "class") {
        typeName = "课程"
      } else if (data.type == "require") {
        typeName = "预约"
      }
      wx.showModal({
        title: '提示',
        content: "确定恢复该"+typeName+"？",
        confirmColor: '#ff0000',
        success: function (res) {
          if (res.confirm) {
            console.log(data.content.id);
            that.postUserRestoreData(data.content.id, data.type);
          }
        }
      })
    },
    
    deleteItem(e) {
      var that = this;
      var data = e.currentTarget.dataset;
      var typeName;
      if (data.type == "class") {
        typeName = "课程"
      } else if (data.type == "require") {
        typeName = "预约"
      }
      wx.showModal({
        title: '提示',
        content: "确定删除该" + typeName + "？彻底删除的" + typeName +"将不可恢复",
        confirmColor: '#ff0000',
        success: function (res) {
          if (res.confirm) {
            console.log(data.content.id);
            that.postUserDeleteData(data.content.id, data.type);
          }
        }
      })
    },

    actionSheet(e) {
      var that = this;
      if (e.currentTarget.dataset.content.status == 0) {
        wx.showActionSheet({
          itemList: ['查看详情', '恢复课程','删除课程'],
          itemColor: "#499ef3",
          success: function (res) {
            switch (res.tapIndex) {
              case 0:
                that.goDetailPage(e)
                break;
              case 1:
                that.restoreItem(e)
                break;
              case 2:
                that.deleteItem(e)
                break;
            }
          }
        })
      } else {
        wx.showActionSheet({
          itemList: ['查看详情','修改课程','取消课程'],
          itemColor: "#499ef3",
          success: function(res) {
            switch(res.tapIndex) {
              case 0:
                that.goDetailPage(e)
                break;
              case 1:
                that.goUploadPage(e,'edit');
                break;
              case 2:
                that.cancelItem(e)
                break;
            }
          }
        })
      }
    },

    actionSheetRequire(e) {
      var that = this;
      if (e.currentTarget.dataset.content.status == 0) {
        wx.showActionSheet({
          itemList: ['查看详情', '恢复预约', '删除预约'],
          itemColor: "#499ef3",
          success: function (res) {
            switch (res.tapIndex) {
              case 0:
                that.goDetailPage(e)
                break;
              case 1:
                that.restoreItem(e)
                break;
              case 2:
                that.deleteItem(e)
                break;
            }
          }
        })
      } else {
        wx.showActionSheet({
          itemList: ['查看详情', '修改预约', '取消预约'],
          itemColor: "#499ef3",
          success: function (res) {
            switch (res.tapIndex) {
              case 0:
                that.goDetailPage(e)
                break;
              case 1:
                that.goUploadPage(e, 'edit');
                break;
              case 2:
                that.cancelItem(e)
                break;
            }
          }
        })
      }
    },

    goUploadPage(e,command) {
      var data = e.currentTarget.dataset;
      var typeNum;
      if (data.type == "class") {
        typeNum = '1';
      } else if (data.type == "require") {
        typeNum = '2';
      }
      if (command == 'edit'){
        wx.navigateTo({
          url: '../upload/upload?edit=1&content_type=' + typeNum +'&class_content='+
          JSON.stringify(e.currentTarget.dataset.content)
        })
      } else {
        wx.navigateTo({
          url: '../upload/upload?edit=0&content_type=' + typeNum,
        })
      }
    },

    goClassList() {
      wx.navigateTo({
        url: '../list/list',
      })
    },

    goDetailPage(e){
      var data = e.currentTarget.dataset;
      var typeNum;
      if(data.type == "class") {
        typeNum = '1';
      } else if(data.type == "require") {
        typeNum = '2';
      }
      wx.navigateTo({
        url: '../detail/detail?content_type='+typeNum+'&class_content=' +
        JSON.stringify(data.content)
      })
    },

    bindCancelReserve(e) {
      console.log(e.currentTarget.dataset.content.class_id);
      req.emit({
        'msgType': 'cancelReserve',
        'openId': getApp().data.openId,
        'classId': e.currentTarget.dataset.content.class_id
      },this);
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

    tabbarRoute(e) {
      tabbar.route(e, this);
    },

    bindNavbarTap(e) {
      this.setData({
        currentNavTab: e.currentTarget.dataset.index
      })
    },

    bindBack() {
      console.log("返回上一级页面");
      wx.switchTab({
        url: '../user/user',
      })
    },
})
