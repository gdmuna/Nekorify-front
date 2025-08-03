import { ScrollSmoother } from "gsap/ScrollSmoother";
import type { Ref } from "vue";

interface SmootherEffectOptions {
    lag?: number;
    speed?: number;
}

type HTMLObj =
    | Ref<HTMLElement | null>
    | Array<Ref<HTMLElement | null> | string>
    | string
    | string[];

export default class Animation {
    smoother: ScrollSmoother | undefined;

    constructor() {
        this.smoother = ScrollSmoother.get();
    }

    smootherEffects(obj: HTMLObj , eff: SmootherEffectOptions) {
        if (!obj || !this.smoother) return;
        const elements = Array.isArray(obj) ? obj : [obj];
        elements.forEach((el) => {
            if (el && typeof el === 'object' && 'value' in el)  {
                this.smoother?.effects(el.value, eff);
            }
            if (typeof el == 'string') {
                this.smoother?.effects(el, eff);
            }
        })
    }
}