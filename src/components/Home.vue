<template>
  <div class="home-setting">
    <chat-index></chat-index>
  </div>
</template>


<script>
import Vue from 'vue';
import VueSocketIo from 'vue-socket.io'
import ChatIndex from '@/components/chat/ChatIndex'

export default {
  name: "Home",
  data(){
    return {
      message:"这是原始消息。",
    }
  },
  components:{
    ChatIndex
  },
  methods:{
  },
  beforeCreate() {
    Vue.use(
        new VueSocketIo({
          debug: true,
          //101.37.158.1
          connection: 'http://localhost:9092?userId='+localStorage.getItem("id"),
          // autoConnect:true  默认自动连接
        })
    )
  },
}
</script>

<style>
.home-setting{
  position: absolute;
  left: 25%;
  top: 10%;
  width: 50%;
  height: 80%;
  /*这里是背景，用这个颜色看大小*/
  background-color: antiquewhite;
}
</style>