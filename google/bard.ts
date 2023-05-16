import { cookies } from "next/dist/client/components/headers";
import { Bard } from "googlebard";

export const googlebard = async (
    token: string,
    prompt: string,
    conversationId?: string
) => {
    let bot = new Bard(token);
    return await bot.ask(prompt);
}