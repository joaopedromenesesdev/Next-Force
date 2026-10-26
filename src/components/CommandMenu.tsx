import React, { useState, useEffect } from 'react';
import { Search, X, UserPlus, Kanban, Building2, Award, MapPin, SearchX } from 'lucide-react';
import { CRMData } from '../types/crm';
import { currencyService } from '../core/currencyService';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  data: CRMData;
  onNavigate: (module: 'leads' | 'opportunities' | 'accounts') => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose, data, onNavigate }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  const filteredOpps = data.opportunities.filter(o =>
    o.name.toLowerCase().includes(q)
  ).slice(0, 4);

  const filteredLeads = data.leads.filter(l =>
    l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)
  ).slice(0, 4);

  const filteredAccounts = data.accounts.filter(a =>
    a.name.toLowerCase().includes(q)
  ).slice(0, 3);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}
      >
        {/* Barra de Busca */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-color)',
            gap: '12px'
          }}
        >
          <Search size={18} color="var(--brand-primary)" />
          <input
            autoFocus
            type="text"
            placeholder="Digite para buscar qualquer oportunidade, lead ou empresa..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '15px',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Resultados */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '12px' }}>
          {filteredOpps.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>
                Oportunidades
              </div>
              {filteredOpps.map(opp => (
                <div
                  key={opp.id}
                  onClick={() => { onNavigate('opportunities'); onClose(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Kanban size={15} color="var(--brand-primary)" />
                    <span style={{ fontWeight: 600 }}>{opp.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                    {currencyService.format(opp.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {filteredLeads.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>
                Leads
              </div>
              {filteredLeads.map(lead => (
                <div
                  key={lead.id}
                  onClick={() => { onNavigate('leads'); onClose(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <UserPlus size={15} color="var(--text-primary)" />
                    <div>
                      <span style={{ fontWeight: 600 }}>{lead.name}</span>
                      <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>({lead.company})</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--brand-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <Award size={13} /> {lead.score}
                  </span>
                </div>
              ))}
            </div>
          )}

          {filteredAccounts.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>
                Contas (Empresas)
              </div>
              {filteredAccounts.map(acc => (
                <div
                  key={acc.id}
                  onClick={() => { onNavigate('accounts'); onClose(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Building2 size={15} color="var(--brand-primary)" />
                    <span style={{ fontWeight: 600 }}>{acc.name}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {acc.city}
                  </span>
                </div>
              ))}
            </div>
          )}

          {filteredOpps.length === 0 && filteredLeads.length === 0 && filteredAccounts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <SearchX size={28} color="var(--brand-primary)" />
              <span>Nenhum resultado encontrado para "{query}"</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
