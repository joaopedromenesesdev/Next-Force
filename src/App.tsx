import React, { useState } from 'react';
import { Sidebar, NavModule } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandMenu } from './components/CommandMenu';
import { DashboardModule } from './modules/dashboard/DashboardModule';
import { LeadsModule } from './modules/leads/LeadsModule';
import { OpportunitiesModule } from './modules/opportunities/OpportunitiesModule';
import { AccountsModule } from './modules/accounts/AccountsModule';
import { ContactsModule } from './modules/contacts/ContactsModule';
import { ActivitiesModule } from './modules/activities/ActivitiesModule';
import { useCRM } from './hooks/useCRM';

export const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<NavModule>('dashboard');
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const {
    data,
    moveOpportunity,
    createOpportunity,
    convertLead,
    createLead,
    createAccount,
    createContact,
    addActivity,
    toggleActivityComplete,
    resetData
  } = useCRM();

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'dashboard': return 'Visão Geral & Métricas';
      case 'leads': return 'Leads & Prospecção Ativa';
      case 'opportunities': return 'Pipeline de Vendas (Kanban)';
      case 'accounts': return 'Contas Corporativas (Visão 360º)';
      case 'contacts': return 'Contatos & Decisores';
      case 'activities': return 'Linha do Tempo de Atividades';
    }
  };

  return (
    <div className="app-layout">
      {/* Barra Lateral de Navegação Estilo Linear/Salesforce */}
      <Sidebar
        currentModule={activeModule}
        onSelectModule={setActiveModule}
        leadsCount={data.leads.filter(l => l.status !== 'convertido').length}
        oppsCount={data.opportunities.length}
      />

      {/* Conteúdo Principal */}
      <div className="main-content">
        <Header
          activeModuleTitle={getModuleTitle()}
          onOpenCommand={() => setIsCommandOpen(true)}
          onResetData={resetData}
        />

        <main className="page-container">
          {activeModule === 'dashboard' && (
            <DashboardModule data={data} onNavigate={m => setActiveModule(m as NavModule)} />
          )}
          {activeModule === 'leads' && (
            <LeadsModule leads={data.leads} onConvertLead={convertLead} onCreateLead={createLead} />
          )}
          {activeModule === 'opportunities' && (
            <OpportunitiesModule
              opportunities={data.opportunities}
              accounts={data.accounts}
              onMoveStage={moveOpportunity}
              onCreateOpportunity={createOpportunity}
            />
          )}
          {activeModule === 'accounts' && (
            <AccountsModule
              accounts={data.accounts}
              contacts={data.contacts}
              opportunities={data.opportunities}
              onCreateAccount={createAccount}
            />
          )}
          {activeModule === 'contacts' && (
            <ContactsModule
              contacts={data.contacts}
              accounts={data.accounts}
              onCreateContact={createContact}
            />
          )}
          {activeModule === 'activities' && (
            <ActivitiesModule
              activities={data.activities}
              onAddActivity={addActivity}
              onToggleComplete={toggleActivityComplete}
            />
          )}
        </main>
      </div>

      {/* Busca Rápida Global Ctrl + K */}
      <CommandMenu
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        data={data}
        onNavigate={mod => setActiveModule(mod)}
      />
    </div>
  );
};
