import React, { useState, useEffect, useRef } from 'react';

interface ChatInputProps {
  suggestions: string[];
  onSendMessage: (message: string) => void;
  showImageUpload: boolean;
  onImageUploadClick: () => void;
  isAgentThinking: boolean;
}

const IconButton: React.FC<{ children: React.ReactNode, onClick?: () => void, ariaLabel: string, disabled?: boolean }> = ({ children, onClick, ariaLabel, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-walmart-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
        {children}
    </button>
);


export const ChatInput: React.FC<ChatInputProps> = ({ suggestions, onSendMessage, showImageUpload, onImageUploadClick, isAgentThinking }) => {
  const [inputValue, setInputValue] = useState('');
  
  const [renderedSuggestions, setRenderedSuggestions] = useState({ suggestions, showImageUpload });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const prevIsAgentThinking = useRef<boolean | undefined>(undefined);

  const isInputDisabled = isAgentThinking;
  const areSuggestionsCurrentlyVisible = (suggestions.length > 0 || showImageUpload) && !isAgentThinking;

  useEffect(() => {
    if (areSuggestionsCurrentlyVisible) {
      setRenderedSuggestions({ suggestions, showImageUpload });
    }
  }, [suggestions, showImageUpload, areSuggestionsCurrentlyVisible]);

  useEffect(() => {
    if (prevIsAgentThinking.current && !isAgentThinking) {
      inputRef.current?.focus();
    }
    prevIsAgentThinking.current = isAgentThinking;
  }, [isAgentThinking]);

  const hasEverHadSuggestions = renderedSuggestions.suggestions.length > 0 || renderedSuggestions.showImageUpload;

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
    setInputValue('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-slate-200">
      {hasEverHadSuggestions && (
        <div 
          className="flex flex-wrap gap-2 mb-3"
          style={{ visibility: areSuggestionsCurrentlyVisible ? 'visible' : 'hidden' }}
          aria-hidden={!areSuggestionsCurrentlyVisible}
        >
          {renderedSuggestions.suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-1 text-sm font-medium text-walmart-blue bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-walmart-blue transition"
              aria-label={`Send suggestion: ${suggestion}`}
              tabIndex={areSuggestionsCurrentlyVisible ? 0 : -1}
            >
              {suggestion}
            </button>
          ))}
          {renderedSuggestions.showImageUpload && (
            <button
              onClick={onImageUploadClick}
              className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 transition flex items-center gap-1.5"
              tabIndex={areSuggestionsCurrentlyVisible ? 0 : -1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span>Upload Image</span>
            </button>
          )}
        </div>
      )}

      <div className="bg-slate-100 rounded-xl p-1.5 flex items-center gap-1">
         <IconButton ariaLabel="Attach file" disabled={isInputDisabled}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
        </IconButton>
        <IconButton ariaLabel="Use microphone" disabled={isInputDisabled}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
        </IconButton>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isInputDisabled ? "Waiting for agent..." : "Type your message"}
          disabled={isInputDisabled}
          className="flex-grow w-full py-1.5 px-3 text-sm text-slate-800 bg-transparent border-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed"
          aria-label="Chat input"
        />
        <button
          onClick={handleSend}
          disabled={isInputDisabled || inputValue.trim() === ''}
          className="flex-shrink-0 flex items-center justify-center w-9 h-9 text-white bg-walmart-blue rounded-lg hover:bg-walmart-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-walmart-blue disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};