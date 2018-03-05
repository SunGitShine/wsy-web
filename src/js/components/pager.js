/**
 * Created by luojie on 2017/2/15 11:19.
 */
const Pager = React.createClass({
   render(){
       return(
           <div className="footer">
               <div className="right">
                   <RUI.Pagination {...this.props} onPage={(page)=>{this.props.onPage && this.props.onPage(page)}} />
               </div>
           </div>
       )
   }
});
module.exports = Pager;