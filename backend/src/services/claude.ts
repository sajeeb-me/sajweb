// services/claude.ts
import Anthropic from "@anthropic-ai/sdk";
import dotenv from 'dotenv';
dotenv.config();

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generatePoem() {
    console.log('Anthropic client initialized.', process.env.ANTHROPIC_API_KEY);
    // const response = await anthropic.messages.create({
    //     model: "claude-sonnet-4-20250514",
    //     max_tokens: 20000,
    //     temperature: 1,
    //     messages: [
    //         {
    //             role: "user",
    //             content: prompt
    //         }
    //     ]
    // });
    // return response;

    console.log('Starting request...');

    // First, let's try a non-streaming request to test the connection
    const message = await anthropic.messages.create({
        // model: 'claude-sonnet-4-20250514',
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        temperature: 0,
        messages: [{ role: 'user', content: 'Hello! Just say "Hi back" to test.' }]
    });

    console.log('Non-streaming test successful:', message);

    // Now try streaming
    console.log('\nTrying streaming...');
    const stream = anthropic.messages.stream({
        messages: [{ role: 'user', content: "Write a short poem about nature" }],
        // model: 'claude-sonnet-4-20250514',
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
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
    console.log('Final message received.');
}

export { generatePoem };