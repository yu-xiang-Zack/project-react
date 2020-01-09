import React from 'react'
import history from './history'
import { Typography, Button} from 'antd'

const { Title } = Typography

export default function(props) {
    function orderCotinue() {
        history.goBack()
    }
    return (
        <div className="menuItemStyle">
            <Title level={2}>下单成功</Title>
            <p>总价：{props.location.state && props.location.state.totalPrice}</p>
            <Button type="primary" onClick={orderCotinue}>继续点单</Button>
        </div>
    )
}