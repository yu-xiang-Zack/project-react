import React, { Component, useState } from 'react'
import io from 'socket.io-client'
import api from './api'
import { produce } from 'immer'

var orderItemStyle = {
  border: '2px solid',
  margin: '5px',
  padding: '5px',
}

function OrderItem({order, onDelete}) {

  var [orderInfo, setOrder] = useState(order)
  console.log(order)
  function setConfirm() {
    api.put(`/restaurant/${order.rid}/order/${order.id}/status`, {
      status: 'confirmed'
    }).then(() => {
      setOrder({
        ...orderInfo,
        status: 'confirmed'
      })
    })
  }

  function setComplete() {
    api.put(`/restaurant/${order.rid}/order/${order.id}/status`, {
      status: 'completed'
    }).then(() => {
      setOrder({
        ...orderInfo,
        status: 'completed'
      })
    })
  }

  function deleteOrder() {
    api.delete(`/restaurant/${order.rid}/order/${order.id}`).then(() => {
      onDelete(order)
    })
  }

  return (
    <div style={orderItemStyle}>
      <h2>{orderInfo.deskName}</h2>
      <h3>总价格：{orderInfo.totalPrice}</h3>
      <h3>人数：{orderInfo.customCount}</h3>
      <h3>订单状态：{orderInfo.status}</h3>
      <div>
        <button>打印</button>
        <button onClick={setConfirm}>确认</button>
        <button onClick={setComplete}>完成</button>
        <button onClick={deleteOrder}>删除</button>
      </div>
    </div>
  )
}

export default class OrderManage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orders: []
    }
  }

  componentDidMount() {
    var params = this.props.match.params

    this.socket = io('ws://localhost:800', {
      path: '/restaurant',
      query: {
        restaurant: 'restaurant:' + params.rid
      }
    })

    this.socket.on('connect', () => {
      this.socket.emit('join restaurant', 'restaurant:' + params.rid)
    })

    this.socket.on('new order', order => {
      this.setState(produce(state => {
        state.orders.unshift(order)
      }))
    })
    api.get(`/restaurant/${params.rid}/order`).then(res => {
      this.setState(produce(state => {
        state.orders = res.data
      }))
    })
  }

  componentWillUnmount() {
    this.socket.close()
  }

  onDelete = (order) => {
    var idx = this.state.orders.findIndex(it => it.id === order.id)

    this.setState(produce(state => {
      state.orders.splice(idx, 1)
    }))
  }

  render() {
    return (
      <div>
        <h2>订单管理</h2>
        <div>
          {this.state.orders.length > 0 ?
            this.state.orders.map(order => {
              return <OrderItem onDelete={this.onDelete} key={order.id} order={order} />
            })
            :
            <div>loading...</div>
          }
        </div>
      </div>
    )
  }
}
