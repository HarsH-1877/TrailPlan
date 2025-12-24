require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    try {
        console.log("API KEY:", process.env.GEMINI_API_KEY);
        console.log("\n📋 Fetching available models...\n");

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Try to list models
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
        );

        const data = await response.json();

        if (data.models) {
            console.log(`✅ Found ${data.models.length} available models:\n`);

            data.models.forEach(model => {
                console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                console.log(`Model: ${model.name}`);
                console.log(`Display Name: ${model.displayName || 'N/A'}`);
                console.log(`Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
            });

            // Try to use the first model that supports generateContent
            const contentModel = data.models.find(m =>
                m.supportedGenerationMethods?.includes('generateContent')
            );

            if (contentModel) {
                console.log(`\n\n🎯 Testing with: ${contentModel.name}\n`);
                const model = genAI.getGenerativeModel({ model: contentModel.name.replace('models/', '') });
                const result = await model.generateContent('Say "Hello!"');
                console.log(`✅ Response:`, result.response.text());
            }
        } else {
            console.error("❌ Error:", data);
        }

    } catch (err) {
        console.error("❌ ERROR:", err.message);
    }
}

listModels();
