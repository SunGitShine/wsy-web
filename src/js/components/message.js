/**
 * Created by luojie on 2016/9/8 17:51.
 */
import '../../css/components/message.scss';
module.exports = React.createClass({
    __timer : null,
    __stay : false,
    getInitialState : function(){
        return {
            show : false,
            msg : this.props.msg,
            type : this.props.type//'success'//success,warn,wrong
        };
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({
            msg : nextProps.msg,
            type : nextProps.type
        });
    },
    open : function() {
        var _this = this;
        _this.setState({
            show : true
        });
    },
    close : function() {
        var _this = this;
        _this.setState({
            show : false
        });
    },
    componentDidMount: function () {
        //居中显示
        var _this = this,
            node = ReactDOM.findDOMNode(_this),
            tipW = $(node).outerWidth();
        node.style.marginLeft = -1 * (tipW / 2) + 'px';
        _this.__timer = window.setTimeout(function () {
            _this.setState({
                show : false
            });
        }, 2000);

    },
    componentWillUnmount : function() {
        var _this = this;
        _this.__timer && window.clearTimeout(_this.__timer);

    },
    render : function() {
        var _this = this,
            tipClass = [_this.state.show ? 'show' : '','web-tip', this.state.type || 'success'].join(' ');
        return(
            <div className={tipClass} style={_this.state.show ? {displsy:'block'} : {display:'none'}}>
                {_this.state.msg}
            </div>
        )
    }
});