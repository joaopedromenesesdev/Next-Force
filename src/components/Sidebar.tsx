import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Kanban, 
  Building2, 
  Users, 
  CheckSquare, 
  Crown
} from 'lucide-react';

export type NavModule = 'dashboard' | 'leads' | 'opportunities' | 'accounts' | 'contacts' | 'activities';

interface SidebarProps {
  currentModule: NavModule;
  onSelectModule: (m: NavModule) => void;
  leadsCount: number;
  oppsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  leadsCount,
  oppsCount
}) => {
  const menuItems: { id: NavModule; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Visão Geral',
      icon: <LayoutDashboard size={18} />
    },
    {
      id: 'leads',
      label: 'Leads & Prospecção',
      icon: <UserPlus size={18} />,
      badge: leadsCount
    },
    {
      id: 'opportunities',
      label: 'Pipeline de Vendas',
      icon: <Kanban size={18} />,
      badge: oppsCount
    },
    {
      id: 'accounts',
      label: 'Contas (Empresas)',
      icon: <Building2 size={18} />
    },
    {
      id: 'contacts',
      label: 'Contatos',
      icon: <Users size={18} />
    },
    {
      id: 'activities',
      label: 'Atividades 360º',
      icon: <CheckSquare size={18} />
    }
  ];

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 16px',
        userSelect: 'none',
        flexShrink: 0
      }}
    >
      <div>
        {/* Logomarca NextForce Noir & Gold */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 12px 24px',
            borderBottom: '1px solid var(--sidebar-border)'
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'var(--gold-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#09090B',
              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)'
            }}
          >
            <Crown size={19} strokeWidth={2.3} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.03em', color: '#FAFAFA' }}>
              Next<span style={{ color: '#D4AF37' }}>Force</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--sidebar-text)', fontWeight: 500 }}>
              CRM Executive Gold
            </div>
          </div>
        </div>

        {/* Itens do Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '20px' }}>
          {menuItems.map(item => {
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--sidebar-item-active-bg)' : 'transparent',
                  color: isActive ? '#FAFAFA' : 'var(--sidebar-text)',
                  border: isActive ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: isActive ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)', display: 'flex' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    style={{
                      padding: '2px 7px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: isActive ? 'var(--gold-gradient)' : '#18181F',
                      color: isActive ? '#09090B' : 'var(--sidebar-text)',
                      border: isActive ? 'none' : '1px solid #27272A'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
