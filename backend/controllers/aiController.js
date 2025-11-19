import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import doctorModel from "../models/doctorModel.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.json({ success: false, reply: "Please describe your issue clearly." });
    }

    // Load available doctors
    const doctors = await doctorModel.find({ available: true }).select([
      "name",
      "speciality",
      "experience",
    ]);

    const doctorsList = doctors
      .map(
        (d, i) =>
          `${i + 1}. ${d.name} — ${d.speciality}, ${d.experience} experience`
      )
      .join("\n");

    // Load the prompt file
    const basePrompt = fs.readFileSync(process.env.PROMPT_PATH, "utf8");

    // Insert dynamic values
    const prompt = basePrompt
      .replace("${doctorsList}", doctorsList)
      .replace("${message}", message);

    // Gemini model
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-09-2025",
    });

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ success: true, reply });

  } catch (error) {
    console.log("AI Error:", error.message);
    return res.json({
      success: false,
      reply: "Server error. Please try again later.",
    });
  }
};
