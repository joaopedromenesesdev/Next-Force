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
        minHeight: '84px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--header-bg, var(--bg-secondary))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 36px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transition: 'background-color 0.2s ease, border-color 0.2s ease'
      }}
    >
      {/* Título com Presença Vertical e Elegância */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--brand-primary)'
          }}
        >
          NextForce CRM
        </span>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.2
          }}
        >
          {activeModuleTitle}
        </h1>
      </div>

      {/* Ações Centrais / Direita com Respiro Confortável */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Barra de Busca Linear Style */}
        <button
          onClick={onOpenCommand}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            width: '230px',
            height: '42px',
            padding: '0 14px',
            borderRadius: 'var(--radius-md)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <Search size={15} color="var(--brand-primary)" />
            <span>Buscar no sistema...</span>
          </div>
          <kbd
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              padding: '2px 6px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)'
            }}
          >
            <Command size={10} /> K
          </kbd>
        </button>

        {/* Divisor vertical */}
        <div style={{ width: '1px', height: '26px', backgroundColor: 'var(--border-color)', margin: '0 2px' }} />

        {/* Botão de Reset Demo */}
        <button
          onClick={onResetData}
          title="Restaurar dados de demonstração"
          aria-label="Restaurar dados"
          className="btn btn-secondary btn-icon"
          style={{
            width: '42px',
            height: '42px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-md)'
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
          <RotateCcw size={16} />
        </button>

        {/* Seletor de Tema */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Mudar para Light Mode (Branco & Ouro)' : 'Mudar para Dark Mode (Noir & Ouro)'}
          aria-label="Alternar tema"
          className="btn btn-secondary btn-icon"
          style={{
            width: '42px',
            height: '42px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-primary)',
            borderColor: 'var(--border-color)',
            borderRadius: 'var(--radius-md)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--brand-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Divisor vertical antes do perfil */}
        <div style={{ width: '1px', height: '26px', backgroundColor: 'var(--border-color)', margin: '0 2px' }} />

        {/* Perfil com proporção generosa */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '5px 12px 5px 6px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            cursor: 'default'
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--gold-gradient)',
              color: '#09090B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px var(--brand-glow)',
              flexShrink: 0
            }}
          >
            <UserCheck size={16} strokeWidth={2.4} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            João Pedro
          </span>
        </div>
      </div>
    </header>
  );
};
