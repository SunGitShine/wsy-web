/**
 * Created by Administrator on 2017-2-13.
 */
import Layout from "../../components/layout";
import LabelInput from "../../components/label-input";
import LabelSelect from "../../components/label-select";
import Pager from "../../components/pager";
import Pubsub from "../../util/pubsub";
import "../../../css/page/department-management.scss";
let typeArr = ["","超级管理员","上案管理员","下案管理员","质检管理员","库存管理员"]
const Depart = React.createClass({
    getInitialState(){
        return{
            title:"添加帐号",
            request : {
                username : "",
                mobile : "",
                realname : "",
                type : 2,
            },
            listRequest:{
                username : "",
                type : ""
            },
            modifyRequest:{
                username:"",
                password:""
            },
            pager:{
                currentPage:1,
                pageSize:20,
                totalNum:0,
            },
            list:[]
        }
    },
    componentDidMount(){
        this.getList();
    },
    getList(pageNo=1){
        let _this = this;
        let {pager,listRequest} = this.state;
        $.ajax({
            url:commonBaseUrl+"/account/findByPage.htm",
            type:"get",
            dataType:"json",
            data:{d:JSON.stringify(listRequest),pageNo:pageNo,pageSize:20},
            success(data){
                if(data.success){
                    pager.currentPage = pageNo;
                    pager.totalNum = data.resultMap.iTotalDisplayRecords;
                    _this.setState({
                        list : data.resultMap.rows,
                        pager : pager
                    })
                }else{
                    pager.currentPage = 1;
                    pager.totalNum = 0;
                    _this.setState({list:[],pager})
                }
            }
        });
    },
    add(){
        let  request = {
            username : "",
            mobile : "",
            realname : "",
            type : 2,
            };
        this.setState({request},()=>{
            console.log(this.state.request)
            this.refs.dialog.show();
        });
    },
    dialogSubmit(){
        let _this = this;
        if(!this.checkValid()){
            return false;
        }
        $.ajax({
            url:commonBaseUrl+"/account/add.htm",
            type:"post",
            dataType:"json",
            data:{d:JSON.stringify(this.state.request)},
            success(data){
                if(data.success){
                    Pubsub.publish("showMsg",["success","添加成功"]);
                    _this.getList();
                }else{
                    Pubsub.publish("showMsg",["success",data.description]);
                }
            }
        })
        console.log(this.state.request);
    },
    checkValid(){
        let {request} = this.state;
        let flag = true;
        let msg = "";
        if(!request.username){
            msg = "请输入帐号";
            flag = false;
        }else if(!request.realname){
            msg = "请输入姓名";
            flag = false;
        }else if(!request.mobile){
            msg = "请输入手机号";
            flag = false;
        }else{
            msg = "";
            flag = true;
        }
        if(msg){
            Pubsub.publish("showMsg",["wrong",msg]);
        }
        return flag;
    },
    handleInput(type,e){
        let {request,modifyRequest} = this.state;
        if(type=="password"){
            modifyRequest[type] = e.target.value;
        }else{
            request[type] = e.target.value;
        }
        this.setState({request,modifyRequest});
    },
    modify(item){
        let {modifyRequest} = this.state;
        modifyRequest.username = item.username;
        this.setState({modifyRequest},()=>{
            this.refs.pwddialog.show();
        });
    },
    delete(username){
        let _this = this;
        RUI.DialogManager.confirm({
            message:'您确定要删除吗？?',
            title:'删除帐号',
            submit:function() {
                $.ajax({
                    url:commonBaseUrl+"/account/delete.htm",
                    type:"post",
                    dataType:"json",
                    data:{d:JSON.stringify({username})},
                    success(data){
                        if(data.success){
                            Pubsub.publish("showMsg",["success","删除成功"]);
                            _this.getList();
                        }else{
                            Pubsub.publish("showMsg",["wrong",data.description]);
                        }
                    }
                });
            },
        });
    },
    pwddialogSubmit(){
        let _this = this;
        let {modifyRequest} = this.state;
        if(!modifyRequest.password){
            Pubsub.publish("showMsg",["wrong","请输入密码"]);
            return false;
        }
        $.ajax({
           url:commonBaseUrl+"/account/updatePassword.htm",
            dataType:"json",
            type:"post",
            data:{d:JSON.stringify(_this.state.modifyRequest)},
            success(data){
                if(data.success){
                    Pubsub.publish("showMsg",["success","修改成功"]);
                }else{
                    Pubsub.publish("showMsg",["wrong",data.description]);
                }
            }
        });
    },
    getType(type){
        return typeArr[type];
    },
    dialogSelect(e){
        let {request} = this.state;
        request.type = e.value;
        this.setState({request});
    },
    select(e){
        let {listRequest} = this.state;
        listRequest.type = e.value;
        this.setState({listRequest},()=>{
            this.getList();
        });
    },
    accountInput(e){
        let {listRequest} = this.state;
        listRequest.username = e.target.value;
        this.setState({listRequest});
    },
    search(){
        this.getList();
    },
    render(){
        let {pager,list,modifyRequest,request} = this.state;
        return(
            <Layout currentKey = "3" defaultOpen={"0"} bread = {["部门成员","帐号管理"]}>
                <div className="depart-content">
                    <div className="tbn-div">
                        <label htmlFor="">部门：</label>
                        <RUI.Select
                            data={[
                            {key:'全部',value:''},
                            {key:'超级管理员',value:'1'},
                            {key:'上案管理员',value:'2'},
                            {key:'下案管理员',value:'3'},
                            {key:'质检管理员',value:'4'},
                            {key:'库存管理员',value:'5'}]}
                            value={{key:'全部',value:''}}
                            stuff={true}
                            callback = {this.select}
                            className="rui-theme-1 w-120">
                        </RUI.Select>
                        <label htmlFor="">帐号：</label>
                        <RUI.Input onChange = {this.accountInput} className = "w-150"/>
                        <RUI.Button className="primary" onClick = {this.search}>搜索</RUI.Button>
                        <RUI.Button className="add-btn primary" onClick = {this.add}>添加</RUI.Button>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <td>帐号</td>
                            <td>名字</td>
                            <td>类型</td>
                            <td>操作方式</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            list.length>0 && list.map((item,index)=>{
                                return(
                                    <tr key={index}>
                                        <td>{item.username}</td>
                                        <td>{item.realname}</td>
                                        <td>{this.getType(item.type)}</td>
                                        <td>
                                            <a href="javascript:;" className="handle-a" onClick = {this.modify.bind(this,item)}>修改</a>
                                            <a href="javascript:;" className="handle-a" onClick = {this.delete.bind(this,item.username)}>删除</a>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                    {
                        list.length==0 && <div className="no-data">暂时没有数据哦</div>
                    }
                    <Pager onPage ={this.getList} {...pager}/>
                    <RUI.Dialog ref="dialog" title={"添加帐号"} draggable={false} buttons="submit,cancel" onSubmit={this.dialogSubmit}>
                        <div style={{width:'400px', wordWrap:'break-word'}}>
                            <LabelInput placeholder = "请输入帐号" require={true} value = {request.username} onChange = {this.handleInput.bind(this,"username")} label = "帐号："/>
                            <LabelInput placeholder = "请输入姓名" require={true} value = {request.realname} onChange = {this.handleInput.bind(this,"realname")} label = "姓名："/>
                            <LabelInput placeholder = "请输入手机号" require={true} value = {request.mobile} onChange = {this.handleInput.bind(this,"mobile")} label = "手机号："/>
                            <LabelSelect
                                require = {true}
                                label = "类型："
                                data = {[
                                {key:"上案管理员",value:2},
                                {key:"下案管理员",value:3},
                                {key:"质检管理员",value:4},
                                {key:"库存管理员",value:5}]}
                                callback = {this.dialogSelect}
                                default = {{key:"上案管理员",value:"2"}}/>
                        </div>
                    </RUI.Dialog>
                    <RUI.Dialog ref="pwddialog" title={"修改密码"} draggable={false} buttons="submit,cancel" onSubmit={this.pwddialogSubmit}>
                        <div style={{width:'400px', wordWrap:'break-word'}}>
                            <LabelInput value = {modifyRequest.username} disabled = {true} require={true} label = "帐号："/>
                            <LabelInput type="password" placeholder = "请输入密码" require={true} onChange = {this.handleInput.bind(this,"password")} label = "密码："/>
                        </div>
                    </RUI.Dialog>
                </div>
            </Layout>
        )
    }
});
module.exports = Depart;