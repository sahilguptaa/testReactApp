
import React from 'react';

const PanelHeader: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => (
  <div className="p-6 border-b border-slate-200">
    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colorClasses: { [key: string]: string } = {
        'New': 'bg-blue-100 text-blue-800',
        'Awaiting Clarification': 'bg-yellow-100 text-yellow-800',
        'Ready for Sourcing': 'bg-green-100 text-green-800',
    };
    const className = colorClasses[status] || 'bg-slate-100 text-slate-800';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
            {status}
        </span>
    );
};


const IntakeFormItem: React.FC<{ title: string, status: string, received: string }> = ({ title, status, received }) => (
    <li className="py-4 px-2 hover:bg-slate-50 rounded-md transition-colors duration-150 cursor-pointer">
        <div className="flex items-center space-x-4">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{title}</p>
                <p className="text-sm text-slate-500">{received}</p>
            </div>
            <div>
                <StatusBadge status={status} />
            </div>
             <div className="text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    </li>
);

export const InitialView: React.FC = () => {
    const intakeForms = [
        { title: "STEM Educational Toy Kit", status: "New", received: "Received today" },
        { title: "Organic Cotton Baby Onesies", status: "Awaiting Clarification", received: "Received yesterday" },
        { title: "Smart Home Security Camera", status: "Ready for Sourcing", received: "Received 2 days ago" },
        { title: "Recycled PET Fabric Backpacks", status: "New", received: "Received 3 days ago" },
    ];

  return (
    <div>
      <PanelHeader title="Sourcing Dashboard" subtitle="Manage intake forms and start new sourcing projects." />
      <div className="p-6">
        <button className="w-full flex items-center justify-center space-x-2 bg-walmart-blue text-white font-semibold py-3 px-4 rounded-lg hover:bg-walmart-darkblue transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-walmart-blue">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Create New Intake Form</span>
        </button>

        <div className="mt-8">
            <h3 className="text-base font-semibold text-slate-700 mb-2">Pending Intake Forms</h3>
            <ul className="divide-y divide-slate-200">
                {intakeForms.map(form => (
                    <IntakeFormItem key={form.title} {...form} />
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};