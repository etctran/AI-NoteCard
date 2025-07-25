import geminiService from '../services/geminiService.js';

export const checkGrammar = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required and must be a string' 
      });
    }

    const result = await geminiService.checkGrammar(text);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Grammar check controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check grammar'
    });
  }
};

export const analyzeTone = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required and must be a string' 
      });
    }

    const result = await geminiService.analyzeTone(text);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Tone analysis controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze tone'
    });
  }
};
export const generateCompletions = async (req, res) => {
  try {
    const { text, cursorPosition } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required and must be a string' 
      });
    }

    if (typeof cursorPosition !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'Cursor position is required and must be a number' 
      });
    }

    const result = await geminiService.generateCompletions(text, cursorPosition);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Text completion controller error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate completions'
    });
  }
};
