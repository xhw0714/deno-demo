import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/b',
    name: '后台管理',
    redirect: '/b/server',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/backend/index.vue'),
    children: [
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 会被渲染在 User 的 <router-view> 中
        path: 'server',
        component: () => import(/* webpackChunkName: "about" */ '../views/backend/server.vue'),
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 会被渲染在 User 的 <router-view> 中
        path: 'pool',
        component: () => import(/* webpackChunkName: "about" */ '../views/backend/pool.vue'),
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
