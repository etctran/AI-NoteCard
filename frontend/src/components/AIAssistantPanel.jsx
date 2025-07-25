import { useState } from 'react';
import { CheckCircleIcon, AlertTriangleIcon, XCircleIcon, SparklesIcon } from 'lucide-react';
import api from '../lib/axios';

const AIAssistantPanel = ({ text, onTextCorrection }) => {
  const [grammarResult, setGrammarResult] = useState(null);
  const [toneResult, setToneResult] = useState(null);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [isAnalyzingTone, setIsAnalyzingTone] = useState(false);
  const [error, setError] = useState(null);
  const [correctionApplied, setCorrectionApplied] = useState(false);

  const checkGrammar = async () => {
    if (!text.trim()) {
      setError('Please enter some text to check');
      return;
    }

    setIsCheckingGrammar(true);
    setError(null);
    setCorrectionApplied(false);
    
    try {
      const response = await api.post('/ai/grammar-check', { text });
      
      if (response.data.success) {
        setGrammarResult(response.data.data);
      }
    } catch (error) {
      console.error('Grammar check failed:', error);
      setError('Failed to check grammar. Please try again.');
    } finally {
      setIsCheckingGrammar(false);
    }
  };

  const analyzeTone = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsAnalyzingTone(true);
    setError(null);
    
    try {
      const response = await api.post('/ai/tone-analysis', { text });
      
      if (response.data.success) {
        setToneResult(response.data.data);
      }
    } catch (error) {
      console.error('Tone analysis failed:', error);
      setError('Failed to analyze tone. Please try again.');
    } finally {
      setIsAnalyzingTone(false);
    }
  };

  const applyCorrectedText = () => {
    if (grammarResult?.correctedText && onTextCorrection) {
      onTextCorrection(grammarResult.correctedText);
      setCorrectionApplied(true);
      
      // Update the result to show success state
      setGrammarResult({
        ...grammarResult,
        applied: true,
        message: 'Grammar corrections applied successfully!'
      });
    }
  };

  const closeGrammarResults = () => {
    setGrammarResult(null);
    setCorrectionApplied(false);
  };

  const closeToneResults = () => {
    setToneResult(null);
  };

  const getToneColor = (score) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-error';
  };

  const getToneIcon = (score) => {
    if (score >= 8) return <CheckCircleIcon className="size-4" />;
    if (score >= 6) return <AlertTriangleIcon className="size-4" />;
    return <XCircleIcon className="size-4" />;
  };
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="card-title text-lg flex items-center gap-2">
          <SparklesIcon className="size-5 text-primary" />
          AI Writing Assistant
        </h3>

        {error && (
          <div className="alert alert-error mb-4">
            <XCircleIcon className="size-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <button
            className="btn btn-primary btn-sm flex-1"
            onClick={checkGrammar}
            disabled={isCheckingGrammar || !text.trim()}
          >
            {isCheckingGrammar ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Checking...
              </>
            ) : (
              'Check Grammar'
            )}
          </button>

          <button
            className="btn btn-secondary btn-sm flex-1"
            onClick={analyzeTone}
            disabled={isAnalyzingTone || !text.trim()}
          >
            {isAnalyzingTone ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Analyzing...
              </>
            ) : (
              'Analyze Tone'
            )}
          </button>
        </div>

        {/* Grammar Results */}
        {grammarResult && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">Grammar Check Results</h4>
              <button
                onClick={closeGrammarResults}
                className="btn btn-ghost btn-xs"
                title="Close results"
              >
                <XCircleIcon className="size-4" />
              </button>
            </div>
            
            {grammarResult.applied ? (
              <div className="alert alert-success">
                <CheckCircleIcon className="size-4" />
                <span>{grammarResult.message}</span>
              </div>
            ) : !grammarResult.hasErrors ? (
              <div className="alert alert-success">
                <CheckCircleIcon className="size-4" />
                <span>No grammar errors found!</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="alert alert-warning">
                  <AlertTriangleIcon className="size-4" />
                  <span>{grammarResult.corrections.length} error(s) found</span>
                </div>
                
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {grammarResult.corrections.map((correction, index) => (
                    <div key={index} className="text-xs bg-base-200 p-2 rounded">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="badge badge-xs badge-error">{correction.type}</span>
                      </div>
                      <div>
                        <span className="line-through text-error">{correction.original}</span>
                        {' → '}
                        <span className="text-success">{correction.corrected}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  className="btn btn-success btn-xs"
                  onClick={applyCorrectedText}
                  disabled={correctionApplied}
                >
                  {correctionApplied ? 'Corrections Applied!' : 'Apply All Corrections'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tone Analysis Results */}
        {toneResult && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">Tone Analysis</h4>
              <button
                onClick={closeToneResults}
                className="btn btn-ghost btn-xs"
                title="Close results"
              >
                <XCircleIcon className="size-4" />
              </button>
            </div>
            
            <div className="bg-base-200 p-3 rounded">
              <p className="text-sm mb-3">{toneResult.description}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between items-center">
                  <span>Overall:</span>
                  <div className={`flex items-center gap-1 ${getToneColor(toneResult.overall)}`}>
                    {getToneIcon(toneResult.overall)}
                    <span className="font-mono">{toneResult.overall}/10</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Formality:</span>
                  <div className={`flex items-center gap-1 ${getToneColor(toneResult.formality)}`}>
                    {getToneIcon(toneResult.formality)}
                    <span className="font-mono">{toneResult.formality}/10</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Positivity:</span>
                  <div className={`flex items-center gap-1 ${getToneColor(toneResult.positivity)}`}>
                    {getToneIcon(toneResult.positivity)}
                    <span className="font-mono">{toneResult.positivity}/10</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Clarity:</span>
                  <div className={`flex items-center gap-1 ${getToneColor(toneResult.clarity)}`}>
                    {getToneIcon(toneResult.clarity)}
                    <span className="font-mono">{toneResult.clarity}/10</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center col-span-2">
                  <span>Engagement:</span>
                  <div className={`flex items-center gap-1 ${getToneColor(toneResult.engagement)}`}>
                    {getToneIcon(toneResult.engagement)}
                    <span className="font-mono">{toneResult.engagement}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default AIAssistantPanel;
