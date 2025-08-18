<template>
    <div class="mt-4 mx-auto">
        <Form v-slot="{ handleSubmit }" keep-values :validation-schema="formSchema" class="min-w-[min(78rem,90%dvw)]">
            <form id="dialogForm" @submit="handleSubmit($event, onSubmit)" class="flex flex-col space-y-4 md:px-0 px-4">
                <!-- 昵称 -->
                <FormField v-slot="{ componentField, value, setValue, handleChange }"
                    v-for="(item, index) in interviewFormJSON" :key="index" :name="item.fieldName">
                    <FormItem>
                        <FormLabel class="data-[error=false]:dark:text-[#FEFCE4]">
                            {{ item.label }}
                        </FormLabel>
                        <FormDescription>
                            {{ item.description }}
                        </FormDescription>
                        <FormControl>
                            <Input v-if="item.type === 'input'" :type="item.style?.inputType || 'text'"
                                :placeholder="item.label" v-bind="componentField" />
                            <RadioGroup v-if="item.type === 'radioGroup'" class="flex flex-col space-y-1"
                                v-bind="componentField">
                                <FormItem v-for="(option, optionIndex) in item.value.options" :key="optionIndex"
                                    class="flex items-center space-y-0 gap-x-3">
                                    <FormControl>
                                        <RadioGroupItem :value="String(option.value)" class="cursor-pointer" />
                                    </FormControl>
                                    <FormLabel class="data-[error=false]:dark:text-[#FEFCE4]">
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
                            <div v-if="item.type === 'upload'"
                                class="size-30 flex items-center justify-center cursor-pointer border-2 upload-container-dashed dark:border-[#B0B0B0]"
                                @click="triggerFileInput(index)">
                                <img v-if="previewUrl" :src="previewUrl" alt="预览" class="size-full object-fit" />
                                <div v-else class="text-sm text-center dark:text-[#D5C8B0]">点击上传图片</div>
                                <input ref="fileInput" type="file" :accept="handleFileAccept(item.value.accept)" class="hidden"
                                    @change="onFileChange($event)" :data-index="index" v-bind="componentField" />
                            </div>
                            <div v-if="item.type === 'checkbox'" class="flex flex-col space-y-3">
                                <div v-for="(option, optionIndex) in item.value.options" :key="optionIndex"
                                    class="flex items-center space-x-3">
                                    <Checkbox :checked="Array.isArray(value) && value.includes(option.value)"
                                        @update:modelValue="checked => updateCheckboxArray(option.value, checked, value, setValue)"
                                        class="cursor-pointer" />
                                    <FormLabel class="data-[error=false]:dark:text-[#FEFCE4]">
                                        {{ option.label }}
                                    </FormLabel>
                                </div>
                            </div>
                            <Textarea v-if="item.type === 'textarea'" :placeholder="item.label" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <secondaryButton text="保存更改" type="submit" form="dialogForm" :icon="useIcon"
                    :class="['dark:bg-[#CFCBA0] dark:text-[#0E100F] rounded xl:text-xl md:text-[1rem] mt-5 w-fit', { 'cursor-progress': underSubmit }]" />
            </form>
        </Form>
    </div>
</template>

<script lang="ts" setup>
import { toTypedSchema } from "@vee-validate/zod"

import { h, ref, computed, watch } from "vue"

import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

import { secondaryButton } from "@/components/ui/button"

import { Rocket, Check, LoaderCircle } from "lucide-vue-next"

import { toast } from 'vue-sonner'

import { storeToRefs } from "pinia"
import { useUserStore } from "@/stores/user"
const userStore = useUserStore()
const { interviewFormJSON } = storeToRefs(userStore)

import { generateZodSchema } from "@/lib/utils"

const isOpen = ref(false)

const underSubmit = ref(false)

const iconMap = ref({
    'submit': Check,
    'loading': LoaderCircle
})

const useIcon = computed(() => {
    return underSubmit.value ? iconMap.value['loading'] : iconMap.value['submit']
})

watch(isOpen, () => {
    if (underSubmit.value) {
        isOpen.value = true
        
    }
})

// 校验规则
// const formSchema = toTypedSchema(z.object({
//     nickname: z.string()
//         .transform(val => val.trim() === "" ? undefined : val)
//         .optional()
//         .refine(val => !val || !/[<>]/.test(val), { message: "昵称不能包含特殊字符" })
//         .refine(val => !val || z.string().max(10).safeParse(val).success, { message: "昵称长度需小于10" })
//         .default(""),
//     bio: z.string()
//         .transform(val => val.trim() === "" ? undefined : val)
//         .optional()
//         .refine(val => !val || !/[<>]/.test(val), { message: "签名不能包含特殊字符" })
//         .refine(val => !val || z.string().max(40).safeParse(val).success, { message: "签名长度需小于40" })
//         .optional()
//         .default(""),
//     email: z.string()
//         .transform(val => val.trim() === "" ? undefined : val)
//         .optional()
//         .refine(val => !val || !/[<>]/.test(val), { message: "邮箱不能包含特殊字符" })
//         .refine(val => !val || z.string().email().safeParse(val).success, { message: "请输入有效的邮箱地址" })
//         .default(""),
// }))

const formSchema = toTypedSchema(generateZodSchema(interviewFormJSON.value))

async function onSubmit(values: any) {
    if (underSubmit.value) return
    underSubmit.value = true
    toast("You submitted the following values:", {
        description: h("pre", { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" }, h("code", { class: "text-white" }, JSON.stringify(values, null, 2))),
    })
    // const ok = await updateUserInfo(values)
    // if (ok) {
    //     toast.success('个人资料已更新')
    // } else {
    //     toast.error('更新失败，请稍后再试')
    // }
    isOpen.value = false
    underSubmit.value = false
}

const fileInput = ref<HTMLInputElement[]>([])
const previewUrl = ref<string | null>(null)

function triggerFileInput(index: number) {
    fileInput.value.find(input => input.dataset.index === String(index))?.click()
    console.log(JSON.stringify(interviewFormJSON.value, null, 1));
}

function onFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (files && files[0]) {
        const file = files[0]
        previewUrl.value = URL.createObjectURL(file)
        // 你可以在这里把 file 传给表单
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

</script>

<style>
.dialogContent {
    scrollbar-width: none;
    -ms-overflow-style: none;
    background-color: #0E100F;
}

.dialogContent::-webkit-scrollbar {
    display: none;
}

/* div[data-slot="drawer-content"]::after {
    pointer-events: none !important;
} */

.upload-container-dashed {
    border-width: 2px;
    border-style: dashed;
    border-image: url("data:image/svg+xml;utf8,<svg width='10' height='10' xmlns='http://www.w3.org/2000/svg'><rect x='1' y='1' width='8' height='8' fill='none' stroke='gray' stroke-width='2' stroke-dasharray='4,4' stroke-dashoffset='2'/></svg>") 2;
}
</style>