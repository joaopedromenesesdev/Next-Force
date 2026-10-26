export type ID = string;

export type LeadStatus = 'novo' | 'contatado' | 'qualificacao' | 'nao_qualificado' | 'convertido';
export type LeadSource = 'Website' | 'Indicação' | 'LinkedIn' | 'Evento' | 'Inbound' | 'Outbound';

export interface Lead {
  id: ID;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  status: LeadStatus;
  score: number; // 0 a 100
  source: LeadSource;
  industry: string;
  estimatedValue: number; // em BRL
  city: string;
  owner: string;
  createdAt: string;
  convertedAt?: string;
  convertedAccountId?: ID;
  convertedContactId?: ID;
  convertedOpportunityId?: ID;
}

export type AccountType = 'Cliente' | 'Prospect' | 'Parceiro';

export interface Account {
  id: ID;
  name: string;
  industry: string;
  website: string;
  annualRevenue: number; // em BRL
  employees: number;
  phone: string;
  city: string;
  type: AccountType;
  owner: string;
  createdAt: string;
}

export type ContactRole = 'Decisor' | 'Influenciador' | 'Financeiro' | 'Técnico' | 'Comprador';

export interface Contact {
  id: ID;
  accountId: ID;
  name: string;
  title: string;
  email: string;
  phone: string;
  role: ContactRole;
  createdAt: string;
}

export type StageId = 
  | 'prospeccao' 
  | 'qualificacao' 
  | 'proposta' 
  | 'negociacao' 
  | 'fechado_ganho' 
  | 'fechado_perdido';

export interface PipelineStageConfig {
  id: StageId;
  label: string;
  probability: number; // %
  color: string;
  badgeBg: string;
  badgeText: string;
}

export type OpportunityType = 'Novo Negócio' | 'Expansão' | 'Renovação';

export interface Opportunity {
  id: ID;
  accountId: ID;
  contactId?: ID;
  name: string;
  amount: number; // em BRL
  stage: StageId;
  probability: number;
  closeDate: string; // YYYY-MM-DD
  type: OpportunityType;
  owner: string;
  nextStep: string;
  createdAt: string;
  closedAt?: string;
}

export type ActivityType = 'call' | 'task' | 'meeting' | 'note' | 'system';
export type ParentType = 'lead' | 'opportunity' | 'account' | 'contact';
export type CallOutcome = 'Conectada' | 'Caixa Postal' | 'Sem Resposta' | 'Reunião Agendada';
export type Priority = 'Alta' | 'Média' | 'Baixa';

export interface Activity {
  id: ID;
  parentType: ParentType;
  parentId: ID;
  type: ActivityType;
  title: string;
  description: string;
  outcome?: CallOutcome;
  priority?: Priority;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export interface CRMData {
  leads: Lead[];
  accounts: Account[];
  contacts: Contact[];
  opportunities: Opportunity[];
  activities: Activity[];
}
