export const formatResponseTime = (startTime) => {
  const endTime = Date.now();
  return endTime - startTime;
};

export const validateTextInput = (text) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Text is required and must be a string' };
  }
  
  if (text.trim().length === 0) {
    return { isValid: false, error: 'Text cannot be empty' };
  }
  
  if (text.length > 10000) {
    return { isValid: false, error: 'Text is too long (maximum 10,000 characters)' };
  }
  
  return { isValid: true };
};

export const sanitizeText = (text) => {
  // Remove any potentially harmful content
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
};

export const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const logAIRequest = (type, duration, success, error = null) => {
  const logData = {
    timestamp: new Date().toISOString(),
    type,
    duration,
    success,
    error: error?.message || null
  };
  
  console.log('AI Request Log:', JSON.stringify(logData));
  return logData;
};
