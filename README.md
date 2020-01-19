# 点餐系统

一个 React.js 点餐系统 
> [**项目演示地址**（管理员体验账号密码均为a）](http://restaurant.xiangyu.world/#/login)
### 技术栈
- creat-react-app
- React
- React-router
- axios
- Express
- SQLite
- socket.io
- antd
## 项目简介
backend文件夹为点餐系统后端项目，后端框架使用了Express,数据库使用了SQLite。需自行安装。  
配置文件为package.json  
  
frontend为点餐系统前端项目，前端框架使用了React，路由系统使用了react-router-dom。  
主要功能有管理员界面的账号登录与登出，账号注册，订单的管理系统，订单状态的管理与更改。菜品管理系统，菜品信息的添加，删除，修改。餐桌管理系统，餐桌信息的添加，修改，删除。桌面信息二维码功能的实现。  
顾客界面点餐系统，实时的查看的菜品信息，实时查看的购物车内的菜品信息，价格。多人点餐功能的实时菜品同步实现。

## 项目安装

```

$ create-react-app project    # 生成项目

$ cd project                  # 进入到 project 目录

$ npm install                 # 使用 npm 安装项目的依赖

$ npm start                   # 启动项目

```