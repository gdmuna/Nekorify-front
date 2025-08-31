<template>
    <div id="articleEdit" class="flex flex-1 flex-col mb-10">
        <Form v-slot="{ handleSubmit, meta }" @invalid-submit="onInvalidSubmit" keep-values :validation-schema="formSchema"
            class="flex flex-col space-y-4" :initial-values="initVal">
            <form id="form" ref="formRef" @submit.prevent="handleSubmit($event, onSubmit)" class="space-y-8">
                <FormField v-slot="{ componentField, value }" name="title">
                    <FormItem class="flex md:flex-row flex-col gap-4">
                        <div class="flex-1 space-y-2">
                            <FormLabel>标题</FormLabel>
                            <FormControl>
                                <Input v-bind="componentField" placeholder="请输入文章标题" />
                            </FormControl>
                            <FormDescription>
                                文章的标题，将展示在文章详情页顶部，建议简明扼要，20字以内
                            </FormDescription>
                            <FormMessage />
                        </div>
                        <div
                            class="lg:max-w-[75dvw] md:max-w-[40dvw] lg:min-w-64 md:min-w-48 p-4 dark:bg-[#2A2A2A] rounded-md md:text-2xl text-xl flex justify-center items-center">
                            <p v-if="value" class="break-all line-clamp-2">{{ value }}</p>
                            <p v-else>预览</p>
                        </div>
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField, value, setValue, meta }" name="coverUrl">
                    <FormItem class="flex gap-4 items-center">
                        <div class="flex flex-1 flex-col space-y-2">
                            <FormLabel>
                                封面图片
                            </FormLabel>
                            <FormControl>
                                <div class="flex items-center gap-4">
                                    <div :data-error="!meta.valid && meta.touched ? 'true' : 'false'"
                                        @blur="componentField.onBlur"
                                        class="size-30 flex items-center justify-center cursor-pointer border-2 upload-container-dashed [data-error=false]:dark:border-[#B0B0B0]"
                                        @click="triggerFileInput">
                                        <img v-if="!!CoverPreviewURL" :src="CoverPreviewURL" alt="预览"
                                            class="size-full object-cover" />
                                        <div v-else
                                            class="text-sm text-center dark:text-[#D5C8B0] flex flex-col items-center">
                                            <ImageUp class="size-6" />
                                            <p>点击上传图片</p>
                                        </div>
                                        <input ref="fileInput" type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif" class=" hidden"
                                            @change="onCoverChange($event, 'article', setValue)" data-index="1"
                                            @click.stop />
                                    </div>
                                    <div class="flex-1 space-y-2">
                                        <FormLabel>
                                            封面图片 URL
                                        </FormLabel>
                                        <FormControl>
                                            <Input v-bind="componentField" placeholder="请输入封面图片 URL" />
                                        </FormControl>
                                        <FormDescription>
                                            可手动填写图片链接，或通过上传自动生成。图片将显示在文章详情页顶部。（还显示不了喵...）
                                        </FormDescription>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormControl>
                            <FormDescription>
                                支持 png、jpeg、jpg、webp、gif 格式，大小不超过 10MB。上传后将自动生成图片 URL
                            </FormDescription>
                            <FormMessage />
                        </div>
                    </FormItem>
                    <FormItem class="flex">
                        <div class="aspect-16/9 flex-1 mx-auto max-w-[32rem] border-2 upload-container-dashed dark:border-[#B0B0B0]
                        dark:text-[#D5C8B0] md:text-2xl flex justify-center items-center">
                            <img v-if="!!value" :src="value" alt="预览" class="size-full object-cover" />
                            <p v-else class="select-none">预览</p>
                        </div>
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField, value, setValue, meta }" name="textUrl">
                    <FormItem class="flex md:flex-row flex-col gap-4 items-center">
                        <div class="flex flex-1 flex-col space-y-2">
                            <FormLabel>
                                markdown 文件上传
                            </FormLabel>
                            <FormControl>
                                <Input type="file" @change="onFileChange($event, 'article', setValue)"
                                    class="cursor-pointer" />
                            </FormControl>
                            <FormDescription>
                                仅支持 .md 格式的 Markdown 文件，建议内容排版规范，便于后续展示
                            </FormDescription>
                            <FormMessage />
                        </div>
                        <div class="flex flex-1 flex-col space-y-2">
                            <FormLabel>
                                markdown 文件URL
                            </FormLabel>
                            <FormControl>
                                <Input v-bind="componentField" placeholder="请输入markdown 文件URL" />
                            </FormControl>
                            <FormDescription>
                                可手动填写 Markdown 文件的外链地址，或通过上传自动生成
                            </FormDescription>
                            <FormMessage />
                        </div>
                    </FormItem>
                    <div class="flex flex-col gap-2">
                        <secondaryButton :text="type === 'edit' ? '保存编辑' : '发布文章'" type="submit" form="form"
                            :icon="useIcon"
                            :class="['dark:bg-[#CFCBA0] dark:text-[#0E100F] rounded xl:text-xl md:text-[1rem] w-fit', { 'cursor-progress': underSubmit }]" />
                        <secondaryButton v-if="type === 'edit'" text="删除文章" :icon="Trash2" type="button"
                            class="dark:bg-[#f19180] dark:text-[#0E100F] rounded xl:text-xl md:text-[1rem] md:mt-4 mt-2 w-fit"
                            @click="onDelete" />
                    </div>
                    <teleport defer to='#articleEdit'>
                        <div class="text-center mt-5 space-y-4">
                            <h3 class="md:text-3xl text-2xl">内容预览</h3>
                            <div class="w-full h-[1px] bg-[#5f5f5f]" />
                            <p v-if="!value" class="dark:text-[#A0A0A0] mt-10">请上传或填写 markdown 文件URL 以预览文章内容</p>
                        </div>
                        <markdownContainer v-if="value" :current-source-url="value" :enableNavigator="false"
                            class="mt-10" />
                    </teleport>
                </FormField>
            </form>
        </Form>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed, toRaw } from 'vue'

import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"

import { toast } from 'vue-sonner'

import markdownContainer from '@/components/markdownContainer.vue'

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"

import { secondaryButton } from '@/components/ui/button'

import { FileUp, LoaderCircle, ImageUp, Info, Hash, Asterisk, Trash2 } from "lucide-vue-next"

import { getRemPx } from '@/lib/utils'

import { gsap } from 'gsap'

import { resourceApi } from '@/api'

import { useRoute } from 'vue-router'
const route = useRoute()

import { useSystemStore } from '@/stores/system'
const systemStore = useSystemStore()
const { routerGoto } = systemStore

import type { Article } from '@/types/resource'

const props = defineProps<{
    fetchInst: any
    params: {
        currentPage: number
        pageSize: number
    }
}>()

const type = computed(() => {
    return route.name === 'articleCreate' ? 'create' : 'edit'
})

const initVal = computed(() => {
    if (type.value === 'edit' && props.fetchInst.data.value) {
        const data = props.fetchInst.data.value.find((item: Article) => item.id === Number(route.params.id))
        console.log('initVal', data);
        if (!data) {
            return {
                title: '',
                coverUrl: '',
                textUrl: ''
            }
        }
        const deepCloneData = structuredClone<Article>(toRaw(data))
        return {
            title: deepCloneData.title,
            coverUrl: deepCloneData.cover_url,
            textUrl: deepCloneData.text_md_url
        }
    } else {
        return {
            title: '',
            coverUrl: '',
            textUrl: ''
        }
    }
})

const formRef = ref<HTMLElement | null>(null)

const formSchema = toTypedSchema(z.object({
    title: z.string({ required_error: `标题 不能为空` }).min(1, "标题 不能为空").max(20, "标题 不能超过 20 个字符"),
    coverUrl: z.string().url("封面图片 URL 格式不正确").optional(),
    textUrl: z.string({ required_error: `markdown 文件URL 不能为空` }).url("markdown 文件URL 格式不正确")
}))

const iconMap = ref({
    'submit': FileUp,
    'loading': LoaderCircle
})

const useIcon = computed(() => {
    return underSubmit.value ? iconMap.value['loading'] : iconMap.value['submit']
})

function onInvalidSubmit() {
    toast.error('请检查表单填写内容');
    const errorField = formRef.value?.querySelector('[data-error=true]')
    gsap.to(window,
        {
            duration: 0.5,
            ease: 'power3.out',
            scrollTo: {
                y: errorField!,
                offsetY: getRemPx(3.5)
            }
        })
}

const fileInput = ref<HTMLInputElement>()

function triggerFileInput() {
    // fileInput.value.find(input => input.dataset.index === String(index))?.click()
    fileInput.value?.click()
    // console.log(JSON.stringify(interviewFormJSON.value, null, 1));
}

const CoverPreviewURL = ref<string | null>(null)
const uploadCoverURL = ref<string | null>(null)

async function onCoverChange(e: Event, type: string, setValue: (value: any) => void) {
    const files = (e.target as HTMLInputElement).files
    if (files && files[0]) {
        const file = files[0]
        if (file.size > 10 * 1024 * 1024) {
            toast.error('图片大小不能超过 10MB')
            return
        }
        if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'].includes(file.type)) {
            toast.error('只支持 png、jpeg、jpg、webp、gif 格式的图片')
            return
        }
        CoverPreviewURL.value = URL.createObjectURL(file)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)
        const { err, res } = await resourceApi.uploadPicture(formData)
        if (res) {
            uploadCoverURL.value = res.data.url
            setValue(res.data.url)
            toast.success('图片上传成功')
        } else {
            toast.error(`图片上传失败: ${err}`)
        }
    }
}

const FilePreviewURL = ref<string | null>(null)
const uploadFileURL = ref<string | null>(null)

async function onFileChange(e: Event, type: string, setValue: (value: any) => void) {
    const files = (e.target as HTMLInputElement).files
    if (files && files[0]) {
        const file = files[0]
        if (!file.name.endsWith('.md')) {
            toast.error('只支持 markdown 格式的文件')
            return
        }
        FilePreviewURL.value = URL.createObjectURL(file)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)
        const { err, res } = await resourceApi.uploadFile(formData)
        if (res) {
            uploadFileURL.value = res.data.url
            setValue(res.data.url)
            toast.success('文件上传成功')
        } else {
            toast.error(`文件上传失败: ${err}`)
        }
    }
}

const underSubmit = ref(false)

async function onSubmit(values: any) {
    if (underSubmit.value) return
    if (!isFormChanged(initVal.value, values)) {
        toast.error('文章内容未修改，无需提交')
        return
    }
    underSubmit.value = true
    console.log(values);
    const id = Number(route.params.id)
    const method = type.value === 'edit'
    ? () => resourceApi.updateArticle(id, values)
    : () => resourceApi.uploadArticle(values)
    toast.promise(() => {
        return new Promise(async (resolve, reject) => {
            const { err, res } = await method()
            if (res) {
                resolve(res)
            } else {
                reject(err)
            }
        })
    }, {
        loading: '发布中...',
        success: async () => {
            underSubmit.value = false
            routerGoto('/dashboard/article-manager')
            await props.fetchInst.send(props.params, true)
            return '成功发布文章'
        },
        error: (err: any) => `发布失败: ${err}`
    })
    underSubmit.value = false
}

async function onDelete() {
    if (underSubmit.value) return
    if (type.value !== 'edit') return
    underSubmit.value = true
    const id = Number(route.params.id)
    toast.promise(() => {
        return new Promise(async (resolve, reject) => {
            const { err, res } = await resourceApi.deleteArticle(id)
            if (res) {
                resolve(res)
            } else {
                reject(err)
            }
        })
    }, {
        loading: '删除中...',
        success: async () => {
            underSubmit.value = false
            routerGoto('/dashboard/article-manager')
            await props.fetchInst.send(props.params, true)
            return '成功删除文章'
        },
        error: (err: any) => `删除失败: ${err}`
    })
}

function isFormChanged(originalValues: any, currentValues: any) {
    return JSON.stringify(originalValues) !== JSON.stringify(currentValues);
}

</script>

<style scoped>
.upload-container-dashed[data-error="true"] {
    border-image: url("data:image/svg+xml,%3Csvg%20width%3D'10'%20height%3D'10'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Crect%20x%3D'1'%20y%3D'1'%20width%3D'8'%20height%3D'8'%20fill%3D'none'%20stroke%3D'%23FB2C36'%20stroke-width%3D'2'%20stroke-dasharray%3D'4%2C4'%20stroke-dashoffset%3D'2'/%3E%3C/svg%3E") 2;
}

.upload-container-dashed[data-error="false"] {
    border-image: url("data:image/svg+xml,%3Csvg%20width%3D'10'%20height%3D'10'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Crect%20x%3D'1'%20y%3D'1'%20width%3D'8'%20height%3D'8'%20fill%3D'none'%20stroke%3D'%23A0A0A0'%20stroke-width%3D'2'%20stroke-dasharray%3D'4%2C4'%20stroke-dashoffset%3D'2'/%3E%3C/svg%3E") 2;
}

.upload-container-dashed {
    border-image: url("data:image/svg+xml,%3Csvg%20width%3D'10'%20height%3D'10'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Crect%20x%3D'1'%20y%3D'1'%20width%3D'8'%20height%3D'8'%20fill%3D'none'%20stroke%3D'%23A0A0A0'%20stroke-width%3D'2'%20stroke-dasharray%3D'4%2C4'%20stroke-dashoffset%3D'2'/%3E%3C/svg%3E") 2;
}

/* Chrome, Safari, Edge */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
}

/* Firefox */
input[type="number"] {
    -moz-appearance: textfield;
    appearance: none;
}

input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #EEE1CA inset !important;
    box-shadow: 0 0 0 1000px #EEE1CA inset !important;
    -webkit-text-fill-color: #0E100F !important;
}
</style>