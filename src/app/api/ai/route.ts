import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'
export const revalidate = 0

const accessToken = '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';

async function ask(prompt: string) {
    let logs = '';
    let running = false;
    if (running) {
        return;
    }
    running = true;
    try {
        const hf = new HfInference(accessToken);
        const model = 'TinyLlama/TinyLlama-1.1B-intermediate-step-955k-token-2T';
        // const prompt = `How is butter made? Describe the process from the beginning`;
        // for await (const output of hf.textGenerationStream({
        //     model,
        //     inputs: prompt,
        //     parameters: { max_new_tokens: 250, temperature: 0 }
        // }, {
        //     use_cache: falses
        // })) {
        //     logs += output.token.text;
        // }
        const logs = await hf.textGeneration({
            model,
            inputs: prompt,
            parameters: { max_new_tokens: 250, temperature: 0 }
        });
        return logs;
    } catch (err: any) {
        console.log("Error: " + err.message);
    } finally {
        running = false;
    }
    return logs;
}

export async function GET(request: Request) {
    try {
        const text = new URL(request.url).searchParams.get('text');
        if (!text) {
            throw ({ error: 'Invalid request' });
        }
        const data = await ask(text);
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}