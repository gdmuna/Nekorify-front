import { createWebHistory, createRouter } from 'vue-router'
import landingPage from '../views/landingPage/index.vue'
import home from '../views/home/index.vue'
import article from '../views/article/index.vue'
import resource from '../views/resource/index.vue'



const routes = [
  { path: '/', component: landingPage },
  { path: '/home', component: home },
  { path: '/article', component: article },
  { path: '/resource', component: resource}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router