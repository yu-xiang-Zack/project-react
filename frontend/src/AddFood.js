import React, {useState} from 'react'
import api from './api'
import history from './history'
import {Input, Button} from 'antd'

function AddFood(props) {
  var [foodInfo, setFoodInfo] = useState({
    name: '',
    desc: '',
    price: '',
    category: '',
    status: 'on',
    img: null,
  })

  function change(e) {
    setFoodInfo({
      ...foodInfo,
      [e.target.name]: e.target.value
    })
  }

  function imgChange(e) {
    setFoodInfo({
      ...foodInfo,
      img: e.target.files[0],
    })
  }

  function priceChange(e) {
    setFoodInfo({
      ...foodInfo,
      price: e.target.value = (e.target.value.match(/^[1-9]\d*$/, "g")),
    })
  }

  function submit(e) {
    e.preventDefault()
    var rid = props.match.params.rid
    var fd = new FormData()
    
    for(var key in foodInfo) {
      var val = foodInfo[key]
      fd.append(key, val)
    }
    api.post(`/restaurant/${rid}/food`, fd).then(res => {
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
      <h2>添加菜品</h2>
      <form onSubmit={submit} className="addForm">
        名称：<p><Input type="text" onChange={change} defaultValue={foodInfo.name} name="name"/></p>
        描述：<p><Input type="text" onChange={change} defaultValue={foodInfo.desc} name="desc"/></p>
        价格：<p><Input type="text" onChange={priceChange} defaultValue={foodInfo.price} name="price"/></p>
        分类：<p><Input type="text" onChange={change} defaultValue={foodInfo.category} name="category"/></p>
        选择菜品图片：
        <div className="imgUpload">
          <label> 
            点击上传
            <input hidden type="file" onChange={imgChange} name="img" id="img" />
          </label>
        </div>
        <Button>提交</Button>
      </form>
    </div>
  )
}

export default AddFood