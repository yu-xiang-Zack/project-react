import React, { Suspense } from "react";
import { Switch, Link, Route, withRouter } from "react-router-dom";
import AddFood from "./AddFood";
import AddDesk from "./AddDesk";
import OrderManage from "./OrderManage";
import FoodManage from "./FoodManage";
import DeskManage from "./DeskManage";
import api from "./api";
import "./RestaurantManage.css";
import userInfoFetcher from "./userInfoFetcher";
import { Layout, Menu, Breadcrumb, Spin, Button, Typography} from "antd";

const { Header, Content } = Layout;
const {Title} = Typography;

function RestaurantInfo() {
  var info = userInfoFetcher.read().data;
  return <Title level={1}> 欢迎光临：{info.title}</Title>;
}

export default withRouter(function(props) {
  async function logout() {
    await api.get("/logout");
    userInfoFetcher.clearCache();
    props.history.push("/login");
  }
  return (
    <div>
      <Layout>
        <Header style={{ textAlign: "center", position: "fixed", zIndex: 1, width: "100%"}}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultActives={["order"]}
            style={{ lineHeight: "64px"}}
          >
            <Menu.Item key="order">
              <Link to="order">订单管理</Link>
            </Menu.Item>
            <Menu.Item key="food" style={{marginLeft: 20}}>
              <Link to="food">菜品管理</Link>
            </Menu.Item>
            <Menu.Item key="desk" style={{marginLeft: 20}}>
              <Link to="desk">桌面管理</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ textAlign: "center",padding: "0", marginTop: 64, marginBottom: 0}}>
          <Breadcrumb style={{  margin: "16px 0" }}>
            <Breadcrumb.Item>
              <Suspense fallback={<div>正在加载...<Spin /></div>}>
                <RestaurantInfo />
              </Suspense>
            </Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ float:"right"}}>
              <Button type="danger" onClick={logout}>退出登录</Button>
          </div>
          <div style={{ background: "#fff", padding: "24px", }}>
            <main className="pageChange">
              <Switch>
                <Route path="/restaurant/:rid/manage/order" component={OrderManage} />
                <Route path="/restaurant/:rid/manage/food" component={FoodManage} />
                <Route path="/restaurant/:rid/manage/desk" component={DeskManage} />
                <Route path="/restaurant/:rid/manage/add-food" component={AddFood} />
                <Route path="/restaurant/:rid/manage/add-desk" component={AddDesk} />
              </Switch>
            </main>
          </div>
        </Content>
      </Layout>
    </div>
  );
});
