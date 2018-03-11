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
            title : "添加分类",
            request : {
                classifyName : "",
                id:""
            },
            type:"",
            list:[],
            pager:{
                currentPage:1,
                pageSize:20,
                totalNum:0,
            },
        }
    },
    componentDidMount(){
        this.getList();
    },
    getList(pageNo=1){
        let _this = this;
        let {pager} = this.state;
        $.ajax({
            url:commonBaseUrl+"/classify/findByPage.htm",
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
    doPage(){

    },
    add(){
        let {request} = this.state;
        delete request.id;
        request.classifyName = "";
        this.setState({
            title : "添加分类",
            type:"add",
            request
        },()=>{
            this.refs.dialog.show();
        });
    },
    dialogSubmit(){
        let _this = this;
        let {request,type} = this.state;
        if(!request.classifyName){
            Pubsub.publish("showMsg",["wrong","请输入类别名称"]);
            return false;
        }
        let url = type=="add"?"/classify/add.htm":"/classify/update.htm";
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
                    Pubsub.publish("showMsg",["wrong",data.description])
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
        let jsonStr = JSON.stringify(item);
        let json = JSON.parse(jsonStr);
        request = json;
        this.setState({
            title : "修改分类",
            type:"edit",
            request
        },()=>{
            this.refs.dialog.show();
        });
    },
    delete(classifyId){
        let _this = this;
        RUI.DialogManager.confirm({
            message:'您确定要删除吗？?',
            title:'删除分类',
            submit:function() {
                $.ajax({
                    url:commonBaseUrl+"/classify/delete.htm",
                    type:"post",
                    dataType:"json",
                    data:{d:JSON.stringify({classifyId})},
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

    render(){
        let {list,pager,request} = this.state;
        return(
            <Layout currentKey = {"4"} defaultOpen={"1"} bread = {["产品库存","分类管理"]}>
                <div className="depart-content">
                    <div className="tbn-div">
                        <RUI.Button className="add-btn primary" onClick = {this.add}>添加</RUI.Button>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <td>类别名称</td>
                            <td>操作方式</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            list.length>0 && list.map((item,index)=>{
                                return(
                                    <tr key = {index}>
                                        <td>{item.classifyName}</td>
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
                            <LabelInput placeholder = "请输入类别名称" require={true} value = {request.classifyName} onChange = {this.handleInput.bind(this,"classifyName")} label = "类别名称："></LabelInput>
                        </div>
                    </RUI.Dialog>
                </div>
            </Layout>
        )
    }
});
module.exports = Depart;