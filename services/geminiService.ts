
declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

import { GoogleGenAI, Type } from "@google/genai";
import type { MealPlan } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const mealPlanSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      day: {
        type: Type.INTEGER,
        description: "Day of the month, from 1 to 30.",
      },
      mealName: {
        type: Type.STRING,
        description: "The name of the Thai lunch dish in Thai language.",
      },
      imagePrompt: {
        type: Type.STRING,
        description: "A detailed, photorealistic English prompt for an image generation AI, describing the dish. Example: 'A steaming bowl of Tom Yum Goong soup with fresh prawns, mushrooms, and herbs, photorealistic style.'",
      },
    },
    required: ["day", "mealName", "imagePrompt"],
  },
};

export async function generateNovemberMealPlan(): Promise<MealPlan> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: "สร้างรายการอาหารกลางวันสำหรับ 30 วันในเดือนพฤศจิกายน โดยเน้นอาหารไทยที่หลากหลายและไม่ซ้ำกันในแต่ละวัน. สำหรับแต่ละเมนู กรุณาตั้งชื่อเมนูเป็นภาษาไทย และสร้าง image prompt เป็นภาษาอังกฤษสำหรับใช้สร้างภาพอาหารเมนูนั้นๆ. ผลลัพธ์ต้องเป็น JSON array เท่านั้น.",
      config: {
        responseMimeType: "application/json",
        responseSchema: mealPlanSchema,
      },
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
      throw new Error("Received an empty response from the Gemini API.");
    }
    
    const mealPlan = JSON.parse(jsonText) as MealPlan;
    // Sort by day just in case the model doesn't return it in order
    return mealPlan.sort((a, b) => a.day - b.day);
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw new Error("Failed to generate meal plan from Gemini API.");
  }
}

export async function generateMealImage(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating meal image:", error);
    // Return a placeholder or re-throw
    return "https://picsum.photos/500/500?grayscale";
  }
}
