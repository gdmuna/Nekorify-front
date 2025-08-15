import { createWebHistory, createRouter } from 'vue-router'
import introduction from '../views/introduction/index.vue'

const routes = [
  {
    path: '/',
    component: introduction
  },
  {
    path:'/home',
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/announcements',
    component: () => import('../views/announcements/index.vue')
  },
  {
    path: '/articles',
    component: () => import('../views/articles/index.vue')
  },
  {
    path: '/videos',
    component: () => import('../views/videos/index.vue')
  },
  {
    path: '/resourcesHub',
    component: () => import('../views/resourcesHub/index.vue')
  },
  {
    path: '/loginCallback',
    component: () => import('../views/loginCallback/index.vue')
  },
  {
    path: '/me' ,
    component: () => import('../views/me/index.vue'),
    children: [
      {
        path: '',
        component: () => import('../components/me/appGroup.vue')
      },
      {
        path: 'announcements'
      },
      {
        path: 'articles'
      },
      {
        path: 'videos'
      },
      {
        path: 'interview'
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router