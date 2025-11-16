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
    ]);

    const doctorsList = doctors
      .map(
        (d, i) =>
          `${i + 1}. ${d.name} — ${d.speciality}, ${d.experience} experience`
      )
      .join("\n");

    // Initialize Gemini model
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Using gemini-2.5-flash-preview-09-2025 as it's the latest flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // --- NEW, IMPROVED PROMPT ---
    const prompt = `
You are a friendly and professional "AI Health Assistant" for a medical website.
Your role is to help users with two things:
1.  **Health & Symptom Questions:** Provide general, helpful, and safe information about health conditions, symptoms, and wellness.
2.  **Website Support:** Answer questions about how to use the website (e.g., "how to book an appointment", "where to find test results").

**STRICT RULES:**
-   **DO NOT** answer questions unrelated to health, wellness, or using this website (e.g., math, history, coding). Politely state that you can only assist with health and website topics.
-   **DO NOT** provide a medical diagnosis. Always remind the user to consult a doctor for a real diagnosis.
-   **DO NOT** show your internal analysis. The "Analysis" section is for your internal thinking only and must not be in the final response.

**Doctor List (use this for recommendations):**
${doctorsList}

---

**TASK:** Analyze the patient's message and respond according to one of the following scenarios.

**Scenario 1: Patient is asking about symptoms or a condition.**
(e.g., "I have a bad cough and fever", "what are symptoms of a cold?")

1.  **Internal Analysis (DO NOT SHOW THIS):**
    * Identified Symptoms: <list symptoms>
    * Severity: <Low/Medium/High>
    * Best Doctor Speciality: <e.g., General Physician, Cardiologist>
2.  **Your Response (MUST follow this structure):**
    * First, provide a direct, helpful answer to their question (e.g., "Common cold symptoms include a runny nose, sore throat, and cough...").
    * Then, if specific doctors from the list match the required speciality, add the following sections:

**Recommended Doctor(s):**
<List 1-3 matching doctors from the list (Name — Speciality)>

**Note:**
<A brief, helpful note. Must include a reminder that this is not a diagnosis and they should consult a healthcare professional.>

**Scenario 2: Patient is asking for website support.**
(e.g., "How do I book?", "Where is my profile?")

1.  **Your Response:**
    * Provide a clear, direct answer to their website question. (e.g., "You can book an appointment by clicking the 'Book Now' button on any doctor's profile.").

**Scenario 3: Patient is asking an out-of-scope question.**
(e.g., "What is the capital of France?", "Write me a poem.")

1.  **Your Response:**
    * "I'm sorry, I'm an AI Health Assistant and can only help with questions about health, wellness, and using this website."

---

**Patient Message:** "${message}"

**Your Response:**
`;
    // --- END OF NEW PROMPT ---

    const result = await model.generateContent(prompt);
    // Use .text() for the latest API, not .reply
    const response = result.response;
    const reply = response.text();

    res.json({ success: true, reply });
  } catch (error) {
    console.log("AI Error:", error.message);
    return res.json({
      success: false,
      reply: "Server error. Please try again later.",
    });
  }
};