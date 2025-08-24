import { nekorify, ranaMinder } from './index'

import { errTemplate, returnTemplate, to } from '@/lib/utils'

import type {
    InterviewRes,
    InterviewReservationRes,
    InterviewResultRes
} from '@/types/interview';

export const interviewApi = {
    async getInterviewList() {
        const inst = ranaMinder.Get('/campaign/user')
        return await to<InterviewRes>(inst)
    },
    async getUserInterviewProgress() {
        const inst = ranaMinder.Get('/user_selection/me')
        return await to<InterviewReservationRes>(inst)
    },
    async getInterviewResult() {
        const inst = ranaMinder.Get('/result/me')
        return await to<InterviewResultRes>(inst)
    },
    async uploadInterviewForm(formData: FormData) {
        // const inst = ranaMinder.Post('/application/', formData)
        // return await to(inst)
        console.log('formData', JSON.stringify(formData.get('information')));
        return to(new Promise<any>((resolve, reject) => {
            const random = Math.random()
            if (random < 0.5) {
                setTimeout(() => resolve(returnTemplate(null, true)), 2000)
            } else {
                setTimeout(() => reject(returnTemplate(errTemplate('上传失败，请重试'), null)), 2000)
            }
        }) as any)
    }
}