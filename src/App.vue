<template>
  <div class="w-full h-full flex items-center justify-center flex-col">
    <!-- 页眉 -->
    <header class="sticky top-0 left-0 w-full h-16 bg-white shadow z-50 flex items-center justify-between px-4">
      <!-- 页眉左侧内容 -->
      <div class="flex items-center">
        <p class="font-bold text-2xl select-none cursor-pointer" @click="routerGoTo('/')">NA&ACM</p>
        <div class="h-10 w-[1px] mx-2 bg-neutral-200 select-none"></div>
        <a href="https://github.com/gdmuna/Nekorify-front" target="_blank" rel="noopener noreferrer"
          class="font-bold text-2xl select-none">
          Nekorify
        </a>
        <div class="h-14 w-[1px] mx-2 bg-neutral-800 select-none"></div>
        <nav class="flex items-center">
          <Button variant="link" @click="routerGoTo('/home')" class="text-xl font-[500] m-0 select-none cursor-pointer">
            <Home />
            首页
          </Button>
          <div class="h-10 w-[1px] m-0 bg-neutral-200 select-none"></div>
          <Button variant="link" @click="routerGoTo('/article')" class="text-xl font-[500] m-0 select-none cursor-pointer">
            <ScrollText />
            文章
          </Button>
          <div class="h-10 w-[1px] m-0 bg-neutral-200 select-none"></div>
          <Button variant="link" @click="routerGoTo('/resource')" class="text-xl font-[500] m-0 select-none cursor-pointer">
            <Database />
            资源站
          </Button>
        </nav>
      </div>
      <!-- 页眉右侧内容 -->
      <div class="flex items-center">
        <Button variant="outline" class="rounded-full h-11 w-11" as="a" href="https://github.com/gdmuna" target="_blank"
          rel="noopener noreferer">
          <Github />
        </Button>
        <div class="h-10 w-[1px] mx-2 bg-neutral-200 select-none"></div>
        <Button variant="outline" class="rounded-full h-11 w-11 cursor-pointer">
          <Mail />
        </Button>
        <div class="h-14 w-[1px] mx-2 bg-neutral-800 select-none"></div>
        <Button class="bg-violet-700 hover:bg-violet-800 cursor-pointer">
          <Smile />
          加入我们
        </Button>
        <div class="h-10 w-[1px] mx-2 bg-neutral-200 select-none"></div>
        <Button variant="outline" class="cursor-pointer">
          <LogIn />
          登录
        </Button>
      </div>
    </header>
    <Toaster />
    <main class="w-full h-full items-center justify-center">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">

// 导入 vue-sonner
import { Toaster, toast } from 'vue-sonner'
import 'vue-sonner/style.css'

// 导入 Vue 相关库和组件
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'


// 导入图标
import { Home } from 'lucide-vue-next';
import { Github } from 'lucide-vue-next';
import { LogIn } from 'lucide-vue-next';
import { Smile } from 'lucide-vue-next';
import { Mail } from 'lucide-vue-next';
import { Database } from 'lucide-vue-next';
import { ScrollText } from 'lucide-vue-next';


onBeforeMount((): void => {

})

const router = useRouter()

function routerGoTo(path: string): void {
  router.push(path)
  console.log(`跳转到${path}`);
}


</script>


<style scoped>

</style>