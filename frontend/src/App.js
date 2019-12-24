import React from 'react';
import './App.css';
import { Router, Route, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import FoodCart from './FoodCart';
import RestaurantManage from './RestaurantManage';
import Login from './Login';
import HomePage from './HomePage'
import history from './history'
import OrderSuccess from './OrderSuccess'
import Register from './Register';
import RegistSuccess from './RegistSuccess';

// 用户侧
// 扫码进入的页面，选择人数：/landing/restaurant/:rid/desk/:did
// 点餐页面：               /restaurant/:rid/desk/:did
// 点餐成功页面：           /

// 商户侧
// 登陆
// 订单管理：    /manage/order
// 订单详情：    /manage/order/35
// 菜品管理：    /manage/food
// 桌面管理：    /manage/desk

function App() {
  return (
    <Router history={history}>
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/landing/r/:rid/d/:did" component={LandingPage} />
          <Route path="/r/:rid/d/:did/c/:count" component={FoodCart} />
          <Route path="/r/:rid/d/:did/order-success" component={OrderSuccess} />
          <Route path="/register/regist-success" component={RegistSuccess} />
          <Route path="/restaurant/:rid/manage/" component={RestaurantManage} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
    </Router>
  );
}

export default App;
