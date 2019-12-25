import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from './api'


function DeskItem({desk, onDelete}) {
  var [deskInfo, setDeskInfo] = useState(desk)
  var [isModify, setIsModify] = useState(false)
  var [deskProps, setDeskProps] = useState({
    name: desk.name,
    capacity: desk.capacity,
  })
  function save() {
    api.put(`/restaurant/${desk.rid}/desk/` + desk.id, deskProps).then((deskInfo) => {
      setIsModify(false)
      setDeskInfo(deskInfo.data)
    })
  }

  function change(e) {
    setDeskProps({
      ...deskProps,
      [e.target.name]: e.target.value
    })
  }

  function deletedesk() {
    api.delete(`/restaurant/${desk.rid}/desk/` + desk.id).then(() => {
      onDelete(desk.id)
    })
  }


  function getContent() {
    if (isModify) {
      return (
        <div>
          <form>
            名称：<input type="text" onChange={change} defaultValue={deskInfo.name} name="name"/><br/>
            人数：<input type="text" onChange={change} defaultValue={deskInfo.capacity} name="capacity"/><br/>
          </form>
        </div>
      )
    } else {
      return (
        <div>
          <p>名称：{deskInfo.name}</p>
          <p>人数：{deskInfo.capacity}</p>
        </div>
      )
    }
  }


  return (
    <div>
      <h3>{deskInfo.name}</h3>
      {getContent()}
      <div>
        <button onClick={() => setIsModify(true)}>修改</button>
        <button onClick={save}>保存</button>
        <button onClick={deletedesk}>删除</button>
      </div>
    </div>
  )
}



export default function DeskManage(props) {
  var [desks, setDesks] = useState([])

  useEffect(() => {
    var rid = props.match.params.rid
    api.get(`/restaurant/${rid}/desk`).then(res => {
      setDesks(res.data)
    })
  }, [props])

  function onDelete(id) {
    setDesks(desks.filter(it => it.id !== id))
  }

  return (
    <div>
      <Link to="add-desk">添加桌面</Link>
      <div>
        {
          desks.map(desk => {
            return <DeskItem onDelete={onDelete} key={desk.id} desk={desk}/>
          })
        }
      </div>
    </div>
  )
}