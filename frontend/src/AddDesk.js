import React, {useState} from 'react'
import api from './api'
import history from './history'

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
  

  return (
    <div>
      <h2>添加菜品</h2>
      <form onSubmit={submit}>
        名称：<input type="text" onChange={change} defaultValue={deskInfo.name} name="name"/><br/>
        数量：<input type="text" onChange={change} defaultValue={deskInfo.capacity} name="capacity"/><br/>
        <button>提交</button>
      </form>
    </div>
  )
}

export default AddDesk