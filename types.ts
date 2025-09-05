export enum UserType {
  AGENT = 'AGENT',
  USER = 'USER',
}

export interface Message {
  id: number;
  user: UserType;
  text: React.ReactNode;
}

export enum ContextView {
  INITIAL = 'INITIAL',
  DRAFT_INTAKE_FORM = 'DRAFT_INTAKE_FORM',
  FINAL_INTAKE_FORM = 'FINAL_INTAKE_FORM',
  SUPPLIER_SHORTLIST = 'SUPPLIER_SHORTLIST',
  SUPPLIER_DASHBOARD = 'SUPPLIER_DASHBOARD',
  SUPPLIER_COMPARISON = 'SUPPLIER_COMPARISON',
  PO_SUMMARY = 'PO_SUMMARY',
}

export interface Supplier {
  name: string;
  type: string;
  score: number;
  status: string;
}

export interface ConversationStep {
  speaker: UserType;
  text: React.ReactNode;
  options?: string[];
  thinkingTime?: number;
  waitingTime?: number;
  contextView?: ContextView;
  isImageUpload?: boolean;
  autoContinue?: boolean;
  awaitsCompletion?: boolean;
}