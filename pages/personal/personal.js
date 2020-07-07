// pages/personal/personal.js
import request from "../../utils/request";
let startY = 0; //触摸开始位置
let moveY = 0; //触摸移动起始位置
let distance = 0; //距离差

Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: "", //位移
    coverTransition: "", //过度
    userInfo: {}, //用户信息
    recentPlayList: [], //用户播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 判断本地是否有用户登录信息
    let userInfo = wx.getStorageSync("userInfo");
    console.log("用户信息", userInfo);
    if (userInfo) {
      this.setData({
        userInfo: JSON.parse(userInfo),
      });
      // 获取用户播放信息
      let recentPlayListData = await request(`/user/record?uid=${this.data.userInfo.userId}&type=0`);
      this.setData({
        recentPlayList: recentPlayListData.allData,
      });
    }
  },

  // 触摸开始
  handleTouchStart(e) {
    // 触摸向下拉没有过度效果
    this.setData({
      coverTransition: "",
    });
    // 获取触摸开始位置
    startY = e.touches[0].clientY;
  },
  // 触摸移动
  handleTouchMove(e) {
    // 手指移动结束位置
    moveY = e.touches[0].clientY;
    // 距离差
    distance = moveY - startY;
    // 判断极端位置
    if (distance <= 0) {
      return;
    }
    if (distance >= 80) {
      distance = 80;
    }
    // 更新coverTransfrom的状态
    this.setData({
      coverTransform: `translateY(${distance}px)`,
    });
  },
  // 触摸结束
  handleTouchEnd() {
    this.setData({
      // 位移
      coverTransform: `translateY(0px)`,
      // 过度
      coverTransition: "transform .5s linear",
    });
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
