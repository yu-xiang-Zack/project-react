import React from 'react'
import history from './history'

export default function(props) {
    var params = props.match.params
    function orderCotinue() {
        history.push(`/r/${params.rid}/d/${params.did}/c/${props.location.state.customCount}`)
    }
    return (
        <div>
            <h2>下单成功</h2>
            <p>总价：{props.location.state && props.location.state.totalPrice}</p>
            <button onClick={orderCotinue}>继续点单</button>
        </div>
    )
}