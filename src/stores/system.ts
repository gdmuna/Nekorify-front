import { defineStore } from 'pinia'
import { h, ref, computed } from 'vue'
import { toast } from 'vue-sonner'

export const useSystemStore = defineStore('system', () => {
    const isDark = ref<boolean>(false)
    function initTheme(): void {
        if (localStorage.getItem('isDark') === 'true') {
            document.documentElement.classList.add('dark')
            isDark.value = true
        } else if (localStorage.getItem('isDark') === 'false') {
            document.documentElement.classList.remove('dark')
            isDark.value = false
        } else {
            // 默认主题为浅色
            document.documentElement.classList.remove('dark')
            isDark.value = false
            localStorage.setItem('isDark', 'light')
        }
    }
    // 切换主题
    function toggleTheme(): void {
        if (isDark.value == false) {
            document.documentElement.classList.add('dark')
            isDark.value = true
            localStorage.setItem('isDark', 'true')
        } else {
            document.documentElement.classList.remove('dark')
            isDark.value = false
            localStorage.setItem('isDark', 'false')
        }
    }

    return {
        isDark: computed(() => isDark.value),
        initTheme,
        toggleTheme,
    }
})