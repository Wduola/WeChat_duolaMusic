import config from "./config";

// 封装请求
export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method: method,
      header: {
        cookie: JSON.parse(wx.getStorageSync("cookies") || "[]").toString(), //设置头部cookie，那视屏数据需要用户登录
      },
      success: (res) => {
        // 判断是否是登录请求
        if (data.isLogin) {
          wx.setStorage({
            data: JSON.stringify(res.cookies),
            key: "cookies",
          });
        }
        // console.log(res);
        resolve(res.data);
      },
      faild: (error) => {
        console.log(error);
        reject(error);
      },
    });
  });
};
