/**
 * Created by Administrator on 2017-2-22.
 */
import "../../css/login.scss";
import RUI from "react-component-lib";
import {hashHistory} from "react-router";
import GlobalData from "../components/Data";
const Login = React.createClass({
    componentDidMount(){
        let _this = this;
        let node = ReactDOM.findDOMNode(this.refs.pwd);
        //let node = document.querySelectorAll("input"); //返回的是数组对象 NodeList
        //let node1 = document.getElementsByTagName("input");//返回的是类数组对象 HTMLCollection
        //let node2 = [].slice.call(node1) //可以通过[].slice.call方法将类数组对象转化成数组对象

        (node).addEventListener("keyup",this.listener);
    },
    componentWillUnmount(){
        let _this = this;
        let node = ReactDOM.findDOMNode(this.refs.pwd);
        (node).removeEventListener("keyup",this.listener);
    },
    listener(e){
        if(e.keyCode == 13){
            this.login();
        }
    },
    login(){
        let userName = this.refs.userName.getValue();
        let password = this.refs.pwd.getValue();
        $.ajax({
            url:commonBaseUrl+"/login.htm",
            type:"post",
            dataType:"json",
            data:{username:this.refs.userName.getValue(),password:this.refs.pwd.getValue()},
            success(data){
                if(data.success){
                    let type = data.resultMap.loginUser.type;
                    let path = "/depart";
                    localStorage.type = type;
                    localStorage.userName = userName;
                    localStorage.password = password;
                    switch (type*1){
                        case 1 : path = "/depart";break;
                        case 2 : path = "/production/order";break;
                        case 3 : path = "/stock";break;
                    }
                    hashHistory.push(path);
                }else{
                    RUI.DialogManager.alert("请输入正确的用户名和密码");
                }
            }
        })
        //hashHistory.push("/depart");
    },
    render(){
        let userName = localStorage.userName;
        let password = localStorage.password;
        return(
            <div className="login-wrapper">
                <div className="login-box">
                    <h3>登录</h3>
                    <div className="user-div">
                    <label htmlFor="">用户名：</label>
                        <RUI.Input className = "w-230" defaultValue = {userName || ""} ref = "userName" placeholder = "用户名"></RUI.Input>
                    </div>
                    <div>
                    <label htmlFor="">密码：</label>
                        <RUI.Input className = "w-230" defaultValue = {password || ""} ref = "pwd" type = "password" placeholder = "密码"></RUI.Input>
                    </div>
                    <div className="login-btn">
                        <RUI.Button className = "w-280 green" onClick = {this.login}>登录</RUI.Button>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = Login;