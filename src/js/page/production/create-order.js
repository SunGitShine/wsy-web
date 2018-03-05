/**
 * Created by Administrator on 2017-2-25.
 */
import Layout from "../../components/layout";
import LabelInput from "../../components/label-input";
import LabelSelect from "../../components/label-select";
import LabelDate from "../../components/label-date";
import LabelArea from "../../components/label-textarea";
import Upload from "../../components/upload";
import Pubsub from "../../util/pubsub";
import {orderDetail} from "../../components/memberAjax";
import {hashHistory} from "react-router"
import "../../../css/page/order.scss";
import moment from 'moment';

export default class Order extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            imgUrl : "",
            defaultSelect:{key:"是",value:"1"},
            request:{
                orderName:"",
                orderNo:"",
                isUrgent:1,
                smsIsOpen:1,
                deliveryTime:moment(new Date()).format("YYYY-MM-DD"),
                //客户名称
                customerName:"",
                //客户电话
                customerPhone:"",
                //客户地址
                deliveryAddress:"",
                //是否创建订货单
                isCreatDeliveryNote:1
            },
            list:[
                {
                    productName : "",
                    produceAsk : "",
                    productUrl : "",
                    producePrice : "",
                    remark : "",
                    produceOrderProductDetailVOs:[
                        {
                            shoeCode:"",
                            shoeNum:""
                        }
                    ]
                }
            ],
            responseList:{}
        };
        this.clickImg = this.clickImg.bind(this);
        this.addSonOrder = this.addSonOrder.bind(this);
        this.select = this.select.bind(this);
        this.submit = this.submit.bind(this);
        this.checkSms = this.checkSms.bind(this);
      }

    componentDidMount(){
        let _this = this;
        let query = this.props.location.query;
        let {request} = this.state;
        if(query.id){
            orderDetail(query.id).then((data)=>{
                request.orderName = data.produceOrderVO.orderName;
                request.deliveryTime = data.produceOrderVO.deliveryTime;
                request.customerName = data.produceOrderVO.customerName;
                request.customerPhone = data.produceOrderVO.customerPhone;
                request.deliveryAddress = data.produceOrderVO.deliveryAddress;
                request.isUrgent = data.produceOrderVO.isUrgent;
                let list = data.produceOrderVO.produceOrderProductVOs;
                list.map((item)=>{
                    item.producePrice = (item.producePrice/100).toFixed(2);
                });
                _this.setState({
                    list:list,
                    responseList : data.produceOrderVO,
                    defaultSelect : data.produceOrderVO.isUrgent == 1?{key:"是",value:1}:{key:"否",value:1},
                });
            })
        }

    }
    addLine(index){
        let {list} = this.state;
        list[index].produceOrderProductDetailVOs.push({
            shoeCode:"",
            shoeNum:""
        });
        this.setState({list});
    }
    addSonOrder(){
        let {list} = this.state;
        list.push({
                productName : "",
                produceAsk : "",
                producePrice : "",
                productUrl : "",
                remark : "",
                produceOrderProductDetailVOs:[
                    {
                        shoeCode:"",
                        shoeNum:""
                    }
                ]
            });
        this.setState({list});
    }
    delete(index){
        let {list} = this.state;
        list.splice(index,1);
        this.setState({list});
        console.log(list)
    }
    clickImg(){}
    handleChange(type,e){
        let {request} = this.state;
        request[type] = e.target.value;
    }
    dateChange(e){
        let {request} = this.state;
        request.deliveryTime = e;
        this.setState({});
    }
    select(e){
        let {request} = this.state;
        request.isUrgent = e.value;
        this.setState({});
    }
    submit(){
        let {request,list} = this.state;
        let reList = $.extend(true,[],list);
        let query = this.props.location.query;
        let flag = true;
        let msg = "";
        if(!request.orderName){
            Pubsub.publish("showMsg",["wrong","请输入订单名称"]);
            return false;
        }
        reList.map((item)=>{
            item.produceOrderProductDetailDOs = item.produceOrderProductDetailVOs;
            item.producePrice = item.producePrice*100;
            if(!item.productName){
                flag = false;
                msg = "请输入产品名称";
                return;
            }
            if(!item.producePrice){
                flag = false;
                msg = "请输入产品单价";
                return;
            }
            delete item.produceOrderProductDetailVOs;
            delete item.orderNo;
            delete item.id;
            item.produceOrderProductDetailDOs.map((sItem)=>{
                if(!sItem.shoeCode){
                    flag = false;
                    msg = "请输入鞋码";
                    return;
                }
                if(!sItem.shoeNum){
                    flag = false;
                    msg = "请输入生产数量";
                    return;
                }
                delete sItem.id;
                delete sItem.orderNo;
                delete sItem.produceOrderProductDistributeDOs;
                delete sItem.produceOrderProductId;
            })
        });
        if(!flag){
            Pubsub.publish("showMsg",["wrong",msg]);
            return false;
        }
        request.orderNo = query.id || "";
        request.produceOrderProductVOs = reList; //produceOrderProductDetailDOs
        let url = "";
        url = query.id? "/order/update.htm" : "/order/add.htm";
        $.ajax({
            url:commonBaseUrl + url,
            type:"post",
            dataType:"json",
            data:{d:JSON.stringify(request)},
            success(data){
                if(data.success){
                    Pubsub.publish("showMsg",["success",query.id?"修改成功":"创建成功"]);
                    this.timer = setTimeout(()=>{
                        hashHistory.push("/production/order");
                    },2000)
                }else{
                    Pubsub.publish("showMsg",["wrong",data.description]);
                }
            }
        })
    }
    uploadCallback(index,url){
        let {list} = this.state;
        list[index].productUrl = url;
        this.setState({});
    }
    productChange(type,index,e){
        let {list} = this.state;
        list[index][type] = e.target.value;
    }
    shoeChange(type,index,sonIndex,e){
        let {list} = this.state;
        list[index].produceOrderProductDetailVOs[sonIndex][type] = e.target.value;
        this.setState({});
    }
    shoeDelete(index,sonIndex){
        let {list} = this.state;
        list[index].produceOrderProductDetailVOs.splice(sonIndex,1);
        this.setState({});
    }
    checkSms(e){
        let {request} = this.state;
        request.smsIsOpen = e.data.selected;
        this.setState({request},()=>{
            console.log(this.state.request);
        });
    }
    checkCreatDeliveryNote(e){
        let {request} = this.state;
        request.isCreatDeliveryNote = e.data.selected;
        this.setState({request},()=>{
            console.log(this.state.request);
        });
    }
    render(){
        let {imgUrl,list,request,defaultSelect,responseList} = this.state;
        let query = this.props.location.query;
        let editFlag =true;
        if(query.id && (responseList.vampStatus!=0 || responseList.tailorStatus!=0 || responseList.soleStatus!=0 || responseList.qcStatus!=0)){
            editFlag = false;
        }
        return(
            <Layout currentKey = "8" defaultOpen={"2"} bread = {["生产管理","生产订单"]}>
                <div className="order-div">
                    <h3>{query.id?"修改订单":"创建订单"}</h3>
                    
                    <LabelInput value = {request.orderName} onChange = {this.handleChange.bind(this,"orderName")} label="订单名称：" require = {true}/>
                    <LabelInput value = {request.customerName} onChange = {this.handleChange.bind(this,"customerName")} label="客户名称：" require = {true}/>
                    <LabelInput value = {request.customerPhone} onChange = {this.handleChange.bind(this,"customerPhone")} label="客户电话：" require = {true}/>
                    <LabelArea label="收货地址："value = {request.deliveryAddress} onChange = {this.handleChange.bind(this,"deliveryAddress")} require = {true}/>                   
                    <LabelSelect
                        require = {true}
                        label = "是否加急："
                        data = {[{key:"是",value:1},{key:"否",value:2}]}
                        callback = {this.select}
                        default = {defaultSelect}/>
                    <LabelDate
                        value = {request.deliveryTime}
                        defaultValue = {request.deliveryTime}
                        require = {true}
                        label = "交货时间："
                        onChange = {this.dateChange.bind(this)}
                    />
                    <div className="m-t-10">
                        <RUI.Checkbox selected = {request.smsIsOpen==1?1:0} onChange = {this.checkSms}>是否发送短信</RUI.Checkbox>
                        <RUI.Checkbox selected = {request.isCreatDeliveryNote==1?1:0} onChange = {this.checkCreatDeliveryNote}>是否创建送货单</RUI.Checkbox>                        
                    </div>
                    {
                        editFlag &&
                        <RUI.Button className = "m-t-10 primary" onClick = {this.addSonOrder}>添加子订单</RUI.Button>
                    }
                    <div className="order-content clearfix">
                        {
                            list.map((item,index)=>{
                                return(
                                    <div className="list left" key = {index}>
                                        {
                                            index!=0 &&
                                            <RUI.Button className = "delete" onClick = {this.delete.bind(this,index)}>删除子订单</RUI.Button>
                                        }
                                        <div className = "clearfix">
                                            <label htmlFor="" className = "left-label left">生产样图：</label>
                                            <Upload
                                                callback = {this.uploadCallback.bind(this,index)}
                                                uploadBtn = "p-l-100"
                                                disabled = {!editFlag}
                                                onClick = {this.clickImg}
                                                url = {item.productUrl || imgUrl}/>
                                        </div>
                                        <div>
                                            <LabelInput value = {item.productName} label="产品名称："
                                                        disabled = {!editFlag}
                                                        onChange = {this.productChange.bind(this,"productName",index)}
                                                        require = {true}/>
                                        </div>
                                        <div>
                                            <LabelInput value = {item.producePrice} label="产品单价："
                                                        disabled = {!editFlag}
                                                        onChange = {this.productChange.bind(this,"producePrice",index)}
                                                        require = {true}/>
                                        </div>
                                        <div className="m-t-10">
                                            <label><i className="require">*</i>生产鞋码与数量：</label>
                                            <table className = "table m-t-10">
                                                <thead>
                                                <tr>
                                                    <td>鞋码</td>
                                                    <td>生产数量</td>
                                                    <td>操作</td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    item.produceOrderProductDetailVOs.map((sonItem,sonIndex)=>{
                                                        return(
                                                            <tr key = {sonIndex}>
                                                                <td>
                                                                    <RUI.Input value = {sonItem.shoeCode}
                                                                               disabled = {!editFlag}
                                                                               onChange = {this.shoeChange.bind(this,"shoeCode",index,sonIndex)}
                                                                               className = "w-80"/>
                                                                </td>
                                                                <td>
                                                                    <RUI.Input value = {sonItem.shoeNum}
                                                                               disabled = {!editFlag}
                                                                               onChange = {this.shoeChange.bind(this,"shoeNum",index,sonIndex)}
                                                                               className = "w-80"/>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        editFlag &&
                                                                        <RUI.Button onClick = {this.shoeDelete.bind(this,index,sonIndex)}>删除</RUI.Button>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                            {
                                                editFlag &&
                                                <RUI.Button className="m-t-10 primary" onClick = {this.addLine.bind(this,index)}>添加一行</RUI.Button>
                                            }
                                        </div>
                                        <LabelArea label="生产要求："
                                                   value = {item.produceAsk}
                                                   disabled = {!editFlag}
                                                   onChange = {this.productChange.bind(this,"produceAsk",index)} />
                                        <LabelArea label="备注："
                                                   value = {item.remark}
                                                   disabled = {!editFlag}
                                                   onChange = {this.productChange.bind(this,"remark",index)} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="m-t-30">
                        <RUI.Button className = "cancel-btn" onClick = {()=>{history.go(-1)}}>取消</RUI.Button>
                        <RUI.Button className = "primary" onClick = {this.submit}>确定</RUI.Button>
                    </div>
                </div>
            </Layout>
        )
    }
}