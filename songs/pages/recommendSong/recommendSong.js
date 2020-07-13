import PubSub from "pubsub-js";
import request from "../../../utils/request";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    month: "",
    day: "",
    recommendList: [], //推荐列表
    index: 0, //标识当前播放音乐下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1, //因为是从0开始，所以要+1
    });
    // 发请求获取recommendList数据
    let recommendListData = await request("/recommend/songs");
    // console.log("推荐列表数据", recommendListData);
    this.setData({
      recommendList: recommendListData.recommend,
    });

    // 订阅song发布的消息
    PubSub.subscribe("switchType", (msg, type) => {
      // console.log("song页面发布的消息", msg, type);
      let { recommendList, index } = this.data;
      let musicId;
      // 切换上一首，下一首
      if (type === "pre") {
        index === 0 && (index = reommendList.length);
        index -= 1;
      } else {
        index === recommendList.length - 1 && (index = -1);
        index += 1;
      }
      // 获取最新的播放音乐的id
      musicId = recommendList[index].id;
      // 更新index下标状态
      this.setData({
        index,
      });
      // 将获取的音乐id发送给song页面
      PubSub.publish("musicId", musicId);
    });
  },

  // 跳转song页面的回调
  toSong(event) {
    let { song, id, index } = event.currentTarget.dataset;
    // 更新index的状态数据
    this.setData({
      index,
    });
    wx.navigateTo({
      // 路由传参： query---> url?key=value&key1=value1
      url: "/songs/pages/song/song?musicId=" + id,
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
