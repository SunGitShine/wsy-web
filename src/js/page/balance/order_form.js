import '../../../css/page/order_form.css';
import Layout from "../../components/layout";
import {hashHistory,Link } from 'react-router';
import Pubsub from "../../util/pubsub";
import moment from 'moment';
class OrderForm extends React.Component{
    constructor(props){
        super(props)
        let opType = this.props.location.query.opType;
        let moneyNo = {b:"",m:"",w:"",q:"",h:"",t:"",y:"",j:"",f:""};
        let productsItem = {
            productName:"",
            productNum:"",
            artNo:"",
            productPrice:""
        };
        this.state = {
            dataType:0,
            editFlag:opType,
            request:{
                orderName:"",
                customerName:"",
                customerPhone:"",
                deliveryAddress:"",
                orderNo:"",
                totalMoney:"",
                totalNum:"",
                products:[productsItem,productsItem,productsItem,productsItem,productsItem]
            },
            moneyList:[moneyNo,moneyNo,moneyNo,moneyNo,moneyNo,moneyNo],
            sumData:{
                times:[],
                sumMoney:"",
                moneyList:"",
                createBy:""
            }
        }
        this.submit = this.submit.bind(this);
    }    
    componentWillMount(){
        let {editFlag} = this.state;
        if(editFlag !== 2){
            this.getorderFormList();
        }       
    }
    typeSwitch(dataType0){
        let dataType = this.state ;
        dataType = (dataType0 == 0?1:0);
        this.setState({dataType})
    }
    getorderFormList(){
        let _this = this;
        let id= this.props.location.query.id;
        let {request,sumData} = _this.state;
        $.ajax({
            url:commonBaseUrl+"/balance/getReceipt.htm",
            type:"get",
            dataType:"json",
            data:{d:JSON.stringify({"orderNo":id})},
            success(data){
                if(data.success){
                    request.customerName = data.resultMap.receiptDO.customerName;
                    request.customerPhone = data.resultMap.receiptDO.customerPhone;
                    request.deliveryAddress = data.resultMap.receiptDO.deliveryAddress;
                    request.orderName = data.resultMap.receiptDO.orderName;
                    request.orderNo = data.resultMap.receiptDO.orderNo;
                    request.totalNum = data.resultMap.receiptDO.totalNum;
                    request.products = data.resultMap.receiptDO.products;
                    for(let i = 0 ;i<request.products;i++){
                        request.products[i].productPrice = request.products[i].productPrice/100;
                    }
                    let time = moment(data.resultMap.receiptDO.createTime);
                    sumData.times=[time.years(),time.months()+1,time.dates()];
                    sumData.moneyList = data.resultMap.receiptDO.products;
                    _this.setState({});
                }else{

                }
            }
        });
    }
    submit(){
        window.print();
    }
    //修改单据
    updateData(){
        let {request} = this.state;
        let url ="/balance/editReceipt.htm";
        let arr = [];
        for(let i = 0;i<request.products.length;i++){
            if(request.products[i].productName !== "" && request.products[i].productNum !== ""){
                request.products[i].productPrice = parseInt(request.products[i].productPrice)*100;
                arr.push(request.products[i]);
            }
        }
        request.products = arr;
        $.post(commonBaseUrl+url,{d:JSON.stringify(request)},function (results) {
            if(results.success){
                Pubsub.publish("showMsg",["success","操作成功"]);
            }else{
                Pubsub.publish("showMsg",["wrong","操作失败"]);
            }
           
        })
    }
    //创建送货单或者收据
    createData(){
        let {request} = this.state;
        let url = "/balance/creatReceipt.htm";
        let arr = [];
        for(let i = 0;i<request.products.length;i++){
            if(request.products[i].productName !== "" && request.products[i].productNum !== ""){
                request.products[i].productPrice = parseInt(request.products[i].productPrice)*100;
                arr.push(request.products[i]);
            }
        }
        request.products = arr;
        $.post(commonBaseUrl+url,{d:JSON.stringify(request)},function (results) {
            if(results.success){
                Pubsub.publish("showMsg",["success","操作成功"]);
            }else{
                Pubsub.publish("showMsg",["wrong","操作失败"]);
            }
           
        })
    }
    handleInput(type,e){
        let {request} = this.state;
        request[type] = e.target.value;
        this.setState({});
    }

    listChange(type,sonIndex,e){
        let {request} = this.state;
        request.products[sonIndex][type] = e.target.value;
        this.setState({});
    }
    render(){
        var openKey = 4;
        var currentKey = 10;
        var typeFlag = localStorage.type;
        let {request,dataType,moneyList,editFlag,sumData} = this.state;
        let createBtn;
        if(editFlag == 0){
            createBtn = "";            
        }else if(editFlag == 1){
            createBtn = (<RUI.Button className = "primary" onClick = {this.updateData.bind(this)} >提交</RUI.Button>);
        }else{
            createBtn = (<RUI.Button className = "primary" onClick = {this.createData.bind(this)} >创建</RUI.Button>);
        }
       
        return(
            
            <Layout currentKey = {currentKey+""} defaultOpen={openKey+""} bread = {["结算管理","送货单管理"]}>
                <div className="m-b-20 not-print">
                    <RUI.Button className = {typeFlag==1?"primary next-btn order_active":"primary next-btn "}
                                        onClick = {this.typeSwitch.bind(this,1)}>送货单</RUI.Button>
                    <RUI.Button className = {typeFlag==1?"primary next-btn order_active":"primary next-btn"}
                                        onClick = {this.typeSwitch.bind(this,0)}>收据</RUI.Button>
                </div>
                <div className="receipt-content">
                    <div className="receipt-title">
                        {dataType == 0 ? (<p>舞思韵送货单</p>) : (<p>舞思韵收款收据</p>)}
                        <span className="receipt-num">{"NO."+request.orderNo}</span>
                    </div>
                    {   dataType == 1?
                        (<div className="receipt-top">
                            <label>客户名称</label>
                            <input disabled ={editFlag ==0?"disabled":""} className="lab" type="text" value={request.customerName} onChange={this.handleInput.bind(this,"customerName")}/>
                            <ul className="receipt-date">
                                <li>{sumData.times[0]}年</li>
                                <li>{sumData.times[1]}月</li>
                                <li>{sumData.times[2]}日</li>
                            </ul>
                        </div>):(
                            <div className="receipt-top-0">
                            <ul className="receipt-date">
                                <li>{sumData.times[0]}年</li>
                                <li>{sumData.times[1]}月</li>
                                <li>{sumData.times[2]}日</li>
                            </ul>
                            <ul className="user-info">
                                <li>
                                    <label>订单名称</label>
                                    <input disabled ={editFlag ==0?"disabled":""} className="lab"  type="text" value={request.orderName} onChange={this.handleInput.bind(this,"orderName")}/> 
                                </li>
                                <li className="user-info-item">
                                    <label>客户名称</label>
                                    <input disabled ={editFlag ==0?"disabled":""}  type="text" value={request.customerName} onChange={this.handleInput.bind(this,"customerName")}/> 
                                </li>
                                <li className="user-info-item">
                                    <label>客户电话</label>
                                    <input disabled ={editFlag ==0?"disabled":""}  type="text" value={request.customerPhone} onChange={this.handleInput.bind(this,"customerPhone")}/> 
                                </li>
                                <li>
                                    <label>收货地址</label>
                                    <input disabled ={editFlag ==0?"disabled":""} className="lab"  type="text" value={request.deliveryAddress} onChange={this.handleInput.bind(this,"deliveryAddress")}/> 
                                </li>
                            </ul>
                        </div>
                        )

                    }

                    <div className="receipt-body">
                        <div  className={dataType == 1?"receipt-left receipt-item":"receipt-left-0 receipt-item"}>                   
        {dataType == 0?(<table>
                            <thead>
                                <tr>
                                    <td>商品名称</td>
                                    <td>货号</td>
                                    <td>数量</td>
                                </tr>
                            </thead>
                            <tbody>
                                {request.products.map((someItem,someIndex)=>{
                                    return(
                                        <tr key={someIndex}>
                                            <td>
                                                <input disabled ={editFlag ==0?"disabled":""} type="text" value={someItem.productName} onChange={this.listChange.bind(this,"productName",someIndex)}/>
                                            </td>
                                            <td>
                                                <input disabled ={editFlag ==0?"disabled":""} type="text" value={someItem.artNo} onChange={this.listChange.bind(this,"artNo",someIndex)}/>
                                            </td> 
                                            <td>
                                                <input disabled ={editFlag ==0?"disabled":""} type="text" value={someItem.productNum} onChange={this.listChange.bind(this,"productNum",someIndex)}/>
                                            </td>                                   
                                        </tr>
                                    )
                                })                               
                            }

                            </tbody>
                        </table>
                        ):(
                        <table>
                            <thead>
                                <tr>
                                    <td>商品名称</td>
                                    <td>货号</td>
                                    <td>数量</td>
                                    <td>单价</td>
                                    <td>合计</td>
                                </tr>
                            </thead>
                            <tbody>
                                {request.products.map((someItem,someIndex)=>{
                                    return(
                                        <tr key={someIndex}>
                                            <td>
                                                <input disabled ={editFlag ==0?"disabled":""} type="text" value={someItem.productName} onChange={this.listChange.bind(this,"productName",someIndex)}/>
                                            </td>
                                            <td>
                                                <input disabled ={editFlag ==0?"disabled":""} type="text" value={someItem.artNo} onChange={this.listChange.bind(this,"artNo",someIndex)}/>
                                            </td> 
                                            <td>
                                                <input disabled ={editFlag ==0?"disabled":""} type="text" value={someItem.productNum} onChange={this.listChange.bind(this,"productNum",someIndex)}/>
                                            </td>
                                            <td>
                                                <input disabled ={editFlag ==0?"disabled":""} type="text" value={someItem.productPrice} onChange={this.listChange.bind(this,"productPrice",someIndex)}/>
                                            </td>  
                                            <td>
                                                <input disabled ={editFlag ==0?"disabled":""} type="text" value={someItem.productPrice*someItem.productNum}/>
                                            </td>                                     
                                        </tr>
                                    )
                                })                               
                            }
                            </tbody>
                        </table>)
                        }
                        <p className="receipt-total">合计{request.totalNum}</p>
                    </div>
                    { dataType ==1 &&
                    <div className="receipt-center receipt-item">
                        <p className="receipt-extra">金额</p>
                        <table>
                            <thead>
                                <tr>
                                    <td>百</td>
                                    <td>十</td>
                                    <td>万</td>
                                    <td>千</td>
                                    <td>百</td>
                                    <td>十</td>
                                    <td>元</td>
                                    <td>角</td>
                                    <td>分</td>
                                </tr>
                            </thead>
                            <tbody>
                               { sumData.moneyList.map((someItem,someIndex)=>{
                                   return(
                                <tr>
                                    <td>{someItem.b}</td>
                                    <td>{someItem.m}</td>
                                    <td>{someItem.w}</td>
                                    <td>{someItem.q}</td>
                                    <td>{someItem.h}</td>
                                    <td>{someItem.t}</td>
                                    <td>{someItem.y}</td>
                                    <td>{someItem.j}</td>
                                    <td>{someItem.f}</td>
                                </tr>
                                )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                    }
                <div className={dataType == 1?"receipt-right receipt-item":"receipt-right-0 receipt-item"}>
                    <p className="receipt-remark">备注</p>
                    <div className="receipt-remark-content">
                        <textarea ></textarea>
                    </div>
                </div>
            </div>
            { dataType == 1 &&
            <div className="receipt-bottom">
                <div className="receipt-item receipt-bottom-total">
                    <ul>
                        <li>人民币</li>
                        <li>佰</li>
                        <li>拾</li>
                        <li>万</li>
                        <li>仟</li>
                        <li>佰</li>
                        <li>拾</li>
                        <li>元</li>
                        <li>角</li>
                        <li>分</li>
                    </ul>
                </div>
                <div className="receipt-item receipt-bottom-money">
                    <ul>
                        <li>¥</li>
                        <li></li>
                    </ul>
                </div>
            </div>
            }
            <div className="receipt-contact">
                <span>厂址：四川省德阳市绵竹市齐天镇浦柳村</span>
                <span className="receipt-phone"> 联系电话：13548058261</span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;15828401115</span>
            </div>
            <div className="receipt-seal">
                <span>单位盖章</span>
                <span>开票人：</span>
                <span>送货人：</span>
            </div>
        </div>
        <div className="m-t-30 not-print">
            <RUI.Button className = "cancel-btn" onClick = {()=>{history.go(-1)}}>取消</RUI.Button>
            <RUI.Button className = "primary" onClick = {this.submit} >打印</RUI.Button>
            {createBtn}
        </div>
    </Layout>
        )
    }
}

export default OrderForm;