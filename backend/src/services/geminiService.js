import geminiConfig from '../config/gemini.js';
import { validateTextInput, sanitizeText, formatResponseTime, logAIRequest } from '../utils/aiUtils.js';

class GeminiService {
  async checkGrammar(text) {
    const startTime = Date.now();
    
    try {
      const validation = validateTextInput(text);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const sanitizedText = sanitizeText(text);
      
      const prompt = `Please check the grammar of the following text and provide corrections. 
      Return a JSON response with this exact structure:
      {
        "hasErrors": boolean,
        "corrections": [
          {
            "original": "incorrect text",
            "corrected": "corrected text",
            "position": { "start": number, "end": number },
            "type": "grammar|spelling|punctuation"
          }
        ],
        "correctedText": "full corrected text"
      }
      
      Text to check: "${sanitizedText}"`;

      const response = await geminiConfig.generateStructuredContent(prompt);
      const duration = formatResponseTime(startTime);
      
      logAIRequest('grammar-check', duration, true);
      
      return response;
    } catch (error) {
      const duration = formatResponseTime(startTime);
      logAIRequest('grammar-check', duration, false, error);
      console.error('Grammar check error:', error);
      throw new Error('Failed to check grammar');
    }
  }

  async analyzeTone(text) {
    const startTime = Date.now();
    
    try {
      const validation = validateTextInput(text);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const sanitizedText = sanitizeText(text);
      
      const prompt = `Analyze the tone of the following text and provide a score from 0-10 for different tone aspects.
      Return a JSON response with this exact structure:
      {
        "overall": number,
        "formality": number,
        "positivity": number,
        "clarity": number,
        "engagement": number,
        "description": "brief description of the overall tone"
      }
      
      Text to analyze: "${sanitizedText}"`;

      const response = await geminiConfig.generateStructuredContent(prompt);
      const duration = formatResponseTime(startTime);
      
      logAIRequest('tone-analysis', duration, true);
      
      return response;
    } catch (error) {
      const duration = formatResponseTime(startTime);
      logAIRequest('tone-analysis', duration, false, error);
      console.error('Tone analysis error:', error);
      throw new Error('Failed to analyze tone');
    }
  }
  async generateCompletions(text, cursorPosition) {
    const startTime = Date.now();
    
    try {
      const validation = validateTextInput(text);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      if (typeof cursorPosition !== 'number' || cursorPosition < 0 || cursorPosition > text.length) {
        throw new Error('Invalid cursor position');
      }

      const sanitizedText = sanitizeText(text);
      const beforeCursor = sanitizedText.substring(0, cursorPosition);
      const afterCursor = sanitizedText.substring(cursorPosition);
      
      const prompt = `You are an intelligent writing assistant. Complete the text naturally based on the context.

Context before cursor: "${beforeCursor}"
Context after cursor: "${afterCursor}"

Generate 3 different completions with confidence scores from 1-10:
- First completion should be your BEST guess (confidence 8-10)
- Second completion should be good but less certain (confidence 6-7)  
- Third completion should be more speculative (confidence 4-5)

Example response format:
{
  "completions": [
    {
      "text": "an incredibly versatile and popular programming language.",
      "preview": "Short, direct continuation",
      "confidence": 9
    },
    {
      "text": "a high-level, interpreted programming language known for its readability and wide range of applications, from web development to data science.",
      "preview": "Medium-length explanation", 
      "confidence": 7
    },
    {
      "text": "often praised for its simplicity and extensive libraries, making it an excellent choice for beginners to learn programming fundamentals.",
      "preview": "Longer, comprehensive explanation",
      "confidence": 5
    }
  ]
}

NOW generate completions for the given context. Make sure each completion has a DIFFERENT confidence score between 1-10:`;

      const response = await geminiConfig.generateStructuredContent(prompt);
      const duration = formatResponseTime(startTime);
      
      // Debug logging for confidence scores
      console.log('=== GEMINI COMPLETIONS RESPONSE ===');
      console.log('Raw response:', JSON.stringify(response, null, 2));
      if (response.completions) {
        response.completions.forEach((completion, index) => {
          console.log(`Completion ${index + 1}:`);
          console.log(`  Preview: ${completion.preview}`);
          console.log(`  Confidence: ${completion.confidence} (type: ${typeof completion.confidence})`);
        });
      }
      console.log('=== END GEMINI RESPONSE ===');
      
      logAIRequest('text-completion', duration, true);
      
      return response;
    } catch (error) {
      const duration = formatResponseTime(startTime);
      logAIRequest('text-completion', duration, false, error);
      console.error('Text completion error:', error);
      throw new Error('Failed to generate completions');
    }
  }
}

export default new GeminiService();
