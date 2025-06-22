import Anthropic from "@anthropic-ai/sdk";
import dotenv from 'dotenv';
import express from 'express';
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { TextBlock } from "@anthropic-ai/sdk/resources/messages";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

app.get('/', (req, res) => {
    res.send('Hello, Anthropic AI!');
});
app.post('/template', async (req, res) => {
    const prompt = req.body.prompt;

    const response = await anthropic.messages.create({
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        // system: getSystemPrompt(),
        system: "Return either node or react based on what do you think this project should be. Only return a single word, either 'node' or 'react'. Do not return anything else.",
    });

    const answer = (response.content[0] as TextBlock).text; // react or node
    console.log('Response from /template:', answer);
    if (answer == "react") {
        res.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        })
        return;
    } if (answer == "node") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [nodeBasePrompt]
        })
        return;
    }

    res.status(403).json({
        error: 'Invalid response from AI. Expected "react" or "node".'
    });
    return;
});

app.post('/chat', async (req, res) => {
    const messages = req.body.messages;
    const response = await anthropic.messages.create({
        messages: messages,
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: getSystemPrompt()
    })
    console.log('Response from /chat:', response.content);

    res.json({
        response: (response.content[0] as TextBlock)?.text
    })
});



app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// async function main() {
//     const stream = anthropic.messages.stream({
//         messages: [
//             {
//                 role: 'user',
//                 content: "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them. \n\nUse icons from lucide-react for logos. \n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n\n"
//             },
//             {
//                 role: 'user',
//                 content: "create a todo todo"
//             }
//         ],
//         // model: 'claude-sonnet-4-20250514',
//         model: 'claude-3-5-sonnet-20241022',
//         max_tokens: 1024,
//         system: getSystemPrompt(),
//     });

//     stream.on('text', (text) => {
//         console.log('Received text chunk:', text);
//         process.stdout.write(text);
//     });

//     stream.on('error', (error) => {
//         console.error('Stream error:', error);
//     });

//     stream.on('end', () => {
//         console.log('\n--- Stream ended ---');
//     });

//     await stream.finalMessage();
// }

// main();
