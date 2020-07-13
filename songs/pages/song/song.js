import PubSub from "pubsub-js"; //消息订阅与发布
import moment from "moment"; //时间格式化
import request from "../../../utils/request";

// 获取全局app实例
let appInstance = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 标识音乐是否播放
    song: {}, // 歌曲信息的对象
    musicId: "", // 音乐id
    musicLink: "", //音乐的链接
    durationTime: "00:00", //总时长
    currentTime: "00:00", //当前时长
    currentWidth: 0, //实施进度条的长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // options: 默认是空对象，用来接收路由跳转传参的参数
    // console.log(options.song); // 因为url长度的限制，被截取了部分出来
    let musicId = options.musicId;
    this.getSongData(musicId);

    // 判断当前页面音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === this.data.musicId) {
      // 当前页面在播放
      this.setData({
        isPlay: true,
      });
    }

    // 生成背景音乐实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();

    // 部署监听(播放，暂停，停止)
    this.backgroundAudioManager.onPlay(() => {
      console.log("play");
      this.setData({
        isPlay: true,
      });
      // 修改全局的状态
      appInstance.globalData.isMusicPlay = true;
      appInstance.globalData.musicId = musicId;
    });

    this.backgroundAudioManager.onPause(() => {
      console.log("pause");
      this.setData({
        isPlay: false,
      });
      // 修改全局的状态
      appInstance.globalData.isMusicPlay = false;
      // appInstance.globalData.musicId = musicId;
    });

    this.backgroundAudioManager.onStop(() => {
      console.log("stop");
      this.setData({
        isPlay: false,
      });

      // this.backgroundAudioManager.stop();
      appInstance.globalData.isMusicPlay = false;
    });

    // 监听背景音频停止事件
    this.backgroundAudioManager.onStop(() => {
      this.setData({
        isPlay: false,
      });
      appInstance.globalData.isMusicPlay = false;
    });

    // 监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format("mm:ss");
      let currentWidth = (this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration) * 450;
      this.setData({
        currentTime,
        currentWidth,
      });
    });

    // 监听音乐播放结束，自动切换至下一首
    this.backgroundAudioManager.onEnded(() => {
      PubSub.publish("switchType", "next");
    });

    // 订阅recommendSong页面发送的消息
    PubSub.subscribe("musicId", (msg, musicId) => {
      console.log("recommend页面发送过来的数据： ", musicId);
      // 获取歌曲信息
      this.getSongData(musicId);
      // 播放歌曲
      this.musicControl(true, musicId);
    });
  },

  // 封装获取音乐详情数据的方法
  async getSongData(musicId) {
    // 发请求获取音乐响应数据
    let songData = await request("/song/detail", { ids: musicId });
    // 格式化时间
    let dt = songData.songs[0].dt;
    let durationTime = moment(dt).format("mm:ss");
    this.setData({
      song: songData.songs[0],
      musicId,
      durationTime,
    });
    // 修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    });
  },

  // 音乐播放/暂停点击事件的回调
  musicPlay() {
    let isPlay = !this.data.isPlay;
    this.setData({
      isPlay,
    });
    let { musicId, musicLink } = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },

  // 封装控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      // 音乐播放
      // 判断是否需要发送请求获取新的音乐链接
      if (!musicLink) {
        // 通过musicId获取音乐播放链接
        let musicLinkData = await request(`/song/url`, { id: musicId });
        musicLink = musicLinkData.data[0].url;
        // 更新musicLink状态
        this.setData({
          musicLink,
        });
      }
      this.backgroundAudioManager.src = musicLink;
      // 注意： title属性必填，否则无法播放
      this.backgroundAudioManager.title = this.data.song.name;
    } else {
      // 音乐暂停
      this.backgroundAudioManager.pause();
      // appInstance.globalData.isMusicPlay = false;
    }
  },

  // 点击切歌的回调
  handleSwitch(event) {
    // 停掉当前音乐
    this.backgroundAudioManager.stop();
    let type = event.currentTarget.id;
    // 发布消息给recommendSong
    PubSub.publish("switchType", type);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
