import { createWebHistory, createRouter } from 'vue-router'
import landingPage from '../views/landingPage/index.vue'
import home from '../views/home/index.vue'
import articles from '../views/articles/index.vue'
import resourcesHub from '../views/resourcesHub/index.vue'



const routes = [
  { path: '/', component: landingPage },
  { path: '/home', component: home },
  { path: '/article', component: articles },
  { path: '/resource', component: resourcesHub}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router