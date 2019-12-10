import React, {Component, useState} from 'react'
import PropTypes from 'prop-types'
import { produce } from 'immer'
import api from './api'
import history from './history'
import { Button } from 'element-react'
import 'element-theme-default'
import io from 'socket.io-client'


function MenuItem({food, onUpdate}) {
    var [count, setCount] = useState(0)

    function dec() {
        if (count === 0) {
            return
        }
        setCount(count - 1)
        onUpdate(food, count - 1)
    }

    function inc() {
        if (count === 99) {
            return
        }
        setCount(count + 1)
        onUpdate(food, count + 1)
    }

    return (
        <div>
            <h3>菜品名：{food.name}</h3>
            <div>
                <img src = {'http://localhost:800/upload/' + food.img} alt={food.name} />
                <p>描述：{food.desc}</p>
                <p>价格：{food.price}</p>
            </div>
            <div>
                <Button onClick={dec}>-</Button>
                <span>{count}</span>
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

function CartStatus(props) {
    var [expand, setExpand] = useState(false)
    var totalPrice = calcTotalPrice(props.foods)
    return (
        <div>
            {
                expand ? 
                <button onClick={() => setExpand(false)}>展开</button> :
                <button onClick={() => setExpand(true)}>收起</button>
            }
            <strong>总价： {totalPrice}</strong>
            <button onClick={() => props.onPlaceOrder()}>下单</button>
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
  
      api.get('/menu/restaurant/1').then(res => {
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
  