import React from 'react'
import { Typography, Button} from 'antd'

const { Title } = Typography

export default function(props) {
    function rigistBack() {
        props.history.push(`/login`)
      }
    return (
        <div className="menuItemStyle">
            <Title level={2}>注册成功</Title>
            <Button type="primary"  onClick = {rigistBack}>返回首页</Button>
        </div>
    )
}