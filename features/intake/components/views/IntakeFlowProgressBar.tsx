

import React from 'react';
import { ContextView } from '../../../../types';

interface IntakeFlowProgressBarProps {
    currentView: ContextView;
    isRfqSent?: boolean;
    isVettingStarted?: boolean;
}

export const IntakeFlowProgressBar: React.FC<IntakeFlowProgressBarProps> = ({ currentView, isRfqSent, isVettingStarted }) => {
    const intakeSteps = ['Intake Form', 'Supplier Search', 'Onboarding', 'Vetting', 'Request for Quote'];

    const getStatus = (stepIndex: number): 'complete' | 'active' | 'pending' => {
        if (isRfqSent) {
            return 'complete';
        }

        const viewToStep: Partial<Record<ContextView, number>> = {
            [ContextView.DRAFT_INTAKE_FORM]: 0,
            [ContextView.FINAL_INTAKE_FORM]: 1,
            [ContextView.SUPPLIER_SHORTLIST]: 1,
            [ContextView.SUPPLIER_DASHBOARD]: 2,
            [ContextView.SUPPLIER_COMPARISON]: 4,
            [ContextView.RFQ_FORM]: 4,
        };

        let activeIndex = viewToStep[currentView] ?? -1;
        
        if (currentView === ContextView.SUPPLIER_DASHBOARD && isVettingStarted) {
            activeIndex = 3;
        }
        
        if (activeIndex === -1) return 'pending';
        
        if (stepIndex < activeIndex) return 'complete';
        if (stepIndex === activeIndex) return 'active';
        
        return 'pending';
    };
    
    return (
        <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex items-start">
                {intakeSteps.map((label, index) => {
                    const isLast = index === intakeSteps.length - 1;
                    const status = getStatus(index);

                    let iconBg = 'bg-slate-200';
                    let iconContent: React.ReactNode = <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>;
                    let textColor = 'text-slate-500';
                    let connectorBg = 'bg-slate-300';
                    
                    if (status === 'complete') {
                        iconBg = 'bg-green-500';
                        iconContent = (
                            <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        );
                        textColor = 'text-slate-700';
                        connectorBg = 'bg-green-500';
                    } else if (status === 'active') {
                        iconBg = 'bg-walmart-blue';
                        iconContent = <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>;
                        textColor = 'text-walmart-blue font-semibold';
                        connectorBg = 'bg-slate-300';
                    }

                    return (
                        <React.Fragment key={label}>
                            <div className="flex flex-col items-center px-2 text-center w-32">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg} transition-colors`}>
                                    {iconContent}
                                </div>
                                <p className={`mt-2 text-xs ${textColor} transition-colors`}>{label}</p>
                            </div>
                            {!isLast && <div className={`flex-1 mt-4 h-0.5 ${connectorBg}`} />}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};