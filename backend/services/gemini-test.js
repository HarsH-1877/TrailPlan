require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    try {
        console.log("API KEY:", process.env.GEMINI_API_KEY);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // ✅ FIXED: Using gemini-2.5-flash (FREE tier model)
        // Note: gemini-1.5-flash does NOT exist in the API
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(
            'Return ONLY this JSON: {"status":"working"}'
        );

        console.log("✅ Gemini response:", result.response.text());
    } catch (err) {
        console.error("❌ Gemini ERROR:", err.message);
    }
}

testGemini();
