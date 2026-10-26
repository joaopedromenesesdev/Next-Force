import React, { useState } from 'react';
import { UserCheck, Mail, Phone, Building2, Plus, Search, Briefcase, ShieldCheck, Check } from 'lucide-react';
import { Contact, Account } from '../../types/crm';
import { Badge } from '../../components/Badge';

interface ContactsModuleProps {
  contacts: Contact[];
  accounts: Account[];
  onCreateContact: (con: Omit<Contact, 'id' | 'createdAt'>) => void;
}

export const ContactsModule: React.FC<ContactsModuleProps> = ({ contacts, accounts, onCreateContact }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const getAccountName = (accId: string) => {
    return accounts.find(a => a.id === accId)?.name || 'Empresa';
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateContact({
      accountId,
      name,
      title: title || 'Tomador de Decisão',
      email,
      phone,
      role: 'Decisor'
    });
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '360px' }}>
          <Search size={16} color="var(--brand-primary)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            className="input"
            placeholder="Buscar contatos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Novo Contato</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.map(con => (
          <div key={con.id} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--brand-light)', border: '1px solid var(--gold-border)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{con.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Briefcase size={11} />
                    <span>{con.title}</span>
                  </div>
                </div>
              </div>
              <Badge variant="primary">
                <ShieldCheck size={11} />
                <span>{con.role}</span>
              </Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={15} color="var(--brand-primary)" />
                <span style={{ fontWeight: 600 }}>{getAccountName(con.accountId)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="var(--brand-primary)" />
                <span>{con.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="var(--text-muted)" />
                <span>{con.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Novo Contato</h2>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Nome Completo</label>
                <input required className="input" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Empresa (Conta)</label>
                <select className="input" value={accountId} onChange={e => setAccountId(e.target.value)}>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Cargo / Papel</label>
                <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Diretor de Tecnologia" />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>E-mail</label>
                <input type="email" required className="input" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Telefone</label>
                <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99888-0000" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Salvar Contato</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
