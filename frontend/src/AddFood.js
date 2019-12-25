import React, {useState} from 'react'
import api from './api'
import history from './history'

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

  return (
    <div>
      <h2>添加菜品</h2>
      <form onSubmit={submit}>
        名称：<input type="text" onChange={change} defaultValue={foodInfo.name} name="name"/><br/>
        描述：<input type="text" onChange={change} defaultValue={foodInfo.desc} name="desc"/><br/>
        价格：<input type="text" onChange={priceChange} defaultValue={foodInfo.price} name="price"/><br/>
        分类：<input type="text" onChange={change} defaultValue={foodInfo.category} name="category"/><br/>
        图片：<input type="file" onChange={imgChange} name="img" /><br/>
        <button>提交</button>
      </form>
    </div>
  )
}

export default AddFood