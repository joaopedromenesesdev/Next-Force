import React, { useState } from 'react';
import { ArrowRightCircle, Plus, Search, Building2, User, Kanban, Check, Sparkles, PhoneCall, Clock, Mail, Phone, Briefcase } from 'lucide-react';
import { Lead, ID } from '../../types/crm';
import { Badge } from '../../components/Badge';
import { currencyService } from '../../core/currencyService';

interface LeadsModuleProps {
  leads: Lead[];
  onConvertLead: (leadId: ID) => void;
  onCreateLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
}

export const LeadsModule: React.FC<LeadsModuleProps> = ({ leads, onConvertLead, onCreateLead }) => {
  const [search, setSearch] = useState('');
  const [selectedLeadForConvert, setSelectedLeadForConvert] = useState<Lead | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  // Formulário de novo lead
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newValue, setNewValue] = useState('150000');
  const [newCity, setNewCity] = useState('São Paulo, SP');

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateLead({
      name: newName,
      company: newCompany,
      title: newTitle || 'Executivo',
      email: newEmail,
      phone: newPhone,
      status: 'novo',
      score: 75,
      source: 'Website',
      industry: 'Tecnologia & Serviços',
      estimatedValue: Number(newValue) || 100000,
      city: newCity,
      owner: 'João Silva'
    });
    setIsNewLeadModalOpen(false);
    setNewName('');
    setNewCompany('');
    setNewEmail('');
    setNewPhone('');
  };

  return (
    <div>
      {/* Top Bar de Controles */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '400px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={16}
              color="var(--brand-primary)"
              style={{ position: 'absolute', left: '12px', top: '10px' }}
            />
            <input
              type="text"
              className="input"
              placeholder="Filtrar por nome ou empresa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>

        <button onClick={() => setIsNewLeadModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Novo Lead</span>
        </button>
      </div>

      {/* Tabela de Leads */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>NOME DO PROSPECT</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>EMPRESA</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>STATUS</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>PONTUAÇÃO</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>POTENCIAL (BRL)</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>CONTATO</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'right' }}>AÇÃO (SALESFORCE)</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => {
              const isConverted = lead.status === 'convertido';

              return (
                <tr
                  key={lead.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background-color 0.1s ease',
                    opacity: isConverted ? 0.75 : 1
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{lead.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Briefcase size={11} /> {lead.title}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={14} color="var(--brand-primary)" />
                      <span>{lead.company}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {isConverted ? (
                      <Badge variant="success">
                        <Check size={12} strokeWidth={2.5} />
                        <span>Convertido</span>
                      </Badge>
                    ) : lead.status === 'qualificacao' ? (
                      <Badge variant="primary">
                        <Sparkles size={12} />
                        <span>Em Qualificação</span>
                      </Badge>
                    ) : lead.status === 'contatado' ? (
                      <Badge variant="warning">
                        <PhoneCall size={12} />
                        <span>Contatado</span>
                      </Badge>
                    ) : (
                      <Badge variant="neutral">
                        <Clock size={12} />
                        <span>Novo</span>
                      </Badge>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700 }}>{lead.score}</span>
                      <div style={{ width: '40px', height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                        <div style={{ width: lead.score + '%', height: '100%', backgroundColor: lead.score > 70 ? 'var(--brand-primary)' : 'var(--text-secondary)' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--brand-primary)' }}>
                    {currencyService.format(lead.estimatedValue)}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={12} color="var(--brand-primary)" />
                      <span>{lead.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                      <Phone size={12} />
                      <span>{lead.phone}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    {isConverted ? (
                      <span style={{ fontSize: '12px', color: 'var(--brand-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Conta Criada
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedLeadForConvert(lead)}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <ArrowRightCircle size={14} />
                        <span>Converter Lead</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL CLÁSSICO DE CONVERSÃO DO SALESFORCE */}
      {selectedLeadForConvert && (
        <div className="modal-overlay" onClick={() => setSelectedLeadForConvert(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--brand-light)', border: '1px solid var(--gold-border)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowRightCircle size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Converter Lead em Negócio</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  O fluxo clássico do Salesforce cria 3 registros vinculados automaticamente:
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
              {/* Item 1: Conta */}
              <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Building2 size={20} color="var(--brand-primary)" />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    1. Nova Conta (Empresa)
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedLeadForConvert.company}</div>
                </div>
              </div>

              {/* Item 2: Contato */}
              <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <User size={20} color="var(--text-primary)" />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    2. Novo Contato Vinculado
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedLeadForConvert.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedLeadForConvert.title}</div>
                </div>
              </div>

              {/* Item 3: Oportunidade */}
              <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Kanban size={20} color="var(--brand-primary)" />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    3. Nova Oportunidade no Pipeline
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>
                    {selectedLeadForConvert.company} — Negócio Convertido
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-primary)', marginTop: '2px' }}>
                    {currencyService.format(selectedLeadForConvert.estimatedValue)}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button onClick={() => setSelectedLeadForConvert(null)} className="btn btn-secondary">
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConvertLead(selectedLeadForConvert.id);
                  setSelectedLeadForConvert(null);
                }}
                className="btn btn-primary"
              >
                <Check size={16} />
                <span>Confirmar Conversão Imediata</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO LEAD */}
      {isNewLeadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewLeadModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Criar Novo Lead</h2>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nome Completo</label>
                <input required className="input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex: Carlos Eduardo" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Empresa</label>
                <input required className="input" value={newCompany} onChange={e => setNewCompany(e.target.value)} placeholder="Ex: MegaLog Transportes" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Cargo</label>
                  <input className="input" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Ex: Diretor de Vendas" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Potencial (R$)</label>
                  <input type="number" className="input" value={newValue} onChange={e => setNewValue(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>E-mail</label>
                  <input type="email" required className="input" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="carlos@megalog.com" />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Telefone</label>
                  <input className="input" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="(11) 99888-7766" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsNewLeadModalOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Salvar Lead</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
