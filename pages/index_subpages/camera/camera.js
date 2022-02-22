// pages/index_subpages/camera/camera.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: '',//拍照后图像路径(临时路径)
        show: false//相机视图显示隐藏标识
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const ctx = wx.createCameraContext()
        const listener = ctx.onCameraFrame((frame) => {
          // 每一帧
          console.log(wx.arrayBufferToBase64(frame.data))
          // // console.log(frame)
          console.log(frame.data instanceof ArrayBuffer, frame.width, frame.height)
          wx.request({
            url: 'https://xdx.test.com:8000/api/test',
            method:'POST',
            data:{
              base64:wx.arrayBufferToBase64(frame.data)
            },
            success:(res)=>{
              console.log(res)
            }
          })
        //   this.sleep(5000)
        })
        listener.start()
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

    }
})