<template>
    <div class="mb-10 mx-auto">
        <section class="space-y-2 text-center">
            <h1 class="md:text-3xl text-2xl">面试报名表</h1>
            <p class="text-[#A0A0A0] md:text-lg text-[1rem]">请如实填写以下信息，所有内容仅用于本次面试报名及后续联系，我们将严格保密您的个人信息</p>
        </section>
        <Form v-slot="{ handleSubmit }" @invalid-submit="onInvalidSubmit" keep-values :validation-schema="formSchema"
            class="min-w-[min(78rem,90%dvw)] mt-6">
            <form id="form" ref="formRef" @submit.prevent="handleSubmit($event, onSubmit)"
                class="flex flex-col space-y-4 md:px-0 px-4">
                <!-- 昵称 -->
                <FormField v-slot="{ componentField, value, setValue, meta }" v-for="(item, index) in interviewFormJSON"
                    :key="index" :name="item.fieldName">
                    <FormItem>
                        <FormLabel class="data-[error=false]:dark:text-[#FEFCE4] md:text-xl text-lg cursor-pointer" :data-index="`formLabel-${index}`" @click="scrollTo(`formLabel-${index}`)">
                            <Hash class="size-5 data-[error=false]:text-[#E9EBE4] data-[error=true]:text-red-500" />
                            <p>{{ item.label }}</p>
                            <sup v-if="item.required" class="text-[#FF5F56]">
                                <Asterisk class="size-4" />
                            </sup>
                        </FormLabel>
                        <FormDescription v-if="!!item.description" class="select-none space-x-2">
                            <Info class="size-4 inline -translate-y-0.5" />
                            <p class="inline">{{ item.description }}</p>
                        </FormDescription>
                        <FormControl>
                            <Input v-if="item.type === 'input'" :type="item.style?.inputType || 'text'"
                                :placeholder="item.label" v-bind="componentField" />
                            <RadioGroup v-if="item.type === 'radioGroup'" class="flex flex-col space-y-1"
                                v-bind="componentField">
                                <FormItem v-for="(option, optionIndex) in item.value.options" :key="optionIndex"
                                    class="flex items-center space-y-0 gap-x-3">
                                    <FormControl>
                                        <RadioGroupItem :value="String(option.value)"
                                            class="cursor-pointer dark:bg-[#202420]" />
                                    </FormControl>
                                    <FormLabel class="data-[error=false]:dark:text-[#FEFCE4] cursor-pointer">
                                        {{ option.label }}
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                            <Select v-if="item.type === 'select'" v-bind="componentField">
                                <SelectTrigger class="cursor-pointer">
                                    <SelectValue :placeholder="item.label" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem v-for="(option, optionIndex) in item.value.options"
                                            :key="optionIndex" :value="String(option.value)" class="cursor-pointer">
                                            {{ option.label }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div v-if="item.type === 'upload'" :data-error="!meta.valid && meta.touched ? 'true' : 'false'" @blur="componentField.onBlur"
                                class="size-30 flex items-center justify-center cursor-pointer border-2 upload-container-dashed dark:border-[#B0B0B0]"
                                @click="triggerFileInput(index)">
                                <img v-if="!!previewUrl" :src="previewUrl" alt="预览" class="size-full object-fit" />
                                <div v-else class="text-sm text-center dark:text-[#D5C8B0] flex flex-col items-center">
                                    <ImageUp class="size-6" />
                                    <p>点击上传图片</p>
                                </div>
                                <input ref="fileInput" type="file" :accept="handleFileAccept(item.value.accept)"
                                    class="hidden" @change="onFileChange($event, setValue)" :data-index="index" @click.stop />
                            </div>
                            <div v-if="item.type === 'checkbox'" class="flex flex-col space-y-3">
                                <div v-for="(option, optionIndex) in item.value.options" :key="optionIndex"
                                    class="flex items-center space-x-3">
                                    <FormControl>
                                        <Checkbox :id="`${index}-${optionIndex}`"
                                            :checked="Array.isArray(value) && value.includes(option.value)"
                                            @update:modelValue="checked => updateCheckboxArray(option.value, checked, value, setValue)"
                                            @blur="componentField.onBlur"
                                            class="cursor-pointer data-[state=unchecked]:dark:bg-[#202420]" />
                                        <label :for="`${index}-${optionIndex}`"
                                            :data-error="!meta.valid && meta.touched ? 'true' : 'false'"
                                            class="cursor-pointer select-none data-[error=true]:text-red-500 data-[error=false]:dark:text-[#FEFCE4]">
                                            {{ option.label }}
                                        </label>
                                    </FormControl>
                                </div>
                            </div>
                            <Textarea v-if="item.type === 'textarea'" :placeholder="item.label"
                                v-bind="componentField" />
                        </FormControl>
                        <FormMessage class="whitespace-pre-line select-none" />
                    </FormItem>
                </FormField>
                <secondaryButton text="提交报名表" type="submit" form="form" :icon="useIcon"
                    :class="['dark:bg-[#CFCBA0] dark:text-[#0E100F] rounded xl:text-xl md:text-[1rem] mt-2 w-fit', { 'cursor-progress': underSubmit }]" />
            </form>
        </Form>
    </div>
</template>

<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod"

import { h, ref, computed } from "vue"

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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

import { secondaryButton } from "@/components/ui/button"

import { FileUp, LoaderCircle, ImageUp, Info, Hash, Asterisk } from "lucide-vue-next"

import { toast } from 'vue-sonner'

import { storeToRefs } from "pinia"
import { useUserStore } from "@/stores/user"
const userStore = useUserStore()
const { interviewFormJSON, currentInterviewNode } = storeToRefs(userStore)
const { uploadInterviewForm } = userStore

import { generateZodSchema, getRemPx } from "@/lib/utils"

import { gsap } from "gsap"

const underSubmit = ref(false)

const iconMap = ref({
    'submit': FileUp,
    'loading': LoaderCircle
})

const useIcon = computed(() => {
    return underSubmit.value ? iconMap.value['loading'] : iconMap.value['submit']
})

const formRef = ref<HTMLFormElement | null>(null)

// 校验规则
const formSchema = toTypedSchema(generateZodSchema(interviewFormJSON.value))

async function onSubmit(values: any) {
    if (underSubmit.value) return
    underSubmit.value = true
    const formData = new FormData();
    const jsonObj: Record<string, any> = {};
    formData.append('campaign_id', String(currentInterviewNode.value))
    Object.entries(values).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else {
            jsonObj[key] = value;
        }
    });
    // 把普通字段整体作为 json 字段上传
    formData.append('information', JSON.stringify(jsonObj));
    toast.promise(() => uploadInterviewForm(formData), {
        loading: '上传中...',
        success: '面试报名表上传成功',
        error: (err: any) => `上传失败: ${err}`
    })
    underSubmit.value = false
}

const fileInput = ref<HTMLInputElement[]>([])
const previewUrl = ref<string | null>(null)

function triggerFileInput(index: number) {
    fileInput.value.find(input => input.dataset.index === String(index))?.click()
    // console.log(JSON.stringify(interviewFormJSON.value, null, 1));
}

function onFileChange(e: Event, setValue: (v: File) => void) {
    const files = (e.target as HTMLInputElement).files
    if (files && files[0]) {
        const file = files[0]
        previewUrl.value = URL.createObjectURL(file)
        setValue(file)
    }
}

function updateCheckboxArray(optionValue: any, checked: string | boolean, value: any[], setValue: (v: any[]) => void) {
    let arr = Array.isArray(value) ? [...value] : [];
    if (checked) {
        if (!arr.includes(optionValue)) arr.push(optionValue);
    } else {
        arr = arr.filter(v => v !== optionValue);
    }
    setValue(arr);
}

function handleFileAccept(accept: string[] | undefined) {
    if (Array.isArray(accept) && accept.length > 0) {
        return accept.join(',')
    }
}

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

function scrollTo(index: string) {
    const label = formRef.value?.querySelector(`[data-index="${index}"]`)
    if (label) {
        gsap.to(window, {
            duration: 0.5,
            ease: 'power3.out',
            scrollTo: {
                y: label,
                offsetY: getRemPx(3.5)
            }
        })
    }
}



</script>

<style scoped>
.upload-container-dashed[data-error="true"] {
    border-image: url("data:image/svg+xml,%3Csvg%20width%3D'10'%20height%3D'10'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Crect%20x%3D'1'%20y%3D'1'%20width%3D'8'%20height%3D'8'%20fill%3D'none'%20stroke%3D'%23FB2C36'%20stroke-width%3D'2'%20stroke-dasharray%3D'4%2C4'%20stroke-dashoffset%3D'2'/%3E%3C/svg%3E") 2;
}
.upload-container-dashed[data-error="false"] {
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