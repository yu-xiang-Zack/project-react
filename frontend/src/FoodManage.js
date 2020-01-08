import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from './api'
import {Typography, Button, Input} from 'antd'

const { Title } = Typography

var imgStyle = {
  border: '1px solid',
  width: '100px',
  height: '100px',
  objectFit: 'cover',
}
// var foodInfoStyle = {
//   overflow: 'hidden',
// }
// var cardStyle = {
//   border: '2px solid',
//   padding: '5px',
//   margin: '5px',
// }

function FoodItem({food, onDelete}) {
  var [foodInfo, setFoodInfo] = useState(food)
  var [isModify, setIsModify] = useState(false)
  var [foodProps, setFoodProps] = useState({
    name: food.name,
    desc: food.desc,
    price: food.price,
    category: food.category,
    status: food.status,
    img: null,
  })

  function save() {
    var fd = new FormData()

    for(var key in foodProps) {
      var val = foodProps[key]
      fd.append(key, val)
    }

    api.put(`/restaurant/${food.rid}/food/` + food.id, fd).then((foodInfo) => {
      setIsModify(false)
      setFoodInfo(foodInfo.data)
    })
  }

  function change(e) {
    setFoodProps({
      ...foodProps,
      [e.target.name]: e.target.value
    })
  }

  function imgChange(e) {
    setFoodProps({
      ...foodProps,
      img: e.target.files[0],
    })
  }

  function priceChange(e) {
    setFoodProps({
      ...foodProps,
      price: e.target.value = (e.target.value.match(/^[1-9]\d*$/, "g")),
    })
  }

  function deleteFood() {
    api.delete(`/restaurant/${food.rid}/food/` + food.id).then(() => {
      onDelete(food.id)
    })
  }

  function setOnline() {
    api.put(`/restaurant/${food.rid}/food/` + food.id, {
      ...foodProps,
      status: 'on',
    }).then(res => {
      setFoodInfo(res.data)
    })
  }
  function setOffline() {
    api.put(`/restaurant/${food.rid}/food/` + food.id, {
      ...foodProps,
      status: 'off',
    }).then(res => {
      setFoodInfo(res.data)
    })
  }

  function getContent() {
    if (isModify) {
      return (
        <div>
          <form className="addForm">
            名称：<p><Input type="text" onChange={change} defaultValue={foodInfo.name} name="name"/></p>
            描述：<p><Input type="text" onChange={change} defaultValue={foodInfo.desc} name="desc"/></p>
            价格：<p><Input type="text" onChange={priceChange} defaultValue={foodInfo.price} name="price"/></p>
            分类：<p><Input type="text" onChange={change} defaultValue={foodInfo.category} name="category"/></p>
            图片：
            <div className="imgUpload">
              <label> 
                <span>点击上传</span>
                <input hidden type="file" onChange={imgChange} name="img" id="img" />
              </label>
            </div>
          </form>
        </div>
      )
    } else {
      return (
        <div>
          <img src={'/upload/' + foodInfo.img} alt={foodInfo.name} style={imgStyle} />
          <p>描述：{foodInfo.desc}</p>
          <p>价格：{foodInfo.price}</p>
          <p>分类：{foodInfo.category ? foodInfo.category : '[暂未分类]'}</p>
        </div>
      )
    }
  }


  return (
    <div className="itemStyle">
      <h3>{foodInfo.name}</h3>
      {getContent()}
      <div>
        <Button onClick={() => setIsModify(true)}>修改</Button>

        <Button onClick={save}>保存</Button>

        {foodInfo.status === 'on' &&
          <Button onClick={setOffline}>下架</Button>
        }
        {foodInfo.status === 'off' &&
          <Button onClick={setOnline}>上架</Button>
        }
        <Button onClick={deleteFood}>删除</Button>
      </div>
    </div>
  )
}



export default function FoodManage(props) {
  var [foods, setFoods] = useState([])
  useEffect(() => {
    var rid = props.match.params.rid
    api.get(`/restaurant/${rid}/food`).then(res => {
      setFoods(res.data)
    })
  }, [props])

  function onDelete(id) {
    setFoods(foods.filter(it => it.id !== id))
  }

  return (
    <div>
      <Title level={2}> 菜品管理</Title>
      <Link to="add-food" style={{fontSize:20}}>添加菜品</Link>
      <div className="items">
        {
          foods.map(food => {
            return <FoodItem onDelete={onDelete} key={food.id} food={food}/>
          })
        }
      </div>
    </div>
  )
}