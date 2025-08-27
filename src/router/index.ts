import { createWebHistory, createRouter } from 'vue-router'
import introduction from '../views/introduction/index.vue'
import home from '../views/home/index.vue'

import { useAuthStore } from '@/stores/auth'
import { useSystemStore } from '@/stores/system'

import { ScrollSmoother } from "gsap/ScrollSmoother";

import { nextTick, h } from 'vue';

import { showModal } from '@/lib/utils';

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
    component: home,
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
    path: '/dashboard',
    component: () => import('../views/dashboard/index.vue')
    ,
    meta: {
      title: '仪表盘',
      requireAuth: true
    },
    children: [
      {
        path: '',
        component: () => import('../components/dashboard/appGroup.vue'),
        name: 'dashboard',
        meta: {
          title: '仪表盘',
          requireAuth: true,
          scrollToTop: true
        },
      },
      {
        path: 'announcement-manager',
        component: () => import('../components/dashboard/app/announcementManager.vue'),
        name: 'announcementManager',
        meta: {
          title: '公告管理',
          requireAuth: true,
          parentAction: {
            doNotScrollToTop: true
          },
          minManageLevel: 3,
          manageRange: {
            onlySelfFrom: 2,
            all: 1
          }
        }
      },
      {
        path: 'article-manager',
        component: () => import('../components/dashboard/app/articleManager.vue'),
        name: 'articleManager',
        meta: {
          title: '文章管理',
          requireAuth: true,
          parentAction: {
            doNotScrollToTop: true
          },
          minManageLevel: 3,
          manageRange: {
            onlySelfFrom: 1,
            all: 0
          }
        }
      },
      {
        path: 'video-manager',
        component: () => import('../components/dashboard/app/videoManager.vue'),
        name: 'videoManager',
        meta: {
          title: '视频管理',
          requireAuth: true,
          parentAction: {
            doNotScrollToTop: true
          },
          minManageLevel: 3,
          manageRange: {
            onlySelfFrom: 1,
            all: 0
          }
        }
      },
      {
        path: 'interview',
        component: () => import('../components/dashboard/app/interview.vue'),
        name: 'interview',
        meta: {
          title: '面试',
          requireAuth: true,
          parentAction: {
            doNotScrollToTop: true
          }
        },
        children: [
          {
            path: ':nodeId',
            component: () => import('../components/dashboard/app/interview/interviewNode.vue'),
            name: 'interviewNode',
            meta: {
              title: '面试节点',
              requireAuth: true,
              parentAction: {
                doNotScrollToTop: true
              }
            }
          }
        ]
      },
    ]
  },
  {
    path: '/:pathMatch(.*)/',
    redirect: (to: any) => '/' + to.params.pathMatch
  }
]

const title = document.title

const router = createRouter({
  history: createWebHistory(),
  routes,
  strict: true
})

router.beforeEach((to, from, next) => {
  const systemStore = useSystemStore()
  if (to.name == 'announcements' || to.name == 'articles' || to.name == 'videos' || to.name == 'resourcesHub') {
    showModal({
      content: [
        h('div', { class: 'flex flex-col space-y-4' }, [
          h('p', { class: 'text-2xl font-bold dark:text-amber-100' }, '喵呜...撞头了喵...'),
          h('p', { class: 'dark:text-[#A0A0A0]' }, '该功能尚未完工，正在紧急施工中喵...'),
        ])
      ]
    })
    return systemStore.routerBack()
  }
  const authStore = useAuthStore()
  const minManageLevel = to.meta.minManageLevel
  if (minManageLevel !== undefined) {
    const maxPermission = authStore.getGroupByRank('max')
    console.log('maxPermission', maxPermission);
    
    if (maxPermission === null || maxPermission.level > (minManageLevel as number)) {
      showModal({
        content: [
          h('div', { class: 'flex flex-col space-y-4' }, [
            h('p', { class: 'text-2xl font-bold dark:text-amber-100' }, '喵呜...撞头了喵...'),
            h('p', { class: 'dark:text-[#A0A0A0]' }, '您当前的权限等级不足，无法访问该页面。')
          ])
        ]
      })
      return systemStore.routerBack()
    }
  }
  document.title = title + ' - ' + (to.meta.title || 'Nekorify')
  // 只有在不是子路由跳转时，且目标路由配置了 scrollToTop 时，才滚动到顶部
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