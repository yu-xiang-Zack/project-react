const express = require('express')
const multer = require('multer')
const path = require('path')
const io = require('./io-server')

var deskCartMap = new Map()

io.restaurant.on('connection', socket => {
  console.log('restaurant client in')

  var restaurant = socket.handshake.query.restaurant
  socket.join(restaurant)
})

io.desk.on('connection', socket => {
  console.log('desk client in')

  var desk = socket.handshake.query.desk
  if (!desk) {
    socket.close()
    return
  }
  socket.join(desk)

  var cartFood = deskCartMap.get(desk)

  if (!cartFood) {
    cartFood = [] 
    deskCartMap.set(desk, cartFood)
  }

  socket.emit('cart food', cartFood)

  socket.on('new food', info => {
    var foodAry = deskCartMap.get(info.desk)
    var idx = foodAry.findIndex(it => it.food.id === info.food.id)

    if (idx >= 0) {
      if (info.amount === 0) {
        foodAry.splice(idx, 1)
      } else {
        foodAry[idx].amount = info.amount
      }
    } else {
      foodAry.push({
        food: info.food,
        amount: info.amount,
      })
    }

    io.desk.in(desk).emit('new food', info)
  })
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const uploader = multer({storage: storage})

let db
(async function(){
  db = await require('./db')
}())

const app = express.Router()

// 获取桌面信息如餐厅名称，桌面名称
// 将会在landing页面请求并展示
// /desinfo?rid=5&did=8
app.get('/deskinfo', async (req, res, next) => {
  // req.query.rid -> '5'
  // req.query.did -> '8'

  // CREATE TABLE desks (
  //   id integer primary key,
  //   rid integer not null,
  //   name string not null,
  //   capacity integer
  // );
  console.log(req.query.did)

  var desk = await db.get(`
    SELECT 
      desks.id as did,
      users.id as uid,
      desks.name,
      users.title
    FROM desks JOIN users ON desks.rid = users.id
    WHERE desks.id=?
  `, req.query.did)

  res.json(desk)
})


//返回某餐厅的菜单
// /menu/restaurant/25
app.get('/menu/restaurant/:rid', async (req, res, next) => {
  // CREATE TABLE foods (
  //   id integer primary key,
  //   rid integer not null,
  //   name string not null,
  //   desc string,
  //   price integer not null,
  //   img string,
  //   category string,
  //   status string not null
  // );
    
  var menu = await db.all(`
    SELECT * FROM foods WHERE rid = ? AND status = 'on'
  `, req.params.rid)

  res.json(menu)
})

// 用户下单
// {
//   deskName:
//   customCount:
//   totalPrice:
//   foods: [{id, amount}, {}, {}]
// }
app.post('/restaurant/:rid/desk/:did/order', async (req, res, next) => {
  var rid = req.params.rid
  var did = req.params.did

  var deskName = req.body.deskName
  var totalPrice = req.body.totalPrice
  var customCount = req.body.customCount
  var details = JSON.stringify(req.body.foods)

  var status = 'pending'// confirmed/completed
  var timestamp = new Date().toISOString()

  await db.run(`
    INSERT INTO orders (rid, did, deskName, totalPrice, customCount, details, status, timestamp)
      VALUES (?,?,?,?,?,?,?,?)
  `, rid, did, deskName, totalPrice, customCount, details, status, timestamp)

  var order = await db.get('SELECT * FROM orders ORDER BY id DESC LIMIT 1')
  order.details = JSON.parse(order.details)
  res.json(order)

  var desk = 'desk:' + did

  deskCartMap.set(desk, [])//清空当前桌已点菜数据

  io.desk.in(desk).emit('placeorder success', order)//通知其它人下单成功

  io.restaurant.in('restaurant:' + rid).emit('new order', order)//通知餐厅新订单
})


// 订单管理
app.route('/restaurant/:rid/order')
.get(async (req, res, next) => {
  var orders = await db.all('SELECT * FROM orders WHERE rid = ? ORDER BY timestamp DESC', req.cookies.userid)
  orders.forEach(order => {
    order.details = JSON.parse(order.details)
  })
  res.json(orders)
})



app.route('/restaurant/:rid/order/:oid')
.get(async (req, res, next) => {

  var order = await db.run('SELECT * FROM orders WHERE rid = ? AND id = ?', req.cookies.userid, req.params.oid)

  if (order) {
    await db.run('DELETE FROM orders WHERE rid = ? AND id = ?', req.cookies.userid, req.params.oid)
    delete order.id
    res.json(order)
  } else {
    res.status(401).json({
      code: -1,
      msg: '没有此订单或您无权限操作此订单'
    })
  }
})

app.route('/restaurant/:rid/order/:oid')
.delete(async (req, res, next) => {
  await db.run('DELETE FROM orders WHERE id = ? AND rid = ?', req.params.oid, req.cookies.userid)
  res.end()
})

// 更改订单状态
// PUT {status: 'pending/confirmed/completed'}
app.route('/restaurant/:rid/order/:oid/status')
.put(async (req, res, next) => {
  await db.run(`
    UPDATE orders SET status = ?
      WHERE id = ? AND rid = ?
  `, req.body.status, req.params.oid, req.cookies.userid)

  res.json(await db.get(`SELECT * FROM orders WHERE id = ?`, req.params.oid))
})


// 菜品管理api
app.route('/restaurant/:rid/food')
.get(async (req, res, next) => {
  // 获取所有菜品列表用于在页面中展示
  
  // CREATE TABLE foods (
  //   id integer primary key,
  //   rid integer not null,
  //   name string not null,
  //   desc string,
  //   price integer not null,
  //   img string,
  //   category string,
  //   status string not null
  // );

  var foodList = await db.all('SELECT * FROM foods WHERE rid=?', req.cookies.userid)
  res.json(foodList)
})
// <input type="file" name="img"/>
// fd = new FormData()
// fd.append('img', input.files[0])
// fd.append('name', 'qinjiaoroushi')
// axios.post('/food', fd, {contenttype:})
.post(uploader.single('img'), async (req, res, next) => {
  // 增加一个菜品

  console.log(req.file)

  await db.run(`
    INSERT INTO foods (rid, name, price, status, desc, category, img)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    req.cookies.userid,
    req.body.name,
    req.body.price,
    req.body.status,
    req.body.desc,
    req.body.category,
    req.file.filename
  )
  
  var food = await db.get('SELECT * FROM foods ORDER BY id DESC LIMIT 1')

  res.json(food)
})

app.route('/restaurant/:rid/food/:fid')
.delete(async (req, res, next) => {
  var fid = req.params.fid
  var userid = req.cookies.userid

  var food = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, userid)

  if (food) {
    await db.run('DELETE FROM foods WHERE id = ? AND rid = ?', fid, userid)
    delete food.id
    res.json(food)
  } else {
    res.status(401).json({
      code: -1,
      msg: '不存在此菜品或您没有权限删除此菜品'
    })
  }
})
.put(uploader.single('img'), async (req, res, next) => {
  var fid = req.params.fid
  var userid = req.cookies.userid

  var food = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, userid)

  var newFoodInfo = {
    name: req.body.name ? req.body.name : food.name,
    price: req.body.price ? req.body.price : food.price,
    status: req.body.status ? req.body.status : food.status,
    desc: req.body.desc ? req.body.desc : food.desc,
    category: req.body.category ? req.body.category : food.category,
    img: req.file ? req.file.filename : food.img,
  }
  
  if (food) {
    await db.run(
      `
        UPDATE foods SET name = ?, price = ?, status = ?, desc = ?, category = ?, img = ?
          WHERE id = ? AND rid = ?
      `,
      newFoodInfo.name, newFoodInfo.price, newFoodInfo.status, newFoodInfo.desc, newFoodInfo.category, newFoodInfo.img,
      fid, userid
    )


    var food = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, userid)

    console.log('updated food', food)

    res.json(food)
  } else {
    res.status(401).json({
      code: -1,
      msg: '不存在此菜品或您没有权限删除此菜品'
    })
  }
})



//桌面管理api
app.route('/restaurant/:rid/desk')
.get(async (req, res, next) => {

  var deskList = await db.all('SELECT * FROM desks WHERE rid=?', req.cookies.userid)
  res.json(deskList)
})
.post(async (req, res, next) => {
  // 增加一个桌子

  await db.run(`
    INSERT INTO desks (rid, name, capacity) VALUES (?, ?, ?)
  `, req.cookies.userid, req.body.name, req.body.capacity)
  
  var desk = await db.get('SELECT * FROM desks ORDER BY id DESC LIMIT 1')

  res.json(desk)
})

app.route('/restaurant/:rid/desk/:did')
.delete(async (req, res, next) => {
  var did = req.params.did
  var userid = req.cookies.userid

  var desk = await db.get('SELECT * FROM desks WHERE id = ? AND rid = ?', did, userid)

  if (desk) {
    await db.run('DELETE FROM desks WHERE id = ? AND rid = ?', did, userid)
    delete desk.id
    res.json(desk)
  } else {
    res.status(401).json({
      code: -1,
      msg: '不存在此桌面或您没有权限删除此桌面'
    })
  }
})
.put(async (req, res, next) => {
  var did = req.params.did
  var userid = req.cookies.userid

  var desk = await db.get('SELECT * FROM desks WHERE id = ? AND rid = ?', did, userid)

  if (desk) {
    await db.run(
      `
        UPDATE desks SET name = ?, capacity = ?
          WHERE id = ? AND rid = ?
      `,
      req.body.name, req.body.capacity,
      did, userid
    )

    var desk = await db.get('SELECT * FROM desks WHERE id = ? AND rid = ?', did, userid)

    res.json(desk)
  } else {
    res.status(401).json({
      code: -1,
      msg: '不存在此桌面或您没有权限删除此桌面'
    })
  }
})

module.exports = app
