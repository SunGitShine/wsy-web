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
import {orderDetail} from "../../components/memberAjax";
import Data from "./testData"
let type = localStorage.type;
import  Modal  from 'antd/lib/Modal';
export default class Detail extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            list:{
                produceOrderProductVOs :[],
            },
            typeFlag : type==3?true : false,
            modalImg:"",
            visible:false
        };
        this.submit = this.submit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
      }

    componentDidMount() {
        this.getList();
    }
    getList(){
        let _this = this;
        let orderNo = this.props.location.query.id;
        let type = 1;
        let {typeFlag} = this.state;
        type = typeFlag?2:1;
        orderDetail(orderNo,type).then((data)=>{
            _this.setState({list:data.produceOrderVO});
        })
    }
    submit(){
       window.print();
    }
    getTableHtml(produceOrderProductDetailVOs){
        let {list,typeFlag} = this.state;
        if((!typeFlag && list.vampStatus==0) || (typeFlag && list.soleStatus==0)){
            let arr = [{},{}];
            return (
                produceOrderProductDetailVOs.map((item,i)=>{
                    return (
                        <tr key = {i}>
                            <td className="w-150">
                                {item.shoeCode+"码->"+item.shoeNum+"双"}
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    )
                })
            )
        }else{
            return(
                produceOrderProductDetailVOs.map((item,i)=>{
                    return (
                        <tr key = {i}>
                            <td>
                                {item.shoeCode+"码->"+item.shoeNum+"双"}
                            </td>
                            <td>
                                {
                                    item.produceOrderProductDistributeDOs.map((sonItem)=>{
                                            return (
                                                <div className="table-bottom-line">{sonItem.employeeNo+"("+sonItem.employeeName+") ---"+sonItem.shoeNum+"双"}</div>
                                            )
                                        }
                                    )
                                }
                            </td>
                        </tr>
                    )
                })
            )
        }
    }
    typeSwitch(typeFlag){
        this.setState({typeFlag},()=>{
            this.getList();
        });
    }
    clickImg(item){
        this.setState({modalImg:item.productUrl,visible:true})
    }
    handleCancel(){
        this.setState({visible:false})
    }
    render(){
        let {list,typeFlag,modalImg,visible } = this.state;
        let query = this.props.location.query;
        let produceOrderProductVOs = list.produceOrderProductVOs;
        var openKey = 0;
        var currentKey = 8;
        switch (type*1){
            case 1 : openKey = 2;break;
            case 2 : openKey = 0;break;
            case 3 : openKey = 1;break;
        }
        if(query.type){
            openKey = 2;
            currentKey = 9;
        }
        return(
            <Layout currentKey = {currentKey+""} defaultOpen={openKey+""} bread = {["生产管理","生产订单"]}>
                <div className="order-div print">
                    <h3 className="not-print">查看订单</h3>
                    <div className="p-l-100">
                        <div className="m-b-20 not-print">
                            <RUI.Button className = {!typeFlag?"primary next-btn order_active":"primary next-btn "}
                                        onClick = {this.typeSwitch.bind(this,false)}>上案</RUI.Button>
                            <RUI.Button className = {typeFlag?"primary next-btn order_active":"primary next-btn"}
                                        onClick = {this.typeSwitch.bind(this,true)}>下案</RUI.Button>
                        </div>
                        <div className="m-b-20">
                            <label>订单编号：</label><span className="m-r-20">{list.orderNo}</span>
                            <label>订单名称：</label><span className="m-r-20">{list.orderName}</span>
                            <label>是否加急：</label><span className="m-r-20">{list.isUrgent==1?"是":"否"}</span>
                            <label>交货时间：</label><span className="m-r-20">{list.deliveryTime}</span>
                        </div>
                        <div className="m-b-20">
                            <label>创建时间：</label><span className="m-r-20">{list.createTime}</span>
                            <label>{typeFlag?"底工完成时间：":"裁剪完成时间："}</label><span className="m-r-20">{typeFlag?list.soleHandleTime:list.tailorFinishTime}</span>
                        </div>
                        <div className="m-b-20">
                            <label>{typeFlag?"底工分配时间：":"机车分配时间："}</label><span className="m-r-20">{typeFlag?list.soleFinishTime:list.vampHandleTime}</span>
                            <label>{typeFlag?"质检完成时间：":"机车完成时间："}</label><span className="m-r-20">{typeFlag?list.qcFinishTime:list.vampFinishTime}</span>
                        </div>
                        <div className="order-content clearfix">
                            {
                                produceOrderProductVOs.map((item,index)=>{
                                    return(
                                        <div className="list left" key = {index}>
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
                                            {
                                                !!item.producePrice &&
                                                <div className="m-b-20 not-print">
                                                    <label>产品单价：</label><span className="require">￥{(item.producePrice/100).toFixed(2)}</span>
                                                </div>
                                            }
                                            {
                                                !!item.produceAmount &&
                                                <div className="m-b-20 not-print">
                                                    <label>产品金额：</label><span className="require">￥{(item.produceAmount/100).toFixed(2)}</span>
                                                </div>
                                            }
                                            <div className="m-t-10">
                                                <label><i className="require">*</i>生产鞋码与数量：</label>
                                                <table className = "table m-t-10 m-b-20">
                                                    {
                                                        this.getTableHtml(item.produceOrderProductDetailVOs)
                                                    }

                                                </table>
                                            </div>
                                            <div className="m-b-20">
                                                <label>生产要求：</label><span>{item.produceAsk}</span>
                                            </div>
                                            <div className="m-b-20">
                                                <label>备注：</label><span>{item.remark}</span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        <Modal visible={visible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={modalImg} />
                        </Modal>
                        </div>
                        <div className="m-t-30 not-print">
                            <RUI.Button className = "cancel-btn" onClick = {()=>{history.go(-1)}}>取消</RUI.Button>
                            <RUI.Button className = "primary" onClick = {this.submit} >打印</RUI.Button>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}