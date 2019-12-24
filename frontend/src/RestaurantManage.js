import React, { Suspense } from 'react'
import { Switch, Link, Route, withRouter } from 'react-router-dom'
import AddFood from './AddFood'
import OrderManage from './OrderManage'
import FoodManage from './FoodManage'
import DeskManage from './DeskManage'
import api from './api'
import userInfoFetcher from './userInfoFetcher'

function RestaurantInfo() {
  var info = userInfoFetcher.read().data
  return (
    <div>
      欢迎光临：{info.title}
    </div>
  )
}

export default withRouter(function(props) {
  async function logout() {
    await api.get('/logout')
    userInfoFetcher.clearCache()
    props.history.push('/')
  }
  return (
    <div>
      <Suspense fallback={<div>正在加载...</div>}>
        <RestaurantInfo />
      </Suspense>
      <nav>
        <ul>
          <li>
            <Link to="order">订单管理</Link>
          </li>
          <li>
            <Link to="food">菜品管理</Link>
          </li>
          <li>
            <Link to="desk">桌面管理</Link>
          </li>
          <li>
            <button onClick = {logout}>退出</button>
          </li>
        </ul>
      </nav>
      <main>
        <Switch>
          <Route path="/restaurant/:rid/manage/order" component={OrderManage}/>
          <Route path="/restaurant/:rid/manage/food" component={FoodManage}/>
          <Route path="/restaurant/:rid/manage/desk" component={DeskManage}/>
          <Route path="/restaurant/:rid/manage/add-food" component={AddFood}/>
        </Switch>
      </main>
    </div>
  );
})
