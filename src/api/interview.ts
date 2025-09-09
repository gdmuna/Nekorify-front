import { nekorify, ranaMinder } from './index';

import { errTemplate, returnTemplate, to } from '@/lib/utils';

import type { InterviewRes, InterviewReservationRes, InterviewResultRes } from '@/types/interview';

export const interviewApi = {
    async getInterviewList(force: boolean = false) {
        const inst = ranaMinder.Get<InterviewRes>('/campaign/user').send(force);
        return await to<InterviewRes>(inst);
    },
    async getUserInterviewProgress(force: boolean = false) {
        const inst = ranaMinder.Get<InterviewReservationRes>('/user_selection/me').send(force);
        return await to<InterviewReservationRes>(inst);
    },
    async getInterviewResult(force: boolean = false) {
        const inst = ranaMinder.Get<InterviewResultRes>('/result/me').send(force);
        return await to<InterviewResultRes>(inst);
    },
    async uploadInterviewForm(formData: FormData) {
        const inst = ranaMinder.Post<any>('/application/', formData);
        return await to(inst);
        // console.log('formData', JSON.stringify(formData.get('information')));
        // return to(new Promise<any>((resolve, reject) => {
        //     const random = Math.random()
        //     if (random < 0.5) {
        //         setTimeout(() => resolve(returnTemplate(null, true)), 2000)
        //     } else {
        //         setTimeout(() => reject(returnTemplate(errTemplate('上传失败，请重试'), null)), 2000)
        //     }
        // }) as any)
    }
};
