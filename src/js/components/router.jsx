import {Router, Route, hashHistory} from "react-router"

function routerChange() {
    // console.log('change');
}

ReactDOM.render(
    <Router onUpdate={routerChange} history={hashHistory}>
        <Route path="/" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./test/index"))
                })
            }}/>
        <Route path="/inform" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./test/information"))
                })
            }}/>
        <Route path="/user" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./user/user"))
                })
            }}/>
        <Route path="/mentor" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./user/mentor"))
                })
            }}/>
        <Route path="/user/order" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./user/order"))
                })
            }}/>
        <Route path="/user/collect" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./user/collect"))
                })
            }}/>
        <Route path="/user/skillManage" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./user/skillManage"))
                })
            }}/>
        <Route path="/user/data" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./user/userData"))
                })
            }}/>
        <Route path="/user/data/update" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./user/Update"))
                })
            }}/>
        <Route path="/login" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./test/login"))
                })
            }}/>
        <Route path="/register" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./test/register"))
                })
            }}/>
        <Route path="/categories" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./test/categories"))
                })
            }}/>
        <Route path="/show" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./skill/show"))
                })
            }}/>
        <Route path="/release" getComponent={function(nextState, cb) {
                require.ensure([], (require) => {
                     cb(null, require("./skill/release"))
                })
            }}/>
    </Router>,
    document.getElementById('app')
);