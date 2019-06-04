// 姓名格式化保留第一个和最后一个中间用三个星号代替
function formatUsername (username) {
  return username.substr(0, 1) + '***' + username.substr(-1, 1)
}

module.exports = {
  formatUsername
}