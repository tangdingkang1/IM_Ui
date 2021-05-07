<template>
  <div class="chatting-setting">
    <div class="top-div">
      {{ nickname }}
    </div>
    <div class="mid-div">
      <!--   我他妈不敢改   {{history}}-->
      <div v-for="(item,index) in history" :key="index">
        <div v-if="item.userId==id" class="user">
            <!--            如果是要绑定信息里面的 就用 :src-->
            <img :src=avatar alt/>
            <div v-bind:title="item.publishTime" class="bubble">
              <span>{{item.msg}}</span>
            </div>
        </div>
        <div v-else class="toUser">
            <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt/>
            <div v-bind:title="item.publishTime" class="toBubble">
              <span>{{item.msg}}</span>
            </div>
        </div>
      </div>
    </div>
      <div class="textarea-div">
        <el-input type="textarea" :autosize="{minRows:6,maxRows:6}"
                  placeholder="Ctrl+Enter换行"
                  style="height: 100%"
                  v-model="message"
                  @keydown.native="handleKeyCode($event)">
        </el-input>
        <el-button style="position: absolute;bottom: 0%; right:0%;height: 6%" @click="handleTextSend">发送</el-button>
      </div>
  </div>
</template>

<script>
import {formatDate} from "@/utils/date";

export default {
  name: "Chatting",
  data() {
    return {
      toUserId: 0,
      nickname: "找个人聊天吧！",
      avatar:localStorage.getItem("avatar"),
      id: localStorage.getItem("id"),
      history: [],
      message: ''
    }
  },
  computed: {
    //这里是返回MsgFlag，
    returnMsgFlag() {
      let msgFlag = ''
      if (this.toUserId > this.id) {
        msgFlag = this.id + ":" + this.toUserId
      } else {
        msgFlag = this.toUserId + ":" + this.id;
      }
      return msgFlag;
    }
  },
  // filters: {
  //   formatDate(time) {
  //     let date = new Date(time);
  //     return formatDate(date, 'yyyy-MM-dd');
  //   }
  // },

  watch: {
    //监控从父组件传来的信息是否变化
    //点击左边的聊天列表，然后父子间会传递不同的信息来。
    info: {
      handler() {
        console.log("子组件能感受到了")
        console.log(this.info)
        this.nickname = this.info.nickname;
        this.toUserId = this.info.toUserId;
        this.loadHistory()
      },
      deep: true,
      immediate: true
    },
    // info: function () {
    //   console.log("子组件能感受到了")
    //   this.nickName = this.info.nickName;
    //   this.toUserId = this.info.toUserId;
    //   this.loadHistory()
    // },
    //消息更新，就自动滑到最下面。
    history:function () {
      this.$nextTick(() => {
        let container = this.$el.querySelector('.mid-div')
        container.scrollTop = container.scrollHeight
      })
    },
  },
  methods: {
    loadHistory() {
      this.$socket.emit('getHistory', {
        userId: localStorage.getItem('id'),
        msgFlag: this.returnMsgFlag
      })
    },
    //这里是将 ctrl+enter 换成，enter是发送
    handleKeyCode(event) {
      if (event.keyCode == 13 && event.ctrlKey) {
        this.message += "\n"; //换行
      } else if (event.keyCode == 13) {
        this.handleTextSend(); //提交的执行函数
        event.preventDefault();//禁止回车的默认换行
      }
    },
    //这里是发送消息，
    //todo：还需要将自己消息顶上去。
    //左边还要更新，列表。要传回父组件
    handleTextSend() {
      this.$socket.emit('sendMsg', {
        userId: localStorage.getItem('id'),
        toUserId: this.toUserId.toString(),
        msg: this.message
      })
      let sendMsg={msg:this.message,userId:this.id,publishTime:formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')}
      this.history.push(sendMsg)
      //因为这里是发送，所以要将userId填成对方的，不能改，应该
      //因为是响应式的，如果改了，那么左右两端就不对了。
      //sendMsg.userId=this.toUserId;
      this.$emit('responseList', {msg:this.message,userId:this.toUserId,publishTime:formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')})
      this.message = ''

    }
  },
  sockets: {
    history(data) {
      this.history = data
      console.log("收到历史信息")
    },
    receiveMsg(data){
      //收到消息，往父组件传，
      //这里有userId向toUserId发送信息。但是恰好和这里是相反的。
      this.$emit('responseList', data)
      //如果对方发送消息来，是当前窗口。就把消息顶上去。
      if(data.userId==this.toUserId){
        this.history.push({msg:data.msg,userId:data.userId,publishTime:data.publishTime})
        console.log("把消息填充到记录去了。")
        //todo:不是当前窗口，更新状态栏。
      }
    }
  },
  props: ['info']
}
</script>

<style  lang="scss" scoped>
.chatting-setting {
  position: relative;
  width: 100%;
  height: 100%;
}

/*头部信息*/
.top-div {
  text-align: center;
  position: relative;
  height: 7%;
  top: 2%;
}
/*聊天信息*/
.mid-div {
  height: 69%;
  width: 100%;
  border-top: 1px solid #d9c0c0;
  border-bottom: 1px solid #d9c0c0;
  overflow-y: auto;
}
/*输入框*/
.textarea-div {
  height: 17%;
  width: 100%;
  outline:none;
}
.textarea-div >>> .el-textarea__inner {
  border: 0;
  resize: none;
}


.user {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin: 0.8rem 0;
  img {
    object-fit: cover;
    width: 3rem;
    height: 3rem;
    border-radius: 3px;
    float: right;
    margin-right: 1rem;
  }
  .bubble {
    position: relative;
    float: right;
    margin-right: 1rem;
    padding: 0.8rem;
    box-sizing: border-box;
    border-radius: 3px;
    max-width: 65%;
    background-color: rgb(116, 228, 116);
    span {
      size: 8px;
    }
  }
  .bubble::after {
    position: absolute;
    right: -1.3rem;
    top: 0.8rem;
    content: "";
    width: 0;
    height: 0;
    border: 0.7rem solid;
    border-color: transparent transparent transparent rgb(116, 228, 116);
  }
}
.toUser {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin: 0.8rem 0;
  img {
    object-fit: cover;
    width: 3rem;
    height: 3rem;
    border-radius: 3px;
    float: left;
    margin-left: 1rem;
  }

  .toBubble {
    position: relative;
    float: left;
    margin-left: 1rem;
    padding: 0 0.7rem;
    box-sizing: border-box;
    border-radius: 3px;
    max-width: 65%;
    background-color: rgb(116, 228, 116);
    line-height: 3rem;
  }
  .toBubble::after {
    position: absolute;
    left: -1.3rem;
    top: 0.8rem;
    content: "";
    width: 0;
    height: 0;
    border: 0.7rem solid;
    border-color: transparent rgb(116, 228, 116) transparent transparent;
  }
}
</style>