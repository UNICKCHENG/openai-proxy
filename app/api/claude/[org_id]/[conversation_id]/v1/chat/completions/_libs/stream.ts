import { v1 as uuidv1 } from 'uuid'

const encoder = new TextEncoder();

const text_encoder = (content: string) => {
    return encoder.encode(content);
}

export async function iteratorToStream(response: any) {
    const decoder = new TextDecoder("utf-8");
    const task_id: string = uuidv1().toString();
    const reader = response.body?.getReader();
    let recorder: string = '';

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
                let content: string = decoder.decode(value);
                if (content.startsWith(recorder)) {
                    content = content.substring(recorder.length);
                    recorder += content;
                }
                controller.enqueue(text_encoder(generateStreamResponse(content, task_id)));
            }
        },
    })
}

const generateStreamResponseStart = (task_id: string) => {
    return "data: " + JSON.stringify({
        "id": task_id,
        "object": "chat.completion.chunk", "created": Date.parse(new Date().toString()),
        "model": "claude-v2",
        "choices": [{ "index": 0, "delta": { "role": "assistant", "content": "" }, "finish_reason": null }]
    }) + "\n\n";
}

const generateStreamResponse = (content: string, task_id: string) => {
    return "data: " + JSON.stringify({
        "id": task_id,
        "object": "chat.completion.chunk",
        "created": Date.parse(new Date().toString()),
        "model": "claude-v2",
        "choices": [{ "delta": { "content": content }, "index": 0, "finish_reason": null }]
    }) + "\n\n";
}

const generateStreamResponseStop = (task_id: string) => {
    return "data: " + JSON.stringify({
        "id": task_id,
        "object": "chat.completion.chunk", "created": Date.parse(new Date().toString()),
        "model": "chatglm-6b",
        "choices": [{ "delta": {}, "index": 0, "finish_reason": "stop" }]
    }) + "\n\n";
}
