/**
 * Created by Administrator on 2017-2-13.
 */
import RUI from "react-component-lib";
import Layout from "../../components/layout";
import Pager from "../../components/pager";
import LabelInput from "../../components/label-input";
import Pubsub from "../../util/pubsub";
import "../../../css/page/department-management.scss";
const Depart = React.createClass({
    getInitialState(){
        return{
            title : "添加部门",
            request : {
                name : "",
                function : "",
                id : ""
            },
            pager:{
                currentPage:1,
                pageSize:20,
                totalNum:0,
            },
            list:[],
            type:""
        }
    },
    componentDidMount(){
        this.getList();
    },
    getList(pageNo=1){
        let _this = this;
        let {pager} = this.state;
        $.ajax({
            url:commonBaseUrl+"/department/findByPage.htm",
            type:"get",
            dataType:"json",
            data:{d:"",pageNo:pageNo,pageSize:20},
            success(data){
                if(data.success){
                    pager.currentPage = pageNo;
                    pager.totalNum = data.resultMap.iTotalDisplayRecords;
                    _this.setState({
                        list : data.resultMap.rows,
                        pager : pager
                    })
                }else{
                    pager.currentPage = 1
                    pager.totalNum = 0
                    _this.setState({list:[],pager})
                }
            }
        });

    },

    add(){
        let {request} = this.state;
        request.name = "";
        request.function = "";
        request.id = "";
        this.setState({
            title : "添加部门",
            type : "add",
            request
        },()=>{
            this.refs.dialog.show();
        });
    },
    dialogSubmit(){
        let _this = this;
        let {request,type} = this.state;
        let url = type=="add"?"/department/add.htm":"/department/update.htm";
        if(!request.name){
            Pubsub.publish("showMsg",["wrong","请输入部门名称"]);
            return false;
        }else if (!request.function){
            Pubsub.publish("showMsg",["wrong","请输入部门职能"]);
            return false;
        }
        $.ajax({
           url:commonBaseUrl + url,
            dataType:"json",
            type:"post",
            data:{d:JSON.stringify(request)},
            success(data){
                if(data.success){
                    Pubsub.publish("showMsg",["success",type=="add"?"添加成功":"修改成功"]);
                    _this.getList();
                }else{
                    Pubsub.publish("showMsg",["wrong",data.description]);
                }
            }
        });
    },
    handleInput(type,e){
        let {request} = this.state;
        request[type] = e.target.value;
        this.setState({request});
    },
    modify(item){
        let {request} = this.state;
        request.name = item.name;
        request.function = item.function;
        request.id = item.id;
        this.setState({
            title : "修改部门",
            type : "edit",
            request,
        },()=>{
            this.refs.dialog.show();
        });
    },
    delete(id){
        let _this = this;
        RUI.DialogManager.confirm({
            message:'您确定要删除吗？?',
            title:'删除部门',
            submit:function() {
                $.ajax({
                    url:commonBaseUrl + "/department/delete.htm",
                    type:"post",
                    dataType:"json",
                    data:{d:JSON.stringify({departmentId:id})},
                    success(data){
                        if(data.success){
                            Pubsub.publish("showMsg",["success","删除成功"]);
                            _this.getList();
                        }else{
                            Pubsub.publish("showMsg",["wrong",data.description]);
                        }
                    }
                })
            },
        });
    },
    render(){
        let {list,pager,request} = this.state;
        return(
            <Layout currentKey = {"1"} defaultOpen={"0"} bread = {["部门成员","部门管理"]}>
                <div className="depart-content">
                    <div className="tbn-div">
                        <RUI.Button className="add-btn primary" onClick = {this.add}>添加</RUI.Button>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <td>部门名称</td>
                            <td>部门职能</td>
                            <td>操作方式</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            list.length>0 && list.map((item,index)=>{
                                return(
                                    <tr key ={index}>
                                        <td>{item.name}</td>
                                        <td>{item.function}</td>
                                        <td>
                                            <a href="javascript:;" className="handle-a" onClick = {this.modify.bind(this,item)}>修改</a>
                                            <a href="javascript:;" className="handle-a" onClick = {this.delete.bind(this,item.id)}>删除</a>
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
                    <Pager onPage ={this.getList} {...pager}></Pager>
                    <RUI.Dialog ref="dialog" title={this.state.title} draggable={false} buttons="submit,cancel" onCancel={this.dialogCancel} onSubmit={this.dialogSubmit}>
                        <div style={{width:'400px', wordWrap:'break-word'}}>
                            <LabelInput require={true} value = {request.name} onChange = {this.handleInput.bind(this,"name")} label = "部门名称："></LabelInput>
                            <div className="m-t-10">
                                <label htmlFor="" className="left-label left">部门职能：</label>
                                <RUI.Textarea value = {request.function} onChange = {this.handleInput.bind(this,"function")}   className ="w-245"></RUI.Textarea>
                            </div>
                        </div>
                    </RUI.Dialog>
                </div>
            </Layout>
        )
    }
});
module.exports = Depart;