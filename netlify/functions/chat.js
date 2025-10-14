const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { message } = JSON.parse(event.body);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use Gemini 2.5 model names:
    const modelsToTry = [
      "gemini-2.5-pro-exp-03-25",  // Gemini 2.5 Pro
      "gemini-2.0-flash-exp",      // Gemini 2.0 Flash
      "gemini-2.5-flash-exp",      // Gemini 2.5 Flash
      "gemini-2.0-flash-thinking", // Alternative
    ];
    
    let lastError;
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(message);
        const response = await result.response;
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            text: response.text(),
            modelUsed: modelName
          })
        };
      } catch (error) {
        lastError = error;
        continue; // Try next model
      }
    }
    
    throw lastError;
    
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        suggestion: 'Gemini 2.5 requires specific model names'
      })
    };
  }
};
