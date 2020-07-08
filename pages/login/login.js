// pages/login/login.js
import request from "../../utils/request";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  // 收集表单数据
  handleInput(e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      [type]: e.detail.value,
    });
  },
  // 登陆流程
  async login() {
    // 一、收集表单数据
    let { phone, password } = this.data;
    // 二、前端验证
    if (!phone || !password) {
      // 前端验证：用户名和密码都错，提示
      this.showToast("用户名/密码错误");
    } else {
      // 前端验证：用户名和密码均正确
      // 三、后端验证
      // let result = await request(`/login/cellphone?phone=${phone}&password=${password}`);
      let result = await request(`/login/cellphone`, { phone, password, isLogin: true });
      console.log("表单验证数据：", result);
      // 提示信息
      if (result.code === 501 || result.code === 400) {
        // 手机号错误
        this.showToast("手机号错误");
      } else if (result.code === 502) {
        // 密码错误
        this.showToast("密码错误");
      } else {
        // 登陆成功
        this.showToast("登陆成功", "seccess");

        // 1.保存用户数据至本地setStorageSync
        wx.setStorageSync("userInfo", JSON.stringify(result.profile));
        // 2.跳转至个人中心 switchTab reLaunch
        wx.reLaunch({
          url: "/pages/personal/personal",
        });
      }
    }
  },
  // 用于提示消息的功能函数
  showToast(title = "", icon = "none") {
    wx.showToast({
      title,
      icon,
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
