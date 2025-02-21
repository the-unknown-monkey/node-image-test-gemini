import * as dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(path, mimeType) {
  try {
    const fileData = fs.readFileSync(path); // Read file synchronously
    const base64Data = fileData.toString("base64");
    return {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };
  } catch (error) {
    console.error(`Error reading file ${path}:`, error);
    return null; // Or throw the error if you want to stop execution
  }
}

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = "What is in the given image"; // Corrected prompt

    const imageParts = [
      fileToGenerativePart("jetpack.jpg", "image/jpeg"),
    ];

    // Check if imageParts are valid before sending the request
    if (imageParts.includes(null)) {
      console.error("One or more image files could not be read.  Exiting.");
      return;
    }

    const generatedContent = await model.generateContent([prompt, ...imageParts]);
    console.log(generatedContent.response.text());

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run();