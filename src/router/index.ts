import { createWebHistory, createRouter } from 'vue-router'
import introduction from '../views/introduction/index.vue'
import home from '../views/home/index.vue'

import { useAuthStore } from '@/stores/auth'
import { useSystemStore } from '@/stores/system'

import { ScrollSmoother } from "gsap/ScrollSmoother";

import { nextTick, h } from 'vue';

import { showModal, openInNewTab } from '@/lib/utils';

import { toast } from 'vue-sonner'


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
      title: '公告列表',
      scrollToTop: true
    },
    children: [
      {
        path: ':id',
        component: () => import('../components/markdownContainer.vue'),
        name: 'announcementDetail',
        meta: {
          title: '公告详情',
          scrollToTop: true
        }
      }
    ]
  },
  {
    path: '/articles',
    component: () => import('../views/articles/index.vue'),
    name: 'articles',
    meta: {
      title: '文章列表',
      scrollToTop: true
    },
    children: [
      {
        path: ':id',
        component: () => import('../components/markdownContainer.vue'),
        name: 'articleDetail',
        meta: {
          title: '文章详情',
          scrollToTop: true
        }
      }
    ]
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
  // {
  //   path: '/resourcesHub',
  //   component: () => import('@/views/resourcesHub/index.vue'),
  //   name: 'resourcesHub',
  //   meta: {
  //     title: '资源站'
  //   }
  // },
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
    component: () => import('../views/dashboard/index.vue'),
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
          minManageLevel: 1,
          manageRange: {
            onlySelfFrom: 1,
            all: 0
          }
        },
        children: [
          {
            path: ':id',
            component: () => import('../components/dashboard/app/announcementManager/announcementEditor.vue'),
            name: 'announcementEditor',
            meta: {
              title: '公告编辑',
              requireAuth: true,
              scrollToTop: true
            }
          },
          {
            path: 'create',
            component: () => import('../components/dashboard/app/announcementManager/announcementEditor.vue'),
            name: 'announcementCreate',
            meta: {
              title: '新增公告',
              requireAuth: true,
              scrollToTop: true
            }
          }
        ]
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
          minManageLevel: 2,
          manageRange: {
            onlySelfFrom: 1,
            all: 0
          }
        },
        children: [
          {
            path: ':id',
            component: () => import('../components/dashboard/app/articleManager/articleEditor.vue'),
            name: 'articleEditor',
            meta: {
              title: '文章编辑',
              requireAuth: true,
              scrollToTop: true
            }
          },
          {
            path: 'create',
            component: () => import('../components/dashboard/app/articleManager/articleEditor.vue'),
            name: 'articleCreate',
            meta: {
              title: '新增文章',
              requireAuth: true,
              scrollToTop: true
            }
          }
        ]
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
          minManageLevel: 2,
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
          scrollToTop: true,
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
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/wtf/index.vue'),
    meta: {
      title: '404 Not Found'
    }
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
  if (to.name == 'videos') {
    showModal({
      content: [
        h('div', { class: 'flex flex-col space-y-4' }, [
          h('h2', { class: 'md:text-3xl text-2xl px-6 mx-auto font-bold dark:text-red-400 text-center' }, '501 Not Implemented'),
          h('p', { class: 'md:text-2xl text-xl font-bold dark:text-amber-100' }, '喵呜...撞头了喵...'),
          h('p', { class: 'dark:text-[#A0A0A0]' }, '该功能尚未完工，正在紧急施工中喵...')
        ])
      ]
    })
    return systemStore.routerBack()
  }

  const authStore = useAuthStore()
  document.title = title + ' - ' + (to.meta.title || 'Nekorify')
  // 只有在不是子路由跳转时，且目标路由配置了 scrollToTop 时，才滚动到顶部
  const isChildRoute = from.matched.length > 0 && to.path === from.matched[0].path
  const scrollToTop = to.meta.scrollToTop && !(from.meta.parentAction?.doNotScrollToTop && isChildRoute)
  if (scrollToTop) {
    const smoother = ScrollSmoother.get();
    smoother?.scrollTo(0, false)
  }
  if (to.meta.requireAuth && !authStore.isAuthenticated) {
    systemStore.targetPath = to.fullPath
    console.log('目标路径', systemStore.targetPath);
    authStore.login()
    return next(false)
  } else if (to.meta.guest && authStore.isAuthenticated) {
    toast.warning('？来这干啥')
    return next({ name: 'home' })
  }
  let minManageLevel;
  // 从最具体的路由记录开始检查（从后向前）
  for (let i = to.matched.length - 1; i >= 0; i--) {
    if (to.matched[i].meta.minManageLevel !== undefined) {
      minManageLevel = to.matched[i].meta.minManageLevel;
      break;
    }
  }
  if (minManageLevel !== undefined) {
    const maxPermission = authStore.getGroupByRank('max')
    console.log('maxPermission', maxPermission);
    if (maxPermission === null || maxPermission.level > Number(minManageLevel)) {
      showModal({
        content: [
          h('div', { class: 'flex flex-col space-y-4' }, [
            h('h2', { class: 'md:text-3xl text-2xl px-6 mx-auto font-bold dark:text-red-400 text-center' }, '403 Forbidden'),
            h('p', { class: 'md:text-2xl text-xl font-bold dark:text-amber-100' }, '喵呜...撞头了喵...'),
            h('p', { class: 'dark:text-[#A0A0A0]' }, '您当前的权限等级不足，无法访问该页面。')
          ])
        ]
      })
      return next({ name: 'dashboard' })
    }
  }
  if (to.name === 'videoManager') {
    showModal({
      content: [
        h('div', { class: 'flex flex-col space-y-4' }, [
          h('h2', { class: 'md:text-3xl text-2xl px-6 mx-auto font-bold dark:text-red-400 text-center' }, '501 Not Implemented'),
          h('p', { class: 'md:text-2xl text-xl font-bold dark:text-amber-100' }, '喵呜...撞头了喵...'),
          h('p', { class: 'dark:text-[#A0A0A0]' }, '该功能尚未完工，正在紧急施工中喵...')
        ])
      ]
    })
    return next({ name: 'dashboard' })
  }
  nextTick(() => {
    next()
  })
})

export default router