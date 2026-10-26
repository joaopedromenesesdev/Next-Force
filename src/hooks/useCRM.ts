import { useState, useEffect, useCallback } from 'react';
import { CRMData, Lead, Account, Contact, Opportunity, Activity, StageId, ID } from '../types/crm';
import { loadCRMData, saveCRMData, resetCRMData } from '../core/storage';
import { PIPELINE_STAGES } from '../core/initialData';

export function useCRM() {
  const [data, setData] = useState<CRMData>(loadCRMData);

  useEffect(() => {
    saveCRMData(data);
  }, [data]);

  // Atualizar estágio de oportunidade (Kanban)
  const moveOpportunity = useCallback((oppId: ID, targetStage: StageId) => {
    const stageConfig = PIPELINE_STAGES.find(s => s.id === targetStage);
    const newProbability = stageConfig ? stageConfig.probability : 50;

    setData(prev => {
      const updatedOpps = prev.opportunities.map(opp => {
        if (opp.id === oppId) {
          const isClosingWon = targetStage === 'fechado_ganho';
          return {
            ...opp,
            stage: targetStage,
            probability: newProbability,
            closedAt: isClosingWon ? new Date().toISOString().split('T')[0] : opp.closedAt
          };
        }
        return opp;
      });

      return { ...prev, opportunities: updatedOpps };
    });
  }, []);

  // Criar Oportunidade
  const createOpportunity = useCallback((newOpp: Omit<Opportunity, 'id' | 'createdAt'>) => {
    const id = 'opp_' + Date.now();
    const fullOpp: Opportunity = {
      ...newOpp,
      id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      opportunities: [fullOpp, ...prev.opportunities]
    }));
    return fullOpp;
  }, []);

  // O FLUXO CLÁSSICO DE OURO DO SALESFORCE:
  // Converte Lead -> Conta + Contato + Oportunidade
  const convertLead = useCallback((leadId: ID, createOpp: boolean = true) => {
    setData(prev => {
      const lead = prev.leads.find(l => l.id === leadId);
      if (!lead) return prev;

      const now = new Date().toISOString().split('T')[0];
      const accountId = 'acc_' + Date.now();
      const contactId = 'con_' + Date.now();
      const oppId = 'opp_' + Date.now();

      // 1. Cria a Conta (Empresa)
      const newAccount: Account = {
        id: accountId,
        name: lead.company,
        industry: lead.industry || 'Serviços Corporativos',
        website: lead.company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com.br',
        annualRevenue: lead.estimatedValue * 12,
        employees: 50,
        phone: lead.phone,
        city: lead.city,
        type: 'Cliente',
        owner: lead.owner,
        createdAt: now
      };

      // 2. Cria o Contato (Pessoa)
      const newContact: Contact = {
        id: contactId,
        accountId: accountId,
        name: lead.name,
        title: lead.title || 'Tomador de Decisão',
        email: lead.email,
        phone: lead.phone,
        role: 'Decisor',
        createdAt: now
      };

      // 3. Cria a Oportunidade no Pipeline
      let newOpp: Opportunity | null = null;
      if (createOpp) {
        newOpp = {
          id: oppId,
          accountId: accountId,
          contactId: contactId,
          name: lead.company + ' — Negócio Convertido',
          amount: lead.estimatedValue,
          stage: 'qualificacao',
          probability: 25,
          closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          type: 'Novo Negócio',
          owner: lead.owner,
          nextStep: 'Agendar call de apresentação e levantamento de requisitos',
          createdAt: now
        };
      }

      // 4. Atualiza o status do Lead para 'convertido'
      const updatedLeads = prev.leads.map(l => {
        if (l.id === leadId) {
          return {
            ...l,
            status: 'convertido' as const,
            convertedAt: now,
            convertedAccountId: accountId,
            convertedContactId: contactId,
            convertedOpportunityId: newOpp ? oppId : undefined
          };
        }
        return l;
      });

      // 5. Migra as atividades existentes do lead para a nova oportunidade/conta
      const updatedActivities = prev.activities.map(act => {
        if (act.parentType === 'lead' && act.parentId === leadId) {
          return {
            ...act,
            parentType: (newOpp ? 'opportunity' : 'account') as any,
            parentId: newOpp ? oppId : accountId
          };
        }
        return act;
      });

      // 6. Adiciona atividade comemorativa do sistema
      const systemAct: Activity = {
        id: 'act_' + Date.now(),
        parentType: newOpp ? 'opportunity' : 'account',
        parentId: newOpp ? oppId : accountId,
        type: 'system',
        title: 'Lead Convertido com Sucesso!',
        description: 'Lead ' + lead.name + ' (' + lead.company + ') qualificado e convertido automaticamente.',
        completed: true,
        createdAt: new Date().toISOString()
      };

      return {
        ...prev,
        leads: updatedLeads,
        accounts: [newAccount, ...prev.accounts],
        contacts: [newContact, ...prev.contacts],
        opportunities: newOpp ? [newOpp, ...prev.opportunities] : prev.opportunities,
        activities: [systemAct, ...updatedActivities]
      };
    });
  }, []);

  // Criar Lead
  const createLead = useCallback((lead: Omit<Lead, 'id' | 'createdAt'>) => {
    const fullLead: Lead = {
      ...lead,
      id: 'lead_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      leads: [fullLead, ...prev.leads]
    }));
    return fullLead;
  }, []);

  // Atualizar Lead
  const updateLead = useCallback((leadId: ID, updates: Partial<Lead>) => {
    setData(prev => ({
      ...prev,
      leads: prev.leads.map(l => l.id === leadId ? { ...l, ...updates } : l)
    }));
  }, []);

  // Criar Conta
  const createAccount = useCallback((acc: Omit<Account, 'id' | 'createdAt'>) => {
    const fullAcc: Account = {
      ...acc,
      id: 'acc_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      accounts: [fullAcc, ...prev.accounts]
    }));
    return fullAcc;
  }, []);

  // Criar Contato
  const createContact = useCallback((con: Omit<Contact, 'id' | 'createdAt'>) => {
    const fullCon: Contact = {
      ...con,
      id: 'con_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setData(prev => ({
      ...prev,
      contacts: [fullCon, ...prev.contacts]
    }));
    return fullCon;
  }, []);

  // Adicionar Atividade
  const addActivity = useCallback((act: Omit<Activity, 'id' | 'createdAt'>) => {
    const fullAct: Activity = {
      ...act,
      id: 'act_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      activities: [fullAct, ...prev.activities]
    }));
    return fullAct;
  }, []);

  // Alternar conclusão de tarefa
  const toggleActivityComplete = useCallback((actId: ID) => {
    setData(prev => ({
      ...prev,
      activities: prev.activities.map(a => a.id === actId ? { ...a, completed: !a.completed } : a)
    }));
  }, []);

  // Resetar dados para o padrão de demonstração
  const resetData = useCallback(() => {
    const fresh = resetCRMData();
    setData(fresh);
  }, []);

  return {
    data,
    moveOpportunity,
    createOpportunity,
    convertLead,
    createLead,
    updateLead,
    createAccount,
    createContact,
    addActivity,
    toggleActivityComplete,
    resetData
  };
}
