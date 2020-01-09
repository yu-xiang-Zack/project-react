import React, {useState} from 'react'
import api from './api'
import history from './history'
import {Button, Input} from 'antd'

function AddDesk(props) {
  var [deskInfo, setDeskInfo] = useState({
    name: '',
    capacity: '',
  })

  function change(e) {
    setDeskInfo({
      ...deskInfo,
      [e.target.name]: e.target.value
    })
  }

  function submit(e) {
    e.preventDefault()
    var rid = props.match.params.rid
    api.post(`/restaurant/${rid}/desk`, deskInfo).then(res => {
      history.goBack()
    })
  }

  function backPage() {
    history.goBack()
  }


  return (
    
    <div className="itemStyle">
      <div className="backPage">
        <Button onClick={backPage}>返回</Button>
      </div>
      <h2>添加桌面</h2>
      <form onSubmit={submit} className="addForm">
        名称：<p><Input type="text" onChange={change} defaultValue={deskInfo.name} placeholder="请输入桌面号" name="name"/><br/></p>
        数量：<p><Input type="text" onChange={change} defaultValue={deskInfo.capacity} placeholder="Input a number" name="capacity"/><br/></p>
        <Button type="primary" htmlType="submit">提交</Button>
      </form>
    </div>
  )
}

export default AddDesk