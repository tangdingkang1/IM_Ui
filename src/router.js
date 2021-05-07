import Vue from 'vue'
import Router from 'vue-router'

//路由懒加载
const Login = ()=>import('./components/login/Login')
const Home =()=>import('./components/Home')

Vue.use(Router)

export default new Router({
    mode:'history',
    routes: [
        {
            path: '/',
            redirect:'/login'
        },
        {
            path: "/login",
            component:Login
        },
        {
            path:"/home",
            component:Home
        },

    ]
})