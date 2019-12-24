import React from 'react'

export default function(props) {
    function rigistBack() {
        props.history.push(`/`)
      }
    return (
        <div>
            <h2>注册成功</h2>
            <button onClick = {rigistBack}>返回首页</button>
        </div>
    )
}