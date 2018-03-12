import '../../../css/page/order_form.css';
import Layout from "../../components/layout";
import {hashHistory,Link } from 'react-router';
import Pubsub from "../../util/pubsub";
import moment from 'moment';
class OrderForm extends React.Component{
    constructor(props){
        super(props)
        let opType = this.props.location.query.opType;
        opType = parseInt(opType);
        this.state = {
            roleFlag:localStorage.type,
            dataType:0,
            editFlag:opType,
            request:{
                orderName:"",
                customerName:"",
                customerPhone:"",
                deliveryAddress:"",
                orderNo:"",
                totalMoney:"",
                totalMoneyB:"",
                totalNum:"",
                products:[
                    {
                        productName:"",
                        productNum:"",
                        artNo:"",
                        totalMoney:"",
                        productPrice:""
                    }
                ]
            },
            sumData:{
                times:[],
                sumMoney:"",
                moneyList:[
                    ["","","","","","","","",""],
                    ["","","","","","","","",""]
                ],
                createBy:""
            }
        }
        this.addSonItem = this.addSonItem.bind(this);
        
    }    
    componentWillMount(){
        let {editFlag} = this.state;
        if(editFlag !== 2){
            this.getorderFormList();
        }     
    }
    componentDidMount(){
        let {dataType }= this.state;
        let h;
        if(dataType == 0){
            h = $(".receipt-left-0").height()-39;
        }else{
            h = $(".receipt-left").height()-39;
        }
        $(".receipt-remark-content").height(h); 
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
        sumData.moneyList = [];
        $.ajax({
            url:commonBaseUrl+"/balance/getReceipt.htm",
            type:"get",
            dataType:"json",
            data:{d:JSON.stringify({"orderNo":id})},
            success(data){
                if(data.success){
                    let mLenth = 9;
                    request.customerName = data.resultMap.receiptDO.customerName;
                    request.customerPhone = data.resultMap.receiptDO.customerPhone;
                    request.deliveryAddress = data.resultMap.receiptDO.deliveryAddress;
                    request.orderName = data.resultMap.receiptDO.orderName;
                    request.orderNo = data.resultMap.receiptDO.orderNo;
                    request.totalNum = data.resultMap.receiptDO.totalNum;
                    request.products = data.resultMap.receiptDO.products;
                    request.totalMoney = data.resultMap.receiptDO.totalMoney;
                    for(let i = 0 ;i<request.products.length;i++){
                        if(request.products[i].totalMoney == null){
                            sumData.moneyList.push("");
                        }else{
                            sumData.moneyList.push(request.products[i].totalMoney);
                        }                     
                        request.products[i].productPrice = request.products[i].productPrice/100;
                        request.products[i].productNum = request.products[i].productNum+"双";
                        // request.products[i].totalMoney = request.products[i].totalMoney/100 ;
                    }
                    if(data.resultMap.receiptDO.createReceiptTime == null){
                        sumData.times = ""
                    }else{
                        let time = moment(data.resultMap.receiptDO.createReceiptTime);
                        sumData.times=[time.years(),time.months()+1,time.dates()];
                    }
                    sumData.createBy = data.resultMap.receiptDO.createUser;
                    for(let j = 0;j<sumData.moneyList.length;j++){
                        var lenth = (sumData.moneyList[j]+"").length;
                        var mArr= [];
                        var nArr= [];
                        for(var k = 0;k<(mLenth-lenth);k++){
                            mArr.push("");
                        }
                        nArr = (sumData.moneyList[j]+"").split("");
                        mArr = mArr.concat(nArr);
                        sumData.moneyList[j] = mArr;
                    }
                    var tLenth = (request.totalMoney+"").length;
                    var tArr = [];
                    for(let n = 0;n<(mLenth-tLenth);n++){
                        tArr.push("");
                    }
                    tArr = tArr.concat((request.totalMoney+"").split(""));
                    for(let m = 0;m < tArr.length;m++){
                        if(tArr[m]==""){
                            tArr[m] = "-";
                        }else if(tArr[m] == "0"){
                            tArr[m] = "零";
                        }else if(tArr[m]=="1"){
                            tArr[m] = "壹";    
                        }else if(tArr[m]=="2"){
                            tArr[m] = "贰";    
                        }else if(tArr[m]=="3"){
                            tArr[m] = "叁";   
                        }else if(tArr[m]=="4"){
                            tArr[m] = "肆";    
                        }else if(tArr[m]=="5"){
                            tArr[m] = "伍";    
                        }else if(tArr[m]=="6"){
                            tArr[m] = "陆";    
                        }else if(tArr[m]=="7"){
                            tArr[m] = "柒";    
                        }else if(tArr[m]=="8"){
                            tArr[m] = "捌";    
                        }else if(tArr[m]=="9"){
                            tArr[m] = "玖";    
                        }

                    }
                    request.totalMoneyB = tArr;
                    request.totalMoney = request.totalMoney/100;
                    sumData.moneyList.push("");
                    _this.setState({});
                }else{

                }
            }
        });

    }
    componentDidUpdate(){
        let {dataType }= this.state;
        let h;
        if(dataType == 0){
            h = $(".receipt-left-0").height()-39;
        }else{
            h = $(".receipt-left").height()-39;
        }
        $(".receipt-remark-content").height(h);
    }
    submit(){
        let num = this.props.location.query.id;
        window.print();
        $.ajax({
            url:commonBaseUrl+"/balance/print.htm",
            type:"get",
            dataType:"json",
            data:{d:JSON.stringify({orderNo:num})},
            success:function(results){
                if(results.success){
                    // Pubsub.publish("showMsg",["success","操作成功"]);
                }
            }
        })
    }
    //修改单据
    updateData(){
        let {request} = this.state;
        let url ="/balance/editReceipt.htm";
        let phReg =/^1[34578]\d{9}$/;
        let arr = [];
        for(let i = 0;i<request.products.length;i++){
            if(request.products[i].productName !== "" && request.products[i].productNum !== ""){
                request.products[i].productPrice = parseInt(request.products[i].productPrice)*100;
                request.products[i].productNum = (request.products[i].productNum+"").replace(/双/g,"");
                arr.push(request.products[i]);
            }else if(request.products[i].productName == "" || request.products[i].productNum == ""){
                Pubsub.publish("showMsg",["wrong","名称和数量为必填项"]);
                return false;
            }
        }
        request.products = arr;
        if(!phReg.test (request.customerPhone)){
            Pubsub.publish("showMsg",["wrong","电话格式不正确"]);
            return false;
        }
        $.post(commonBaseUrl+url,{d:JSON.stringify(request)},function (results) {
            if(results.success){
                Pubsub.publish("showMsg",["success","操作成功"]);               
                hashHistory.push("/deliverynote");
            }else{
                Pubsub.publish("showMsg",["wrong","操作失败"]);
            }
           
        })
    }
    //创建送货单或者收据
    createData(){
        let {request} = this.state;
        let url = "/balance/creatReceipt.htm";
        let phReg =/^1[34578]\d{9}$/;
        let arr = [];
        for(let i = 0;i<request.products.length;i++){
            if(request.products[i].productName !== "" && request.products[i].productNum !== ""){
                request.products[i].productPrice = parseInt(request.products[i].productPrice)*100;
                request.products[i].productNum = (request.products[i].productNum+"").replace(/双/g,"");
                arr.push(request.products[i]);
            }else if(request.products[i].productName == "" || request.products[i].productNum == ""){
                Pubsub.publish("showMsg",["wrong","名称和数量为必填项"]);
                return false;
            }
        }
        request.products = arr;
        if(!phReg.test (request.customerPhone)){
            Pubsub.publish("showMsg",["wrong","电话格式不正确"]);
            return false;
        }
        $.post(commonBaseUrl+url,{d:JSON.stringify(request)},function (results) {
            if(results.success){
                Pubsub.publish("showMsg",["success","操作成功"]);
                hashHistory.push("/deliverynote");
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
    listChange(type,someIndex,e){
        let {request} = this.state;
        let vl = e.target.value;
        if(type == "productNum"){
            vl = (vl+"").replace(/双/g,"");
        }
        request.products[someIndex][type] = vl; 
        this.setState({});
    }
    addSonItem(){
        let {sumData,request} = this.state;
        request.products.push({
            productName:"",
            productNum:"",
            artNo:"",
            totalMoney:"",
            productPrice:""
        });
        sumData.moneyList.push("");
        this.setState({sumData,request});
    }
    removeSonItem(index){
        let {sumData,request} = this.state;
        request.products.splice(index,1);
        sumData.moneyList.splice(index,1);
        this.setState({sumData,request});
    }
    // 发送短信给客户
    senMsg(){
        let num = this.props.location.query.id;
        $.ajax({
            url:commonBaseUrl+"/balance/sendMsg.htm",
            type:"get",
            dataType:"json",
            data:{d:JSON.stringify({orderNo:num})},
            success:function(results){
                if(results.success){
                    Pubsub.publish("showMsg",["success","发送成功"]);
                }
            }
        })
    }
    render(){
        var openKey = 4;
        var currentKey = 10;
        var typeFlag = localStorage.type;
        let {request,dataType,editFlag,sumData,roleFlag} = this.state;
        let orderNo = request.orderNo;
        let createBtn;
        if(editFlag == 0){
            createBtn = "";            
        }else if(editFlag == 1){
            createBtn = (<RUI.Button className = "primary" onClick = {this.updateData.bind(this)} >提交</RUI.Button>);
        }else{
            createBtn = (<RUI.Button className = "primary" onClick = {this.createData.bind(this)} >创建</RUI.Button>);
        }
        let fontSize = "18px;";
        return(
            
            <Layout currentKey = "10" defaultOpen={"3"} bread = {["结算管理","送货单管理"]}>
               
                <div className="m-b-20 no-print center-btn">
                    <RUI.Button className = {dataType ==1?"primary next-btn":"primary next-btn order_active"}
                                        onClick = {this.typeSwitch.bind(this,1)}>送货单</RUI.Button>
                   { roleFlag == 1 &&<RUI.Button className = {dataType ==1?"primary next-btn order_active":"primary next-btn "}
                                        onClick = {this.typeSwitch.bind(this,0)}>收据</RUI.Button>}
                </div>
                <div id="printPage" className={editFlag ==0?"receipt-content active":"receipt-content"}>
                    <div className="receipt-title">
                        {dataType == 0 ? (<p>舞思韵送货单</p>) : (<p>舞思韵收款收据</p>)}
                        <span className="receipt-num"><span style={{fontSize:18}}>NO.</span>{request.orderNo}</span>
                    </div>
                    {   dataType == 1?
                        (<div className="receipt-top">
                            <label>客户名称：</label>
                            <input disabled ={editFlag ==0?"disabled":""} className="lab" type="text" value={request.customerName} onChange={this.handleInput.bind(this,"customerName")}/>
                            <ul className="receipt-date">
                                <li>{sumData.times[0]}&nbsp;&nbsp;&nbsp;&nbsp;年</li>
                                <li>{sumData.times[1]}&nbsp;&nbsp;&nbsp;&nbsp;月</li>
                                <li>{sumData.times[2]}&nbsp;&nbsp;&nbsp;&nbsp;日</li>
                            </ul>
                        </div>):(
                            <div className="receipt-top-0">
                            <ul className="receipt-date">
                                <li>{sumData.times[0]}&nbsp;&nbsp;&nbsp;&nbsp;年</li>
                                <li>{sumData.times[1]}&nbsp;&nbsp;&nbsp;&nbsp;月</li>
                                <li>{sumData.times[2]}&nbsp;&nbsp;&nbsp;&nbsp;日</li>
                            </ul>
                            <ul className="user-info">
                                {editFlag ==0?"":<li>
                                    <label>订单名称：</label>
                                    <input disabled ={editFlag ==0?"disabled":""} className="lab"  type="text" value={request.orderName} onChange={this.handleInput.bind(this,"orderName")}/> 
                                </li>
                                }
                                <li className="user-info-item">
                                    <label>客户名称：</label>
                                    <input disabled ={editFlag ==0?"disabled":""}  type="text" value={request.customerName} onChange={this.handleInput.bind(this,"customerName")}/> 
                                </li>
                                <li className="user-info-item">
                                    <label>客户电话：</label>
                                    <input disabled ={editFlag ==0?"disabled":""}  type="text" value={request.customerPhone} onChange={this.handleInput.bind(this,"customerPhone")}/> 
                                </li>
                                <li>
                                    <label>收货地址：</label>
                                    <input disabled ={editFlag ==0?"disabled":""} className="lab"  type="text" value={request.deliveryAddress} onChange={this.handleInput.bind(this,"deliveryAddress")}/> 
                                </li>
                            </ul>
                        </div>
                        )

                    }

                    <div className={editFlag ==0?"receipt-body active":"receipt-body"}>
                        <div  className={dataType == 1?"receipt-left receipt-item":"receipt-left-0 receipt-item"}>                   
        {dataType == 0?(<table>
                            <thead>
                                <tr>
                                    <td>商品名称</td>
                                    <td>货号</td>
                                    <td>数量</td>
                                    {editFlag ==0?"":<td style={{width:100}}><RUI.Button className="primary" onClick= {this.addSonItem}>添加一行</RUI.Button></td>}
                                </tr>
                            </thead>
                            <tbody>
                                {request.products.map((someItem,someIndex)=>{
                                    return(
                                        <tr key={someIndex}>
                                            <td>
                                                <input  disabled ={editFlag ==0?"disabled":""} type="text" value={someItem.productName} onChange={this.listChange.bind(this,"productName",someIndex)}/>
                                            </td>
                                            <td>
                                                <input disabled ={editFlag ==0?"disabled":""} type="text" value={someItem.artNo} onChange={this.listChange.bind(this,"artNo",someIndex)}/>
                                            </td> 
                                            <td>
                                                <input disabled ={editFlag ==0?"disabled":""} type="text" value={someItem.productNum} onChange={this.listChange.bind(this,"productNum",someIndex)}/>
                                            </td>
                                            {editFlag ==0?"":<td><RUI.Button onClick={this.removeSonItem.bind(this,someIndex)}>删除</RUI.Button></td>}                                  
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
                                    {editFlag ==0?"":<td style={{width:100}}><RUI.Button className="primary" onClick= {this.addSonItem}>添加一行</RUI.Button></td>}
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
                                            {editFlag ==0?"":<td><RUI.Button onClick={this.removeSonItem.bind(this,someIndex)}>删除</RUI.Button></td>}                                       
                                        </tr>
                                    )
                                })                               
                            }
                            </tbody>
                        </table>)
                        }
                        <p className="receipt-total">合<span></span>计<span></span>{request.totalNum+"双"}</p>
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
                                        <tr key={someIndex}>
                                            <td>{someItem[0]}</td>
                                            <td>{someItem[1]}</td>
                                            <td>{someItem[2]}</td>
                                            <td>{someItem[3]}</td>
                                            <td>{someItem[4]}</td>
                                            <td>{someItem[5]}</td>
                                            <td>{someItem[6]}</td>
                                            <td>{someItem[7]}</td>
                                            <td>{someItem[8]}</td>
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
                        <li><span className="c-gray">{request.totalMoneyB[0]}</span>&nbsp;&nbsp;佰</li>
                        <li><span className="c-gray">{request.totalMoneyB[1]}</span>&nbsp;&nbsp;拾</li>
                        <li><span className="c-gray">{request.totalMoneyB[2]}</span>&nbsp;&nbsp;万</li>
                        <li><span className="c-gray">{request.totalMoneyB[3]}</span>&nbsp;&nbsp;仟</li>
                        <li><span className="c-gray">{request.totalMoneyB[4]}</span>&nbsp;&nbsp;佰</li>
                        <li><span className="c-gray">{request.totalMoneyB[5]}</span>&nbsp;&nbsp;拾</li>
                        <li><span className="c-gray">{request.totalMoneyB[6]}</span>&nbsp;&nbsp;元</li>
                        <li><span className="c-gray">{request.totalMoneyB[7]}</span>&nbsp;&nbsp;角</li>
                        <li><span className="c-gray">{request.totalMoneyB[8]}</span>&nbsp;&nbsp;分</li>
                    </ul>
                </div>
                <div className="receipt-item receipt-bottom-money">
                    <ul>
                        <li>¥</li>
                        <li className="c-gray">{request.totalMoney}</li>
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
                <span>开票人：{sumData.createBy}</span>
                <span>送货人：</span>
            </div>
        </div>
        <div className="m-t-30 no-print center-btn">
            <RUI.Button className = "cancel-btn" onClick = {()=>{history.go(-1)}}>取消</RUI.Button>
            {editFlag ==0 &&<RUI.Button className = "primary" onClick = {this.submit.bind(this)} >打印</RUI.Button>}
            {createBtn}
            {dataType == 1 &&<RUI.Button className = "primary" onClick = {this.senMsg.bind(this)} >短信通知客户</RUI.Button>}
        </div>        
    </Layout>
        )
    }
}

export default OrderForm;