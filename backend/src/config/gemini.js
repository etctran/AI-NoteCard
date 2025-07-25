import { GoogleGenAI } from "@google/genai";

class GeminiConfig {
  constructor() {
    this.ai = null;
    this.model = "gemini-2.5-flash";
  }

  getClient() {
    if (!this.ai) {
      // The client gets the API key from the environment variable `GEMINI_API_KEY` automatically
      this.ai = new GoogleGenAI({});
    }
    return this.ai;
  }

  async generateContent(contents, config = {}) {
    try {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: this.model,
        contents: contents,
        config: {
          thinkingConfig: {
            thinkingBudget: 0 // Disable thinking for faster responses
          },
          temperature: 0.7,
          ...config
        }
      });
      return response;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  // Helper method for structured JSON responses
  async generateStructuredContent(prompt) {
    const response = await this.generateContent(prompt);
    return this.parseJsonResponse(response.text);
  }

  parseJsonResponse(responseText) {
    try {
      // Remove markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Failed to parse JSON response:', responseText);
      throw new Error('Invalid response format from AI service');
    }
  }
}

export default new GeminiConfig();
