<template>
    <Dialog v-model:open="dialogOpen">
        <DialogTrigger as-child>
            <secondaryButton text="编辑个人资料" :icon="PenLine"
                class="dark:bg-[#CFCBA0] dark:text-[#0E100F] rounded xl:text-xl md:text-[1rem]" />
        </DialogTrigger>
        <DialogScrollContent class="max-w-[90%] md:max-w-[680px] xl:max-w-[750px] 2xl:max-w-[950px]">
            <DialogHeader>
                <DialogTitle class="dark:text-[#CFCBA0] md:text-3xl text-2xl">
                    <p v-if="!isAdvanced">编辑个人资料</p>
                    <p v-else>账户安全</p>
                </DialogTitle>
                <DialogDescription class="dark:text-[#D5C8B0] md:text-lg">
                    <p v-if="!isAdvanced">于此编辑您用以对外展示的个人资料</p>
                    <p v-else>您可以在这里更改账户安全信息</p>
                </DialogDescription>
            </DialogHeader>
            <Form v-if="isAdvanced" v-slot="{ handleSubmit, setFieldValue }" as="" keep-values
                :validation-schema="emailFormSchema">
                <form id="dialogForm1" @submit="handleSubmit($event, onSubmitEmailForm)"
                    class="flex flex-col space-y-4">
                    <h2 class="flex items-center space-x-2 md:text-2xl text-xl dark:text-[#dbd7aa]">
                        <Mail class="size-5" />
                        <p>换绑邮箱</p>
                    </h2>
                    <FormField v-slot="{ componentField }" name="email">
                        <FormItem>
                            <FormLabel class="data-[error=false]:dark:text-[#FEFCE4] md:text-base text-sm">
                                新邮箱
                            </FormLabel>
                            <FormDescription>
                                换绑邮箱后，您可通过新邮箱登录账户
                            </FormDescription>
                            <FormControl class="flex space-x-2">
                                <div class="flex space-x-2">
                                    <Input type="email" placeholder="请输入您的新邮箱" v-bind="componentField" />
                                    <primaryButton text="发送验证码" type="button"
                                        class="dark:bg-emerald-500 dark:text-[#0E100F] md:text-base"
                                        mask1-color="#1aa0c2" mask2-color="#7de3f3" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ value }" name="emailVerificationCode">
                        <FormItem>
                            <FormLabel class="data-[error=false]:dark:text-[#FEFCE4] md:text-base text-sm">
                                邮箱验证码
                            </FormLabel>
                            <FormControl>
                                <PinInput :model-value="value" placeholder="○" inputmode="numeric"
                                    class="flex gap-2 items-center mt-1" otp type="text" name="emailVerificationCode"
                                    @update:model-value="(arrStr) => {
                                        setFieldValue('emailVerificationCode', arrStr)
                                    }">
                                    <PinInputGroup>
                                        <PinInputSlot v-for="(id, index) in 6" :key="id" :index="index" />
                                    </PinInputGroup>
                                </PinInput>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <secondaryButton text="换绑邮箱" type="submit" form="dialogForm1"
                        :class="['dark:bg-[#CFCBA0] dark:text-[#0E100F] rounded xl:text-xl md:text-[1rem] ml-auto', { 'cursor-progress': emailUnderSubmit }]">
                        <component :is="emailUseIcon"
                            :class="['md:size-5 size-4', { 'animate-spin': emailUnderSubmit }]" />
                    </secondaryButton>
                    <div class="w-full h-[1px] bg-[#2e2c2c]" />
                </form>
            </Form>
            <Form v-if="!isAdvanced" v-slot="{ handleSubmit, setFieldValue }" as="" keep-values
                :validation-schema="normalFormSchema" :initial-values="{
                    nickname: userInfo?.nickname || '',
                    bio: userInfo?.bio || '',
                    links: userInfo?.links || []
                }">
                <form id="dialogForm2"
                    @submit="handleSubmit($event, (values) => onSubmitNormalForm(values, setFieldValue))"
                    class="space-y-4">
                    <!-- 昵称 -->
                    <FormField v-slot="{ componentField }" name="nickname">
                        <FormItem>
                            <FormLabel class="data-[error=false]:dark:text-[#FEFCE4] md:text-base text-sm">
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
                            <FormLabel class="data-[error=false]:dark:text-[#FEFCE4] md:text-base text-sm">
                                <Hash class="size-4" />
                                签名
                            </FormLabel>
                            <FormControl>
                                <Input type="bio" placeholder="个性签名" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <!-- 友情链接 -->
                    <FormField v-slot="{ value, setValue }" name="links">
                        <FormItem>
                            <FormLabel class="data-[error=false]:dark:text-[#FEFCE4] md:text-base text-sm">
                                <Link class="size-4" />
                                外链
                            </FormLabel>
                            <FormDescription>
                                在此添加您的个人网站或社交媒体链接。最多可添加4个链接。
                            </FormDescription>
                            <div class="space-y-4">
                                <div v-for="(_, idx) in value || []" :key="idx" class="flex items-center space-x-2">
                                    <Input type="url" :placeholder="`链接${idx + 1}`" v-model="value[idx]" />
                                    <outlineText @click="removeLink(idx, value, setValue)" text="删除"
                                        lineColor="oklch(63.7% 0.237 25.331)" class="w-fit shrink-0 text-red-500" />
                                </div>
                                <outlineText v-if="(value || []).length < 4" @click="addLink(value, setValue)" text="添加"
                                    lineColor="oklch(62.3% 0.214 259.815)" class="w-fit text-blue-500" />
                            </div>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </form>
            </Form>
            <Form v-else v-slot="{ handleSubmit }" as="" keep-values :validation-schema="passwordFormSchema">
                <form id="dialogForm3" @submit="handleSubmit($event, onSubmitPasswordForm)"
                    class="flex flex-col space-y-4">
                    <h2 class="flex items-center space-x-2 md:text-2xl text-xl dark:text-[#dbd7aa]">
                        <KeyRound class="size-5" />
                        <p>修改密码</p>
                        <input type="text" name="username" :value="userInfo.studentNumber" autocomplete="username"
                            tabindex="-1" class="hidden" />
                    </h2>
                    <FormField v-slot="{ componentField }" name="newPassword">
                        <FormItem>
                            <FormLabel class="data-[error=false]:dark:text-[#FEFCE4] md:text-base text-sm">
                                新密码
                            </FormLabel>
                            <FormControl>
                                <div class="relative w-full">
                                    <Input :type="showPassword ? 'text' : 'password'" placeholder="新密码"
                                        v-bind="componentField" autocomplete="new-password" />
                                    <button type="button" @click="showPassword = !showPassword"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                        <component :is="showPassword ? EyeOff : Eye" class="size-5" />
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="confirmPassword">
                        <FormItem>
                            <FormLabel class="data-[error=false]:dark:text-[#FEFCE4] md:text-base text-sm">
                                确认密码
                            </FormLabel>
                            <FormControl>
                                <div class="relative w-full">
                                    <Input :type="showConfirmPassword ? 'text' : 'password'" placeholder="请再次输入新密码"
                                        v-bind="componentField" autocomplete="new-password" />
                                    <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                        <component :is="showConfirmPassword ? EyeOff : Eye" class="size-5" />
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </form>
            </Form>
            <DialogFooter class="flex flex-row items-center !justify-between space-y-0">
                <outlineButton :text="isAdvanced ? '返回' : '高级选项'" :icon="isAdvanced ? Undo2 : ArrowRight"
                    icon-class="!size-5" @click="handleClick" class="!text-lg dark:text-[#FEF3C6]"
                    bottom-line-class="!mt-0" :keep-in-end="!isDesktop" />
                <secondaryButton :text="isAdvanced ? '修改密码' : '保存更改'" type="submit"
                    :form="isAdvanced ? 'dialogForm3' : 'dialogForm2'"
                    :class="['dark:bg-[#CFCBA0] dark:text-[#0E100F] rounded xl:text-xl md:text-[1rem]', { 'cursor-progress': isAdvanced ? normalUnderSubmit : passwordUnderSubmit }]">
                    <component :is="isAdvanced ? normalUseIcon : passwordUseIcon"
                        :class="['md:size-5 size-4', { 'animate-spin': isAdvanced ? normalUnderSubmit : passwordUnderSubmit }]" />
                </secondaryButton>
            </DialogFooter>
        </DialogScrollContent>
    </Dialog>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { h, ref, computed, watch } from "vue"
import * as z from "zod"

import { secondaryButton, outlineButton, primaryButton } from "@/components/ui/button"
import {
    Dialog,
    DialogScrollContent,
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

import {
    PinInput,
    PinInputGroup,
    PinInputSlot,
} from "@/components/ui/pin-input"

import {
    PenLine,
    UserRound,
    Mail,
    Link,
    Hash,
    Check,
    LoaderCircle,
    ArrowRight,
    Undo2,
    KeyRound,
    Eye,
    EyeOff
} from 'lucide-vue-next';

import { outlineText } from "@/components/ui/text"

import { useUserStore } from "@/stores/user"
import { useSystemStore } from "@/stores/system"
import { useAuthStore } from "@/stores/auth"
import { storeToRefs } from "pinia";
import { toast } from "vue-sonner"
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const { updateCasdoorUserInfo, setPassword, getUserInfo } = userStore;

const systemStore = useSystemStore();
const { isDesktop } = storeToRefs(systemStore);

const authStore = useAuthStore();
const { refresh } = authStore;

const dialogOpen = ref(false);

const iconMap = ref({
    'submit': Check,
    'loading': LoaderCircle
})

const underSubmit = computed(() => {
    return normalUnderSubmit.value || passwordUnderSubmit.value || emailUnderSubmit.value
})

watch(dialogOpen, () => {
    if (underSubmit.value) {
        dialogOpen.value = true
    }
})

const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 校验规则
const normalFormSchema = toTypedSchema(z.object({
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
    links: z.array(
        z.string()
            .url({ message: "请检查URL输入" })
            .refine(val => !/[<>]/.test(val), { message: "签名不能包含特殊字符" })
    )
        .max(4, { message: "搞啥呢？" })
        .optional()
        .default(userInfo.value?.links || []),
}))

const passwordFormSchema = toTypedSchema(z.object({
    newPassword: z.string({ invalid_type_error: `新密码 必须是字符串`, required_error: `新密码 不能为空` })
        .min(6, { message: "新密码 长度需大于等于 8" })
        .max(50, { message: `新密码 长度需小于等于 50` })
        .nonempty({ message: `新密码 不能为空` }),
    confirmPassword: z.string({ invalid_type_error: `确认密码 必须是字符串`, required_error: `确认密码 不能为空` })
        .min(6, { message: "确认密码 长度需大于等于 8" })
        .max(50, { message: `确认密码 长度需小于等于 50` })
        .nonempty({ message: `确认密码 不能为空` })
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "两次输入的新密码不一致",
    path: ["confirmPassword"],
}));

const emailFormSchema = toTypedSchema(z.object({
    email: z.string({ invalid_type_error: `新邮箱 必须是字符串`, required_error: `新邮箱 不能为空` })
        .email()
        .nonempty({ message: `新邮箱 不能为空` }),
    emailVerificationCode: z.preprocess(val => {
        if (Array.isArray(val)) {
            return Number(val.join(''))
        }
        return undefined;
    }, z.number({ invalid_type_error: `邮箱验证码 必须是字符串`, required_error: `邮箱验证码 不能为空` })
        .refine(val => String(Math.abs(val)).length === 6, { message: "邮箱验证码 必须是6位数字" }))
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

const isAdvanced = ref(false);

const normalUseIcon = computed(() => {
    return normalUnderSubmit.value ? iconMap.value['loading'] : iconMap.value['submit']
})

const normalUnderSubmit = ref(false);
async function onSubmitNormalForm(values: any, setFieldValue: (field: string, value: any) => void) {
    if (normalUnderSubmit.value) return
    normalUnderSubmit.value = true
    const info = {
        bio: values.bio,
        properties: {
            nickname: values.nickname,
            links: Array.isArray(values.links) ? values.links.join(',') : values.links
        }
    }
    const ok = await updateCasdoorUserInfo(info)
    if (ok) {
        await refresh()
        await getUserInfo(true)
        toast.success('个人资料更新成功')
        setFieldValue('links', userInfo.value?.links || [])
        setFieldValue('nickname', userInfo.value?.nickname || '')
        setFieldValue('bio', userInfo.value?.bio || '')
    } else {
        toast.error(`个人资料更新失败`)
    }
    dialogOpen.value = false
    normalUnderSubmit.value = false
}

const passwordUseIcon = computed(() => {
    return passwordUnderSubmit.value ? iconMap.value['loading'] : iconMap.value['submit']
})

const passwordUnderSubmit = ref(false);
async function onSubmitPasswordForm(values: any) {
    if (passwordUnderSubmit.value) return
    passwordUnderSubmit.value = true
    const formData = new FormData()
    formData.append('userOwner', String(userInfo.value.owner))
    formData.append('userName', String(userInfo.value.studentNumber))
    formData.append('newPassword', values.newPassword)
    await setPassword(formData)
    dialogOpen.value = false
    passwordUnderSubmit.value = false
}

const emailUseIcon = computed(() => {
    return emailUnderSubmit.value ? iconMap.value['loading'] : iconMap.value['submit']
})

const emailUnderSubmit = ref(false);
//casdoor文档过于答辩 暂时搞不定
async function onSubmitEmailForm(values: any) {
    if (emailUnderSubmit.value) return
    emailUnderSubmit.value = true
    console.log(values);
    const formData = new FormData()
    dialogOpen.value = false
    emailUnderSubmit.value = false
}

function handleClick() {
    if (underSubmit.value) return
    isAdvanced.value = !isAdvanced.value
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