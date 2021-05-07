<template>
  <div :style="background ">
    <login-form></login-form>
  </div>

</template>

<script>
import  LoginForm from '@/components/login/LoginForm'
export default {
  name: 'login',
  data() {
    return {
      background: {
        backgroundImage: "url(" + require("@/assets/images/bg.jpg") + ") ",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh",
        width: "100%",
      }
    }
  },
  components:{
    LoginForm
  },
  methods: {
  },
}
</script>

<style>
html,body {
  margin: 0;
  padding: 0;
}
</style>