import { createWebHistory, createRouter } from 'vue-router'
import introductionPage from '../views/introductionPage/index.vue'
import home from '../views/home/index.vue'
import articles from '../views/articles/index.vue'
import resourcesHub from '../views/resourcesHub/index.vue'
import announcements from '../views/announcements/index.vue'


const routes = [
  { path: '/', component: introductionPage },
  { path: '/home', component: home },
  { path: '/articles', component: articles },
  { path: '/resourcesHub', component: resourcesHub},
  { path: '/announcements', component: announcements },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router