import React, { useState } from 'react';
import { 
  Kanban, 
  ListFilter, 
  Plus, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  Inbox, 
  Check, 
  AlertTriangle, 
  Target, 
  Pencil,
  Briefcase,
  User,
  X,
  MessageCircle
} from 'lucide-react';
import { Opportunity, Account, Contact, Activity, StageId, OpportunityType, ID } from '../../types/crm';
import { PIPELINE_STAGES } from '../../core/initialData';
import { currencyService } from '../../core/currencyService';
import { fireClosedWonCelebration } from '../../components/ConfettiCelebration';
import { CurrencyInput } from '../../components/CurrencyInput';
import { parseCurrencyToNumber } from '../../utils/currencyMask';
import { WhatsAppActionModal } from '../../components/WhatsAppActionModal';
import { WhatsAppIcon } from '../../components/WhatsAppIcon';

interface OpportunitiesModuleProps {
  opportunities: Opportunity[];
  accounts: Account[];
  contacts?: Contact[];
  activities?: Activity[];
  onMoveStage: (oppId: ID, targetStage: StageId) => void;
  onCreateOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt'>) => void;
  onUpdateOpportunity?: (oppId: ID, updates: Partial<Opportunity>) => void;
  onAddActivity?: (act: Omit<Activity, 'id' | 'createdAt'>) => void;
}

export const OpportunitiesModule: React.FC<OpportunitiesModuleProps> = ({
  opportunities,
  accounts,
  contacts = [],
  activities = [],
  onMoveStage,
  onCreateOpportunity,
  onUpdateOpportunity,
  onAddActivity
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [filterStaleOnly, setFilterStaleOnly] = useState(false);
  const [draggedOppId, setDraggedOppId] = useState<ID | null>(null);

  // Modal de Criação
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAccountId, setNewAccountId] = useState(accounts[0]?.id || '');
  const [newAmount, setNewAmount] = useState('150.000,00');
  const [newStage, setNewStage] = useState<StageId>('prospeccao');

  // Modal de Edição Completa da Oportunidade
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [editName, setEditName] = useState('');
  const [editAccountId, setEditAccountId] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editStage, setEditStage] = useState<StageId>('prospeccao');
  const [editCloseDate, setEditCloseDate] = useState('');
  const [editNextStep, setEditNextStep] = useState('');
  const [editType, setEditType] = useState<OpportunityType>('Novo Negócio');
  const [editOwner, setEditOwner] = useState('João Silva');

  // WhatsApp Action Hub State
  const [whatsAppData, setWhatsAppData] = useState<{
    opp: Opportunity;
    recipientName: string;
    recipientPhone: string;
    companyName: string;
    isStale: boolean;
    staleDays: number;
  } | null>(null);

  const getAccountName = (accId: ID) => {
    return accounts.find(a => a.id === accId)?.name || 'Conta Corporativa';
  };

  /**
   * Cálculo Inteligente de Saúde do Negócio (Deal Health / Detector de Estagnação)
   */
  const getDealHealth = (opp: Opportunity) => {
    if (opp.stage === 'fechado_ganho' || opp.stage === 'fechado_perdido') {
      return { isClosed: true, isStale: false, days: 0 };
    }

    const oppActs = activities.filter(a => a.parentId === opp.id || a.parentType === 'opportunity' && a.parentId === opp.id);
    let latestTime = new Date(opp.createdAt).getTime();

    for (const a of oppActs) {
      const t = new Date(a.createdAt).getTime();
      if (t > latestTime) latestTime = t;
    }

    const diffDays = Math.max(0, Math.floor((Date.now() - latestTime) / (1000 * 60 * 60 * 24)));

    if (diffDays >= 7) {
      return {
        isClosed: false,
        isStale: true,
        days: diffDays,
        severity: diffDays >= 12 ? 'high' : 'medium',
        badgeText: `${diffDays}d sem contato`,
        color: diffDays >= 12 ? '#F87171' : '#E5C158',
        bg: diffDays >= 12 ? 'rgba(239, 68, 68, 0.14)' : 'rgba(212, 175, 55, 0.14)',
        border: diffDays >= 12 ? 'rgba(239, 68, 68, 0.35)' : 'var(--gold-border)'
      };
    }

    return {
      isClosed: false,
      isStale: false,
      days: diffDays,
      badgeText: diffDays === 0 ? 'Ativo hoje' : `${diffDays}d atrás`
    };
  };

  // Contagem de negócios estagnados
  const staleCount = opportunities.filter(o => getDealHealth(o).isStale).length;

  // Filtragem
  const displayedOpportunities = filterStaleOnly
    ? opportunities.filter(o => getDealHealth(o).isStale)
    : opportunities;

  // Abrir Modal de Edição preenchendo todos os dados do card selecionado
  const handleOpenEdit = (opp: Opportunity) => {
    setEditingOpp(opp);
    setEditName(opp.name);
    setEditAccountId(opp.accountId);
    setEditAmount(currencyService.format(opp.amount).replace('R$', '').trim());
    setEditStage(opp.stage);
    setEditCloseDate(opp.closeDate);
    setEditNextStep(opp.nextStep || '');
    setEditType(opp.type || 'Novo Negócio');
    setEditOwner(opp.owner || 'João Silva');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpp || !onUpdateOpportunity) return;

    const parsedAmount = parseCurrencyToNumber(editAmount);
    const stConfig = PIPELINE_STAGES.find(s => s.id === editStage);
    const wasWonBefore = editingOpp.stage === 'fechado_ganho';
    const isNowWon = editStage === 'fechado_ganho';

    if (!wasWonBefore && isNowWon) {
      fireClosedWonCelebration();
    }

    onUpdateOpportunity(editingOpp.id, {
      name: editName.trim(),
      accountId: editAccountId,
      amount: parsedAmount > 0 ? parsedAmount : editingOpp.amount,
      stage: editStage,
      probability: stConfig ? stConfig.probability : editingOpp.probability,
      closeDate: editCloseDate,
      nextStep: editNextStep.trim(),
      type: editType,
      owner: editOwner,
      closedAt: isNowWon ? new Date().toISOString().split('T')[0] : editingOpp.closedAt
    });

    setEditingOpp(null);
  };

  // Abrir WhatsApp Hub buscando dados do decisor/conta e status de saúde do deal
  const handleOpenWhatsApp = (opp: Opportunity) => {
    const acc = accounts.find(a => a.id === opp.accountId);
    const contact = contacts.find(c => c.id === opp.contactId) || contacts.find(c => c.accountId === opp.accountId);
    const health = getDealHealth(opp);

    setWhatsAppData({
      opp,
      recipientName: contact?.name || (acc ? `Diretoria da ${acc.name}` : 'Tomador de Decisão'),
      recipientPhone: contact?.phone || acc?.phone || '(11) 98765-4321',
      companyName: acc?.name || 'Conta Corporativa',
      isStale: health.isStale,
      staleDays: health.days
    });
  };

  const handleWhatsAppMessageSent = (messageText: string) => {
    if (onAddActivity && whatsAppData) {
      onAddActivity({
        type: 'whatsapp',
        title: `WhatsApp: ${whatsAppData.opp.name}`,
        description: messageText,
        parentType: 'opportunity',
        parentId: whatsAppData.opp.id,
        dueDate: new Date().toISOString().split('T')[0],
        completed: true
      });
    }
  };

  const handleDragStart = (oppId: ID) => {
    setDraggedOppId(oppId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetStage: StageId) => {
    if (draggedOppId) {
      if (targetStage === 'fechado_ganho') {
        fireClosedWonCelebration();
      }
      onMoveStage(draggedOppId, targetStage);
      setDraggedOppId(null);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stConfig = PIPELINE_STAGES.find(s => s.id === newStage);
    onCreateOpportunity({
      accountId: newAccountId,
      name: newName,
      amount: parseCurrencyToNumber(newAmount) || 100000,
      stage: newStage,
      probability: stConfig ? stConfig.probability : 25,
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'Novo Negócio',
      owner: 'João Silva',
      nextStep: 'Apresentação de proposta'
    });
    setIsCreateModalOpen(false);
    setNewName('');
    setNewAmount('150.000,00');
  };

  // Cálculo do total de todas as oportunidades ativas
  const totalPipeline = displayedOpportunities.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Controles do Pipeline */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Alternador Kanban / Lista */}
          <div style={{ display: 'flex', padding: '3px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: viewMode === 'kanban' ? 'var(--bg-secondary)' : 'transparent',
                color: viewMode === 'kanban' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                boxShadow: viewMode === 'kanban' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <Kanban size={15} />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: viewMode === 'table' ? 'var(--bg-secondary)' : 'transparent',
                color: viewMode === 'table' ? 'var(--brand-primary)' : 'var(--text-secondary)',
                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <ListFilter size={15} />
              <span>Tabela</span>
            </button>
          </div>

          {/* Filtro Rápido Inteligente: Detector de Negócios Estagnados */}
          {staleCount > 0 && (
            <button
              onClick={() => setFilterStaleOnly(!filterStaleOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: filterStaleOnly ? 'rgba(239, 68, 68, 0.16)' : 'var(--bg-secondary)',
                color: filterStaleOnly ? '#F87171' : 'var(--text-secondary)',
                border: filterStaleOnly ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)',
                transition: 'all 0.15s ease'
              }}
            >
              <AlertTriangle size={14} color={filterStaleOnly ? '#F87171' : '#E5C158'} />
              <span>{filterStaleOnly ? 'Exibindo Estagnados' : `${staleCount} Negócios Estagnados`}</span>
            </button>
          )}

          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Volume Total: <strong style={{ color: 'var(--brand-primary)' }}>{currencyService.format(totalPipeline)}</strong>
          </div>
        </div>

        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Nova Oportunidade</span>
        </button>
      </div>

      {/* VISÃO KANBAN */}
      {viewMode === 'kanban' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(290px, 1fr))',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '24px'
          }}
        >
          {PIPELINE_STAGES.map(stageConfig => {
            const oppsInStage = displayedOpportunities.filter(o => o.stage === stageConfig.id);
            const totalStageAmount = oppsInStage.reduce((acc, curr) => acc + curr.amount, 0);
            const weightedAmount = totalStageAmount * (stageConfig.probability / 100);

            return (
              <div
                key={stageConfig.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stageConfig.id)}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: 'calc(100vh - 220px)',
                  minWidth: '280px'
                }}
              >
                {/* Cabeçalho da Coluna */}
                <div
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--border-color)',
                    borderTop: '3px solid ' + stageConfig.color,
                    borderTopLeftRadius: 'var(--radius-md)',
                    borderTopRightRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {stageConfig.label}
                    </span>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: stageConfig.badgeBg,
                        color: stageConfig.badgeText,
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      {stageConfig.probability}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {currencyService.format(totalStageAmount)}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                      Prev: {currencyService.format(weightedAmount)}
                    </span>
                  </div>
                </div>

                {/* Lista de Cards da Coluna */}
                <div
                  style={{
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    overflowY: 'auto',
                    flex: 1
                  }}
                >
                  {oppsInStage.map(opp => {
                    const health = getDealHealth(opp);

                    return (
                      <div
                        key={opp.id}
                        draggable
                        onDragStart={() => handleDragStart(opp.id)}
                        className="card"
                        style={{
                          padding: '14px',
                          cursor: 'grab',
                          borderLeft: '3px solid ' + stageConfig.color,
                          backgroundColor: 'var(--bg-primary)',
                          transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                        }}
                      >
                        {/* Linha Superior: Empresa + Alerta de Saúde do Negócio */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '6px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <Building2 size={11} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{getAccountName(opp.accountId)}</span>
                          </div>

                          {/* Badge de Alerta: Negócio Estagnado */}
                          {health.isStale && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenWhatsApp(opp);
                              }}
                              title={`Sem atividade registrada há ${health.days} dias. Clique para reativar via WhatsApp!`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 700,
                                backgroundColor: health.bg,
                                color: health.color,
                                border: '1px solid ' + health.border,
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                cursor: 'pointer'
                              }}
                            >
                              <AlertTriangle size={10} />
                              <span>{health.badgeText}</span>
                            </button>
                          )}
                        </div>

                        {/* Nome da Oportunidade */}
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            marginBottom: '8px',
                            lineHeight: 1.3,
                            color: 'var(--text-primary)'
                          }}
                        >
                          {opp.name}
                        </div>

                        {/* Próximo Passo Comercial */}
                        {opp.nextStep && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '11px',
                              color: 'var(--text-secondary)',
                              backgroundColor: 'var(--bg-secondary)',
                              border: '1px solid var(--border-subtle)',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              marginBottom: '8px'
                            }}
                          >
                            <Target size={11} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {opp.nextStep}
                            </span>
                          </div>
                        )}

                        {/* Linha Inferior: Valor + Data + Ações Rápidas */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-primary)' }}>
                              {currencyService.format(opp.amount)}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              <Calendar size={11} color="var(--brand-primary)" />
                              <span>{opp.closeDate}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {/* BOTÃO WHATSAPP DIRECT ACTION (APENAS ÍCONE CLEAN) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenWhatsApp(opp);
                              }}
                              className="btn btn-secondary btn-icon"
                              style={{
                                width: '28px',
                                height: '28px',
                                padding: 0,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 'var(--radius-sm)',
                                color: '#25D366',
                                borderColor: 'rgba(37, 211, 102, 0.35)',
                                backgroundColor: 'rgba(37, 211, 102, 0.08)',
                                transition: 'all 0.15s ease'
                              }}
                              title="Conversar via WhatsApp"
                            >
                              <WhatsAppIcon size={14} color="#25D366" />
                            </button>

                            {/* BOTÃO ÚNICO DE EDITAR OPORTUNIDADE */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEdit(opp);
                              }}
                              className="btn btn-secondary btn-sm"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 9px',
                                fontSize: '11px',
                                fontWeight: 600,
                                color: 'var(--text-primary)'
                              }}
                              title="Editar oportunidade"
                            >
                              <Pencil size={11} color="var(--brand-primary)" />
                              <span>Editar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {oppsInStage.length === 0 && (
                    <div
                      style={{
                        padding: '24px 12px',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        border: '1px dashed var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Inbox size={18} color="var(--brand-primary)" />
                      <span>Arraste um negócio aqui</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISÃO TABELA */
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>OPORTUNIDADE</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>EMPRESA</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>PRÓXIMO PASSO</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>ESTÁGIO</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>VALOR (BRL)</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>FECHAMENTO</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>SAÚDE DO NEGÓCIO</th>
                <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {displayedOpportunities.map(opp => {
                const health = getDealHealth(opp);

                return (
                  <tr
                    key={opp.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Nome */}
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      {opp.name}
                    </td>

                    {/* Empresa */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={14} color="var(--brand-primary)" />
                        <span>{getAccountName(opp.accountId)}</span>
                      </div>
                    </td>

                    {/* Próximo Passo */}
                    <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: opp.nextStep ? 'inherit' : 'var(--text-muted)' }}>
                        <Target size={12} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {opp.nextStep || 'Não definido'}
                        </span>
                      </span>
                    </td>

                    {/* Estágio */}
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: PIPELINE_STAGES.find(s => s.id === opp.stage)?.badgeBg,
                          color: PIPELINE_STAGES.find(s => s.id === opp.stage)?.badgeText,
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        {PIPELINE_STAGES.find(s => s.id === opp.stage)?.label}
                      </span>
                    </td>

                    {/* Valor */}
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--brand-primary)' }}>
                      {currencyService.format(opp.amount)}
                    </td>

                    {/* Fechamento */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={13} color="var(--brand-primary)" />
                        <span>{opp.closeDate}</span>
                      </div>
                    </td>

                    {/* Saúde do Negócio */}
                    <td style={{ padding: '14px 16px' }}>
                      {health.isStale ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: health.bg,
                            color: health.color,
                            border: '1px solid ' + health.border
                          }}
                        >
                          <AlertTriangle size={12} />
                          <span>{health.badgeText}</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={12} color="var(--brand-primary)" />
                          <span>Em dia</span>
                        </span>
                      )}
                    </td>

                    {/* Ações na Tabela */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => handleOpenWhatsApp(opp)}
                          className="btn btn-secondary btn-icon"
                          style={{
                            width: '28px',
                            height: '28px',
                            padding: 0,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--radius-sm)',
                            color: '#25D366',
                            borderColor: 'rgba(37, 211, 102, 0.35)',
                            backgroundColor: 'rgba(37, 211, 102, 0.08)',
                            transition: 'all 0.15s ease'
                          }}
                          title="Conversar via WhatsApp"
                        >
                          <WhatsAppIcon size={14} color="#25D366" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(opp)}
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        >
                          <Pencil size={12} color="var(--brand-primary)" />
                          <span>Editar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL DE EDIÇÃO COMPLETA DA OPORTUNIDADE                  */}
      {/* ======================================================== */}
      {editingOpp && (
        <div className="modal-overlay" onClick={() => setEditingOpp(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--brand-light)',
                    border: '1px solid var(--gold-border)',
                    color: 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Pencil size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Editar Oportunidade</h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Atualize os dados comerciais e de fechamento desta negociação
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingOpp(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Título do Negócio */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Título do Negócio
                </label>
                <input
                  required
                  className="input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Ex: Projeto Expansão Enterprise"
                />
              </div>

              {/* Empresa (Conta) */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Empresa Cliente (Conta)
                </label>
                <select
                  className="input"
                  value={editAccountId}
                  onChange={e => setEditAccountId(e.target.value)}
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Linha dupla: Valor e Estágio */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Valor da Negociação (R$)
                  </label>
                  <CurrencyInput
                    required
                    value={editAmount}
                    onChangeValue={(_, formatted) => setEditAmount(formatted)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Estágio do Funil
                  </label>
                  <select
                    className="input"
                    value={editStage}
                    onChange={e => setEditStage(e.target.value as StageId)}
                  >
                    {PIPELINE_STAGES.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.probability}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Linha dupla: Data de Fechamento e Tipo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Previsão de Fechamento
                  </label>
                  <input
                    type="date"
                    required
                    className="input"
                    value={editCloseDate}
                    onChange={e => setEditCloseDate(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Tipo de Oportunidade
                  </label>
                  <select
                    className="input"
                    value={editType}
                    onChange={e => setEditType(e.target.value as OpportunityType)}
                  >
                    <option value="Novo Negócio">Novo Negócio</option>
                    <option value="Expansão">Expansão</option>
                    <option value="Renovação">Renovação</option>
                  </select>
                </div>
              </div>

              {/* Próximo Passo Comercial */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Próximo Passo Comercial
                </label>
                <input
                  className="input"
                  value={editNextStep}
                  onChange={e => setEditNextStep(e.target.value)}
                  placeholder="Ex: Agendar validação de segurança com time de TI"
                />
              </div>

              {/* Responsável (Owner) */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Executivo Responsável
                </label>
                <input
                  className="input"
                  value={editOwner}
                  onChange={e => setEditOwner(e.target.value)}
                />
              </div>

              {/* Botões do Rodapé */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setEditingOpp(null)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL NOVA OPORTUNIDADE                                  */}
      {/* ======================================================== */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Nova Oportunidade de Venda</h2>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Título do Negócio</label>
                <input required className="input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex: Projeto Expansão Cloud" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Empresa Cliente (Conta)</label>
                <select className="input" value={newAccountId} onChange={e => setNewAccountId(e.target.value)}>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Valor (em R$)</label>
                  <CurrencyInput required value={newAmount} onChangeValue={(_, formatted) => setNewAmount(formatted)} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Estágio Inicial</label>
                  <select className="input" value={newStage} onChange={e => setNewStage(e.target.value as StageId)}>
                    {PIPELINE_STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label} ({s.probability}%)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Adicionar ao Pipeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL WHATSAPP ACTION HUB                                */}
      {/* ======================================================== */}
      {whatsAppData && (
        <WhatsAppActionModal
          isOpen={!!whatsAppData}
          onClose={() => setWhatsAppData(null)}
          recipientName={whatsAppData.recipientName}
          recipientPhone={whatsAppData.recipientPhone}
          companyName={whatsAppData.companyName}
          contextType="opportunity"
          dealData={{
            title: whatsAppData.opp.name,
            amount: whatsAppData.opp.amount,
            stageLabel: PIPELINE_STAGES.find(s => s.id === whatsAppData.opp.stage)?.label || '',
            isStale: whatsAppData.isStale,
            staleDays: whatsAppData.staleDays
          }}
          onMessageSent={handleWhatsAppMessageSent}
        />
      )}
    </div>
  );
};
