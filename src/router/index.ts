import { createWebHistory, createRouter } from 'vue-router'
import introductionPage from '../views/introductionPage/index.vue'
import home from '../views/home/index.vue'
import announcements from '../views/announcements/index.vue'
import articles from '../views/articles/index.vue'
import replay from '../views/replays/index.vue'
import resourcesHub from '../views/resourcesHub/index.vue'


const routes = [
  { path: '/', component: introductionPage },
  { path: '/home', component: home },
  { path: '/announcements', component: announcements },
  { path: '/articles', component: articles },
  { path: '/replay', component: replay },
  { path: '/resourcesHub', component: resourcesHub},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router