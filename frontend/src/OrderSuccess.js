import React from 'react'

export default function(props) {

    return (
        <div>
            <h2>下单成功</h2>
            <p>总价：{props.location.state && props.location.state.totalPrice}</p>
        </div>
    )
}