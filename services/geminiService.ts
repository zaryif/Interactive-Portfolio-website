import type { ResumeData } from '../types';
import { GoogleGenAI } from "@google/genai";

// Define a daily request limit to prevent abuse and stay within free tier limits.
const DAILY_REQUEST_LIMIT = 50;

/**
 * Checks if the user has exceeded the daily request limit.
 * Throws an error if the limit is reached.
 * Uses localStorage to track usage per user.
 */
export const checkRateLimit = () => {
    const STORAGE_KEY_DATE = 'portfolio_ai_usage_date';
    const STORAGE_KEY_COUNT = 'portfolio_ai_usage_count';

    const today = new Date().toDateString();
    const lastDate = localStorage.getItem(STORAGE_KEY_DATE);
    let count = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10);

    if (lastDate !== today) {
        count = 0;
        localStorage.setItem(STORAGE_KEY_DATE, today);
    }

    if (count >= DAILY_REQUEST_LIMIT) {
        throw new Error(`Daily demo limit reached (${DAILY_REQUEST_LIMIT} requests/day). Please come back tomorrow!`);
    }

    localStorage.setItem(STORAGE_KEY_COUNT, (count + 1).toString());
};

/**
 * Helper method to natively bypass the client-side Google SDK and connect securely to our Serverless backend proxy.
 */
const callGeminiApi = async (action: string, payload: any) => {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// --- Text and Chat ---

export const getGroundedChatResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string, useMaps: boolean, resumeData: ResumeData): Promise<any> => {
    checkRateLimit();
    return await callGeminiApi('getGroundedChatResponse', { history, newMessage, useMaps, resumeData });
};

// --- Image Generation ---

export const generateImage = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4"): Promise<any> => {
    checkRateLimit();
    return await callGeminiApi('generateImage', { prompt, aspectRatio });
};

// --- Video Generation ---

// Uses a dummy key because window.aistudio dynamically intercepts the underlying HTTP request and uses the Guest's API key.
const getGenAI = () => new GoogleGenAI({ apiKey: "GUEST_PROVIDED_API_KEY" });

export const generateVideo = async (prompt: string, aspectRatio: "16:9" | "9:16", imageBase64?: string, imageMimeType?: string): Promise<any> => {
    const ai = getGenAI();
    const requestPayload: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio,
        }
    };
    if (imageBase64 && imageMimeType) {
        requestPayload.image = {
            imageBytes: imageBase64,
            mimeType: imageMimeType,
        };
    }
    return await ai.models.generateVideos(requestPayload);
};

export const getVideosOperation = async (operation: any): Promise<any> => {
    const ai = getGenAI();
    return await ai.operations.getVideosOperation({ operation });
};

// --- Complex Problem Solving ---

export const getComplexSolution = async (prompt: string): Promise<any> => {
    checkRateLimit();
    return await callGeminiApi('getComplexSolution', { prompt });
};

// --- Image Analysis and Editing ---

export const analyzeImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<any> => {
    checkRateLimit();
    return await callGeminiApi('analyzeImage', { prompt, imageBase64, mimeType });
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<any> => {
    checkRateLimit();
    return await callGeminiApi('editImage', { prompt, imageBase64, mimeType });
};

// --- Text Humanization & Analysis ---

export const humanizeText = async (text: string): Promise<any> => {
    checkRateLimit();
    return await callGeminiApi('humanizeText', { text });
};

export const detectAIText = async (text: string): Promise<any> => {
    checkRateLimit();
    return await callGeminiApi('detectAIText', { text });
};

export const enhancePrompt = async (prompt: string): Promise<any> => {
    checkRateLimit();
    return await callGeminiApi('enhancePrompt', { prompt });
};