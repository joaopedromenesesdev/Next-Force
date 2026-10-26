import React from 'react';
import { Sun, Moon, Search, RotateCcw, Command, UserCheck } from 'lucide-react';
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
        backgroundColor: 'var(--header-bg, var(--bg-secondary))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h1
          style={{
            fontSize: '17px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            margin: 0
          }}
        >
          {activeModuleTitle}
        </h1>
      </div>

      {/* Ações Centrais / Direita */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Barra de Busca Compacta Estilo Linear (Ctrl / Cmd + K) */}
        <button
          onClick={onOpenCommand}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            width: '210px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-muted)',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--brand-primary)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={14} color="var(--brand-primary)" />
            <span>Buscar...</span>
          </div>
          <kbd
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              padding: '1px 5px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--text-muted)'
            }}
          >
            <Command size={9} /> K
          </kbd>
        </button>

        {/* Divisor sutil */}
        <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} />

        {/* Botão de Reset Demo (Apenas Ícone com Tooltip) */}
        <button
          onClick={onResetData}
          title="Restaurar dados de demonstração"
          aria-label="Restaurar dados"
          className="btn btn-secondary btn-icon"
          style={{
            width: '34px',
            height: '34px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-sm)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--brand-primary)';
            e.currentTarget.style.borderColor = 'var(--brand-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <RotateCcw size={15} />
        </button>

        {/* Seletor de Tema (Sol / Lua - Apenas Ícone com Tooltip) */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Mudar para Light Mode (Branco & Ouro)' : 'Mudar para Dark Mode (Noir & Ouro)'}
          aria-label="Alternar tema"
          className="btn btn-secondary btn-icon"
          style={{
            width: '34px',
            height: '34px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-primary)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-sm)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--brand-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Divisor sutil antes do perfil */}
        <div style={{ width: '1px', height: '22px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} />

        {/* Perfil Minimalista em Linha Única */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            padding: '3px 8px 3px 4px',
            borderRadius: 'var(--radius-full)',
            transition: 'background-color 0.15s ease',
            cursor: 'default'
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--gold-gradient)',
              color: '#09090B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px var(--brand-glow)',
              flexShrink: 0
            }}
          >
            <UserCheck size={15} strokeWidth={2.4} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            João Pedro
          </span>
        </div>
      </div>
    </header>
  );
};
