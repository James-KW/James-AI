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

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { message } = JSON.parse(event.body);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // TRY DIFFERENT MODEL NAMES:
    
    // Option 1: Most common
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Option 2: If above doesn't work
    // const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
    
    // Option 3: Latest model
    // const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    
    const result = await model.generateContent(message);
    const response = await result.response;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: response.text() })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        suggestion: 'Try changing the model name to gemini-pro or gemini-1.0-pro'
      })
    };
  }
};
