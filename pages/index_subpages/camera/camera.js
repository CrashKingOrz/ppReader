// pages/index_subpages/camera/camera.js

const app = getApp()
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: '', //拍照后图像路径(临时路径)
        /** 中文 */
        cn_color: "blue",
        cn_flag: 1,
        cn_show: false,

        /** 关联 */
        word_color: "black",
        word_flag: 0,
        word_show: true,

        /** 释义 */
        mean_color: "black",
        mean_flag: 0,
        mean_show: true,

        /** 中文例句 */
        cn_se_color: "black",
        cn_se_flag: 0,
        cn_se_show: true,

        /** 典故 */
        story_color: "black",
        story_flag: 0,
        story_show: true,

        /** 英文 */
        en_color: "black",
        en_flag: 0,
        en_show: true,

        /** 英文例句 */
        en_se_color: "black",
        en_se_flag: 0,
        en_se_show: true,

        /** 查询 */
        search_color: "black",
        search_flag: 0,
        search_show: true,

        /** show mode
         */
        show: false, //相机视图显示隐藏标识

        /** 页面识别内容变量*/
        title: "狗急跳墙",  //OCR识别的文本或Dectect识别的Lable的中文
        pinyin: "等待点读中……",  //OCR识别的文本或Dectect识别的Lable的中文拼音
        rev_word: "无",
        sim_word: "无",
        base_mean: "等待点读中……",
        detail_mean: "等待点读中……",
        sentence: "无",
        story: "无",
        trans: "等待点读中……",
        yinbiao: "等待点读中……",
        en_sentence: "无", //
        checked: false,
        mode_text: "点读",
        mode: 0,
        fps: 0,
        paw: 0
    },

    /** 语音相关 */
    //播放音频初始化，不可省略
    onReady(e) {
      //创建内部 audio 上下文 InnerAudioContext 对象。
      this.innerAudioContext = wx.createInnerAudioContext();
      this.innerAudioContext.onError(function (res) {
        console.log(res);
        wx.showToast({
          title: '语音播放失败',
          icon: 'none',
        })
      }) 
    },

    // //获取句子读音并自动播放
    // get_voice:function(){
    //   var that = this;
    //   var content = this.data.title;
    //   plugin.textToSpeech({
    //     lang: "zh_CN",
    //     tts: true,
    //     content: content,
    //     success: function (res) {
    //       console.log(res);
    //       console.log("succ tts", res.filename);
    //       that.setData({
    //         src: res.filename
    //       })
    //       that.yuyinPlay();
    //     },
    //     fail: function (res) {
    //       console.log("fail tts", res)
    //     }
    //   })
    // },

    //获取单词读音
    get_word_voice:function(){

      var that = this;
      var content = this.data.title;
      plugin.textToSpeech({
        lang: "zh_CN",
        tts: true,
        content: content,
        success: function (res) {
          console.log(res);
          console.log("succ tts", res.filename);
          that.setData({
            src: res.filename
          })
          that.yuyinPlay();
        },
        fail: function (res) {
          console.log("fail tts", res)
        }
      })
    },

    //播放语音
    yuyinPlay: function (e) {
      if (this.data.src == '') {
        console.log(暂无语音);
        return;
      }
      this.innerAudioContext.src = this.data.src //设置音频地址
      this.innerAudioContext.play(); //播放音频
    },

    // 结束语音
    end: function (e) {
      this.innerAudioContext.pause();//暂停音频
    },
    
    /** 画矩形框 */
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
            this.setData({ 
              checked: detail,
            });
          if (this.data.checked) {
            this.setData({
              mode: 1,
              mode_text: '框读'
            })
          }
          else {
            this.setData({
              mode: 0,
              mode_text: '点读'
            })
          }
          }
        },
      });
    },

    baidu_search: function() {
      wx.request({
        url: 'https://ppreader.creativecc.cn/api/others/baidu',
        data: {
          'input_word': this.data.title
        },
        header: {
          'content_type': 'application/json',
        },
        method: 'POST',
        success: res => {
          if (res.statusCode == 200) {
            console.log(res.data)
            if (res.data['ret'] == 0) {
              this.setData({
                pinyin : res.data['relist']['拼音'],
                rev_word : res.data['relist']['反义词'],
                sim_word : res.data['relist']['近义词'],
                base_mean : res.data['relist']['基本释义'],
                detail_mean : res.data['relist']['详细释义'],
                sentence : res.data['relist']['例句'],
              })
            }
            else{
              this.setData({
                pinyin : "等待点读中……",
                rev_word : "等待点读中……",
                sim_word : "等待点读中……",
                base_mean : "等待点读中……",
                detail_mean : "等待点读中……",
                sentence : "等待点读中……",
              })
            }
          }
        }
      })
    },

    text_search: function () {
      wx.request({
          url: 'https://ppreader.creativecc.cn/api/others/youdao_word/ZtoE ', //英汉
          data: {
              'input_word': this.data.title //查询单词，key必须为 “input_word"
          },
          header: {
              'content-type': 'application/json',
          },
          method: 'POST',
          success: res => {
              if (res.statusCode == 200) {
                  console.log(res.data)//输出response
                  if (res.data['ret'] == 0) {//ret = 0 查询成功
                      this.setData({
                          trans : res.data['relist']['英文'],
                          yinbiao : res.data['relist']['英标'],
                          // en_sentence : res.data['relist'][0]["英"]
                          en_sentence : res.data['relist'][0]
                      })
                  } else {//ret = 1 查询识别 显示报错msg
                      this.setData({
                          trans: res.data['msg']
                      })
                  }
              }
          }
      })
  },
  
    // observers: {
    //   'title': function(title) {
    //     // 在 title 被设置时，执行这个函数
    //     this.baidu_search
    //   }
    // },

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
          const dataUrl = canvas.toDataURL("image/jpeg", 0.9); //使用toDataURL方法将相机帧压缩为JPEG，质量70%
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
              if(res.data.text != []){
                this.setData(
                  {
                    title : res.data.text,
                    mean : res.data.keypoint,
                    fps : res.data.fps,
                    paw : res.data.hands
                  }
                )
              }
              
              // title = res.data.detection_label
              // mean = res.data.ocr_text
              console.log(res.data)     
              console.log(res.data.data)
              this.showRect(res.data.keypoint[0][0], res.data.keypoint[0][1], res.data.keypoint[1][0] - res.data.keypoint[0][0], res.data.keypoint[1][1] - res.data.keypoint[0][1]);
            },
            fail: (res) => {
              this.setData(
                {
                  title : res.data['msg']
                }
              )
              console.log(res);
              
            },
            complete: (res) => {
              //  that.setData({ sendload: false });
            }
          })
          this.sleep(200)
          
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

    },

    /** 中文*/
    setCnShow(){
      if (!this.data.cn_flag){
        this.setData({
          cn_color: "blue",
          cn_flag: 1,
          cn_show: false
        })
      }
      else{
        this.setData({
          cn_color: "black",
          cn_flag: 0,
          cn_show: true
        })
      }     
    },

    /** 释义*/
    setMeanShow(){
      if (!this.data.mean_flag){
        this.setData({
          mean_color: "blue",
          mean_flag: 1,
          mean_show: false
        })
      }
      else{
        this.setData({
          mean_color: "black",
          mean_flag: 0,
          mean_show: true
        })
      }     
    },

    /** 关联*/
    setWordShow(){
      if (!this.data.word_flag){
        this.setData({
          word_color: "blue",
          word_flag: 1,
          word_show: false
        })
      }
      else{
        this.setData({
          word_color: "black",
          word_flag: 0,
          word_show: true
        })
      }     
    },


    /** 中文例句*/
    setCnSeShow(){
      if (!this.data.cn_se_flag){
        this.setData({
          cn_se_color: "blue",
          cn_se_flag: 1,
          cn_se_show: false
        })
      }
      else{
        this.setData({
          cn_se_color: "black",
          cn_se_flag: 0,
          cn_se_show: true
        })
      }     
    },

    /** 典故*/
    setStoryShow(){
      if (!this.data.story_flag){
        this.setData({
          story_color: "blue",
          story_flag: 1,
          story_show: false
        })
      }
      else{
        this.setData({
          story_color: "black",
          story_flag: 0,
          story_show: true
        })
      }     
    },

    /** 英文*/
    setEnShow(){
      if (!this.data.en_flag){
        this.setData({
          en_color: "blue",
          en_flag: 1,
          en_show: false
        })
      }
      else{
        this.setData({
          en_color: "black",
          en_flag: 0,
          en_show: true
        })
      }     
    },

    /** 英文例句*/
    setEnSeShow(){
      if (!this.data.en_se_flag){
        this.setData({
          en_se_color: "blue",
          en_se_flag: 1,
          en_se_show: false
        })
      }
      else{
        this.setData({
          en_se_color: "black",
          en_se_flag: 0,
          en_se_show: true
        })
      }     
    },

    /** 查询*/
    setSearchShow(){
      if (!this.data.search_flag){
        this.setData({
          search_color: "blue",
          search_flag: 1,
          search_show: false
        })
      }
      else{
        this.setData({
          search_color: "black",
          search_flag: 0,
          search_show: true
        })
      }     
    },
})