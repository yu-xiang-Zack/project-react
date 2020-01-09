import React, { useRef } from 'react'
import { withRouter } from 'react-router-dom'
import api from './api'
import { Form, Button } from 'antd';

export default withRouter(function(props){
  var nameRef = useRef()
  var passwordRef = useRef()
  var titleRef = useRef()

  async function register(e) {
    e.preventDefault()
    var name = nameRef.current.value
    var password = passwordRef.current.value
    var title = titleRef.current.value
    try {
      await api.post('/register', {name, password, title})
      props.history.push(`/register/regist-success`)
    } catch(e) {
      alert(e.response.data.msg)
    }
  }
  return (
    <div className="container">
      {/* <h2>账号注册</h2>
      <form onSubmit={register}>
        用户名<br/><input type="text" ref={nameRef}/><br/>
        密码<br/><input type="password" ref={passwordRef}/><br/>
        邮箱<br/><input type="email" ref={emailRef}/><br/>
        餐厅名称<br/><input type="text" ref={titleRef}/><br/>
        <button>注册</button>
      </form> */}
      <Form onSubmit={register} className="login-form">
        <h2>账号注册</h2>
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
              placeholder="请输入餐厅名称"
              type="text"
              ref={titleRef} 
            />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
})