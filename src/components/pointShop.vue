<template>
    <div ref="root" class="max-w-[90%] md:max-w-[550px] xl:max-w-[800px] 2xl:max-w-[900px] flex flex-col
    dark:bg-[#181818] rounded-lg" @click.stop>
        <div class="flex flex-col space-y-4 justify-between items-center mb-4">
            <h2 class="md:text-4xl text-2xl font-bold dark:text-[#CFCBA0]">猫粮 & 鱼粮商店</h2>
            <h3 class="md:text-lg text-base text-center dark:text-[#A0A0A0]">
                积分商城即将开放，届时可兑换谷子、服务器使用权限等好物，敬请期待喵~
            </h3>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const root = ref<HTMLElement | null>(null);

const props = defineProps<{ visible: boolean }>()


</script>

<style scoped></style>