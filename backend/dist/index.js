"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const prompts_1 = require("./prompts");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const anthropic = new sdk_1.default({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
app.get('/', (req, res) => {
    res.send('Hello, Anthropic AI!');
});
app.post('/template', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    const response = yield anthropic.messages.create({
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: (0, prompts_1.getSystemPrompt)(),
    });
    res.send(response);
}));
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
