import { createWebHistory, createRouter } from 'vue-router'
import introduction from '../views/introduction/index.vue'

import { useAuthStore } from '@/stores'

import { ScrollSmoother } from "gsap/ScrollSmoother";

import { nextTick } from 'vue';

const routes = [
  {
    path: '/',
    component: introduction,
    name: 'introduction',
    meta: {
      title: '宣传页',
      scrollToTop: true
    }
  },
  {
    path: '/home',
    component: () => import('../views/home/index.vue'),
    name: 'home',
    meta: {
      title: '主页',
      scrollToTop: true
    }
  },
  {
    path: '/announcements',
    component: () => import('../views/announcements/index.vue'),
    name: 'announcements',
    meta: {
      title: '公告',
      scrollToTop: true
    }
  },
  {
    path: '/articles',
    component: () => import('../views/articles/index.vue'),
    name: 'articles',
    meta: {
      title: '文章',
      scrollToTop: true
    }
  },
  {
    path: '/videos',
    component: () => import('../views/videos/index.vue'),
    name: 'videos',
    meta: {
      title: '视频',
      scrollToTop: true
    }
  },
  {
    path: '/resourcesHub',
    component: () => import('../views/resourcesHub/index.vue'),
    name: 'resourcesHub',
    meta: {
      title: '资源站',
      scrollToTop: true
    }
  },
  {
    path: '/loginCallback',
    component: () => import('../views/loginCallback/index.vue'),
    name: 'loginCallback',
    meta: {
      title: '登录回调',
      guest: true
    }
  },
  {
    path: '/me',
    component: () => import('../views/me/index.vue'),
    meta: {
      title: '个人中心'
    },
    children: [
      {
        path: '',
        component: () => import('../components/me/appGroup.vue'),
        name: 'me',
        meta: {
          title: '个人中心',
          requireAuth: true,
          scrollToTop: true
        },
      },
      {
        path: 'announcement-manager',
        component: () => import('../components/me/app/announcementManager.vue'),
        name: 'announcementManager',
        meta: {
          title: '公告管理',
          requireAuth: true,
          parentAction: {
            doNotScrollToTop: true
          }
        }
      },
      {
        path: 'article-manager',
        component: () => import('../components/me/app/articleManager.vue'),
        name: 'articleManager',
        meta: {
          title: '文章管理',
          requireAuth: true,
          parentAction: {
            doNotScrollToTop: true
          }
        }
      },
      {
        path: 'video-manager',
        component: () => import('../components/me/app/videoManager.vue'),
        name: 'videoManager',
        meta: {
          title: '视频管理',
          requireAuth: true,
          parentAction: {
            doNotScrollToTop: true
          }
        }
      },
      {
        path: 'interview-status',
        component: () => import('../components/me/app/interviewStatus.vue'),
        name: 'interviewStatus',
        meta: {
          title: '面试状态',
          requireAuth: true,
          parentAction: {
            doNotScrollToTop: true
          }
        }
      }
    ]
  },
]

const title = document.title

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  document.title = title + ' - ' + (to.meta.title || 'Nekorify')
  const isChildRoute = from.matched.length > 0 && to.path === from.matched[0].path
  const scrollToTop = to.meta.scrollToTop && !(from.meta.parentAction?.doNotScrollToTop && isChildRoute)
  if (scrollToTop) {
    const smoother = ScrollSmoother.get();
    smoother?.scrollTo(0, false)
  }
  if (to.meta.requireAuth && !authStore.isAuthenticated) {
    authStore.login()
    return next(false)
  } else if (to.meta.guest && authStore.isAuthenticated) {
    return next({ name: 'home' })
  }
  nextTick(() => {
    next()
  })
})

export default router