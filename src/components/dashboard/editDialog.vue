<template>
    <Form v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema" class="select-none">
        <Dialog v-model:open="dialogOpen">
            <DialogTrigger as-child>
                <secondaryButton text="编辑个人资料" :icon="PenLine"
                    class="dark:bg-[#CFCBA0] dark:text-[#0E100F] rounded xl:text-xl md:text-[1rem]" />
            </DialogTrigger>
            <DialogContent class="max-w-[90%] md:max-w-[550px] xl:max-w-[650px] 2xl:max-w-[850px]">
                <DialogHeader>
                    <DialogTitle class="dark:text-[#CFCBA0] xl:text-xl">编辑个人资料</DialogTitle>
                    <DialogDescription class="dark:text-[#D5C8B0]">
                        于此编辑您的个人资料。当编辑完毕后，点击保存更改按钮以保存您的修改。
                    </DialogDescription>
                </DialogHeader>
                <form id="dialogForm" @submit="handleSubmit($event, onSubmit)" class="space-y-4">
                    <!-- 昵称 -->
                    <FormField v-slot="{ componentField }" name="nickname">
                        <FormItem>
                            <FormLabel class="data-[error=false]:dark:text-[#FEFCE4]">
                                <UserRound class="size-4" />
                                昵称
                            </FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="昵称" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <!-- 签名 -->
                    <FormField v-slot="{ componentField }" name="bio">
                        <FormItem>
                            <FormLabel class="data-[error=false]:dark:text-[#FEFCE4]">
                                <Hash class="size-4" />
                                签名
                            </FormLabel>
                            <FormControl>
                                <Input type="bio" placeholder="个性签名" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <!-- 邮箱 -->
                    <FormField v-slot="{ componentField }" name="email">
                        <FormItem>
                            <FormLabel class="data-[error=false]:dark:text-[#FEFCE4]">
                                <Mail class="size-4" />
                                邮箱
                            </FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="邮箱" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <!-- 友情链接 -->
                    <FormField v-slot="{ value, setValue }" name="links">
                        <FormItem>
                            <FormLabel class="data-[error=false]:dark:text-[#FEFCE4]">
                                <Link class="size-4" />
                                外链
                            </FormLabel>
                            <FormDescription>
                                在此添加您的个人网站或社交媒体链接。最多可添加4个链接。
                            </FormDescription>
                            <div class="space-y-4">
                                <div v-for="(_, idx) in value" :key="idx" class="flex items-center space-x-2">
                                    <Input type="url" :placeholder="`链接${idx + 1}`" v-model="value[idx]" />
                                    <outlineText @click="removeLink(idx, value, setValue)" text="删除"
                                        lineColor="oklch(63.7% 0.237 25.331)" class="w-fit shrink-0 text-red-500" />
                                </div>
                                <outlineText v-if="value.length < 4" @click="addLink(value, setValue)" text="添加"
                                    lineColor="oklch(62.3% 0.214 259.815)" class="w-fit text-blue-500" />
                            </div>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </form>
                <DialogFooter>
                    <secondaryButton text="保存更改" type="submit" form="dialogForm"
                        :class="['dark:bg-[#CFCBA0] dark:text-[#0E100F] rounded xl:text-xl md:text-[1rem]', { 'cursor-progress': underSubmit }]">
                        <component :is="useIcon" ref="iconRef"
                            :class="['md:size-5 size-4', { 'animate-spin': underSubmit }]" />
                    </secondaryButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Form>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { h, ref, computed, watch } from "vue"
import * as z from "zod"

import { secondaryButton } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'vue-sonner'

import { PenLine, UserRound, Mail, Link, Hash, Check, LoaderCircle } from 'lucide-vue-next';

import { outlineText } from "@/components/ui/text"

import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const { updateUserInfo } = userStore;

const dialogOpen = ref(false);

const iconRef = ref<HTMLElement | null>(null);

const iconMap = ref({
    'submit': Check,
    'loading': LoaderCircle
})

const underSubmit = ref(false);

const useIcon = computed(() => {
    return underSubmit.value ? iconMap.value['loading'] : iconMap.value['submit']
})

watch(dialogOpen, () => {
    if (underSubmit.value) {
        dialogOpen.value = true
    }
})

// 校验规则
const formSchema = toTypedSchema(z.object({
    nickname: z.string()
        .transform(val => val.trim() === "" ? undefined : val)
        .optional()
        .refine(val => !val || !/[<>]/.test(val), { message: "昵称不能包含特殊字符" })
        .refine(val => !val || z.string().max(10).safeParse(val).success, { message: "昵称长度需小于10" })
        .default(userInfo.value?.nickname || ""),
    bio: z.string()
        .transform(val => val.trim() === "" ? undefined : val)
        .optional()
        .refine(val => !val || !/[<>]/.test(val), { message: "签名不能包含特殊字符" })
        .refine(val => !val || z.string().max(40).safeParse(val).success, { message: "签名长度需小于40" })
        .optional()
        .default(userInfo.value?.bio || ""),
    // ...existing code...
    email: z.string()
        .transform(val => val.trim() === "" ? undefined : val)
        .optional()
        .refine(val => !val || !/[<>]/.test(val), { message: "邮箱不能包含特殊字符" })
        .refine(val => !val || z.string().email().safeParse(val).success, { message: "请输入有效的邮箱地址" })
        .default(userInfo.value?.email || ""),
    // ...existing code...
    links: z.array(
        z.string()
            .url({ message: "请检查URL输入" })
            .refine(val => !/[<>]/.test(val), { message: "签名不能包含特殊字符" })
    )
        .max(4, { message: "搞啥呢？" })
        .optional()
        .default(userInfo.value?.links || []),
}))

function addLink(value: string[], setValue: (v: string[]) => void) {
    if (value.length < 4) {
        setValue([...value, ""]);
    }
}
function removeLink(idx: number, value: string[], setValue: (v: string[]) => void) {
    const newLinks = value.slice();
    newLinks.splice(idx, 1);
    setValue(newLinks);
}

async function onSubmit(values: any) {
    if (underSubmit.value) return
    underSubmit.value = true
    toast("You submitted the following values:", {
        description: h("pre", { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" }, h("code", { class: "text-white" }, JSON.stringify(values, null, 2))),
    })
    const ok = await updateUserInfo(values)
    if (ok) {
        toast.success('个人资料已更新')
    } else {
        toast.error('更新失败，请稍后再试')
    }
    dialogOpen.value = false
    underSubmit.value = false
}
</script>

<style scoped>
.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>