import React, { useRef, useEffect } from 'react';
import { Message as MessageType } from '../types';
import { Message } from './Message';
import { ThinkingIndicator } from './ThinkingIndicator';
import { WaitingIndicator } from './WaitingIndicator';
import { ChatInput } from './ChatInput';
import { SendingInviteAnimation } from './SendingInviteAnimation';

interface ChatPanelProps {
  messages: MessageType[];
  isAgentThinking: boolean;
  isAgentWaiting: boolean;
  isAgentSending: boolean;
  userOptions: string[];
  onUserResponse: (option: string) => void;
  showImageUpload: boolean;
  onImageUploadClick: () => void;
  showSupplierSelectionUI: boolean;
  shortlistedSuppliers: string[];
  primarySupplier: string | null;
  backupSupplier: string | null;
  onSetPrimarySupplier: (name: string) => void;
  onSetBackupSupplier: (name: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ 
    messages, isAgentThinking, isAgentWaiting, isAgentSending, userOptions, onUserResponse, 
    showImageUpload, onImageUploadClick, showSupplierSelectionUI, shortlistedSuppliers,
    primarySupplier, backupSupplier, onSetPrimarySupplier, onSetBackupSupplier
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isAgentThinking, isAgentWaiting, isAgentSending]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">Beacon AI</h2>
        <div className="relative group">
          <div className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-full cursor-pointer">
            <span className="font-semibold text-slate-600">2</span>
          </div>
          <div className="absolute right-0 z-10 w-48 mt-2 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <p className="font-semibold border-b border-slate-600 pb-2 mb-2">Participants</p>
            <ul className="space-y-1.5">
              <li className="flex items-center">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2.5 border border-slate-500"></span>
                You
              </li>
              <li className="flex items-center">
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full mr-2.5 border border-slate-500"></span>
                Sourcing Agent
              </li>
            </ul>
            <div className="absolute right-3 -top-1.5 w-3 h-3 bg-slate-800 transform rotate-45"></div>
          </div>
        </div>
      </div>
      
      {/* Chat Body */}
      <div className="flex-grow p-6 overflow-y-auto bg-white">
        <div className="flex flex-col space-y-4">
          {messages.map((msg) => (
            <Message key={msg.id} user={msg.user} text={msg.text} isThinkingMessage={msg.isThinkingMessage} />
          ))}
          {isAgentThinking && <ThinkingIndicator />}
          {isAgentWaiting && <WaitingIndicator />}
          {isAgentSending && <SendingInviteAnimation />}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Chat Input */}
      <ChatInput 
        suggestions={userOptions}
        onSendMessage={onUserResponse}
        showImageUpload={showImageUpload}
        onImageUploadClick={onImageUploadClick}
        isAgentThinking={isAgentThinking || isAgentWaiting || isAgentSending}
        showSupplierSelectionUI={showSupplierSelectionUI}
        shortlistedSuppliers={shortlistedSuppliers}
        primarySupplier={primarySupplier}
        backupSupplier={backupSupplier}
        onSetPrimarySupplier={onSetPrimarySupplier}
        onSetBackupSupplier={onSetBackupSupplier}
      />
    </div>
  );
};
