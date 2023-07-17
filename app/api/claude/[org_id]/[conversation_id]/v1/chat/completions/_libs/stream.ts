import { v1 as uuidv1 } from 'uuid'

const encoder = new TextEncoder();

const text_encoder = (content: string) => {
    return encoder.encode(content);
}

export async function iteratorToStream(response: any) {
    const decoder = new TextDecoder("utf-8");
    const task_id: string = uuidv1().toString();
    const reader = response.body?.getReader();

    return new ReadableStream({
        async start(controller) {
            controller.enqueue(text_encoder(generateStreamResponseStart(task_id)));
        },
        async pull(controller) {
            const { value, done } = await reader?.read();
            if (done) {
                controller.enqueue(text_encoder(generateStreamResponseStop(task_id)));
                controller.enqueue(text_encoder("[DONE]"));
                controller.close();
            } else {
                controller.enqueue(text_encoder(generateStreamResponse(decoder.decode(value), task_id)));
            }
        },
    })
}

const generateStreamResponseStart = (task_id: string) => {
    return JSON.stringify({
        "id": task_id,
        "object": "chat.completion.chunk", "created": Date.parse(new Date().toString()),
        "model": "claude-v2",
        "choices": [{ "delta": { "role": "assistant" }, "index": 0, "finish_reason": null }]
    }) + "\n";
}

const generateStreamResponse = (content: string, task_id: string) => {
    return JSON.stringify({
        "id": task_id,
        "object": "chat.completion.chunk",
        "created": Date.parse(new Date().toString()),
        "model": "claude-v2",
        "choices": [{ "delta": { "content": content }, "index": 0, "finish_reason": null }]
    }) + "\n";
}

const generateStreamResponseStop = (task_id: string) => {
    return JSON.stringify({
        "id": task_id,
        "object": "chat.completion.chunk", "created": Date.parse(new Date().toString()),
        "model": "chatglm-6b",
        "choices": [{ "delta": {}, "index": 0, "finish_reason": "stop" }]
    }) + "\n";
}
