import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Orders from '../components/order/Orders.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

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
      { path: '/roles', component: Roles }
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
