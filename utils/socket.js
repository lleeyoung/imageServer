// 引入敏感词库
var tc = require('text-censor')
const { formatUsername } = require('../utils')
const socket = (server) => {
  // 创建socket服务
  const io = require('socket.io').listen(server);

  // 房间用户名单
  const roomInfo = {}
  
  // 随机颜色列表
  const clors = ['#b895ff', '#ffb96b', '#ffc0d5', '#fffab2', '#ffb69f', '#afe7ff', '#e5f4bd', '#ffa1a1']
  // 定义当前颜色
  let currentColor = ''
  // 定义信息列表
  const broadcastMsg = []
  // socket服务连接
  io.sockets.on('connection', (socket) => {
    // console.log('socket.handshake.query ', socket.handshake.query)
    // 获取房间ID
    let roomId = socket.handshake.query.roomId
    // 定义用户名
    let username = ''
    // 进入直播间
    socket.on('join', user => {
      username = user.username
      // 如果没有创建房间，创建一个新的房间
      if(!roomInfo[roomId]) {
        roomInfo[roomId] = []
      }
      // 将用户的昵称加入到房间名单中
      roomInfo[roomId].push(username)
      socket.join(roomId)    // 加入房间

      // broadcastMsg.push(`${user}加入了房间`)
      // 通知房间内人员
      io.to(roomId).emit('syx', username + '加入了房间', roomInfo[roomId])
      io.to(roomId).emit('broadcast', `${username}加入了房间`)
      console.log(username + '加入了房间' + roomId)
    })
    // 获取谁去购买了
    socket.on('goBuy', (msg) => {
      // 通知房间谁去购买了
      io.to(roomId).emit('broadcast', `${formatUsername(username)} 正在去买`)
    })
    // 获取谁加入购物车了
    socket.on('addCart', (msg) => {
      // 通知房间谁加入购物车了
      io.to(roomId).emit('broadcast', `${formatUsername(username)} 悄悄加入了购物车`)
    })
    // 获取发送的消息
    socket.on('sendMsg', d => {
      console.log('獲取客戶端消息', d)
  
      // 敏感词处理
      tc.filter(d.msg, (err, censored) => {
        console.log(err)
        console.log(censored)
        d.msg = censored
      })
  
      // 设置用户颜色
      let newColors = clors.filter((item) => {
        return item !== currentColor
      })
      // 生成颜色下标
      const index = Math.floor(Math.random() * newColors.length)
      // 赋值给随机颜色
      let randomColor = newColors[index]
      d.color = `${randomColor}`
      // 赋值给当前的随机颜色
      currentColor = randomColor

      if (d.tag && d.tag === '客服') {
        d.tag = '客服'
      }
      // 通知房间发送的消息
      io.to(roomId).emit('receiveMessage', d)
    })
  
    // 用户离开
    socket.on('disconnect', () => {
      console.log('离开了')
    })
  })
}

module.exports = socket