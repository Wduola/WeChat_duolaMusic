// pages/video/video.js
import request from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], // 视频导航标签数据
    navId: "", // 导航标识
    videoList: [], // 视频列表数据
    videoContext: "", //存放上一个播放记录
    videoId: "", //视屏id
    triggered: false, //标识下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 验证用户是否登录
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo) {
      // 提示用户没有登录，请先登录
      wx.showToast({
        title: "请先登录",
        icon: "none",
      });
      // 跳转至登录页面
      wx.redirectTo({
        url: "/pages/login/login",
      });
      return;
    }

    // 获取视屏导航标签数据
    let videoGroupListData = await request("/video/group/list");
    // 设置
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id, //设置默认第一个有选中的下划线
    });
    // 获取视屏数据的navId
    this.getVideoList(this.data.navId);
  },
  // 获取视屏列表数据
  async getVideoList(navId) {
    let videoListData = await request(`/video/group`, { id: navId });
    // 关闭消息提示
    wx.hideLoading();
    // console.log(videoListData);
    this.setData({
      triggered: false, //标识下拉刷新是否被触发
      videoList: videoListData.datas,
    });
  },
  // 设置选中的导航样式
  changeNavId(e) {
    this.setData({
      navId: e.currentTarget.id >>> 0, // 强制转换成number
      videoList: [], //清空之前的视频
    });
    // 显示加载提示信息
    wx.showLoading({
      title: "正在加载",
    });
    this.getVideoList(this.data.navId);
  },
  // video播放/继续播放回调
  handlePlay(e) {
    // 获取video的id
    let vid = e.currentTarget.id;
    this.setData({ videoId: vid });
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    // this.vid = vid;
    this.videoContext = wx.createVideoContext(vid);
    this.videoContext.play();
  },
  // 自定义下拉刷新回调
  handleRefresher() {
    // 发送获取最新的数据
    this.getVideoList(this.data.navId);
  },
  // scrollView的触底回调
  handleToLower() {
    console.log("scrollView触底事件");
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
