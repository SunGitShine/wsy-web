/**
 * Created by luojie on 2017/3/2 11:32.
 */
import Pubsub from "../util/pubsub";
export function departList(){
    return $.ajax({
        url:commonBaseUrl+"/department/findByPage.htm",
        type:"get",
        dataType:"json",
        data:{d:"",pageNo:1,pageSize:20000},
    }).then((data)=>{
        if(data.success){
            return data.resultMap;
        }else{
            Pubsub.publish("showMsg",["wrong",data.description]);
            return data;
        }
    })
}
export function employeeList(){
    return $.ajax({
        url:commonBaseUrl+"/employee/findByPage.htm",
        type:"get",
        dataType:"json",
        data:{d:"",pageNo:1,pageSize:20000},
    }).then((data)=>{
        if(data.success){
            return data.resultMap;
        }else{
            Pubsub.publish("showMsg",["wrong",data.description]);
            return data;
        }
    })
}
export function classifyList(){
    return $.ajax({
        url:commonBaseUrl+"/classify/findByPage.htm",
        type:"get",
        dataType:"json",
        data:{d:"",pageNo:1,pageSize:20000},
    }).then((data)=>{
        if(data.success){
            return data.resultMap;
        }else{
            Pubsub.publish("showMsg",["wrong",data.description]);
            return data;
        }
    })
}
export function productList(){
    return $.ajax({
        url:commonBaseUrl+"/product/findByPage.htm",
        type:"get",
        dataType:"json",
        data:{d:JSON.stringify({classifyId:"",name:""}),pageNo:1,pageSize:20000},
    }).then((data)=>{
        if(data.success){
            return data.resultMap;
        }else{
            Pubsub.publish("showMsg",["wrong",data.description]);
            return data;
        }
    })
}
export function memberList(paramType){
    let departmentId = paramType || "";
    return $.ajax({
        url:commonBaseUrl+"/employee/findByPage.htm",
        type:"get",
        dataType:"json",
        data:{d:JSON.stringify({departmentId}),pageNo:1,pageSize:20000},
    }).then((data)=>{
        if(data.success){
            return data.resultMap;
        }else{
            Pubsub.publish("showMsg",["wrong",data.description]);
            return data;
        }
    })
}
export function orderDetail(orderNo,paramType){
    let loginType = localStorage.type;
    let type = 1;
    if(loginType==2){
        type = 1;
    }else if(loginType==3){
        type = 2;
    }
    type = paramType || type;
    return $.ajax({
        url:commonBaseUrl+"/order/findByOrderNo.htm",
        type:"get",
        dataType:"json",
        data:{d:JSON.stringify({orderNo,type})},
    }).then((data)=>{
        if(data.success){
            return data.resultMap;
        }else{
            Pubsub.publish("showMsg",["wrong",data.description]);
            return data;
        }
    })
}