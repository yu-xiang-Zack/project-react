import React, { useRef } from 'react'
import { withRouter } from 'react-router-dom'
import api from './api'

export default withRouter(function(props){
  var nameRef = useRef()
  var passwordRef = useRef()
  var emailRef = useRef()
  var titleRef = useRef()

  async function register(e) {
    e.preventDefault()
    var name = nameRef.current.value
    var password = passwordRef.current.value
    var email = emailRef.current.value
    var title = titleRef.current.value
    try {
      await api.post('/register', {name, email, password, title})
      props.history.push(`/register/regist-success`)
    } catch(e) {
      alert(e.response.data.msg)
    }
  }
  return (
    <div>
      <h2>账号注册</h2>
      <form onSubmit={register}>
        用户名<br/><input type="text" ref={nameRef}/><br/>
        密码<br/><input type="password" ref={passwordRef}/><br/>
        邮箱<br/><input type="email" ref={emailRef}/><br/>
        餐厅名称<br/><input type="text" ref={titleRef}/><br/>
        <button>注册</button>
      </form>
    </div>
  )
})