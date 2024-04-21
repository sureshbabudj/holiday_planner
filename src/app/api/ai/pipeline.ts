import { PipelineType, pipeline } from "@xenova/transformers";

const P = () => class PipelineSingleton {
    static task: PipelineType = 'text2text-generation';
    static model = 'HuggingFaceH4/zephyr-7b-alpha';
    static instance: any = null;

    static async getInstance(progress_callback?: () => void) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

let PipelineSingleton: ReturnType<typeof P>;
if (process.env.NODE_ENV !== 'production') {
    let globalWithPipelineSingleton = global as typeof globalThis & {
        PipelineSingleton: ReturnType<typeof P>;
    };
    if (!globalWithPipelineSingleton.PipelineSingleton) {
        globalWithPipelineSingleton.PipelineSingleton = P();
    }
    PipelineSingleton = globalWithPipelineSingleton.PipelineSingleton;
} else {
    PipelineSingleton = P();
}
export default PipelineSingleton;
