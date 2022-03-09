// pages/index_subpages/camera/camera.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: '', //拍照后图像路径(临时路径)
        show: false, //相机视图显示隐藏标识
        popup_show: false, //识别弹框显示
        title: "初始化",
        mean: "初始化",
        checked: true,
        mode: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */ 
    /*onLoad: function (options) {
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
    },*/

    showRect(x, y, width, height){
      const ctx1 = wx.createCanvasContext('myCanvas', this);        
      ctx1.rect(x, y, width, height);
      ctx1.lineWidth = 4;
      ctx1.setStrokeStyle("red");
      ctx1.stroke();
      ctx1.draw();
    },

    modeChange({ detail }) {
      wx.showModal({
        title: '提示',
        content: '是否切换开关？',
        success: (res) => {
          if (res.confirm) {
            this.setData({ checked: detail });
          }
        },
      });
    },

    showPopup() {
      this.setData({ popup_show: true });
    },
  
    onClose() {
      this.setData({ popup_show: false });
    },

    sleep: function (numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
          now = new Date();
          if (now.getTime() > exitTime)
            return;
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */ 
    onLoad: function (options) {
      
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
      const query = wx.createSelectorQuery();
      query.select('#capture')
          .fields({node: true})
          .exec((res) => {
              const canvas = res[0].node
              //设置canvas内部尺寸为480*640，frame-size="medium"的设置下相机帧大多是480*640
              canvas.width = 480
              canvas.height = 640
              this.canvas = canvas
          });
      
      const cameraContext = wx.createCameraContext();
      const listener = cameraContext.onCameraFrame(frame => {
          if (!this.canvas) return
          const canvas = this.canvas
          //如果尺寸不匹配，就修改canvas尺寸以适应相机帧
          if (canvas.width !== frame.width || canvas.height !== frame.height) {
              canvas.width = frame.width
              canvas.height = frame.height
          }

          const context = canvas.getContext('2d');
          const ctxImageData = context.createImageData(frame.width, frame.height);
          ctxImageData.data.set(new Uint8ClampedArray(frame.data)); //复制相机帧内容到imageData
          context.putImageData(ctxImageData, 0, 0); //将imageData画到canvas上
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7); //使用toDataURL方法将相机帧压缩为JPEG，质量70%
          const base64 = dataUrl.substr(23); //去除dataURL头，留下文件内容的base64
    
          wx.request({
            url: 'https://ppreader.creativecc.cn/api/test',
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            data: {
              'base64': base64,
              'mode': this.data.mode,
            },
            success: (res) => {  
              this.setData(
                {
                  title : res.data.text,
                  mean : res.data.keypoint

                }
              )
              // title = res.data.detection_label
              // mean = res.data.ocr_text
              console.log(res.data)     
              console.log(res.data.data)
              this.showRect(res.data.keypoint[0][0], res.data.keypoint[0][1], res.data.keypoint[1][0] - res.data.keypoint[0][0], res.data.keypoint[1][1] - res.data.keypoint[0][1]);
            },
            fail: (res) => {
              this.setData(
                {
                  title : "aaa",
                  mean : "aaa"
                }
              )
              console.log(res);
              
            },
            complete: (res) => {
              //  that.setData({ sendload: false });
            }
          })
          this.sleep(100)
          
          //TODO 在这里保存frame对象，以便在需要的时候进行下一步压缩图片、发起CRS请求。不要在onCameraFrame回调中直接处理。
      });
      
      listener.start()

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