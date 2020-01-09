import React, { Suspense, useState } from 'react'
import { withRouter } from 'react-router-dom'
import createFetcher from './create-fetcher'
import api from './api'
import {Spin, Button, Radio, Typography} from 'antd'
import './LandingPage.css'

const { Title } = Typography

var fetcher = createFetcher((did) => {
  return api.get('/deskinfo?did=' + did)
})

function DeskInfo({did}) {
  var info = fetcher.read(did).data
  
  return (
    <div className="restaurantTitle">
      <span>欢迎光临{info.title}</span>
      -
      <span>{info.name}桌</span>
    </div>
  )
}


export default withRouter(function(props) {
  var [custom, setCustom] = useState(0)

  var rid = props.match.params.rid
  var did = props.match.params.did

  function startOrder() {
    props.history.push(`/r/${rid}/d/${did}/c/${custom}`)
  }

  return (
    <div className="LandingPage">
      <Suspense fallback={<div>正在加载桌面信息...<Spin /></div>}>
        <DeskInfo did={did} />
      </Suspense>
      <Title level={4} style={{color:"#fff", marginBottom:20}}>请选择人数</Title>
      <Radio.Group buttonStyle="solid">
        <Radio.Button value="a" className={custom === 1 ? 'active' : null} onClick={() => setCustom(1)}>1</Radio.Button>
        <Radio.Button value="b" className={custom === 2 ? 'active' : null} onClick={() => setCustom(2)}>2</Radio.Button>
        <Radio.Button value="c" className={custom === 3 ? 'active' : null} onClick={() => setCustom(3)}>3</Radio.Button>
        <Radio.Button value="d" className={custom === 4 ? 'active' : null} onClick={() => setCustom(4)}>4</Radio.Button>
      </Radio.Group>
      <br/>
      {
        custom > 0 &&
        <Button type="primary" onClick={startOrder} style={{marginTop:30}}>开始点餐</Button>
      }
      
    </div>
  )
})
