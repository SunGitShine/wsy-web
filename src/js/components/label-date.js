/**
 * Created by Administrator on 2017-2-19.
 */
import DatePicker  from 'antd/lib/date-picker';
import moment from 'moment';
const Input = React.createClass({
    getDefaultProps(){
        return{
            value:moment(new Date()).format("YYYY-MM-DD"),
            defaultValue:moment(new Date()).format("YYYY-MM-DD"),
        }
    },
    datePickerChange(_,d){
        this.props.onChange && this.props.onChange(d);
    },
    render(){
        return(
                <div className = "m-t-10 clearfix">

                    <label className = "left-label left">
                        {
                            this.props.require &&
                            <i className="require">*</i>
                        }
                        {this.props.label || ""}</label>
                    <DatePicker onChange={this.datePickerChange}
                                size = "large"
                                allowClear ={false}
                                value={moment(this.props.value, 'YYYY-MM-DD')}
                                defaultValue={moment(this.props.defaultValue, 'YYYY-MM-DD')}/>
                </div>          
        )
    }
});
module.exports = Input;