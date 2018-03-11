/**
 * Created by Administrator on 2017-2-21.
 */
import Layout from "../../components/layout";
import LabelInput from "../../components/label-input";
import LabelSelect from "../../components/label-select";
import "../../../css/page/department-management.scss";
const Detail = React.createClass({
    getInitialState(){
        return{
            title:"添加成员",
        }
    },
    render(){
        return(
            <Layout currentKey = "6" defaultOpen={"1"} bread = {["产品库存","库存管理"]}>
                <div className="depart-content">
                    <div className="tbn-div clearfix">
                        <label htmlFor="" className="left">库存操作：</label>
                        <RUI.Select
                            data={[{key:'全部',value:'1'}, {key:'出库',value:'2'}, {key:'入库',value:'3'}]}
                            value={{key:'全部',value:'1'}}
                            stuff={true}
                            className="rui-theme-1 w-120 left">
                        </RUI.Select>
                        <label htmlFor="" className="left">操作时间：</label>
                        <RUI.DatePicker max = {Date.now()}  className = "left" startValue={''} endValue={''} formatter={new RUI.DateFormatter("Y-m-d")} range={true} onChange={this.datePickerChange} />
                        <label htmlFor="" className = "left">操作人：</label>
                        <RUI.Input className = "w-150 left"></RUI.Input>
                        <RUI.Button className="primary">搜索</RUI.Button>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <td>库存操作</td>
                            <td>操作日期</td>
                            <td>操作人</td>
                            <td>操作数量</td>
                            <td>库存总量</td>
                            <td>备注</td>
                            <td>操作方式</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>01</td>
                            <td>张三</td>
                            <td>13568763633</td>
                            <td>2017-02-14 22:10:22</td>
                            <td>机车部</td>
                            <td>备注</td>
                            <td>
                                <a href="javascript:;" className="handle-a" onClick = {this.detail}>明细</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="footer">
                        <div className="right">
                            <RUI.Pagination pageSize={10} currentPage={1} totalNum={100} onPage={this.doPage} />
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
});
module.exports = Detail;