import Vue from 'vue'
import VueRouter from 'vue-router'


//import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
//import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
//import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

//import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "Users_Orders_Rights" */ '../components/user/Users.vue')
//import Orders from '../components/order/Orders.vue'
const Orders = () => import(/* webpackChunkName: "Users_Orders_Rights" */ '../components/order/Orders.vue')
//import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_Orders_Rights" */ '../components/power/Rights.vue')


//import Roles from '../components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "Roles_Cate_Goods" */ '../components/power/Roles.vue')
//import Cate from '../components/goods/cate.vue'
const Cate = () => import(/* webpackChunkName: "Roles_Cate_Goods" */ '../components/goods/cate.vue')
//import  Goods from '../components/goods/goods.vue'
const Goods = () => import(/* webpackChunkName: "Roles_Cate_Goods" */ '../components/goods/goods.vue')


//import Params from '../components/goods/params.vue'
const Params = () => import(/* webpackChunkName: "Params_Reports_Add" */ '../components/goods/params.vue')
//import Reports from '../components/reports/Reports.vue'
const Reports = () => import(/* webpackChunkName: "Params_Reports_Add" */ '../components/reports/Reports.vue')
//import Add from '../components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "Params_Reports_Add" */ '../components/goods/Add.vue')


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/orders', component: Orders },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/categories', component: Cate },
      { path: '/reports', component: Reports },
      { path: '/add', component: Add }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

//配置路由的导航守卫，对页面路径进行权限控制
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()

  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
