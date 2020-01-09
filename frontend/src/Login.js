import React, { useRef } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Form, Button } from 'antd';
import './Login.css'
import api from './api'

export default withRouter(function(props){
  var nameRef = useRef()
  var passwordRef = useRef()
  var captchaRef = useRef()
  

  async function login(e) {
    e.preventDefault()
    var name = nameRef.current.value
    var password = passwordRef.current.value
    var captcha = captchaRef.current.value

    try {
      var res = await api.post('/login', {name, password, captcha})
      props.history.push(`/restaurant/${res.data.id}/manage/order`)
    } catch(e) {
      alert(e.response.data.msg)
    }
  }

  function changCaptcha() {
    document.getElementById('captcha').style.display="block"
  }
  return (
    <div className="container">
      
      {/* <form onSubmit={login}>
      用户名<br/><input type="text" ref={nameRef}/><br/>
      密码<br/><input type="password" ref={passwordRef}/><br/>
      验证码（区分大小写）<br/><input type="text" ref={captchaRef}/><br/>
      <br/><img src="/api/captcha" alt="captcha"/><br/>
      <br/><Button>Login</Button><br/>
      </form> */}
      <Form onSubmit={login} className="login-form">
        <h2>餐厅管理员登陆</h2>
        <Form.Item>
            <input
              placeholder="请输入用户名"
              type="text"
              ref={nameRef}
            />
        </Form.Item>
        <Form.Item>
            <input
              type="password"
              placeholder="请输入密码"
              ref={passwordRef}
            />
        </Form.Item>
        <Form.Item>
            <input
              placeholder="请输入验证码（区分大小写）"
              type="text"
              ref={captchaRef} 
              onFocus={changCaptcha}
            />
            <img src="/api/captcha" alt="captcha" id="captcha"/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
          <span>还未注册？</span><Link to="/register">现在注册</Link>
        </Form.Item>
      </Form>
    </div>
  )
})
