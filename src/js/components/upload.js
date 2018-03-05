/**
 * Created by Administrator on 2017-3-6.
 */
import "../../css/components/upload.scss";
import "../library/ajaxupload.3.5";
import  Modal  from 'antd/lib/Modal';

import Pubsub from "../util/pubsub";
export default class Upload extends React.Component{
    // 构造
    constructor(props) {
          super(props);
          // 初始状态
          this.state = {
              imgUrl : "",
              visible:false
          };
        this.handleCancel = this.handleCancel.bind(this);
        this.clickImg = this.clickImg.bind(this);
    }

    componentDidMount() {
        if(!this.props.disabled){
            let node = $(ReactDOM.findDOMNode(this.refs.upload));
            this.upload(node);
        }
    }
    upload(node){
        let _this = this;
        new AjaxUpload(node,{
            action: "/product/upload.htm",
            name: "upload",
            responseType: "json",
            onChange(file){
                if(!/\.(gif|bmp|jpg|jpeg|png|GIF|JPG|PNG|image)$/.test(file)){
                    RUI.DialogManager.alert("图片格式不对，请重新上传！");
                    return false;
                }
            },
            onComplete:function(e,data){
                if(data.success){
                    _this.props.callback && _this.props.callback(data.resultMap.picPath);
                    _this.setState({imgUrl : data.resultMap.picPath});
                }else{
                    Pubsub.publish("showMsg",["wrong",data.description]);
                }
            }
        });
    }
    componentWillReceiveProps(nextProps){
        //if(nextProps.url){
        //    this.setState({imgUrl:nextProps.url});
        //}
    }
    handleCancel(){
        this.setState({visible:false});
    }
    clickImg(){
        this.setState({visible:true});
    }
    render(){
        let {imgUrl,visible} = this.state;
        let url = imgUrl || this.props.url;
        return(
            <div>
                {
                    url ?
                    <div className="upload-div relative">
                        <img src={url} onClick = {this.clickImg} className="upload-img" alt=""/>
                    </div>
                        :
                    <div className="upload-div" >
                        <i className="upload-trigger"/>
                    </div>
                }
                {
                    !this.props.disabled &&
                    <div className={this.props.uploadBtn}>
                        <RUI.Button className = "primary" ref = "upload">上传</RUI.Button>
                    </div>
                }
                <Modal visible={visible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={url} />
                </Modal>
            </div>
        )
    }

}