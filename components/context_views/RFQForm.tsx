import React from 'react';

const PanelHeader: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => (
  <div className="p-6 border-b border-slate-200">
    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
  </div>
);

const FormField: React.FC<{ label: string, value: string | React.ReactNode, isTextarea?: boolean }> = ({ label, value, isTextarea }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        {isTextarea ? (
            <div className="mt-1 p-3 w-full rounded-md border border-slate-300 bg-slate-50 text-sm text-slate-600 min-h-[60px]">
                {value}
            </div>
        ) : (
            <div className="mt-1 p-3 w-full rounded-md border border-slate-300 bg-slate-50 text-sm text-slate-600">
                {value}
            </div>
        )}
    </div>
);

interface RFQFormProps {
    supplierName: string | null;
}

export const RFQForm: React.FC<RFQFormProps> = ({ supplierName }) => {
  return (
    <div>
      <PanelHeader 
        title="Request for Quote (RFQ)" 
        subtitle={`Define criteria for ${supplierName || 'selected supplier'}.`}
      />
      <div className="p-6 space-y-4">
        <FormField 
            label="Price" 
            value="Requesting quotes for 1,500 units, with price breaks at 5,000 and 10,000 units." 
        />
        <FormField 
            label="Compliance" 
            value={
                <ul className="list-disc list-inside">
                    <li>ASTM F963</li>
                    <li>EN71</li>
                    <li>CPSIA</li>
                    <li>Confirmation of phthalate-free materials</li>
                </ul>
            }
            isTextarea
        />
        <FormField 
            label="Defect Rate Tolerance" 
            value="Must be less than 1.5% on initial production runs." 
        />
        <div className="pt-4 text-center text-sm text-slate-500">
            <p>Click "Send RFQ" in the chat to send this request to the selected supplier.</p>
        </div>
      </div>
    </div>
  );
};