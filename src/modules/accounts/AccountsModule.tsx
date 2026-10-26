import React, { useState } from 'react';
import { Building2, Globe, Phone, MapPin, Users, Plus, DollarSign, Briefcase, ShieldCheck, Mail, Calendar, ArrowRight, Check } from 'lucide-react';
import { Account, Contact, Opportunity } from '../../types/crm';
import { currencyService } from '../../core/currencyService';

interface AccountsModuleProps {
  accounts: Account[];
  contacts: Contact[];
  opportunities: Opportunity[];
  onCreateAccount: (acc: Omit<Account, 'id' | 'createdAt'>) => Account;
}

export const AccountsModule: React.FC<AccountsModuleProps> = ({ accounts, contacts, opportunities, onCreateAccount }) => {
  const [selectedAcc, setSelectedAcc] = useState<Account>(accounts[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Tecnologia');
  const [revenue, setRevenue] = useState('10000000');
  const [city, setCity] = useState('São Paulo, SP');
  const [phone, setPhone] = useState('(11) 4004-9988');

  const relatedContacts = contacts.filter(c => c.accountId === selectedAcc?.id);
  const relatedOpps = opportunities.filter(o => o.accountId === selectedAcc?.id);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = onCreateAccount({
      name,
      industry,
      website: name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com.br',
      annualRevenue: Number(revenue) || 5000000,
      employees: 250,
      phone,
      city,
      type: 'Cliente',
      owner: 'João Silva'
    });
    setSelectedAcc(created);
    setIsModalOpen(false);
    setName('');
  };

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      {/* Coluna Esquerda: Lista de Empresas */}
      <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={16} color="var(--brand-primary)" />
            <span>Contas Cadastradas ({accounts.length})</span>
          </span>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={14} />
            <span>Nova Conta</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {accounts.map(acc => {
            const isSelected = selectedAcc?.id === acc.id;
            return (
              <div
                key={acc.id}
                onClick={() => setSelectedAcc(acc)}
                className="card"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  borderLeft: isSelected ? '4px solid var(--brand-primary)' : '1px solid var(--border-color)',
                  backgroundColor: isSelected ? 'var(--brand-light)' : 'var(--bg-secondary)'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={15} color="var(--brand-primary)" />
                  <span>{acc.name}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{acc.industry}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-primary)', marginTop: '8px' }}>
                  Faturamento: {currencyService.format(acc.annualRevenue)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coluna Direita: Visão 360º da Conta Selecionada */}
      {selectedAcc && (
        <div className="card" style={{ flex: 1, padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={22} color="var(--brand-primary)" />
                <span>{selectedAcc.name}</span>
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Globe size={14} color="var(--brand-primary)" /> {selectedAcc.website}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} color="var(--brand-primary)" /> {selectedAcc.phone}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="var(--brand-primary)" /> {selectedAcc.city}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>RECEITA ANUAL ESTIMADA</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-primary)' }}>
                {currencyService.format(selectedAcc.annualRevenue)}
              </div>
            </div>
          </div>

          {/* Abas Relacionadas: Contatos & Oportunidades */}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Seção Contatos */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="var(--brand-primary)" />
                <span>Contatos Vinculados ({relatedContacts.length})</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                {relatedContacts.map(con => (
                  <div key={con.id} style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                    <div style={{ fontWeight: 600 }}>{con.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Briefcase size={11} /> {con.title}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--brand-primary)', fontWeight: 600 }}>
                        <ShieldCheck size={12} /> {con.role}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '6px', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={12} />
                      <span>{con.email}</span>
                    </div>
                  </div>
                ))}
                {relatedContacts.length === 0 && (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Nenhum contato direto cadastrado nesta conta.</div>
                )}
              </div>
            </div>

            {/* Seção Oportunidades */}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={16} color="var(--brand-primary)" />
                <span>Oportunidades no Pipeline ({relatedOpps.length})</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {relatedOpps.map(opp => (
                  <div key={opp.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{opp.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                        <ArrowRight size={12} color="var(--brand-primary)" />
                        <span>Próximo passo: {opp.nextStep}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{currencyService.format(opp.amount)}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Calendar size={11} /> Previsão: {opp.closeDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Conta */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Cadastrar Nova Empresa (Conta)</h2>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Razão Social / Nome Fantasia</label>
                <input required className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: InovaTech Sistemas" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Setor</label>
                  <input className="input" value={industry} onChange={e => setIndustry(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Receita Anual Estimada (R$)</label>
                  <input type="number" className="input" value={revenue} onChange={e => setRevenue(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Salvar Empresa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
