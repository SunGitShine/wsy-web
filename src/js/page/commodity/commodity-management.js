/**
 * Created by Administrator on 2017-2-13.
 */
import Layout from "../../components/layout";
import Pager from "../../components/pager";
import Pubsub from "../../util/pubsub";
import {hashHistory,Link } from 'react-router';
import "../../../css/page/department-management.scss";
import {classifyList} from "../../components/memberAjax";
const sexArr = ["","男","女","通用"];
const crowdArr = ["","成人","儿童","通用"];
const Depart = React.createClass({
    getInitialState(){
        return{
            listRequest:{
                classifyId : "",
                name : "",
            },
            pager:{
                currentPage:1,
                pageSize:10,
                totalNum:0,
            },
            selectValue:[{key:"全部",value:""}],
            list:[],
        }
    },
    componentDidMount(){
        this.getList();
        this.classifyList();
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
    getList(pageNo=1){
        let _this = this;
        let {pager,listRequest} = this.state;
        $.ajax({
            url:commonBaseUrl+"/product/findByPage.htm",
            type:"get",
            dataType:"json",
            data:{d:JSON.stringify(listRequest),pageNo:pageNo,pageSize:10},
            success(data){
                if(data.success){
                    pager.currentPage = pageNo;
                    pager.totalNum = data.resultMap.iTotalDisplayRecords;
                    _this.setState({
                        list : data.resultMap.rows,
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
    add(){
        hashHistory.push("/commodity/add/")
    },
    delete(productId){
        let _this = this;
        RUI.DialogManager.confirm({
            message:'您确定要删除吗？?',
            title:'删除成员',
            submit:function() {
                $.ajax({
                    url:commonBaseUrl+"/product/delete.htm",
                    type:"post",
                    dataType:"json",
                    data:{d:JSON.stringify({productId})},
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
    applySex(type){
        return sexArr[type];
    },
    applyCrowd(type){
        return crowdArr[type];
    },
    select(e){
        let {listRequest} = this.state;
        listRequest.classifyId = e.value;
        this.setState({listRequest},()=>{
            this.getList();
        });
    },
    search(){
        this.getList();
    },
    inputChange(e){
        let {listRequest} = this.state;
        listRequest.name = e.target.value;
        this.setState({listRequest});
    },
    render(){
        let {list,pager,selectValue} = this.state;
        return(
            <Layout currentKey = "5" defaultOpen={"1"} bread = {["产品库存","产品管理"]}>
                <div className="depart-content">
                    <div className="tbn-div">
                        <label htmlFor="">分类：</label>
                        <RUI.Select
                            data={selectValue}
                            value={{key:'全部',value:""}}
                            stuff={true}
                            callback = {this.select}
                            className="rui-theme-1 w-120">
                        </RUI.Select>
                        <label htmlFor="">名称：</label>
                        <RUI.Input onChange = {this.inputChange} className = "w-150"></RUI.Input>
                        <RUI.Button className="primary" onClick = {this.search}>搜索</RUI.Button>
                        <RUI.Button className="add-btn primary" onClick = {this.add}>添加</RUI.Button>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <td>产品图片</td>
                            <td>产品名称</td>
                            <td>所属分类</td>
                            <td>适用性别</td>
                            <td>适用人群</td>
                            <td>鞋码区间</td>
                            <td>操作方式</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            list.length>0 && list.map((item,index)=>{
                                return(
                                    <tr key = {index}>
                                        <td>
                                            <img className = "commodity-img" src={item.url} alt=""/>
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.classifyName}</td>
                                        <td>{this.applySex(item.applySex)}</td>
                                        <td>{this.applyCrowd(item.applyCrowd)}</td>
                                        <td>{item.minCode+ "~"+item.maxCode}</td>
                                        <td>
                                            <Link to={"/commodity/add/?id="+item.id} className="handle-a">修改</Link>
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
                    <Pager onPage ={this.getList} {...pager}/>
                </div>
            </Layout>
        )
    }
});
module.exports = Depart;