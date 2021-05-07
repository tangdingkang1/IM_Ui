<template>
  <div class="detail-div">
    <div class="top-div">
      <el-image
          style="width: 100%; height: 100%;"
          src="https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg" fit="cover"></el-image>
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                 shape="square"     :size="80"
                 style="position: relative;margin-top: -10%;right:3%;float: right"
      ></el-avatar>
      <span style="position: relative;font-weight:bold;margin-top: -5%;right:4%;float: right"
      >{{nickname}}</span>
    </div>
    <div class="body-div">
      <el-image-viewer
          v-if="showBig"
          :on-close="closeViewer"
          :url-list="showBigImgList"
      />
      <div class="moment-div" v-for="(item,momentIndex) in momentDetail" v-bind:key="momentIndex">
        <div class="left-div">
          <el-avatar :src=item.avatar
                     shape="square" :size="50"
                     style="position: relative;margin-left: 15%"
          ></el-avatar>
        </div>
        <div class="right-div">
          <span style="font-weight: bold;position:relative;width: 80%">{{item.nickname}}</span>
          <p style="position:relative;width: 80%">{{item.content}}</p>
          <div class="image-div" v-if="item.image!=''">
            <img v-for="(image,imageIndex) in item.image.split(',')"
                 v-bind:key="imageIndex" :src=image @click="preImage(momentIndex,imageIndex)"/>
          </div>
          <p v-if="item.location!=''" style="position:relative;width: 80%;font-size:50%">{{item.location}}</p>
<!--          这里是时间和点赞的按钮-->
          <div style="position:relative;width: 100%;margin-top: -10px">
            <p v-if="item.time!=''" style="float:left;font-size:8px">{{handleTime(item.time)}}</p>
            <el-popover
                placement="left"
                trigger="hover"
                :width="150"
                :visible-arrow=false
                style="float: right;margin-top: 5px">
              <div style="position: relative;padding-top:2px;height: 15px;width: 100%; margin-top: -15px;">

                <el-button v-if="item.ifLike==false" size="mini" type="text" icon="iconfont iconempty" style="position: relative;left: 5%;">赞</el-button>
                <el-button v-else size="mini" type="text" icon="iconfont icondianzanaixinhongse-" style="position: relative;left: 5%;">取消赞</el-button>

                <el-button size="mini" type="text" icon="iconfont iconpinglun" style="position: relative;left: 30%"> 评论</el-button>
              </div>
              <el-button size="mini" style="position:relative;margin-right: 45px;padding:0 0 0 0 ;height: 15px;width: 30px;cursor: pointer;"
                         icon="iconfont iconliangdian" type="info" slot="reference">
              </el-button>
            </el-popover>
          </div>
          <div style="position: relative;width:89%;background-color:#ead7ad;border-radius:5px;margin-bottom: 10px">
            <!--这里是点赞列表-->
            <div v-if="item.likeList!=''" style="position: relative;margin-left: 10px">
              <i class="iconfont iconempty" style="float: left;margin-top: 6px;"></i>
              <span v-for="(likeName,likeIndex) in item.likeList" v-bind:key="likeIndex"
                    style="font-size:14px;float: left;margin-top: 5px">
                {{likeName.nickName}},
              </span>
            </div>
<!--  这里是评论列表-->
            <div v-if="item.commentList!=''" style="position:relative;margin-top:3px;border-top: 1px solid #939090;">
              <div style="position: relative;margin-left: 10px;margin-top: 2px"
                   v-for="(commentDetail,commentIndex) in item.commentList" v-bind:key="commentIndex">
                <span style="font-size: 14px">{{commentDetail.nickName}}: {{commentDetail.content}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "MomentDetail",
  components: {
    'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
  },
  data(){
  return{
    id:localStorage.getItem("id"),
    toUserId:0,//被访问人的id
    nickname:"被访问的人的名字",
    momentDetail:[],
    showBig:false,
    showBigImgList:[],
  }
  },
  methods:{
    closeViewer(){
      this.showBig = false;
    },
    preImage(momentIndex,imageIndex){
      let temp= this.momentDetail[momentIndex].image.split(",");
      this.showBigImgList=temp.slice(imageIndex).concat(temp.slice(0,imageIndex))
      console.log(this.showBigImgList)
      this.showBig=true;
    },
    handleTime(time){
      time = time.replace(/-/g,"/");
      let time_date = new Date(time);
      let localTime = new Date();
      let timeYear = time_date.getFullYear();
      let timeMonth = time_date.getMonth()+1;
      let timeDate =time_date.getDate();
      let timeHours = time_date.getHours();
      if(timeHours<10)
        timeHours="0"+timeHours;
      let timeMinutes = time_date.getMinutes();
      if(timeMinutes<10)
        timeMinutes="0"+timeMinutes;

      let currYear = localTime.getFullYear();
      if(timeYear!=currYear){
        return timeYear+"年"+timeMonth+"月"+timeDate+"日 "+timeHours+":"+timeMinutes;
      }else{
        let num = (localTime-time_date)/(1000*3600*24);//求出两个时间的时间差，这个是天数

        let days = parseInt(num);//转化为整天（小于零的话剧不用转了）
        console.log(num-0.5);
        if(days==0){
          return "今天"+timeHours+":"+timeMinutes;
        }else if(days==1){
          return "昨天"+timeHours+":"+timeMinutes;
        }else if(days==2)
          return "前天"+timeHours+":"+timeMinutes;
        else
          return timeMonth+"月"+timeDate+"日 "+timeHours+":"+timeMinutes;
      }
    }
  },
  mounted() {
    this.getRequest('/moment/getMoments',{userId:this.id}).then(resp => {
      if(resp){
        this.momentDetail=resp.obj;
        console.log(this.momentDetail)
      }
    }).catch( ()=>{
      console.log("这里是出错问题了")
    })
  }
}
</script>

<style scoped>
/* 这里是防止div height为0*/
div:after {
  content: "";
  display: block;
  clear: both;
}
span{
  word-break:normal;
  display:block;
  white-space:pre-wrap;
  word-wrap : break-word ;
  overflow: hidden ;
}
.detail-div{
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.left-div{
  float: left;
  width: 14%;
}
.right-div{
  float: left;
  width: 86%;
  /*border-bottom: 1px solid #d9c0c0;*/
}
.moment-div{
  position: relative;
  width: 100%;
  border-bottom: 1px solid #939090;
  margin-top: 10px;
}
.image-div{
  position: relative;
  width: 80%;
  background-color: antiquewhite;

}
img{
  cursor:pointer;
  margin-right:3px;
  width: 110px;
  height: 110px;
  object-fit: cover;
}
img:only-child{
  height: initial;  /*相当于删除已设置的某一属性*/
  width: initial;
  max-width: 230px;
  max-height: 230px;
}
img:nth-child(2):nth-last-child(3){
  margin-right: 110px;
}

.top-div {
  position: relative;
  height: 25%;
}
.body-div{
  position: relative;
  /*background-color: red;*/
  margin-top:10%;
  height: 65%;
  width: 100%;
}
.comment-div{

}
</style>