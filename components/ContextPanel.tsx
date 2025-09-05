import React from 'react';
import { ContextView } from '../types';
import { QUALIFIED_SUPPLIERS } from '../constants';
import { InitialView } from './context_views/InitialView';
import { DraftIntakeForm } from './context_views/DraftIntakeForm';
import { FinalIntakeForm } from './context_views/FinalIntakeForm';
import { SupplierShortlist } from './context_views/SupplierShortlist';
import { SupplierDashboard } from './context_views/SupplierDashboard';
import { SupplierComparison } from './context_views/SupplierComparison';
import { POSummary } from './context_views/POSummary';

interface ContextPanelProps {
  view: ContextView;
  selectedSuppliers: Set<string>;
  onToggleSupplier: (supplierName: string) => void;
  supplierStatuses: Record<string, string>;
  primarySupplier: string | null;
}

const viewMap: Record<ContextView, React.ComponentType<any>> = {
  [ContextView.INITIAL]: InitialView,
  [ContextView.DRAFT_INTAKE_FORM]: DraftIntakeForm,
  [ContextView.FINAL_INTAKE_FORM]: FinalIntakeForm,
  [ContextView.SUPPLIER_SHORTLIST]: SupplierShortlist,
  [ContextView.SUPPLIER_DASHBOARD]: SupplierDashboard,
  [ContextView.SUPPLIER_COMPARISON]: SupplierComparison,
  [ContextView.PO_SUMMARY]: POSummary,
};

export const ContextPanel: React.FC<ContextPanelProps> = ({ view, selectedSuppliers, onToggleSupplier, supplierStatuses, primarySupplier }) => {
  const CurrentView = viewMap[view] || InitialView;

  const viewProps: any = {};
  if (view === ContextView.SUPPLIER_SHORTLIST) {
    viewProps.suppliers = QUALIFIED_SUPPLIERS;
    viewProps.selectedSuppliers = selectedSuppliers;
    viewProps.onToggleSupplier = onToggleSupplier;
  } else if (view === ContextView.SUPPLIER_DASHBOARD) {
    viewProps.allSuppliers = QUALIFIED_SUPPLIERS;
    viewProps.shortlistedSuppliers = selectedSuppliers;
    viewProps.supplierStatuses = supplierStatuses;
  } else if (view === ContextView.SUPPLIER_COMPARISON) {
    viewProps.shortlistedSuppliers = selectedSuppliers;
  } else if (view === ContextView.PO_SUMMARY) {
    viewProps.primarySupplier = primarySupplier;
  }

  return (
    <div className="h-full overflow-y-auto">
        <CurrentView {...viewProps} />
    </div>
  );
};
