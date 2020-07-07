import config from "./config";

// 封装请求
export default (url, data = {}, method = "GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method: method,
      success: (res) => {
        console.log(res);
        resolve(res.data);
      },
      faild: (error) => {
        console.log(error);
        reject(error);
      },
    });
  });
};
