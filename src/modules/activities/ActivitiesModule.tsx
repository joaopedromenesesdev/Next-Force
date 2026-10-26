import React, { useState } from 'react';
import { PhoneCall, CheckSquare, Calendar, FileText, Plus, CheckCircle2, Layers, Clock, Check } from 'lucide-react';
import { Activity } from '../../types/crm';

interface ActivitiesModuleProps {
  activities: Activity[];
  onAddActivity: (act: Omit<Activity, 'id' | 'createdAt'>) => void;
  onToggleComplete: (actId: string) => void;
}

export const ActivitiesModule: React.FC<ActivitiesModuleProps> = ({ activities, onAddActivity, onToggleComplete }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'call' | 'task' | 'meeting'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [type, setType] = useState<'call' | 'task' | 'meeting' | 'note'>('call');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const filtered = activities.filter(a => activeTab === 'all' || a.type === activeTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddActivity({
      parentType: 'opportunity',
      parentId: 'opp_1',
      type,
      title,
      description,
      completed: type === 'call' || type === 'note',
      dueDate: type === 'task' || type === 'meeting' ? new Date().toISOString().split('T')[0] : undefined
    });
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const activityTypeOptions: { id: 'call' | 'task' | 'meeting' | 'note'; label: string; icon: React.ReactNode }[] = [
    { id: 'call', label: 'Ligação', icon: <PhoneCall size={15} /> },
    { id: 'task', label: 'Tarefa', icon: <CheckSquare size={15} /> },
    { id: 'meeting', label: 'Reunião', icon: <Calendar size={15} /> },
    { id: 'note', label: 'Anotação', icon: <FileText size={15} /> }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'call', 'task', 'meeting'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            >
              {tab === 'all' && <><Layers size={14} /> <span>Todas</span></>}
              {tab === 'call' && <><PhoneCall size={14} /> <span>Ligações</span></>}
              {tab === 'task' && <><CheckSquare size={14} /> <span>Tarefas</span></>}
              {tab === 'meeting' && <><Calendar size={14} /> <span>Reuniões</span></>}
            </button>
          ))}
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Registrar Atividade</span>
        </button>
      </div>

      {/* Feed da Linha do Tempo */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.map(act => (
            <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div
                onClick={() => onToggleComplete(act.id)}
                title={act.completed ? 'Concluída (clique para reabrir)' : 'Pendente (clique para concluir)'}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: act.completed ? 'var(--brand-light)' : 'var(--bg-tertiary)',
                  border: act.completed ? '1px solid var(--gold-border)' : '1px solid var(--border-color)',
                  color: act.completed ? 'var(--brand-primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {act.type === 'call' && <PhoneCall size={18} />}
                {act.type === 'task' && <CheckSquare size={18} />}
                {act.type === 'meeting' && <Calendar size={18} />}
                {act.type === 'note' && <FileText size={18} />}
                {act.type === 'system' && <CheckCircle2 size={18} />}
              </div>

              <div style={{ flex: 1, paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{act.title}</div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} color="var(--brand-primary)" />
                    {new Date(act.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {act.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Registrar Nova Atividade</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Tipo de Atividade</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {activityTypeOptions.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setType(opt.id)}
                      className={type === opt.id ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Título / Assunto</label>
                <input required className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Alinhamento de proposta de preços" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Detalhes / Resumo</label>
                <textarea rows={3} className="input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Principais tópicos conversados..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Registrar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
