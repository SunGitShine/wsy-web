'use strict';
import "./css/app.scss";
import { Router, Route, hashHistory } from 'react-router';
import Layout from "./js/components/layout";
import Login from "./js/page/login";
import Depart from "./js/page/member/department-management";
//最终渲染
ReactDOM.render((
    <Router history={hashHistory}>
        <Route path='/' component={Login}/>
        <Route path='/login' component={Login}/>
        <Route path='/depart' component={Depart}/>
        <Route path="/member" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./js/page/member/member-management"))
                })
            }}/>
        <Route path="/accounts" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./js/page/member/accounts-management"))
                })
            }}/>
        <Route path="/classify" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./js/page/commodity/classify-management"))
                })
            }}/>
        <Route path="/commodity" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./js/page/commodity/commodity-management"))
                })
            }}/>

        <Route path="/commodity/add" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
                 cb(null, require("./js/page/commodity/add-commodity"))
            })

        }}/>
        <Route path="/stock" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
                 cb(null, require("./js/page/commodity/stock-management"))
            })

        }}/>
        <Route path="/stock/detail" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
                 cb(null, require("./js/page/commodity/stock-detail"))
            })
        }}/>
        <Route path="/production/order" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
                 cb(null, require("./js/page/production/production-order"))
            })
        }}/>
         <Route path="/production/createOrder" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
                 cb(null, require("./js/page/production/create-order"))
            })
        }}/>
        <Route path="/output" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
             cb(null, require("./js/page/commodity/output-detail"))
            })
        }}/>
        <Route path="/order/detail" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
             cb(null, require("./js/page/production/order-detail"))
            })
        }}/>
        <Route path="/order/distribution" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
             cb(null, require("./js/page/production/distribution-order"))
            })
        }}/>
        <Route path="/statistic" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
             cb(null, require("./js/page/production/order-statistic"))
            })
        }}/>
        <Route path="/stock/query" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
             cb(null, require("./js/page/production/stock_query"))
            })
        }}/>
        <Route path="/stock/query/detail" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
             cb(null, require("./js/page/production/stock_detail"))
            })
        }}/>
        <Route path="/deliverynote" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
             cb(null, require("./js/page/balance/delivery_note"))
            })
        }}/>
        <Route path="/orderForm" getComponent={function(nextState, cb) {
            require.ensure([], (require) => {
             cb(null, require("./js/page/balance/order_form"))
            })
        }}/>
    </Router>
), document.getElementById('app'));
