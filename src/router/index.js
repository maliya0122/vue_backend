import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
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
