/**
 *  启动聊天的服务端程序
 */
var app = require('express')();
const cors = require('cors');
/* 由于服务端占用了3000端口，socket给服务器发送消息也需要走
*  3000端口，前台启动项目又不能占用3000端口，所以要配置允许跨域
*/
app.use(cors())
var server = require('http').Server(app)
var io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:5173", // 允许的前端域名
    methods: ["GET", "POST"] // 允许的方法
  }
})

// 所有用户
const userList = []

// io.on    注册事件
// io.emit  向所有连接的客户端触发事件
// socket   用户的连接
io.on('connection', socket => {
  socket.on('login', data => {
    const exsist = userList.find((i) => i.username === data.username);
    if (exsist) {
      socket.emit('userExist', { msg: '用户已存在' })
    } else {
      userList.push(data)
      socket.emit("loginSuccess", { ...data })
      // 告诉所有人，有人加入聊天室
      io.emit('joinRoom', data)
      io.emit('userList', userList)
      // 把登录成功的用户名和头像存储起来
      socket.username = data.username
      socket.avatar = data.avatar
    }
  })
  socket.on('disconnect', () => {
    const index = userList.findIndex(i => i.username === socket.username)
    userList.splice(index, 1)
    // 告诉所有人，有人离开聊天室
    io.emit('leaveRoom', { username: socket.username })
    // 更新用户列表
    io.emit('userList', userList)
  })
  socket.on('sendMessage', data => {
    // 将用户消息发送给所有人
    io.emit('receiveMessage', data)
  })
})
server.listen(3000, () => {
  console.log('服务器启动成功')
})

