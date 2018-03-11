/**
 * Created by Administrator on 2017-3-21.
 */
import "../../../css/page/stock_query.scss";
import {hashHistory} from "react-router"
export default class Query extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            list:[{},{},{},{},{},{},{},{},]
        };
      }
    handleList(i){
        hashHistory.push("/stock/query/detail")
    }
    render(){
        let {list} = this.state;
        return(
            <div>
                <RUI.Select value={{key:'全部',value:''}}
                            stuff={true}
                            className="rui-theme-1 w-100"
                            />
                <ul className="clearfix">
                    {
                        list.map((item,index)=>{
                            return(
                                <li className="stock-list" key = {index} onClick = {this.handleList.bind(this,item)}>
                                    <img className="query-img" src={require("../../../images/yeoman.png")} alt=""/>
                                    <p>红色11 骚等我</p>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}