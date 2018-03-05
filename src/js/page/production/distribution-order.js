/**
 * Created by Administrator on 2017-2-25.
 */
import Layout from "../../components/layout";
import LabelInput from "../../components/label-input";
import LabelSelect from "../../components/label-select";
import LabelArea from "../../components/label-textarea";
import Upload from "../../components/upload";
import Pubsub from "../../util/pubsub";
import "../../../css/page/order.scss";
import {hashHistory } from 'react-router';
import {orderDetail,memberList} from "../../components/memberAjax";
import  Modal  from 'antd/lib/Modal';
import Data from "./testData"
export default class Detail extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            list:{
                    produceOrderProductVOs :[]
            },
            employeesList :[],
            modalImg:"",
            visible:false
        };
        this.submit = this.submit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount() {
        this.getList();
        this.getEmployee();
    }

    componentWillMount() {
        this.timer && clearTimeout(this.timer);
    }
    getEmployee(){
        let employeesList = [];
        let _this = this;
        let type = localStorage.type;
        let num = type==2?2:3;
        memberList(num).then((data)=>{
            data.rows.map((item)=>{
                employeesList.push({key:(item.employeeNo+"("+item.name+")"),value:item.name,no:item.employeeNo});
            });
            _this.setState({employeesList});
        });

    }
    getList(){
        let _this = this;
        let orderNo = this.props.location.query.id;
        orderDetail(orderNo).then((data)=>{
            _this.setState({list:data.produceOrderVO});
        })
    }
    submit(){
        let request = {orderDistributes:[]};
        let {list} = this.state;
        let url = "";
        let query = this.props.location.query;
        let type = localStorage.type;
        list.produceOrderProductVOs.map((item,index)=>{
            item.produceOrderProductDetailVOs.map((sItem,sIndex)=>{
                sItem.produceOrderProductDistributeDOs.map((ssItem,ssIndex)=>{
                    request.orderDistributes.push({
                        produceOrderProductId:item.id,
                        produceOrderProductDetailId:sItem.id,
                        shoeCode:sItem.shoeCode,
                        shoeNum:ssItem.shoeNum,
                        employeeNo:ssItem.defaultValue.no,
                        employeeName:ssItem.defaultValue.value})
                })
            });
        });
        request.produceOrderNo = list.orderNo;
        request.type  = type==2?1:2;
        url = query.id?"/order/updateDistribute.htm":"/order/distribute.htm"
        $.ajax({
           url:commonBaseUrl + url,
            type : "post",
            dataType:"json",
            data:{d:JSON.stringify(request)},
            success(data){
                if(data.success){
                    Pubsub.publish("showMsg",["success","操作成功"]);
                    this.timer = setTimeout(()=>{
                        hashHistory.push("/production/order");
                    },2000)
                }else{
                    Pubsub.publish("showMsg",["wrong",data.description]);
                }
            }
        });
        console.log(request)
    }
    addTable(item,sonIndex,index){
        let {list} = this.state;
        if(sonIndex == item.length-1){
            item.push({shoeNum:"",employeeNo:"",employeeName:"",defaultValue:{key:"请选择",value:""}});
        }else{
            item.splice(index,1);
        }
        this.setState({list});
    }
    tableInput(item,sonIndex,e){
        let {list} = this.state;
        item[sonIndex].shoeNum = e.target.value;
        this.setState({list});
    }
    selectTable(item,sonIndex,index,i,e){
        let {list} = this.state;
        item[sonIndex].defaultValue = e;
        let inputRefs = "input"+i+index+sonIndex;
        let node = ReactDOM.findDOMNode(this.refs[inputRefs]);
        $(node).focus();
        this.setState({list});
    }
    clickImg(item){
        this.setState({modalImg:item.productUrl,visible:true})
    }
    handleCancel(){
        this.setState({visible:false})
    }
    render(){
        let _this = this;
        let {list,employeesList,visible,modalImg } = this.state;
        let produceOrderProductVOs = list.produceOrderProductVOs;
        let type = localStorage.type;
        var openKey = 0;
        switch (type*1){
            case 1 : openKey = 2;break;
            case 2 : openKey = 0;break;
            case 3 : openKey = 1;break;
        }
        return(
            <Layout currentKey = "8" defaultOpen={openKey+""} bread = {["生产管理","生产订单"]}>
                <div className="order-div print">
                    <h3 className="not-print">查看订单</h3>
                    <div className="p-l-100">
                        <div className="m-b-20">
                            <label>订单编号：</label><span className="m-r-20">{list.orderNo}</span>
                            <label>订单名称：</label><span className="m-r-20">{list.orderName}</span>
                            <label>是否加急：</label><span className="m-r-20">{list.isUrgent==1?"是":"否"}</span>
                            <label>交货时间：</label><span className="m-r-20">{list.deliveryTime}</span>
                        </div>
                        <div className="order-content clearfix">
                            {
                                produceOrderProductVOs.map((item,i)=>{
                                    return(
                                        <div className="list left" key = {i}>
                                            {
                                                item.productUrl!=""&&
                                                <div className = "clearfix">
                                                    <label htmlFor="" className = "left-label left"><i className="require">*</i>生产样图：</label>
                                                    <img src={item.productUrl} onClick = {this.clickImg.bind(this,item)} className="upload-img" alt=""/>
                                                </div>
                                            }
                                            <div className="m-b-20">
                                                <label>产品名称：</label><span>{item.productName}</span>
                                            </div>
                                            <div className="m-b-20">
                                                <label>产品数量：</label><span>{item.produceNum}</span>
                                            </div>
                                            <div className="m-t-10">
                                                <label><i className="require">*</i>生产鞋码与数量：</label>
                                                <table className = "table m-t-10 m-b-20">
                                                    {
                                                        item.produceOrderProductDetailVOs.map((item,index)=>{
                                                        return (
                                                        <tr key = {index}>
                                                            <td>
                                                                {item.shoeCode+"码->"+item.shoeNum+"双"}
                                                            </td>
                                                            <td>
                                                                {
                                                                    (function(){
                                                                        if(item.produceOrderProductDistributeDOs.length==0){
                                                                            item.produceOrderProductDistributeDOs.push({shoeNum:"",employeeNo:"",employeeName:"",defaultValue:{key:"请选择",value:""}});
                                                                        }
                                                                        let query = _this.props.location.query;
                                                                        if(query.id){
                                                                            item.produceOrderProductDistributeDOs.map((data)=>{
                                                                                if(data.defaultValue){
                                                                                    return;
                                                                                }
                                                                                data.defaultValue = {key:data.employeeNo,value:data.employeeName}
                                                                            })
                                                                        }
                                                                        return(
                                                                            item.produceOrderProductDistributeDOs.map((sonItem,sonIndex)=>{
                                                                                    let flag = item.produceOrderProductDistributeDOs.length-1 == sonIndex;
                                                                                    return (
                                                                                        <div className="table-bottom-line" key = {sonIndex}>
                                                                                            <RUI.Select data = {employeesList}
                                                                                                        value = {sonItem.defaultValue}
                                                                                                        callback = {_this.selectTable.bind(_this,item.produceOrderProductDistributeDOs,sonIndex,index,i)}
                                                                                                        className = "w-100 rui-theme-1"/>
                                                                                            <span className="l-r-10">{sonItem.defaultValue.value}</span>
                                                                                            <RUI.Input value = {sonItem.shoeNum}
                                                                                                       ref = {"input"+i+index+sonIndex}
                                                                                                       onChange = {_this.tableInput.bind(_this,item.produceOrderProductDistributeDOs,sonIndex)}
                                                                                                       className = "w-80"/>
                                                                                            <RUI.Button onClick = {_this.addTable.bind(_this,item.produceOrderProductDistributeDOs,sonIndex,index)}>{flag?"添加":"删除"}</RUI.Button>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            )
                                                                        )
                                                                    })()
                                                                }
                                                            </td>
                                                        </tr>
                                                        )
                                                    })
                                                    }
                                                </table>
                                            </div>
                                            <div className="m-b-20">
                                                <label>生产要求：</label><span>{item.produceAsk || "无"}</span>
                                            </div>
                                            <div className="m-b-20">
                                                <label>备注：</label><span>{item.remark || "无"}</span>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>
                        <Modal visible={visible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={modalImg} />
                        </Modal>
                        <div className="m-t-30 not-print">
                            <RUI.Button className = "cancel-btn" onClick = {()=>{history.go(-1)}}>取消</RUI.Button>
                            <RUI.Button className = "primary" onClick = {this.submit} >确定</RUI.Button>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}