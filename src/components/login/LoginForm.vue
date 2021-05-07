<template>
  <div>1
      <el-form
          :rules="rules"
          ref="loginForm"
          v-loading="loading"
          element-loading-text="正在登录..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :model="loginForm"
          class="loginContainer">
        <h3 class="loginTitle">系统登录</h3>
        <el-form-item prop="username">
          <el-input size="normal" type="text" v-model="loginForm.username" auto-complete="off"
                    placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="normal" type="password" v-model="loginForm.password" auto-complete="off"
                    placeholder="请输入密码"></el-input>
        </el-form-item>
            <el-button size="normal" type="primary" style="width: 50%;" @click="submitLogin">登录</el-button>
      </el-form>

  </div>

</template>

<script>
export default {
  name: 'loginForm',
  data(){
    return {
      loading: false,
      loginForm: {
        username: 'tangdingkang',
        password: '123',
      },
      checked: true,
      rules: {
        username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
      }
    }
  },
  methods:{
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          //这是promise 异步里面的知识
          this.getRequest('/user/login', this.loginForm).then(resp => {
            this.loading = false;
            //我不清楚这个是干什么的，但估计是api那边，成功了为真。不然是空的
            //登录成功就要重定向到home去
            if(resp){
              //要把登录返回的token 存放起来，我还没学store ，不急。
              //将token存储起来，切分一下，将id也拿到。
              //这里是将 token和我id都放到了这个里面。 还是放在localStorage里面比较好
              //传过来本来就是字符串。就不用json的那个了
              window.localStorage.setItem("token", resp.obj.token);
              window.localStorage.setItem("id", resp.obj.token.substring(32));
              window.localStorage.setItem("nickname",resp.obj.nickname)
              window.localStorage.setItem("avatar",resp.obj.avatar)
              //todo 如果有机会的话，路由这块还要在仔细看一下。
              //反正这个path 是undefined 我测试过了。
              let path = this.$route.query.redirect;
              this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
            }
            console.log(JSON.stringify(resp));
          }).catch( ()=>{
            console.log("这里是出错问题了")
          })
        }
      });
    }
  }
}
</script>
<style>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 200px auto;
  width: 250px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

}

.loginTitle {
  margin: 15px auto 20px auto;
  text-align: center;
  color: #505458;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}
.el-form-item__content{
  display: flex;
  align-items: center;
}
</style>