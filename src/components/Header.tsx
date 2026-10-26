import React from 'react';
import { Sun, Moon, Search, RotateCcw, Coins, Command, UserCheck, Briefcase } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  onOpenCommand: () => void;
  onResetData: () => void;
  activeModuleTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommand, onResetData, activeModuleTitle }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      style={{
        height: 'var(--header-height)',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'background-color 0.2s ease, border-color 0.2s ease'
      }}
    >
      {/* Título do Módulo Ativo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {activeModuleTitle}
        </h1>
        <span
          style={{
            fontSize: '11px',
            padding: '3px 9px',
            borderRadius: '9999px',
            backgroundColor: 'var(--brand-light)',
            border: '1px solid var(--gold-border)',
            color: 'var(--brand-primary)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Coins size={12} /> BRL (R$) Ativo
        </span>
      </div>

      {/* Ações Centrais / Direita */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Barra de Busca rápida (Ctrl + K) */}
        <button
          onClick={onOpenCommand}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Search size={15} color="var(--brand-primary)" />
          <span>Buscar cliente, lead ou negócio...</span>
          <kbd
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              padding: '2px 6px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginLeft: '8px'
            }}
          >
            <Command size={10} /> K
          </kbd>
        </button>

        {/* Botão de Reset Demo */}
        <button
          onClick={onResetData}
          title="Resetar dados demonstrativos para o estado original"
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RotateCcw size={14} color="var(--brand-primary)" />
          <span>Restaurar Dados</span>
        </button>

        {/* Seletor de Tema (Sol / Lua) */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Mudar para Light Mode (Branco & Ouro)' : 'Mudar para Dark Mode (Noir & Ouro)'}
          className="btn btn-secondary btn-icon"
          style={{ color: 'var(--brand-primary)' }}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Perfil do Usuário */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginLeft: '8px',
            paddingLeft: '12px',
            borderLeft: '1px solid var(--border-color)'
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--gold-gradient)',
              color: '#09090B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px var(--brand-glow)'
            }}
          >
            <UserCheck size={17} strokeWidth={2.2} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>João Pedro</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Briefcase size={10} color="var(--brand-primary)" /> Executivo de Vendas
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
