import React, { Component, useState } from 'react'
import io from 'socket.io-client'
import api from './api'
import { produce } from 'immer'
import {Typography, Button} from 'antd'

const { Title } = Typography


function OrderItem({order, onDelete}) {

  var [orderInfo, setOrder] = useState(order)
  console.log(order)
  function setConfirm() {
    api.put(`/restaurant/${order.rid}/order/${order.id}/status`, {
      status: '已确认'
    }).then(() => {
      setOrder({
        ...orderInfo,
        status: '已确认'
      })
    })
  }

  function setComplete() {
    api.put(`/restaurant/${order.rid}/order/${order.id}/status`, {
      status: '已完成'
    }).then(() => {
      setOrder({
        ...orderInfo,
        status: '已完成'
      })
    })
  }

  function deleteOrder() {
    api.delete(`/restaurant/${order.rid}/order/${order.id}`).then(() => {
      onDelete(order)
    })
  }

  return (
    <div className="itemStyle">
      <p>餐桌号：{orderInfo.deskName}</p>
      <p>总价格：{orderInfo.totalPrice}元</p>
      <p>用餐人数：{orderInfo.customCount}人</p>
      <p>订单状态：{orderInfo.status}</p>
      <div>
        <Button onClick={setConfirm}>确认</Button>
        <Button onClick={setComplete}>完成</Button>
        <Button onClick={deleteOrder}>删除</Button>
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

    this.socket = io({
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
        <Title level={2}> 订单管理</Title>
        <div>
          {this.state.orders.length > 0 ?
            this.state.orders.map(order => {
              return <OrderItem onDelete={this.onDelete} key={order.id} order={order} />
            })
            :
            <div>暂无新订单</div>
          }
        </div>
      </div>
    )
  }
}
