require('dotenv').config();
import Anthropic from "@anthropic-ai/sdk";


const anthropic = new Anthropic();


async function main() {
    const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 20000,
        temperature: 1,
        messages: [
            {
                role: "user",
                content: "Write a poem about the beauty of nature."
            }
        ]
    });
    console.log(msg);
}

main();
