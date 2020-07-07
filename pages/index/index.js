// pages/index/index.js
import request from "../../utils/request";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], //banner
    recommendList: [], //推荐歌曲
    topList: [], //排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取banner数据
    let bannerListData = await request("/banner", { type: 2 });
    this.setData({
      bannerList: bannerListData.banners,
    });
    // 获取推荐歌曲数据
    let recommendListData = await request("/personalized");
    this.setData({
      recommendList: recommendListData.result,
    });
    // 获取排行榜数据
    let idx = 0;
    let resultArr = [];
    while (idx < 5) {
      let result = await request("/top/list", { idx: idx++ });
      // 对数据进行过滤：slice
      let obj = { name: result.playlist.name, tracks: result.playlist.tracks.slice(0, 3) };
      resultArr.push(obj);
    }
    //数据添加完毕后，统一更新
    this.setData({
      topList: resultArr,
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
