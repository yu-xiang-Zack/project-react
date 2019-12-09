const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const userAccountMiddleware = require('./user-account')
const restaurantMiddleware = require('./restaurant')

// const port = 800

const app = express()

app.use((req, res, next) => {
  console.log(req.socket.remoteAddress, req.method, req.url)
  next()
})

app.use(cors({
  origin: true,
  maxAge: 86400,
  credentials: true,
}))

app.use(session({secret:'secret'}))
app.use(cookieParser('secret'))

app.use(express.static(__dirname + '/build/'))//处理静态文件请求的中间件
app.use(express.static(__dirname + '/static/'))//处理静态文件请求的中间件
app.use('/upload', express.static(__dirname + '/upload/'))//处理静态文件请求的中间件

app.use(express.urlencoded({extended: true}))//用来解析扩展url编码的请求体
app.use(express.json())//用来解析json请求体

app.use('/api', userAccountMiddleware)
app.use('/api', restaurantMiddleware)

// app.listen(port, () => {
//   console.log('server listening on port', port)
// })

module.exports = app
