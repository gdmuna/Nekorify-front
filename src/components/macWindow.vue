<template>
    <div class="border-0 rounded-lg shadow-lg dark:bg-[#040711] p-4 pt-0 flex flex-col items-between ">
        <div class="flex items-center justify-between space-x-6 my-2">
            <div class="flex items-center justify-between space-x-6">
                <div class="w-6 h-6 bg-[#FF5F56] rounded-full"></div>
                <div class="w-6 h-6 bg-[#FFBD2E] rounded-full"></div>
                <div class="w-6 h-6 bg-[#27C93F] rounded-full"></div>
            </div>
            <div class="flex items-center justify-between space-x-2">
                <img src="@/assets/icons8-javascript.svg" alt="JavaScript" class="w-10 h-10">
                <span class="text-2xl code-JS">Javascript</span>
            </div>
        </div>
        <div
            class="border-0 rounded-lg shadow-lg dark:bg-[#16191D] min-w-[40rem] min-h-[20rem] flex flex-col items-start justify-between p-4">
            <div class="flex flex-1 items-start justify-start space-x-6 mb-4">
                <div class="flex flex-col items-end justify-start">
                    <span v-for="(_, i) in codeRow" :key="i" class="text-xl leading-6 text-[#75777D]">{{ i + 1 }}</span>
                </div>
                <pre class="flex-1 !p-0 !m-0 !bg-transparent" tabindex="-1">
<code ref="codeBlock" class="!text-xl !leading-6 language-javascript">{{ code }}</code>
</pre>
            </div>
            <div class="flex items-center w-full pt-4 border-t-[#595959] border-t-1">
                <ChevronRight class="size-16 text-[#75777D]"/>
                <span class="text-5xl">Hello GDMU!</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'

import { ChevronRight } from 'lucide-vue-next';

const codeRow = ref(14)

// @ts-ignore
import Prism from 'prismjs'

const code = ref(`/**
 * 逐字符输出指定文本到终端
 * Powered by GDMU-NA & GDMU-ACM
 * @param {string} text - 要输出的文本内容
 * @returns {void} 无返回值
 * @example helloGDMU('Hello GDMU!');
 */
function helloGDMU(text) {
  for (let i = 0; i < text.length; i++) {
    process.stdout.write(text[i]);
  }
}

helloGDMU('Hello GDMU!');`)

onMounted(() => {
  Prism.highlightAll();
});


</script>

<style scoped>
.code-JS {
    background: linear-gradient(90deg, rgba(247, 178, 30, 1), rgba(247, 245, 30, 1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
</style>