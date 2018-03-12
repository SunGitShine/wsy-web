/**
 * Created by luojie on 2017/2/9 16:26.
 */
import "../../css/components/header.scss";
import  Icon  from 'antd/lib/Icon';
import  Breadcrumb  from 'antd/lib/Breadcrumb';
import {hashHistory} from "react-router"
import Pubsub from "../util/pubsub";
const Header = React.createClass({
    loginOut(){
        $.ajax({
            url:commonBaseUrl+"/logout.htm",
            dataType:"json",
            type:"get",
            data:{},
            success(data){
                if(data.success){
                    hashHistory.push("/login");
                }else{
                    Pubsub.publish("showMsg",["wrong",data.description]);
                }
            }
        })
    },
    render(){
        return(
            <div className="no-print">
                <div className="header-div ">
                    {/* <h1>舞思韵后台管理系统</h1>  */}
                </div>
                <div className="header-bread">
                    <Breadcrumb className = "line-50">
                        <Breadcrumb.Item href="javascript:;">
                            <Icon type="home" />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="javascript:;">
                            <span>{this.props.bread[0]}</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {this.props.bread[1]}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="login-out">
                    <a onClick = {this.loginOut}>退出</a>
                </div>
            </div>
        )
    }
});
module.exports = Header;