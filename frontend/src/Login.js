import React, { useRef } from 'react'
import { withRouter } from 'react-router-dom'
import api from './api'

export default withRouter(function(props){
  var nameRef = useRef()
  var passwordRef = useRef()

  async function login(e) {
    e.preventDefault()
    var name = nameRef.current.value
    var password = passwordRef.current.value

    try {
      var res = await api.post('./login', {name, password})
      props.history.push(`./restaurant/${res.data.id}/manage/`)
    } catch(e) {
      alert(e.response.data.msg)
    }
  }



  return (
  <div>
    <h2>餐厅管理员登录</h2>
    <form onSubmit={login}>
      <input type="text" ref={nameRef}/>
      <input type="password" ref={passwordRef}/>
      <button>登录</button>
    </form>
  </div>
  )
})