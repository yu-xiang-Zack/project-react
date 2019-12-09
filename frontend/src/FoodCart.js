import React, {useState, Suspense, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import createFetcher from './create-fetcher'
import PropTypes from 'prop-types'
import { produce } from 'immer'
import api from './api'
import history from './history'
import { Button } from 'element-react'
import 'element-theme-default';

var imgStyle = {
    float: 'left',
    width: '100px',
    height: '100px',
    border: '2px solid',
}



function MenuItem({food, onUpdate}) {
    var [count, setCount] = useState(0)

    function dec() {
        if (count === 0) {
            return
        }
        setCount(count - 1)
        onUpdate(food, count - 1)
    }

    function inc() {
        if (count === 99) {
            return
        }
        setCount(count + 1)
        onUpdate(food, count + 1)
    }

    return (
        <div>
            <h3>菜品名：{food.name}</h3>
            <div>
                <img style = {imgStyle} src = {'http://localhost:800/upload/' + food.img} alt={food.name} />
                <p>描述：{food.desc}</p>
                <p>价格：{food.price}</p>
            </div>
            <div>
                <Button onClick={dec}>-</Button>
                <span>{count}</span>
                <Button onClick={inc}>+</Button>
            </div>
        </div>
    )
}

MenuItem.propTypes = {
    food: PropTypes.object.isRequired,
    onUpdate: PropTypes.func,
}
MenuItem.defaultProps = {
    onUpdate: () => {},
}

var menuFetcher = createFetcher(() => {
    return api.get('menu/restaurant/1')
})

function FoodCart() {
    var params = useParams()
    var [deskInfo, setDeskInfo] = useState(null)
    var foods = menuFetcher.read().data
    var [cart, setCart] = useState([])
    
    useEffect(() => {
        api.get('/deskinfo?did=' + params.did).then(val => {
          setDeskInfo(val.data)
    })
    }, [params.did])
    console.log(cart)
    function foodChange(food, amount) {
        var upDated = produce(cart, cart => {
            var idx = cart.findIndex(it => it.food.id === food.id)
            if (idx >= 0) {
                if(amount === 0) {
                    cart.splice(idx, 1)
                }else {
                    cart[idx].amount = amount
                }
            }else {
                cart.push({
                    food,
                    amount,
                })
            }
        })
        setCart(upDated)
    }
    function placeOrder() {
        api.post(`/restaurant/${params.rid}/desk/${params.did}/order`, {
            deskName: deskInfo.name,
            customCount: params.count,
            totalPrice: calcTotalPrice(cart),
            foods: cart,
        }).then(res => {
            history.push({
                pathname: `/r/${params.rid}/d/${params.did}/order-success`,
                state: res.data,
            })
        })
    }
    return (
    <div>
        <div>
            {
                foods.map(food => {
                    return <MenuItem key= {food.id} food={food} onUpdate={foodChange}/>
                })
            }
        </div>
        <div>
            <CartStatus foods={cart} onUpdate={foodChange} onPlaceOrder={placeOrder} />
        </div>
    </div>
    )
}

function calcTotalPrice(cartAry) {
    return cartAry.reduce((total, item) => {
        return total + item.amount * item.food.price
    }, 0) 
}

function CartStatus(props) {
    var [expand, setExpand] = useState(false)
    var totalPrice = calcTotalPrice(props.foods)
    return (
        <div>
            {
                expand ? 
                <button onClick={() => setExpand(false)}>展开</button> :
                <button onClick={() => setExpand(true)}>收起</button>
            }
            <strong>总价： {totalPrice}</strong>
            <button onClick={() => props.onPlaceOrder()}>下单</button>
        </div>
    )
}

export default () => {
    return (
        <Suspense fallback={<div>loading...</div>}>
            <FoodCart />
        </Suspense>
    )
}