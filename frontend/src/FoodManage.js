import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from './api'


var imgStyle = {
  float: 'left',
  border: '1px solid',
  width: '100px',
  height: '100px',
  objectFit: 'cover',
}
var foodInfoStyle = {
  overflow: 'hidden',
}
var cardStyle = {
  border: '2px solid',
  padding: '5px',
  margin: '5px',
}

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
          <form>
            名称：<input type="text" onChange={change} defaultValue={foodInfo.name} name="name"/><br/>
            描述：<input type="text" onChange={change} defaultValue={foodInfo.desc} name="desc"/><br/>
            价格：<input type="text" onChange={priceChange} defaultValue={foodInfo.price} name="price"/><br/>
            分类：<input type="text" onChange={change} defaultValue={foodInfo.category} name="category"/><br/>
            图片：<input type="file" onChange={imgChange} name="img" />
          </form>
        </div>
      )
    } else {
      return (
        <div style={foodInfoStyle}>
          <img src={'http://localhost:800/upload/' + foodInfo.img} alt={foodInfo.name} style={imgStyle} />
          <p>描述：{foodInfo.desc}</p>
          <p>价格：{foodInfo.price}</p>
          <p>分类：{foodInfo.category ? foodInfo.category : '[暂未分类]'}</p>
        </div>
      )
    }
  }


  return (
    <div style={cardStyle}>
      <h3>{foodInfo.name}</h3>
      {getContent()}
      <div>
        <button onClick={() => setIsModify(true)}>修改</button>

        <button onClick={save}>保存</button>

        {foodInfo.status === 'on' &&
          <button onClick={setOffline}>下架</button>
        }
        {foodInfo.status === 'off' &&
          <button onClick={setOnline}>上架</button>
        }
        <button onClick={deleteFood}>删除</button>
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
      <Link to="add-food">添加菜品</Link>
      <div>
        {
          foods.map(food => {
            return <FoodItem onDelete={onDelete} key={food.id} food={food}/>
          })
        }
      </div>
    </div>
  )
}