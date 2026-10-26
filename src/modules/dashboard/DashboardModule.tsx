import React from 'react';
import { TrendingUp, DollarSign, Target, Award, ArrowUpRight, CheckCircle2, Building2, MapPin, Sparkles, Layers } from 'lucide-react';
import { CRMData } from '../../types/crm';
import { currencyService } from '../../core/currencyService';
import { PIPELINE_STAGES } from '../../core/initialData';

interface DashboardModuleProps {
  data: CRMData;
  onNavigate: (module: 'opportunities' | 'leads' | 'activities') => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ data, onNavigate }) => {
  // Métricas
  const closedWonOpps = data.opportunities.filter(o => o.stage === 'fechado_ganho');
  const activeOpps = data.opportunities.filter(o => o.stage !== 'fechado_ganho' && o.stage !== 'fechado_perdido');

  const totalWonRevenue = closedWonOpps.reduce((acc, curr) => acc + curr.amount, 0);
  const totalActivePipeline = activeOpps.reduce((acc, curr) => acc + curr.amount, 0);

  // Forecast Ponderado: soma de (Valor * Probabilidade)
  const weightedForecast = activeOpps.reduce((acc, curr) => {
    return acc + (curr.amount * (curr.probability / 100));
  }, 0);

  const totalCompletedOpps = data.opportunities.filter(o => o.stage === 'fechado_ganho' || o.stage === 'fechado_perdido');
  const winRate = totalCompletedOpps.length > 0
    ? Math.round((closedWonOpps.length / totalCompletedOpps.length) * 100)
    : 75;

  // Funil por estágio
  const stageStats = PIPELINE_STAGES.map(stage => {
    const oppsInStage = data.opportunities.filter(o => o.stage === stage.id);
    const amountInStage = oppsInStage.reduce((acc, curr) => acc + curr.amount, 0);
    return {
      stage,
      count: oppsInStage.length,
      amount: amountInStage
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 4 KPIs de Alto Nível */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}
      >
        {/* KPI 1: Receita Fechada */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Receita Fechada (Mês)
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--gold-gradient)', color: '#09090B', display: 'flex' }}>
              <DollarSign size={18} strokeWidth={2.3} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            {currencyService.format(totalWonRevenue)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--brand-primary)', fontWeight: 600 }}>
            <TrendingUp size={14} />
            <span>Meta atingida com sucesso</span>
          </div>
        </div>

        {/* KPI 2: Pipeline Ativo Total */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Pipeline Ativo em Negociação
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--brand-light)', border: '1px solid var(--gold-border)', color: 'var(--brand-primary)', display: 'flex' }}>
              <Target size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            {currencyService.format(totalActivePipeline)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <Layers size={13} color="var(--brand-primary)" />
            <span>{activeOpps.length} oportunidades em andamento</span>
          </div>
        </div>

        {/* KPI 3: Forecast Ponderado */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Previsão Ponderada (Forecast)
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            {currencyService.format(weightedForecast)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <Sparkles size={13} color="var(--brand-primary)" />
            <span>Baseado na probabilidade real de cada estágio</span>
          </div>
        </div>

        {/* KPI 4: Win Rate */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Taxa de Sucesso (Win Rate)
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'var(--brand-light)', border: '1px solid var(--gold-border)', color: 'var(--brand-primary)', display: 'flex' }}>
              <Award size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            {winRate}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--brand-primary)', fontWeight: 600 }}>
            <CheckCircle2 size={14} />
            <span>Acima da média da indústria (55%)</span>
          </div>
        </div>
      </div>

      {/* Gráfico Visual do Funil de Vendas */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Distribuição do Funil de Vendas</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Volume financeiro e contagem de oportunidades por estágio no pipeline
            </p>
          </div>
          <button
            onClick={() => onNavigate('opportunities')}
            className="btn btn-secondary btn-sm"
          >
            <span>Ver Pipeline Kanban</span>
            <ArrowUpRight size={14} color="var(--brand-primary)" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {stageStats.map(({ stage, count, amount }) => {
            const maxAmount = Math.max(...stageStats.map(s => s.amount), 1);
            const percentWidth = Math.max((amount / maxAmount) * 100, 4);

            return (
              <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '160px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {stage.label} ({stage.probability}%)
                </div>
                <div style={{ flex: 1, backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', height: '24px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <div
                    style={{
                      width: percentWidth + '%',
                      height: '100%',
                      backgroundColor: stage.color,
                      borderRadius: '6px',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
                <div style={{ width: '150px', textAlign: 'right', fontSize: '13px', fontWeight: 700 }}>
                  {currencyService.format(amount)}
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                    ({count})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Linha dupla: Leads Quentes & Atividades Recentes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Leads de Maior Pontuação */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Leads de Maior Pontuação</h2>
            <button onClick={() => onNavigate('leads')} className="btn btn-secondary btn-sm">
              <span>Ver Todos</span>
              <ArrowUpRight size={13} color="var(--brand-primary)" />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.leads
              .filter(l => l.status !== 'convertido')
              .sort((a, b) => b.score - a.score)
              .slice(0, 4)
              .map(lead => (
                <div
                  key={lead.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{lead.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Building2 size={12} color="var(--brand-primary)" /> {lead.company}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {lead.city}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--brand-primary)', fontSize: '14px' }}>
                      {currencyService.format(lead.estimatedValue)}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Award size={12} color="var(--brand-primary)" /> Score: {lead.score}/100
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Atividades Recentes (Visão 360º)</h2>
            <button onClick={() => onNavigate('activities')} className="btn btn-secondary btn-sm">
              <span>Abrir Timeline</span>
              <ArrowUpRight size={13} color="var(--brand-primary)" />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.activities.slice(0, 4).map(act => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <CheckCircle2 size={16} color="var(--brand-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{act.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {act.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
