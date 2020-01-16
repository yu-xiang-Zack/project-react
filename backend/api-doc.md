# 扫码点餐 API 文档

所有 api 以 http://localhost:800/api 为前缀

## 登陆相关

### POST /register

### GET /captcha

### GET /userinfo

### POST /login

### GET /logout

## 点餐逻辑相关

### GET /deskinfo?did=8

### GET /menu/restaurant/:rid

### POST /restaurant/:rid/desk/:did/order

```json
{
  deskName:
  customCount:
  totalPrice:
  foods: [{id, amount}, {}, {}]
}
```

## 订单管理，需登陆

### GET /restaurant/:rid/order

获取餐厅所有订单

### GET /restaurant/:rid/order/:oid

获取单个订单信息

### DELETE /restaurant/:rid/order/:oid

删除订单

### PUT /restaurant/:rid/order/:oid/status

修改订单状态

```json
{
  status: completed/confirmed
}
```

## 菜品管理，需登陆

### GET /restaurant/:rid/food

获取所有菜品

### POST /restaurant/:rid/food

增加菜品

```json
FormData {
  name,
  price,
  desc,
  catetory,
  img: file
}
```

### DELETE /restaurant/:rid/food/:fid

### PUT /restaurant/:rid/food/:fid

请求体同增加

## 实时通信相关

### 同步点餐状态

```js
io('ws://10.1.1.1:800', {
  path: '/desk',
  query: {
    desk: 'desk:88'//要加入的桌号
  }
})

//此桌已点菜品，仅触发一次
io.on('cart food', foodAry => {

})

//其它人新增菜品，多次触发
io.on('new food', food => {

})

//其它人下单成功
io.on('placeorder success', order => {

})

```

### 后厨实时接收新的订单

```js
io('ws://10.1.1.1:800', {
  path: '/restaurant',
  query: {
    restaurant: 'restaurant:99'//要监听的餐厅id
  }
})

io.on('new order', order => {

})
```
