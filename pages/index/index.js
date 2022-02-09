// index.js
// 获取应用实例
const app = getApp()


Page({
  data: {
    
  },
  
  gotoCamera(){
    wx.navigateTo({
      url: '/pages/index_subpages/camera/camera',
    })
  },
});
