import Anthropic from "@anthropic-ai/sdk";
import dotenv from 'dotenv';
import { getSystemPrompt } from "./prompts";
dotenv.config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main() {
    const stream = anthropic.messages.stream({
        messages: [{ role: 'user', content: "Write a short poem about nature" }],
        // model: 'claude-sonnet-4-20250514',
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: getSystemPrompt(),
    });

    stream.on('text', (text) => {
        console.log('Received text chunk:', text);
        process.stdout.write(text);
    });

    stream.on('error', (error) => {
        console.error('Stream error:', error);
    });

    stream.on('end', () => {
        console.log('\n--- Stream ended ---');
    });

    await stream.finalMessage();
}

main();
