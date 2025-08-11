import { defineStore } from 'pinia'
import { h, ref, computed } from 'vue'
import { toast } from 'vue-sonner'

export const useSystemStore = defineStore('system', () => {
    const isDark = ref<boolean>(true)
    function initTheme(): void {
        // if (localStorage.getItem('isDark') === 'true') {
        //     document.documentElement.classList.add('dark')
        //     isDark.value = true
        // } else if (localStorage.getItem('isDark') === 'false') {
        //     document.documentElement.classList.remove('dark')
        //     isDark.value = false
        // } else {
        //     // 默认主题为深色
        //     document.documentElement.classList.add('dark')
        //     isDark.value = true
        //     localStorage.setItem('isDark', 'true')
        // }
        document.documentElement.classList.add('dark')
        isDark.value = true
        localStorage.setItem('isDark', 'true')
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
    // 强制切换主题
    function forceToggleTheme(theme: string): void {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
            isDark.value = true
        } else {
            document.documentElement.classList.remove('dark')
            isDark.value = false
        }
    }

    const isMobile = computed(() => window.innerWidth <= 767)
    const isTablet = computed(() => window.innerWidth > 767 && window.innerWidth <= 1024)
    const isDesktop = computed(() => window.innerWidth > 1024)

    return {
        isDark,
        isMobile,
        isTablet,
        isDesktop,
        initTheme,
        toggleTheme,
        forceToggleTheme
    }
})