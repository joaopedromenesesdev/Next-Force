import React, { useState } from 'react';
import { Kanban, ListFilter, Plus, Calendar, ChevronRight, ChevronLeft, Building2, Inbox, Check } from 'lucide-react';
import { Opportunity, Account, StageId, ID } from '../../types/crm';
import { PIPELINE_STAGES } from '../../core/initialData';
import { currencyService } from '../../core/currencyService';
import { fireClosedWonCelebration } from '../../components/ConfettiCelebration';
import { CurrencyInput } from '../../components/CurrencyInput';
import { parseCurrencyToNumber } from '../../utils/currencyMask';

interface OpportunitiesModuleProps {
  opportunities: Opportunity[];
  accounts: Account[];
  onMoveStage: (oppId: ID, targetStage: StageId) => void;
  onCreateOpportunity: (opp: Omit<Opportunity, 'id' | 'createdAt'>) => void;
}

export const OpportunitiesModule: React.FC<OpportunitiesModuleProps> = ({
  opportunities,
  accounts,
  onMoveStage,
  onCreateOpportunity
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [draggedOppId, setDraggedOppId] = useState<ID | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [amount, setAmount] = useState('150.000,00');
  const [stage, setStage] = useState<StageId>('prospeccao');

  const getAccountName = (accId: ID) => {
    return accounts.find(a => a.id === accId)?.name || 'Conta Corporativa';
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
    const stConfig = PIPELINE_STAGES.find(s => s.id === stage);
    onCreateOpportunity({
      accountId,
      name,
      amount: parseCurrencyToNumber(amount) || 100000,
      stage,
      probability: stConfig ? stConfig.probability : 25,
      closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'Novo Negócio',
      owner: 'João Silva',
      nextStep: 'Apresentação de proposta'
    });
    setIsModalOpen(false);
    setName('');
  };

  // Cálculo do total de todas as oportunidades ativas
  const totalPipeline = opportunities.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Controles do Pipeline */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Volume Total: <strong style={{ color: 'var(--brand-primary)' }}>{currencyService.format(totalPipeline)}</strong>
          </div>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Nova Oportunidade</span>
        </button>
      </div>

      {/* VISÃO KANBAN COM FORECAST AUTOMÁTICO */}
      {viewMode === 'kanban' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(280px, 1fr))',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '24px'
          }}
        >
          {PIPELINE_STAGES.map(stageConfig => {
            const oppsInStage = opportunities.filter(o => o.stage === stageConfig.id);
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
                  maxHeight: 'calc(100vh - 210px)',
                  minWidth: '270px'
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
                  {oppsInStage.map(opp => (
                    <div
                      key={opp.id}
                      draggable
                      onDragStart={() => handleDragStart(opp.id)}
                      className="card"
                      style={{
                        padding: '14px',
                        cursor: 'grab',
                        borderLeft: '3px solid ' + stageConfig.color,
                        backgroundColor: 'var(--bg-primary)'
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Building2 size={11} color="var(--brand-primary)" />
                        <span>{getAccountName(opp.accountId)}</span>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
                        {opp.name}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-primary)' }}>
                          {currencyService.format(opp.amount)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <Calendar size={12} />
                          <span>{opp.closeDate}</span>
                        </div>
                      </div>

                      {/* Botões rápidos de avançar/recuar estágio para facilidade no clique */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px', marginTop: '10px' }}>
                        {stageConfig.id !== 'prospeccao' && (
                          <button
                            title="Recuar estágio"
                            onClick={() => {
                              const currIdx = PIPELINE_STAGES.findIndex(s => s.id === stageConfig.id);
                              if (currIdx > 0) onMoveStage(opp.id, PIPELINE_STAGES[currIdx - 1].id);
                            }}
                            className="btn btn-secondary btn-icon"
                            style={{ padding: '3px 6px', fontSize: '11px' }}
                          >
                            <ChevronLeft size={13} />
                          </button>
                        )}
                        {stageConfig.id !== 'fechado_ganho' && stageConfig.id !== 'fechado_perdido' && (
                          <button
                            title="Avançar estágio"
                            onClick={() => {
                              const currIdx = PIPELINE_STAGES.findIndex(s => s.id === stageConfig.id);
                              if (currIdx < PIPELINE_STAGES.length - 2) {
                                const nextStage = PIPELINE_STAGES[currIdx + 1].id;
                                if (nextStage === 'fechado_ganho') fireClosedWonCelebration();
                                onMoveStage(opp.id, nextStage);
                              }
                            }}
                            className="btn btn-secondary btn-icon"
                            style={{ padding: '3px 6px', fontSize: '11px' }}
                          >
                            <ChevronRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

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
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>ESTÁGIO</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>PROBABILIDADE</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>VALOR (BRL)</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>FECHAMENTO</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map(opp => (
                <tr
                  key={opp.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{opp.name}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={14} color="var(--brand-primary)" />
                      <span>{getAccountName(opp.accountId)}</span>
                    </div>
                  </td>
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
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>{opp.probability}%</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--brand-primary)' }}>
                    {currencyService.format(opp.amount)}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={13} />
                      <span>{opp.closeDate}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL NOVA OPORTUNIDADE */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Nova Oportunidade de Venda</h2>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Título do Negócio</label>
                <input required className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Projeto Expansão Cloud" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Empresa Cliente (Conta)</label>
                <select className="input" value={accountId} onChange={e => setAccountId(e.target.value)}>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Valor (em R$)</label>
                  <CurrencyInput required value={amount} onChangeValue={(_, formatted) => setAmount(formatted)} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Estágio Inicial</label>
                  <select className="input" value={stage} onChange={e => setStage(e.target.value as StageId)}>
                    {PIPELINE_STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label} ({s.probability}%)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
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
    </div>
  );
};
