/**
 * Created by Administrator on 2017-2-13.
 */
import Layout from "../../components/layout";
import LabelSelect from "../../components/label-select";
import Pager from "../../components/pager";
import {hashHistory,Link } from 'react-router';
import "../../../css/page/department-management.scss";
import Data from "../../components/Data";
import Pubsub from "../../util/pubsub";
let arr1 = ["未处理","已分配","已完成"];
const Depart = React.createClass({
    getInitialState(){
        return{
            listRequest:{
                orderNo:"",
                orderName:"",
                isUrgent:"",
                tailorStatus:"",
                vampStatus:"",
                soleStatus:"",
                qcStatus:"",
            },
            pager:{
                currentPage:1,
                pageSize:10,
                totalNum:0,
            },
            handleSelect:[{key:"裁剪完成",value:"1"},{key:"机车分配",value:"2"},{key:"机车完成",value:"3"},{key:"查看",value:"4"},{key:"修改",value:"5"},{key:"删除",value:"6"}],
            list:[],
            isUrgent:{key:"全部",value:""},
            tailorStatus:{key:"全部",value:""},
            vampStatus:{key:"全部",value:""},
            qcStatus:{key:"全部",value:""},
            soleStatus:{key:"全部",value:""},
            smsIsOpen:1,
            confirmMsg:"",
            confirmUrl:"",
            currListItem:{}
        }
    },
    componentDidMount(){
        this.getList();
    },
    getList(pageNo=1){
        let _this = this;
        let {pager,listRequest} = this.state;
        $.ajax({
            url:commonBaseUrl+"/order/findOrderList.htm",
            type:"get",
            dataType:"json",
            data:{d:JSON.stringify(listRequest),pageNo:pageNo,pageSize:10},
            success(data){
                if(data.success){
                    pager.currentPage = pageNo;
                    pager.totalNum = data.resultMap.iTotalDisplayRecords;
                    _this.setState({
                        list : data.resultMap.rows || [],
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
    create(){
        //hashHistory.push("/stock/query");
        hashHistory.push("/production/createOrder");
    },
    getVampType(type){
        return arr1[type*1];
    },
    handleListSelect(item,e){
        let value = e.value;
        switch(value*1){
            case 2:
                this.modify(item);
                break;
            case 4:
            case 6:
                hashHistory.push("/order/distribution?id="+item.orderNo);
                break;
            case 1:
                hashHistory.push("/order/detail?id="+item.orderNo);
                break;
            case 3:
            case 5:
            case 7:
            case 8:
                this.commonHandle(value,item);
                break;
            case 9:
                this.delete(item);
                break;
        }
    },
    modify(item){
        let type = localStorage.type;
        if(type==1){
            hashHistory.push("/production/createOrder?id="+item.orderNo);
        }else{
            hashHistory.push("/order/distribution?id="+item.orderNo+"&type='edit'");
        }
    },
    commonHandle(type,item){
        let _this = this;
        let url,msg = "";
        switch(type*1){
            case 3:  //裁剪完成
                url = "/order/tailorFinish.htm";
                msg = "确认是否裁剪完成？";
                break;
            case 5:  //机车完成
                url = "/order/vampFinish.htm";
                msg = "确认是否机车完成？";
                this.handleConfirm(url,msg,item);
                return;
            case 7:  //底工完成
                url = "/order/soleFinish.htm";
                msg = "确认是否底工完成？";
                break;
            case 8:  //质检完成
                url = "/order/qcFinish.htm";
                msg = "确认是否质检完成？";
                this.handleConfirm(url,msg,item);
                return;
        }
        RUI.DialogManager.confirm({
            message:msg,
            title:'提示',
            submit:function() {
                $.ajax({
                    url:commonBaseUrl+url,
                    type:"post",
                    dataType:"json",
                    data:{d:JSON.stringify({orderNo:item.orderNo})},
                    success(data){
                        if(data.success){
                            Pubsub.publish("showMsg",["success","操作成功"]);
                            _this.getList();
                        }else{
                            Pubsub.publish("showMsg",["wrong",data.description]);
                        }
                    }
                })
            },
        });

    },
    handleConfirm(url,msg,item){
        this.setState({smsIsOpen:1,confirmMsg:msg,currListItem:item,confirmUrl:url},()=>{
            this.refs.dialog.show();
        })
    },
    delete(item){
        let orderNo = item.orderNo;
        let _this = this;
        RUI.DialogManager.confirm({
            message:'您确定要删除吗？?',
            title:'删除订单',
            submit:function() {
                $.ajax({
                    url:commonBaseUrl + "/order/delete.htm",
                    type:"post",
                    dataType:"json",
                    data:{d:JSON.stringify({orderNo})},
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
    handleSelect(type,e){
        let {listRequest} = this.state;
        listRequest[type] = e.value;
        this.state[type] = e;
        this.setState({},()=>{
            this.getList();
        })
    },
    handleInput(type,e){
        let {listRequest} = this.state;
        listRequest[type] = e.target.value;
    },
    search(){
        this.getList();
    },
    getSelectList(item){
        let arr = [{key:"查看",value:"1"}];
        let type = localStorage.type;
        if(type==1){
            arr.push({key:"修改",value:"2"},{key:"删除",value:"9"});
        }else if(type == 2){ //上案
            if(item.vampStatus ==1){
                arr.push({key:"修改",value:"2"});
            }
            if(item.tailorStatus==0){
                arr.push({key:"裁剪完成",value:"3"});
            }
            if(item.vampStatus==0){
                arr.push({key:"机车分配",value:"4"});
            }
            if(item.tailorStatus==1 && item.vampStatus==1){
                arr.push({key:"机车完成",value:"5"});
            }
        }else if(type == 3){//下案
            if(item.soleStatus ==1){
                arr.push({key:"修改",value:"2"});
            }
            if(item.soleStatus==0){
                arr.push({key:"底工分配",value:"6"});
            }
            if(item.soleStatus==1){
                arr.push({key:"底工完成",value:"7"});
            }
            if(item.qcStatus==0 && item.soleStatus==2){
                arr.push({key:"质检完成",value:"8"});
            }
        }
        return arr;
    },
    dialogSubmit(){
        let _this = this;
        let {confirmUrl,smsIsOpen,currListItem} = this.state;
        $.ajax({
            url:commonBaseUrl+confirmUrl,
            type:"post",
            dataType:"json",
            data:{d:JSON.stringify({orderNo:currListItem.orderNo,smsIsOpen})},
            success(data){
                if(data.success){
                    Pubsub.publish("showMsg",["success","操作成功"]);
                    _this.getList();
                }else{
                    Pubsub.publish("showMsg",["wrong",data.description]);
                }
            }
        })
    },
    checkSms(e){
        this.setState({smsIsOpen:e.data.selected});
    },
    render(){
        let _this = this;
        let {pager,list,handleSelect,isUrgent,tailorStatus,vampStatus,soleStatus,qcStatus,smsIsOpen,confirmMsg} = this.state;
        let type = localStorage.type;
        var openKey = 0;
        switch (type*1){
            case 1 : openKey = 2;break;
            case 2 : openKey = 0;break;
            case 3 : openKey = 1;break;
        }
        return(
            <Layout currentKey = "8" defaultOpen={openKey+""} bread = {["生产管理","生产订单"]}>
                <div className="depart-content">
                    <div className="tbn-div h-100">
                        <div>
                            <label htmlFor="">订单编号：</label>
                            <RUI.Input onChange = {this.handleInput.bind(this,"orderNo")} className = "w-150"/>
                            <label htmlFor="">订单名称：</label>
                            <RUI.Input onChange = {this.handleInput.bind(this,"orderName")} className = "w-150"/>
                            <label htmlFor="">加急：</label>
                            <RUI.Select
                                data={[{key:'全部',value:''}, {key:'是',value:'1'}, {key:'否',value:'2'}]}
                                value={isUrgent}
                                stuff={true}
                                callback = {this.handleSelect.bind(this,"isUrgent")}
                                className="rui-theme-1 w-120">
                            </RUI.Select>
                            <RUI.Button className="primary" onClick = {this.search}>搜索</RUI.Button>
                            {
                                type==1&&
                                <RUI.Button className="add-btn primary" onClick = {this.create}>创建</RUI.Button>
                            }
                        </div>
                        <div className="m-t-10">
                            <label htmlFor="">裁剪状态：</label>
                            <RUI.Select
                                data={[{key:'全部',value:''}, {key:'未处理',value:'0'}, {key:'已完成',value:'1'}]}
                                value={tailorStatus}
                                stuff={true}
                                callback = {this.handleSelect.bind(this,"tailorStatus")}
                                className="rui-theme-1 w-120">
                            </RUI.Select>
                            <label htmlFor="">机车状态：</label>
                            <RUI.Select
                                data={[{key:'全部',value:''}, {key:'未处理',value:'0'}, {key:'处理中',value:'1'}, {key:'已完成',value:'2'}]}
                                value={vampStatus}
                                stuff={true}
                                callback = {this.handleSelect.bind(this,"vampStatus")}
                                className="rui-theme-1 w-120">
                            </RUI.Select>
                            <label htmlFor="">底工状态：</label>
                            <RUI.Select
                                data={[{key:'全部',value:''}, {key:'未处理',value:'0'}, {key:'处理中',value:'1'}, {key:'已完成',value:'2'}]}
                                value={soleStatus}
                                stuff={true}
                                callback = {this.handleSelect.bind(this,"soleStatus")}
                                className="rui-theme-1 w-120">
                            </RUI.Select>
                            <label htmlFor="">质检状态：</label>
                            <RUI.Select
                                data={[{key:'全部',value:''}, {key:'未处理',value:'0'}, {key:'已完成',value:'1'}]}
                                value={qcStatus}
                                stuff={true}
                                callback = {this.handleSelect.bind(this,"qcStatus")}
                                className="rui-theme-1 w-120">
                            </RUI.Select>
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <td>生产样图</td>
                            <td>订单编号</td>
                            <td>订单名称</td>
                            <td>交货时间</td>
                            <td>双数</td>
                            {
                                type==1 &&
                                <td>产品金额</td>
                            }
                            <td>加急</td>
                            <td>裁剪状态</td>
                            <td>机车状态</td>
                            <td>底工状态</td>
                            <td>质检状态</td>
                            <td>剩余时间</td>
                            <td>操作方式</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            list.map((item,index)=>{
                                let selectData = _this.getSelectList(item);
                                return(
                                    <tr key = {index}>
                                        <td>
                                            <img className = "commodity-img" src={item.orderPic?item.orderPic:require("../../../images/picList.jpg")} alt=""/>
                                        </td>
                                        <td>{item.orderNo}</td>
                                        <td>{item.orderName}</td>
                                        <td>{item.deliveryTime}</td>
                                        <td>{item.orderNum}</td>
                                        {
                                            type==1 &&
                                            <td>{(item.orderAmount/100).toFixed(2)}</td>
                                        }
                                        <td>{item.isUrgent==1?"是":"否"}</td>
                                        <td>{item.tailorStatus==0?"未处理":"裁料完成"}</td>
                                        <td>{this.getVampType(item.vampStatus)}</td>
                                        <td>{this.getVampType(item.soleStatus)}</td>
                                        <td>{item.qcStatus==0?"未处理":"已处理"}</td>
                                        <td>{item.residueTime+"天"}</td>
                                        <td>
                                            <RUI.Select data = {selectData}
                                                        value = {{key:"查看",value:"1"}}
                                                        className="rui-theme-1 w-120"
                                                        callback = {this.handleListSelect.bind(this,item)}
                                                        stuff={true}/>
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
                    <RUI.Dialog ref="dialog" title={"提示"} draggable={false} buttons="submit,cancel"  onSubmit={this.dialogSubmit}>
                        <div style={{width:'300px', wordWrap:'break-word'}}>
                            <div>{confirmMsg}</div>
                            <div>
                                <RUI.Checkbox selected = {smsIsOpen==1?1:0} onChange = {this.checkSms}>是否发送短信</RUI.Checkbox>
                            </div>
                        </div>
                    </RUI.Dialog>
                </div>
            </Layout>
        )
    }
});
module.exports = Depart;