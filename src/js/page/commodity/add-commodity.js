/**
 * Created by luojie on 2017/2/18 11:17.
 */

import Layout from "../../components/layout";
import LabelInput from "../../components/label-input";
import LabelSelect from "../../components/label-select";
import Upload from "../../components/upload";
import {classifyList} from "../../components/memberAjax";
import Pubsub from "../../util/pubsub";
import {hashHistory } from 'react-router';
import "../../../css/page/add-commodity.scss";

const sexArr = ["","男","女","通用"];
const crowdArr = ["","成人","儿童","通用"];

const Add = React.createClass({
    timer :"",
    getInitialState(){
        return{
            imgUrl:"",
            visible : false,
            request :{
                name : "",
                url : "",
                colour : "",
                classifyId : "",
                classifyName : "",
                applySex : 1,
                applyCrowd : 1,
                maxCode : "",
                minCode : "",
                vampMaterial : "",
                soleMaterial : "",
                flowerType : "",
                remark : "",
            },
            selectValue:[{key:"全部",value:""}],
            defaultSelect:{key:"全部",value:""},
            sexSelect:{key:"男",value:"1"},
            crowdSelect:{key:"成人",value:"1"},
            fileList:[],
            defaultFileList : [],
        }
    },
    componentDidMount(){
        let query = this.props.location.query;
        if(query.id){
            this.setState({id:query.id});
            this.getDetail(query.id);
        }
        this.classifyList();
    },
    componentWillUnmount(){
    },
    getDetail(productId){
        let _this = this;
        let {defaultSelect,sexSelect,crowdSelect,defaultFileList} = this.state;
        $.ajax({
           url:commonBaseUrl + "/product/findById.htm",
            type:"get",
            dataType:"json",
            data:{d:JSON.stringify({productId})},
            success(data){
                if(data.success){
                    let detail = data.resultMap.productDO;
                    defaultSelect = {key:detail.classifyName,value:detail.classifyId};
                    sexSelect = {key:_this.applySex(detail.applySex),value:detail.applySex};
                    crowdSelect = {key:_this.applyCrowd(detail.applyCrowd),value:detail.applyCrowd};
                    _this.setState({request:data.resultMap.productDO,defaultSelect,sexSelect,crowdSelect,imgUrl:detail.url});
                }else{
                    Pubsub.publish("showMsg",["wrong",data.description]);
                }
            }

        });
    },
    applySex(type){
        return sexArr[type];
    },
    applyCrowd(type){
        return crowdArr[type];
    },
    classifyList(){
        let _this = this;
        let {selectValue} = this.state;
        classifyList().then((result)=>{
            result.rows && result.rows.map((item)=>{
                selectValue.push({key:item.classifyName,value:item.id})
            });
            _this.setState({selectValue});
        });
    },
    changeInput(type,e){
        let {request} = this.state;
        request[type] = e.target.value;
    },
    submit(){
        let _this =this;
        if(!_this.checkValid()){
            return false;
        }
        let query = this.props.location.query;
        let {request,imgUrl} = this.state;
        request.url = request.url|| imgUrl;
        let url = query.id?"/product/update.htm":"/product/add.htm";
        request.id = query.id;
        $.ajax({
           url : commonBaseUrl + url,
            type:"post",
            dataType:"json",
            data:{d:JSON.stringify(request)},
            success(data){
                if(data.success){
                    Pubsub.publish("showMsg",["success",query.id?"修改成功":"添加成功"]);
                    _this.timer = setTimeout(()=>{
                        hashHistory.push("/commodity");
                    },2000)
                }else{
                    Pubsub.publish("showMsg",["wrong",data.description]);
                }
            }
        });
    },
    checkValid(){
        let {request,imgUrl} = this.state;
        let flag = true;
        let msg = "";
        if(!imgUrl){
            msg = "请上传产品图片";
            flag = false;
        }else if(!request.name){
            msg = "请输入产品名称";
            flag = false;
        }else if(!request.colour){
            msg = "请输入产品颜色";
            flag = false;
        }else if(!request.classifyId){
            msg = "请选择产品分类";
            flag = false;
        }else if(!request.minCode || !request.maxCode){
            msg = "请输入鞋码区间";
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
    classifySelect(e){
        let {request} = this.state;
        request.classifyName = e.key;
        request.classifyId = e.value;
        this.setState({request});
    },
    applySelect(type,e){
        let {request} = this.state;
        request[type] = e.value;
        this.setState({request});
    },
    preview(file){
        console.log(file);

    },
    uploadCallback(imgUrl){
        this.setState({imgUrl});
    },
   render(){
       let {imgUrl,request,selectValue,defaultSelect,sexSelect,crowdSelect,id,defaultFileList} = this.state;
       let query = this.props.location.query;

       return(
           <Layout currentKey = {"5"} defaultOpen={"1"} bread = {["产品库存","产品管理"]}>
                <div className="add-commodity">
                    <h3>{id?"修改商品":"添加商品"}</h3>
                    <div className = "add-content ">
                        <div className = "clearfix">
                            <label htmlFor="" className = "left-label left"><i className="require">*</i>产品图片</label>
                            <Upload callback = {this.uploadCallback} uploadBtn = "p-l-100" onClick = {this.clickImg}  url = {imgUrl}/>
                        </div>
                        <LabelInput value = {request.name} onChange = {this.changeInput.bind(this,"name")}  require = {true} label = "产品名称"/>
                        <LabelInput value = {request.colour} onChange = {this.changeInput.bind(this,"colour")}  require = {true} label = "产品颜色"/>
                        <LabelSelect
                            require = {true}
                            label = "产品分类"
                            data = {selectValue}
                            callback = {this.classifySelect}
                            default = {defaultSelect}/>
                        <LabelSelect
                            require = {true}
                            label = "适用性别"
                            callback = {this.applySelect.bind(this,"applySex")}
                            data = {[{key:"男",value:1},{key:"女",value:2},{key:"通用",value:3}]}
                            default = {sexSelect}/>
                        <LabelSelect
                            require = {true}
                            label = "适用人群"
                            callback = {this.applySelect.bind(this,"applyCrowd")}
                            data = {[{key:"成人",value:1},{key:"儿童",value:2},{key:"通用",value:3}]}
                            default = {crowdSelect}/>
                        <div className="m-t-10">
                            <label className="left-label ">
                                <i className="require">*</i>
                                <span>鞋码区间</span>
                            </label>
                            <span>
                                    <RUI.Input value = {request.minCode}
                                               disabled = {query.id?true:false}
                                               onChange = {this.changeInput.bind(this,"minCode")}
                                               className="w-50"/>
                                    <span>----</span>
                                    <RUI.Input value = {request.maxCode}
                                               disabled = {query.id?true:false}
                                               onChange = {this.changeInput.bind(this,"maxCode")}
                                               className="w-50"/>
                                    <span>码</span>
                            </span>
                        </div>
                        <LabelInput value = {request.vampMaterial} onChange = {this.changeInput.bind(this,"vampMaterial")}  label = "鞋面材质"/>
                        <LabelInput value = {request.soleMaterial} onChange = {this.changeInput.bind(this,"soleMaterial")}  label = "鞋底材质"/>
                        <LabelInput value = {request.flowerType} onChange = {this.changeInput.bind(this,"flowerType")}   label = "花型"/>
                        <LabelInput value = {request.remark} onChange = {this.changeInput.bind(this,"remark")}  label = "备注"/>
                    </div>
                    <RUI.Button className="add-cancel-btn" onClick = {()=>{history.go(-1)}}>取消</RUI.Button>
                    <RUI.Button className="primary" onClick = {this.submit} ref = "submit">确定</RUI.Button>
                </div>

           </Layout>
       )
   }
});
module.exports = Add;