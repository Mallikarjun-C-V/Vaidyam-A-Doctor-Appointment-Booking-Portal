import { GoogleGenerativeAI } from "@google/generative-ai";
import doctorModel from "../models/doctorModel.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.json({ success: false, reply: "Please describe your issue clearly." });
    }

    // Load doctors for AI recommendation
    const doctors = await doctorModel.find({ available: true }).select([
      "name",
      "speciality",
      "experience",
      "_id"
    ]);

    const doctorsList = doctors
      .map(
        (d, i) =>
          `${i + 1}. ${d.name} — ${d.speciality}, ${d.experience} experience (ID: ${d._id})`
      )
      .join("\n");

    // Initialize Gemini model
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an AI medical assistant.  
Your job:
1. Analyze the patient's message.
2. Identify symptoms.
3. Determine severity (Low / Medium / High).
4. Recommend 1–3 doctors from the below list based on symptoms.
5. Provide a short explanation.
6. Output must be friendly and simple.

Doctor list:
${doctorsList}

Patient: "${message}"

Give answer in this structure:

**Analysis:**  
<your analysis>

**Recommended Doctor(s):**  
<doctor names + speciality>

**Note:**  
<small advice, no long paragraphs>
    `;

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
