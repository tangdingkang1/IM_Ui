<template>
  <div class="detail-div">
    <div class="top-div">详细信息</div>
    <div class="avatar-div">
      <el-avatar  :src=avatar shape="square" :size="100" style="position: relative;top: 10%;"></el-avatar>
    </div>
    <div class="name-div">
      <span style="position: relative;top:20%;font-size: 20px">{{nickname}}</span>
    </div>
    <div class="introduction-div">
      <span style="position: relative;top:10%;">{{introduction}}</span>
    </div>
    <el-button @click="startChatting()">聊天</el-button>
  </div>
</template>

<script>
export default {
  name: "FriendDetail",
  data(){
    return {
      userId:null,
      nickname:"",
      avatar:"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      introduction:"这里是自我介绍"
    }
  },
  watch:{
    //监控穿过来userId是不是变化了，
    // friendInfo: function () {
    //   this.nickname = this.friendInfo.nickname;
    //   this.userId = this.friendInfo.userId;
    // }
    friendInfo:{
      handler() {
        this.nickname = this.friendInfo.nickname;
        this.userId = this.friendInfo.userId;
      },
      deep: true,
      immediate: true
    }
  },
  methods:{
    startChatting(){
      console.log("子类触发点击事件")
      this.$emit("createChattingWindow",{toUserId:this.userId,nickname:this.nickname,avatar:this.avatar});
    }
  },
  mounted() {
  },
  props:['friendInfo']
}
</script>

<style scoped>
.detail-div{
  position: relative;
  width: 100%;
  height: 100%;
}

.top-div {
  text-align: center;
  position: relative;
  height: 7%;
  top: 2%;
}
.avatar-div{
  text-align: center;
  height: 20%;
  width: 100%;
  border-top: 1px solid #d9c0c0;
  overflow-y: auto;
}
.name-div{
  text-align: center;
  height: 10%;
  width: 100%;
}
.introduction-div{
  text-align: center;
  height: 10%;
  width: 100%;
}

.center {
  text-align: center;
  position: relative;
  height:80%;
  width: 100%;
}
</style>