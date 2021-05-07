<template>
<div class="chatIndex-setting">
  <div class="left-div">
    <div class="menu-div">
      <div class="info">
        <el-avatar  :src=avatar
                    shape="square"     :size="60" style="position: relative; "></el-avatar>
        <span style="position: relative;left: 10%;top: -35%; font-weight:bold;font-size: 20px" >{{nickname}}</span>
      </div>
      <div class="search-div">
        <el-input placeholder="搜索" size="small" style="position: relative;top: 20%">
          <i slot="prefix" class="el-input__icon el-icon-search"/>
        </el-input>
      </div>
<!--      这里是菜单栏，聊天-朋友圈-好友信息 -->
      <div class="select-div">
        <i class="el-icon-chat-round" @click="changeMenu(true,1)" style="position: relative;left: 10%;cursor:pointer;"></i>
        <i class="el-icon-orange" @click="changeMenu(menuChoose,2)" style="position: relative;left: 30%;cursor:pointer;"></i>
        <i class="el-icon-s-custom" @click="changeMenu(false,3)" style="position: relative;left: 50%;cursor:pointer;"></i>
      </div>
    </div>
    <div v-if="menuChoose" class="list" style="position:relative;width: 100%;height: 75%">
<!--      这里是聊天列表-->
      <el-card v-for="(item,index) in chatList" v-bind:key="index" shadow="always" class="box-card"
               @click.native="selectChattingUser({toUserId:item.toUserId,nickname:item.nickname})">
        <el-avatar  :src=item.avatar
                    style="position: absolute;left:  2%;top: 50%; transform: translateY(-50%);"></el-avatar>
        <span style="position: absolute;left: 20%;top: 10%; font-weight:bold">{{item.nickname}}</span>
        <span style="position: absolute;left: 50%;top: 15%; font-size: 8px">{{item.publishTime}}</span>
        <span class="msg">{{item.msg}}</span>
      </el-card>
    </div>

<!--    这里是好友列表-->
    <div v-if="!menuChoose" class="list" style="position:relative;width: 100%;height: 75%">
      <el-card v-for="(item,index) in friendList" v-bind:key="index" shadow="always" class="box-card"
               @click.native="selectFriendInfo({userId: item.userId,nickname:item.nickname})">
        <el-avatar  :src=item.avatar
                    style="position: absolute;left:  2%;top: 50%; transform: translateY(-50%);"></el-avatar>
        <span style="position: absolute;left: 20%;top: 10%; font-weight:bold">{{item.nickname}}</span>
      </el-card>
    </div>
  </div>
  <div class="right-div" >
      <chatting v-if="rightChoose==1" :info=info v-on:responseList="changeList"/>
      <MomentDetail v-if="rightChoose==2"></MomentDetail>
      <FriendDetail v-if="rightChoose==3" :friend-info=friendInfo v-on:createChattingWindow="createChattingWindow"></FriendDetail>

  </div>
</div>
</template>

<script>
import Chatting from './Chatting'
import FriendDetail from "@/components/Friend/FriendDetail";
import MomentDetail from "@/components/Moment/MomentDetail";
export default {
  name: "ChatIndex",
  data(){
    return {
      id:"1",
      message:[],
      chatList:[],
      info:{
        toUserId:0,
        nickName:"对方名字"
      },
      friendInfo:{
        userId:0,
        nickName:"对方名字"
      },
      //这是当前用户的名字和头像。
      nickname:localStorage.getItem("nickname"),
      avatar:localStorage.getItem("avatar"),
      //选择是聊天窗口还是朋友圈,默认 1,
      //1,聊天窗口。
      //2.朋友圈
      //3.显示个人信息。
      //4.某人的朋友圈（应该可以和2一个模板）
      rightChoose:1,
      //true，聊天信息，false:好友列表。
      menuChoose:true,
      friendList:[],
    }
  },
  components:{
    FriendDetail,
    Chatting,
    MomentDetail
  },
  sockets:{
    // receiveMsg(data){
    //   console.log(data)
    // },
    receiveChatList(data){
      this.chatList=(data)
    },
    connect(){
      console.log("socket已经连接了")
    }
  },
  methods:{
    //这里是左边选择用户，要将userId和nickName传过去
    //聊天框
    selectChattingUser(userInfo){
      this.rightChoose=1
      console.log("调用了函数了吗")
      this.info=userInfo;
    },
    //选择用户信息
    //就穿个userId和nickName去
    selectFriendInfo(friendInfo){
      this.rightChoose=3
      this.friendInfo=friendInfo
    },
    //改变右边的
    //选择是聊天窗口还是朋友圈,默认1,
    //1,聊天窗口。
    //2.朋友圈
    //3.显示个人信息。
    //4.某人的朋友圈（应该可以和2一个模板）
    changeMenu(condition,rightChoose){
        this.rightChoose=rightChoose
        this.menuChoose=condition;
    },
    //有两种情况更新，
    //这里是收到消息的情况
    changeList(data){
      console.log(data)
      //首先读取出来。
      //注意userId和to的区别，这里是相反的。
      for (let index=0;index<this.chatList.length;index++){
        if(data.userId==this.chatList[index].toUserId){
          if(index==0){
            this.chatList[index].msg=data.msg;
            this.chatList[index].publishTime=data.publishTime;
          }else{
            let firstElement =this.chatList[index];
            this.chatList.splice(index,1);
            firstElement.msg=data.msg;
            firstElement.publishTime=data.publishTime;
            this.chatList.unshift(firstElement);
          }
          return;
        }
      }
      //说明列表没有当前元素。要新加一个上来
      let newElement={};
      newElement.msg=data.msg;
      newElement.publishTime=data.publishTime;
      newElement.toUserId=data.userId;
      this.createNewElement(newElement);
    },
    createNewElement(data){
      //todo:这里还有头像还名字没传过来，要在后端加一个api，通过userId获得avatar和nickname;
      //这里的data时没有avatar和nickname的
      this.chatList.unshift(data);
    },
    //这里是自己创建一个新的窗口
    //首先也要遍历一下，如果没有就创建一个新的。
    //如果存在就将。最新页面展示出来。
    createChattingWindow(userInfo){
      this.rightChoose=1
      this.menuChoose=true;
      this.selectChattingUser(userInfo)
      console.log("........"+this.info)
      //创建窗口
      //遍历看有没有结果
      for(let index=0;index<this.chatList.length;index++){
        if(this.chatList[index].toUserId==userInfo.toUserId){
          return;
        }
      }
      let newElement={};
      newElement.toUserId=userInfo.toUserId
      newElement.avatar="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      newElement.nickname=userInfo.nickname
      this.createNewElement(newElement);
    }
  },
  mounted() {
    //这是promise 异步里面的知识
    //这里是得到我的好友列表
    this.getRequest('/friend/info',{userId:this.id}).then(resp => {
      if(resp){
        this.friendList=resp;
      }
      console.log(JSON.stringify(resp));
    }).catch( ()=>{
      console.log("这里是出错问题了")
    })
  }
}
</script>

<style>
.chatIndex-setting{
  position: relative;
  width: 100%;
  height: 100%;
}
.menu-div{
  width: 100%;
  height:25%;
}
.info{
  width: 100%;
  height: 40%;

}
.search-div{
  width: 100%;
  height: 30%;
}
.select-div{
  width: 100%;
  height: 30%;
  /*父子间设置 icon大小*/
  font-size: 30px;
}
.left-div{
  width: 33.33%;
  height:100%;
  /*下面是并列显示的*/
  float: left;
  position: relative;
}
.right-div{
  width: 66.66%;
  height:100%;
  float: left;
}
.box-card{
  height: 12.5%;
  width: 100%;
  cursor:pointer;
  position: relative;
}
.msg{
  position: absolute;
  width: 80%;
  left: 20%;
  top: 60%;
  font-size: 8px;
  /*下面是超出部分显示...*/
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space:nowrap;
  display:block;
}

</style>