import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import api from './api'
import { produce } from 'immer'
import history from './history'
import io from 'socket.io-client'
import { Button, Icon} from 'antd'



function MenuItem({food, onUpdate, amount}) {
  // var [count, setCount] = useState(amount)

  function dec() {
    if (amount === 0) {
      return
    }
    // setCount(count - 1)
    onUpdate(food, amount - 1)
  }

  function inc() {
    // setCount(count + 1)
    onUpdate(food, amount + 1)
  }

  return (
    <div className="menuItemStyle">
      <h3>菜品名：{food.name}</h3>
      <div className="menuItemDesc">
        <img className="imgStyle" src={'/upload/' + food.img} alt={food.name}/><br/>
        <p>菜品描述：{food.desc}</p>
        <p>菜品价格：{food.price}</p>
      </div>
      <div>
        <Button onClick={dec}>-</Button>
        <span>&nbsp;{amount}&nbsp;</span>
        <Button onClick={inc}>+</Button>
      </div>
    </div>
  )
}

MenuItem.propTypes = {
  food: PropTypes.object.isRequired,
  onUpdate: PropTypes.func,
}

MenuItem.defaultProps = {
  onUpdate: () => {},
}


function calcTotalPrice(cartAry) {
  return cartAry.reduce((total, item) => {
    return total + item.amount * item.food.price
  }, 0)
}



/**
 * foods：购物车信息
 * onUpdate事件：用户修改菜品数量时触发
 * onPlaceOrder事件：用户点击下单时触发
 */
function CartStatus(props) {
  var [expand, setExpand] = useState(false)
  var totalPrice = calcTotalPrice(props.foods)
  var display = expand ? "block" : "none";
  return (
    <div className="foodCart">
      <div className="cart-order">
        {
          <div className="shopping-cart" style={{display}}>
            <div className="cart-outer">
              {
                props.foods.map((foodInfo, idx) => {
                  return (
                     
                    <p key={idx}>
                      <Icon type="close" className="close" onClick={() => setExpand(false)}/>
                      <strong>{foodInfo.food.name}</strong>
                      ---
                      <strong>{foodInfo.food.price}元</strong>×
                      <strong>{foodInfo.amount}</strong>
                    </p>
                  )
                })
              }
            </div>
          </div>
        }
      
      {expand ?
        <Button onClick={() => setExpand(false)}>收起</Button> :
        <Button onClick={() => setExpand(true)}>展开</Button>
      }
      <strong style={{padding:"0 10px"}}>总价：{totalPrice}</strong>
      <Button type="primary" onClick={() => props.onPlaceOrder()}>下单</Button>
      </div>
    </div>
  )
}


export default class FoodCart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cart: [],
      foodMenu: [],
      deskInfo: {},
    }
  }

  componentDidMount() {
    var params = this.props.match.params

    api.get('/deskinfo?did=' + params.did).then(val => {
      this.setState({
        deskInfo: val.data,
      })
    })
    console.log(params)
    api.get('/menu/restaurant/' + params.rid).then(res => {
      this.setState({
        foodMenu: res.data,
      })
    })


    this.socket = io({
      path: '/desk',
      query: {
        desk: 'desk:' + params.did
      }
    })

    this.socket.on('connect', () => {
      console.log('connect on')
      this.socket.emit('join desk', 'desk:' + params.did)
    })



    // 后端发回此桌面已点菜单
    this.socket.on('cart food', info => {
      console.log('cart init', info)
      this.setState(produce(state => {
        state.cart.push(...info)
      }))
    })

    // 来自同桌其它用户新增的菜单
    this.socket.on('new food', info => {

      console.log(info)
      this.foodChange(info.food, info.amount)
    })

    this.socket.on('placeorder success', order => {
      history.push({
        pathname: `/r/${params.rid}/d/${params.did}/order-success`,
        state: order,
      })
    })
  }

  componentWillUnmount() {
    this.socket.close()
  }

  cartChange = (food, amount) => {
    var params = this.props.match.params
    this.socket.emit('new food', {desk: 'desk:' + params.did, food, amount})
  }

  foodChange = (food, amount) => {
    var updated = produce(this.state.cart, cart => {
      var idx = cart.findIndex(it => it.food.id === food.id)

      if (idx >= 0) {
        if (amount === 0) {
          cart.splice(idx, 1)
        } else {
          cart[idx].amount = amount
        }
      } else {
        cart.push({
          food,
          amount,
        })
      }
    })
    this.setState({cart: updated})
  }

  placeOrder = () => {
    console.log('下单')
    var params = this.props.match.params
    // {
    //   deskName:
    //   customCount:
    //   totalPrice:
    //   foods: [{id, amount}, {}, {}]
    // }
    console.log(params)
    api.post(`/restaurant/${params.rid}/desk/${params.did}/order`, {
      deskName: this.state.deskInfo.name,
      customCount: params.count,
      totalPrice: calcTotalPrice(this.state.cart),
      foods: this.state.cart,
    }).then(res => {
      history.push({
        pathname: `/r/${params.rid}/d/${params.did}/order-success`,
        state: res.data,
      })
    })
  }

  render() {
    return (
      <div>
        <div>
          {
            this.state.foodMenu.map(food => {
              var currentAmount = 0
              var currFoodCartItem = this.state.cart.find(cartItem => cartItem.food.id === food.id)
              if (currFoodCartItem) {
                currentAmount = currFoodCartItem.amount
              }

              return <MenuItem key={food.id} food={food} amount={currentAmount} onUpdate={this.cartChange}/>
            })
          }
        </div>
        <CartStatus foods={this.state.cart} onUpdate={this.cartChange} onPlaceOrder={this.placeOrder}/>
      </div>
    )
  }
}