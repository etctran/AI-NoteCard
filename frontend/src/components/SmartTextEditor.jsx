import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, StarIcon } from 'lucide-react';
import api from '../lib/axios';

const SmartTextEditor = ({ value, onChange, placeholder, className = '', onAIAssist }) => {
  const [showCompletions, setShowCompletions] = useState(false);
  const [completions, setCompletions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoadingCompletions, setIsLoadingCompletions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [completionCursorPos, setCompletionCursorPos] = useState(0);
  
  const textareaRef = useRef(null);

  // Helper function to get confidence color and icon
  const getConfidenceDisplay = (confidence) => {
    const score = confidence || 5; // Default to 5 if no confidence provided
    
    if (score >= 8) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: '🎯',
        label: 'High'
      };
    } else if (score >= 6) {
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: '⚡',
        label: 'Medium'
      };
    } else {
      return {
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        icon: '💭',
        label: 'Low'
      };
    }
  };

  // Calculate cursor position in textarea
  const getCursorPosition = () => {
    if (!textareaRef.current) return { x: 0, y: 0 };
    
    const textarea = textareaRef.current;
    const cursorIndex = textarea.selectionStart;
    
    // Create mirror div
    const mirror = document.createElement('div');
    const computedStyle = getComputedStyle(textarea);
    
    // Copy all relevant styles
    [
      'border', 'boxSizing', 'fontFamily', 'fontSize', 'fontWeight',
      'letterSpacing', 'lineHeight', 'padding', 'textDecoration',
      'textIndent', 'textTransform', 'whiteSpace', 'wordBreak', 'wordWrap'
    ].forEach(prop => {
      mirror.style[prop] = computedStyle[prop];
    });
    
    mirror.style.position = 'absolute';
    mirror.style.visibility = 'hidden';
    mirror.style.top = '-9999px';
    mirror.style.left = '-9999px';
    mirror.style.width = computedStyle.width;
    mirror.style.height = 'auto';
    mirror.style.overflow = 'hidden';
    
    // Add text up to cursor
    const textBeforeCursor = value.substring(0, cursorIndex);
    mirror.textContent = textBeforeCursor;
    
    // Add span for cursor measurement
    const cursorSpan = document.createElement('span');
    cursorSpan.textContent = '|';
    mirror.appendChild(cursorSpan);
    
    document.body.appendChild(mirror);
    
    // Get positions
    const textareaRect = textarea.getBoundingClientRect();
    const spanRect = cursorSpan.getBoundingClientRect();
    const mirrorRect = mirror.getBoundingClientRect();
    
    // Calculate relative position
    const x = textareaRect.left + (spanRect.left - mirrorRect.left);
    const y = textareaRect.top + (spanRect.top - mirrorRect.top) + 25;
    
    document.body.removeChild(mirror);
    
    return { x, y };
  };

  // Handle key down events
  const handleKeyDown = async (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      if (showCompletions && completions.length > 0) {
        // Apply selected completion
        applyCompletion(completions[selectedIndex]);
      } else {
        // Request new completions
        await requestCompletions();
      }
    } else if (e.key === 'Escape') {
      setShowCompletions(false);
    } else if (showCompletions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, completions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        applyCompletion(completions[selectedIndex]);
      }
    }
  };

  // Request completions from API
  const requestCompletions = async () => {
    if (!textareaRef.current) return;
    
    try {
      setIsLoadingCompletions(true);
      const cursorPos = textareaRef.current.selectionStart;
      setCompletionCursorPos(cursorPos); // Store cursor position
      
      const response = await api.post('/ai/completions', {
        text: value,
        cursorPosition: cursorPos
      });

      if (response.data.success && response.data.data.completions) {
        setCompletions(response.data.data.completions);
        setSelectedIndex(0);
        
        // Calculate and set position
        const position = getCursorPosition();
        setDropdownPosition(position);
        setShowCompletions(true);
      }
    } catch (error) {
      console.error('Failed to get completions:', error);
      onAIAssist && onAIAssist('Failed to generate completions');
    } finally {
      setIsLoadingCompletions(false);
    }
  };

  // Apply selected completion
  const applyCompletion = (completion) => {
    if (!completion) {
      console.log('No completion provided');
      return;
    }
    
    console.log('=== APPLYING COMPLETION ===');
    console.log('Completion text:', completion.text);
    console.log('Current value length:', value.length);
    console.log('Stored cursor position:', completionCursorPos);
    
    // Use stored cursor position instead of current selection
    const cursorPos = completionCursorPos;
    const textBefore = value.substring(0, cursorPos);
    const textAfter = value.substring(cursorPos);
    const newText = textBefore + completion.text + textAfter;
    
    console.log('Text before:', textBefore);
    console.log('Text after:', textAfter);
    console.log('New text:', newText);
    
    // Apply the change
    onChange(newText);
    setShowCompletions(false);
    
    // Set cursor position after completion
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = cursorPos + completion.text.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        console.log('Cursor moved to position:', newCursorPos);
        console.log('=== COMPLETION APPLIED ===');
      }
    }, 50); // Increased timeout slightly
  };

  // Handle text changes
  const handleTextChange = (e) => {
    onChange(e.target.value);
    
    // Hide completions when typing
    if (showCompletions) {
      setShowCompletions(false);
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on textarea or dropdown
      if (textareaRef.current && textareaRef.current.contains(event.target)) {
        return;
      }
      
      // Check if clicking inside the completion dropdown
      const dropdownElement = document.querySelector('[data-completion-dropdown]');
      if (dropdownElement && dropdownElement.contains(event.target)) {
        return;
      }
      
      setShowCompletions(false);
    };

    if (showCompletions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCompletions]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${className} ${isLoadingCompletions ? 'opacity-75' : ''}`}
      />
      
      {isLoadingCompletions && (
        <div className="absolute top-2 right-2">
          <div className="loading loading-spinner loading-sm"></div>
        </div>
      )}
      
      {/* Completion Dropdown */}
      {showCompletions && completions.length > 0 && (
        <div 
          data-completion-dropdown
          className="fixed bg-white border-2 border-blue-500 rounded-xl shadow-2xl min-w-80 max-w-md"
          style={{
            left: `${dropdownPosition.x}px`,
            top: `${dropdownPosition.y}px`,
            zIndex: 10000,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="p-4">
            <div className="text-xs text-blue-600 font-bold mb-2 flex items-center gap-2">
              <ChevronDownIcon className="size-4" />
              AI Writing Suggestions
            </div>
            <div className="text-xs text-gray-500 mb-3 flex items-center justify-between">
              <span>Tab/Enter to apply • ↑↓ to navigate • Esc to close</span>
              <span className="flex items-center gap-1">
                <StarIcon className="size-3" />
                Confidence scores
              </span>
            </div>
            
            {completions.map((completion, index) => {
              const confidenceDisplay = getConfidenceDisplay(completion.confidence);
              
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer mb-2 last:mb-0 border-2 transition-all duration-200 ${
                    index === selectedIndex 
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg transform scale-[1.02]' 
                      : 'hover:bg-blue-50 hover:border-blue-300 border-gray-200 hover:shadow-md'
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent textarea from losing focus
                    console.log('Mouse down on completion:', completion.text);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Clicked completion:', completion.text);
                    applyCompletion(completion);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-sm flex-1">{completion.preview}</div>
                    <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      index === selectedIndex ? 'bg-white/20 text-white' : `${confidenceDisplay.bgColor} ${confidenceDisplay.color}`
                    }`}>
                      <span>{confidenceDisplay.icon}</span>
                      <span>{completion.confidence || 5}/10</span>
                    </div>
                  </div>
                  <div className={`text-xs ${index === selectedIndex ? 'text-blue-100' : 'text-gray-600'}`}>
                    "{completion.text.substring(0, 120)}{completion.text.length > 120 ? '...' : ''}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-600 mt-3 flex items-center gap-2">
        <span>💡 Press <kbd className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-xs">Tab</kbd> for AI completions</span>
        {isLoadingCompletions && (
          <span className="text-blue-500 flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Generating...
          </span>
        )}
      </div>
    </div>
  );
};

export default SmartTextEditor;
