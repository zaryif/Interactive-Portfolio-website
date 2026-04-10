import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const getGenAI = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { action, payload } = req.body;
        const ai = getGenAI();

        let result;

        switch (action) {
            case 'getGroundedChatResponse':
                result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: [...payload.history, { role: 'user', parts: [{ text: payload.newMessage }] }],
                    config: {
                        systemInstruction: `You are ZOSO AI, an expert AI assistant for a software developer named ${payload.resumeData.name}. Your goal is to answer questions about their skills, experience, and projects based on the provided resume data. You can also answer general tech questions. Be friendly, helpful, and professional. Here is the resume data in JSON format: ${JSON.stringify(payload.resumeData)}`,
                        tools: payload.useMaps ? [{ googleSearch: {} }, { googleMaps: {} }] : [{ googleSearch: {} }]
                    }
                });
                break;

            case 'generateImage':
                result = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: payload.prompt,
                    config: {
                        numberOfImages: 1,
                        outputMimeType: 'image/png',
                        aspectRatio: payload.aspectRatio,
                    },
                });
                break;

            case 'generateVideo':
                const videoPayload: any = {
                    model: 'veo-3.1-fast-generate-preview',
                    prompt: payload.prompt,
                    config: {
                        numberOfVideos: 1,
                        resolution: '720p',
                        aspectRatio: payload.aspectRatio,
                    }
                };
                if (payload.imageBase64 && payload.imageMimeType) {
                     videoPayload.image = {
                         imageBytes: payload.imageBase64,
                         mimeType: payload.imageMimeType
                     }
                }
                result = await ai.models.generateVideos(videoPayload);
                break;

            case 'getVideosOperation':
                result = await ai.operations.getVideosOperation({ operation: payload.operation });
                break;
                
            case 'getComplexSolution':
                result = await ai.models.generateContent({
                    model: 'gemini-2.5-pro',
                    contents: payload.prompt,
                    config: {
                        thinkingConfig: { thinkingBudget: 32768 },
                    },
                });
                break;

            case 'analyzeImage':
                result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [
                        { inlineData: { data: payload.imageBase64, mimeType: payload.mimeType } },
                        { text: payload.prompt }
                    ]}
                });
                break;

            case 'editImage':
                result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [
                        { inlineData: { data: payload.imageBase64, mimeType: payload.mimeType } },
                        { text: payload.prompt }
                    ]},
                    config: {
                        responseModalities: ["IMAGE"],
                    }
                });
                break;

            case 'humanizeText':
                result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: payload.text,
                    config: {
                        systemInstruction: `You are an advanced AI text humanizer. Your task is to rewrite the provided text to make it sound as if it were written by a human. Focus on varying sentence structure, improving flow, eliminating AI hallmarks, injecting personality, and enhancing word choice. The output should ONLY be the rewritten text, with no preamble.`
                    }
                });
                break;

            case 'detectAIText':
                result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Analyze this text: "${payload.text}"`,
                    config: {
                        systemInstruction: `You are an expert AI text classifier. Your task is to analyze the following text and determine if it was likely written by a human or an AI. Provide a classification and a confidence score. Consider factors like sentence structure variety, word choice, repetitiveness, and common AI linguistic patterns. The output must be a JSON object.`,
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: "OBJECT",
                            properties: {
                                classification: { type: "STRING" },
                                confidence: { type: "NUMBER" },
                                reasoning: { type: "STRING" }
                            },
                            required: ["classification", "confidence", "reasoning"],
                        }
                    }
                });
                break;

            case 'enhancePrompt':
                result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: payload.prompt,
                    config: {
                        systemInstruction: `You are an expert prompt engineer for generative AI models. Your task is to take a user's simple prompt and expand it into a detailed, rich, and well-structured prompt that will produce a high-quality, creative, and specific output, particularly for image generation. Analyze the user's core idea and add details about subject, composition, style, medium, lighting, atmosphere, color palette, and technical details. The output should ONLY be the enhanced prompt text, without any explanation or preamble.`
                    }
                });
                break;

            default:
                return res.status(400).json({ error: 'Unknown action' });
        }

        res.status(200).json(result);
    } catch (error: any) {
        console.error("API Error:", error);
        res.status(500).json({ error: error.message });
    }
}
