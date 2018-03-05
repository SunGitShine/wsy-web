/**
 * Created by Administrator on 2017-2-13.
 */
import Layout from "../../components/layout";
import LabelSelect from "../../components/label-select";
import Pager from "../../components/pager";
import {hashHistory,Link } from 'react-router';
import LabelDate from "../../components/label-date";
import LabelInput from "../../components/label-input";
import "../../../css/page/delivery.scss";
import Data from "../../components/Data";
import Pubsub from "../../util/pubsub";
let arr1 = ["未处理","已分配","已完成"];
import moment from 'moment';
const Depart = React.createClass({
    getInitialState(){
        return{
            listRequest:{
                orderNo:"",
                orderName:"",
                customerName:"",
                startTime:moment(new Date()-86400*30*1000).format("YYYY-MM-DD"),
                endTime:moment(new Date()).format("YYYY-MM-DD"),
                balanceStatus:""
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
        listRequest.startTime = listRequest.startTime +" 00:00:00";
        listRequest.endTime = listRequest.endTime +" 23:59:59";
        $.ajax({
            url:commonBaseUrl+"/balance/findBalanceList.htm",
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
        hashHistory.push("/orderForm?opType=2");
    },
    getVampType(type){
        return arr1[type*1];
    },
    handleListSelect(item,e){
        let value = e.value;
        switch(value*1){
            //查看
            case 0:
            hashHistory.push("/orderForm?id="+item.orderNo+"&opType=0");
            break;
            //修改
            case 2:
                hashHistory.push("/orderForm?id="+item.orderNo+"&opType=1");
                break;
            case 4:
            case 6:
                hashHistory.push("/orderForm?id="+item.orderNo+"&limit="+localStorage.type);
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
    dateChange(e){
        let {listRequest} = this.state;         
        listRequest.startTime = e;
        this.setState({});
    },
    dateChangeEnd(e){
        let {listRequest} = this.state;
        listRequest.endTime = e;
        this.setState({});
    },
    search(){
        this.getList();
    },
    getSelectList(item){
        let arr = [{key:"订单详情",value:"1"},{key:"查看",value:"0"}];
        let type = localStorage.type;
        if(type==1){
            arr.push({key:"修改",value:"2"});
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
        let {pager,list,handleSelect,isUrgent,tailorStatus,vampStatus,soleStatus,qcStatus,smsIsOpen,confirmMsg,listRequest} = this.state;
        let type = localStorage.type;
        var openKey = 0;
        switch (type*1){
            case 1 : openKey = 2;break;
            case 2 : openKey = 0;break;
            case 3 : openKey = 1;break;
        }
        return(
            <Layout currentKey = "10" defaultOpen={openKey+""} bread = {["结算管理","送货单管理"]}>
                <div className="depart-content">
                    <div className="tbn-div">
                        <div>                           
                            <LabelDate
                                value = {listRequest.startTime}                              
                                label = "制单日期："
                                onChange = {this.dateChange.bind(this)}
                            />                           
                            <LabelDate
                                value = {listRequest.endTime} 
                                label = "至"                              
                                onChange = {this.dateChangeEnd.bind(this)}
                            />
                            <LabelInput value = {listRequest.orderNo} onChange = {this.handleInput.bind(this,"orderNo")} label="订单编号："/>                            
                            <LabelInput value = {listRequest.customerPhone} onChange = {this.handleInput.bind(this,"customerPhone")} label="客户名称：" />
                            <LabelInput value = {listRequest.orderName} onChange = {this.handleInput.bind(this,"orderName")} label="订单名称：" />
                            <label>结算状态&nbsp;&nbsp;</label>
                            <RUI.Select
                                data={[{key:'全部',value:''}, {key:'已结算',value:'1'}, {key:'未结算',value:'2'}]}
                                value={isUrgent}
                                stuff={true}
                                callback = {this.handleSelect.bind(this,"isUrgent")}
                                className="rui-theme-1 w-120">
                            </RUI.Select>
                            <RUI.Button className="primary" onClick = {this.search}>搜索</RUI.Button>
                            {
                                type == 1&&
                                <RUI.Button className="primary" onClick = {this.create}>创建</RUI.Button>
                            }
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <td>订单编号</td>
                            <td>订单名称</td>
                            <td>客户名称</td>
                            <td>制单时间</td>
                            <td>双数</td>
                            <td>金额</td>
                            <td>结算状态</td>
                            <td>操作方式</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            list.map((item,index)=>{
                                let selectData = _this.getSelectList(item);
                                return(
                                    <tr key = {index}>
                                        <td>{item.orderNo}</td>
                                        <td>{item.orderName}</td>
                                        <td>{item.customerName}</td>
                                        <td>{item.createReceiptTime ==undefined?"":item.createReceiptTime }</td>
                                        <td>{item.totalNum}</td>


                                        <td>{item.totalMoney}</td>
                                        <td>{item.balanceStatus== 0?"未结算":"已结算"}</td>
                                        <td>
                                            <RUI.Select data = {selectData}
                                                        value = {{key:"订单详情",value:"0"}}
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