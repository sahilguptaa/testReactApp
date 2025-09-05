
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { LeftNavBar } from './components/LeftNavBar';
import { ChatPanel } from './components/ChatPanel';
import { ContextPanel } from './components/ContextPanel';
import { CONVERSATION_SCRIPT, QUALIFIED_SUPPLIERS } from './constants';
import { Message, UserType, ContextView, ConversationStep } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [isAgentWaiting, setIsAgentWaiting] = useState(false);
  const [isAgentSending, setIsAgentSending] = useState(false);
  const [contextView, setContextView] = useState<ContextView>(ContextView.INITIAL);
  const [userOptions, setUserOptions] = useState<string[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Set<string>>(new Set());
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [supplierStatuses, setSupplierStatuses] = useState<Record<string, string>>({});
  const [primarySupplier, setPrimarySupplier] = useState<string | null>(null);
  const [backupSupplier, setBackupSupplier] = useState<string | null>(null);
  const [showSupplierSelectionUI, setShowSupplierSelectionUI] = useState(false);

  const imageUploadRef = useRef<HTMLInputElement>(null);

  const addMessage = (message: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: prev.length }]);
  };

  useEffect(() => {
    // FIX: Use ReturnType<typeof setTimeout> for timers to ensure correct typing in browser environments.
    let waitingTimerId: ReturnType<typeof setTimeout> | undefined;

    if (currentStep >= CONVERSATION_SCRIPT.length) return;

    const step: ConversationStep = CONVERSATION_SCRIPT[currentStep];

    if (step.speaker === UserType.AGENT) {
      setIsAgentThinking(true);

      const baseThinkingTime = step.thinkingTime || 0;
      const variableDelay = step.thinkingTime ? Math.random() * 1000 : 0;
      const totalDelay = baseThinkingTime + variableDelay;

      const thinkingTimerId = setTimeout(() => {
        setIsAgentThinking(false);
        
        let messageText = step.text;
        if (typeof messageText === 'function') {
            messageText = messageText({ primary: primarySupplier, backup: backupSupplier });
        }

        if (step.awaitsCompletion && React.isValidElement(messageText)) {
          messageText = React.cloneElement(messageText as React.ReactElement<any>, {
            onComplete: () => {
              const nextStepIndex = currentStep + 1;
              if (nextStepIndex < CONVERSATION_SCRIPT.length) {
                setCurrentStep(nextStepIndex);
              }
            },
          });
        }

        addMessage({ user: UserType.AGENT, text: messageText, isThinkingMessage: step.isThinkingMessage });

        if (step.contextView) {
          setContextView(step.contextView);
        }

        const hasOptions = (step.options && step.options.length > 0) || step.isImageUpload || step.isSupplierSelection;

        const proceed = () => {
            if (step.autoContinue && !hasOptions) {
                const nextStepIndex = currentStep + 1;
                if (nextStepIndex < CONVERSATION_SCRIPT.length) {
                    setCurrentStep(nextStepIndex);
                }
            } else if (!step.awaitsCompletion) {
                setUserOptions(step.options || []);
                setShowImageUpload(step.isImageUpload || false);
                setShowSupplierSelectionUI(step.isSupplierSelection || false);
            }
        };
        
        if (step.waitingTime) {
            setIsAgentWaiting(true);
            waitingTimerId = setTimeout(() => {
                setIsAgentWaiting(false);
                proceed();
            }, step.waitingTime);
        } else {
            proceed();
        }

      }, totalDelay);
      
      return () => {
          clearTimeout(thinkingTimerId);
          if (waitingTimerId) {
              clearTimeout(waitingTimerId);
          }
      };
    } else if (step.speaker === UserType.USER) {
      const timer = setTimeout(() => {
          // FIX: Resolve `step.text` if it is a function to ensure it is a valid ReactNode before passing to `addMessage`.
          let messageText = step.text;
          if (typeof messageText === 'function') {
            // This case is not expected for user steps in the script, but handled for type safety.
            messageText = messageText({ primary: null, backup: null });
          }
          addMessage({ user: UserType.USER, text: messageText });
          const nextStepIndex = currentStep + 1;
          if (nextStepIndex < CONVERSATION_SCRIPT.length) {
              setCurrentStep(nextStepIndex);
          }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, primarySupplier, backupSupplier]);

  useEffect(() => {
    if (contextView === ContextView.SUPPLIER_DASHBOARD) {
        const initialStatuses: Record<string, string> = {};
        for (const supplierName of selectedSuppliers) {
            const supplierInfo = QUALIFIED_SUPPLIERS.find(s => s.name === supplierName);
            if (supplierInfo) {
                initialStatuses[supplierName] = supplierInfo.status === 'Onboarded' ? 'Onboarded' : 'Invite Pending';
            }
        }
        setSupplierStatuses(initialStatuses);
    }
  }, [contextView, selectedSuppliers]);

  const handleUserResponse = (response: string) => {
    let userMessage = response;
    const currentStepConfig = CONVERSATION_SCRIPT[currentStep];

    if (currentStepConfig.contextView === ContextView.SUPPLIER_SHORTLIST && response === 'Confirm Shortlist') {
      if (selectedSuppliers.size === 0) {
        addMessage({ user: UserType.AGENT, text: "Please select at least one supplier before confirming." });
        return;
      }
      userMessage = `Shortlist: ${Array.from(selectedSuppliers).join(', ')}.`;
    } else if (currentStepConfig.isSupplierSelection && response === 'Confirm Selection') {
        if (!primarySupplier) {
            addMessage({ user: UserType.AGENT, text: "Please select a primary supplier before confirming." });
            return;
        }
        userMessage = `Primary: ${primarySupplier}${backupSupplier ? `, Backup: ${backupSupplier}` : ''}.`;
        setShowSupplierSelectionUI(false);
    }
    
    addMessage({ user: UserType.USER, text: userMessage });
    setUserOptions([]);
    setShowImageUpload(false);
    
    // Conditional step jumps
    if (currentStep === 18 && response === "Draft my own instead.") {
        setCurrentStep(21); // Jump to manual question step
        return;
    }

    if (currentStep === 12 && response === "Yes, send them.") {
        setIsAgentSending(true);

        const newStatuses = { ...supplierStatuses };
        QUALIFIED_SUPPLIERS.forEach(supplier => {
            if (selectedSuppliers.has(supplier.name) && supplier.status !== 'Onboarded') {
                newStatuses[supplier.name] = 'Sending Invite...';
            }
        });
        setSupplierStatuses(newStatuses);
        
        const nextStepDelay = CONVERSATION_SCRIPT[currentStep + 1]?.thinkingTime || 2000;
        
        setTimeout(() => {
            setIsAgentSending(false);
            
            setSupplierStatuses(prevStatuses => {
                const finalStatuses = { ...prevStatuses };
                Object.keys(finalStatuses).forEach(name => {
                    if (finalStatuses[name] === 'Sending Invite...') {
                        finalStatuses[name] = 'Invited';
                    }
                });
                return finalStatuses;
            });
            
            const nextStepIndex = currentStep + 1;
            if (nextStepIndex < CONVERSATION_SCRIPT.length) {
                setCurrentStep(nextStepIndex);
            }
        }, nextStepDelay);

        return; 
    }
    
    if (currentStep === 4 && response === "Accept directly") {
      setCurrentStep(7);
      return;
    }

    const nextStepIndex = currentStep + 1;
    if (nextStepIndex < CONVERSATION_SCRIPT.length) {
      setCurrentStep(nextStepIndex);
    }
  };

  const handleImageUpload = () => {
    addMessage({ user: UserType.USER, text: "Uploading the image." });
    setUserOptions([]);
    setShowImageUpload(false);

    const nextStepIndex = currentStep + 1;
    if (nextStepIndex < CONVERSATION_SCRIPT.length) {
      setCurrentStep(nextStepIndex);
    }
  };
  
  const triggerImageUpload = () => {
      if (imageUploadRef.current) {
          imageUploadRef.current.click();
      }
  };

  const handleToggleSupplier = (supplierName: string) => {
    setSelectedSuppliers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(supplierName)) {
        newSet.delete(supplierName);
      } else {
        newSet.add(supplierName);
      }
      return newSet;
    });
  };

  const handleSetPrimarySupplier = (name: string) => {
      setPrimarySupplier(name);
      if (backupSupplier === name) {
          setBackupSupplier(null);
      }
  };

  const handleSetBackupSupplier = (name: string) => {
      if (primarySupplier !== name) {
          setBackupSupplier(name);
      }
  };


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header onMenuClick={() => setIsNavOpen(!isNavOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <LeftNavBar isOpen={isNavOpen} />
        <main className="flex-grow grid grid-cols-1 md:grid-cols-5 gap-6 p-6 overflow-auto">
          <div className="md:col-span-3 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
            <ContextPanel 
              view={contextView} 
              selectedSuppliers={selectedSuppliers}
              onToggleSupplier={handleToggleSupplier}
              supplierStatuses={supplierStatuses}
              primarySupplier={primarySupplier}
            />
          </div>
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md flex flex-col overflow-hidden">
            <ChatPanel
              messages={messages}
              isAgentThinking={isAgentThinking}
              isAgentWaiting={isAgentWaiting}
              isAgentSending={isAgentSending}
              userOptions={userOptions}
              onUserResponse={handleUserResponse}
              showImageUpload={showImageUpload}
              onImageUploadClick={triggerImageUpload}
              showSupplierSelectionUI={showSupplierSelectionUI}
              shortlistedSuppliers={Array.from(selectedSuppliers)}
              primarySupplier={primarySupplier}
              backupSupplier={backupSupplier}
              onSetPrimarySupplier={handleSetPrimarySupplier}
              onSetBackupSupplier={handleSetBackupSupplier}
            />
          </div>
        </main>
      </div>
      <input type="file" ref={imageUploadRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
    </div>
  );
};

export default App;
