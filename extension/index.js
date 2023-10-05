const vscode = require('vscode');
const axios = require('axios');

const openaiApiKey = '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';

async function sendToChatGPT(text) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: text,
        max_tokens: 50, // Adjust this as needed
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );

    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error sending request to ChatGPT:', error);
    return 'An error occurred while connecting to ChatGPT.';
  }
}
