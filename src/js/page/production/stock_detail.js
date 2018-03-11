/**
 * Created by Administrator on 2017-3-21.
 */
import "../../../css/page/stock_query.scss";

export default class Detail extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
      }
    render(){
        return(
            <div>
                <div className="">
                    <div className="info">
                        <label htmlFor="" >产品信息：</label>
                        <span>111双</span>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <td>鞋码</td>
                            <td>库存</td>
                            <td>库存区间</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>11</td>
                            <td>22</td>
                            <td>33</td>
                        </tr>
                        <tr>
                            <td>11</td>
                            <td>22</td>
                            <td>33</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}