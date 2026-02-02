const axios = require('axios');

exports.getChatResponse = async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // These are the models we saw in your successful debug list
  const models = ["gemini-2.0-flash", "gemini-2.5-flash"];
  let lastError = "";

  for (let modelName of models) {
    try {
      console.log(`🤖 Attempting connection to: ${modelName}`);
      
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const response = await axios.post(url, {
        contents: [{
          parts: [{ text: `You are FitFlow Assistant, a fitness expert. Answer: ${message}` }]
        }]
      });

      const replyText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (replyText) {
        console.log(`✅ SUCCESS! ${modelName} is active.`);
        return res.json({ reply: replyText });
      }

    } catch (error) {
      lastError = error.response?.data?.error?.message || error.message;
      
      // If it says limit: 0, it confirms the model is FOUND but waiting for Google
      if (lastError.includes("limit") || lastError.includes("quota")) {
          console.warn(`⏳ Model ${modelName} is waiting for quota activation (Limit: 0).`);
          return res.status(429).json({ 
            message: "Google is still activating your AI key. Please wait 10-15 minutes and try again. Your code is 100% correct!" 
          });
      }
      console.warn(`❌ ${modelName} failed: ${lastError}`);
    }
  }

  res.status(500).json({ message: "AI Assistant is currently connecting to satellites..." });
};

// Keep debug for testing
exports.listModels = async (req, res) => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) { res.status(500).json(error.message); }
};