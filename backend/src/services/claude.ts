// services/claude.ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function generatePoem(prompt: string) {
    const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 20000,
        temperature: 1,
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    });
    return response;
}