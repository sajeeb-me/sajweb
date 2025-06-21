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
exports.generatePoem = generatePoem;
// services/claude.ts
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const anthropic = new sdk_1.default({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
function generatePoem() {
    return __awaiter(this, void 0, void 0, function* () {
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
        const message = yield anthropic.messages.create({
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
        yield stream.finalMessage();
        console.log('Final message received.');
    });
}
