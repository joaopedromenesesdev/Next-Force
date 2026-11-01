import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Copy, Check, Sparkles, Phone, Building2, User } from 'lucide-react';
import { currencyService } from '../core/currencyService';
import { WhatsAppIcon } from './WhatsAppIcon';

export interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientPhone: string;
  companyName: string;
  contextType: 'lead' | 'opportunity';
  dealData?: {
    title: string;
    amount: number;
    stageLabel: string;
    isStale?: boolean;
    staleDays?: number;
  };
  onMessageSent?: (messageText: string) => void;
}

export const WhatsAppActionModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientPhone,
  companyName,
  contextType,
  dealData,
  onMessageSent
}) => {
  const [phone, setPhone] = useState(recipientPhone);
  const [selectedScriptIndex, setSelectedScriptIndex] = useState(0);
  const [customMessage, setCustomMessage] = useState('');
  const [autoLogActivity, setAutoLogActivity] = useState(true);
  const [copied, setCopied] = useState(false);

  // Formata o valor se houver dados de negócio
  const formattedAmount = dealData?.amount ? currencyService.format(dealData.amount) : 'R$ 0,00';
  const dealTitle = dealData?.title || 'Projeto Corporativo';

  // Gerador de Scripts Contextuais
  const scripts = contextType === 'opportunity'
    ? [
        {
          id: 'followup',
          title: 'Follow-up de Proposta',
          tag: 'Alta Conversão',
          text: `Olá ${recipientName}, tudo bem? Aqui é o Executivo de Vendas da NextForce. Gostaria de saber se você conseguiu avaliar a proposta comercial de ${formattedAmount} para a ${companyName}. Ficou alguma dúvida sobre o escopo ou condições de pagamento?`
        },
        {
          id: 'resgate',
          title: dealData?.isStale ? `Resgate (${dealData.staleDays || 7}d sem contato)` : 'Resgate de Negócio',
          tag: dealData?.isStale ? 'Urgente' : 'Reengajamento',
          text: `Olá ${recipientName}, como vão as coisas na ${companyName}? Notei que faz alguns dias desde nossa última conversa sobre o ${dealTitle}. Conseguimos alinhar uma breve chamada esta semana para avançarmos?`
        },
        {
          id: 'reuniao',
          title: 'Agendamento de Reunião',
          tag: 'Validação',
          text: `Olá ${recipientName}, bom dia! Gostaria de agendar uma breve conversa de 15 minutos para alinharmos os próximos passos do projeto ${dealTitle}. Como está sua agenda amanhã às 14h?`
        }
      ]
    : [
        {
          id: 'apresentacao',
          title: 'Apresentação Comercial',
          tag: 'Primeiro Contato',
          text: `Olá ${recipientName}, tudo bem? Sou da equipe comercial da NextForce. Vi o interesse da ${companyName} em nossas soluções corporativas de gestão e vendas. Teria 15 minutos nesta semana para uma breve demonstração prática?`
        },
        {
          id: 'qualificacao',
          title: 'Qualificação de Dores',
          tag: 'Diagnóstico',
          text: `Olá ${recipientName}! Recebi seu contato e gostaria de entender melhor os desafios atuais da ${companyName} na estruturação do time comercial e conversão de pipeline. Qual o melhor horário para conversarmos hoje?`
        },
        {
          id: 'followup_lead',
          title: 'Follow-up de Contato',
          tag: 'Reativação',
          text: `Olá ${recipientName}, passei para checar se você conseguiu ver o material que enviamos sobre a NextForce. Teria disponibilidade para um café virtual ou alinhamento rápido esta semana?`
        }
      ];

  // Sincroniza script inicial e telefone ao abrir
  useEffect(() => {
    if (isOpen) {
      setPhone(recipientPhone || '(11) 98765-4321');
      // Se a oportunidade estiver estagnada, pré-seleciona o script de resgate
      const initialIdx = (contextType === 'opportunity' && dealData?.isStale) ? 1 : 0;
      setSelectedScriptIndex(initialIdx);
      setCustomMessage(scripts[initialIdx]?.text || '');
      setCopied(false);
    }
  }, [isOpen, recipientPhone, recipientName, companyName, contextType, dealData?.isStale]);

  if (!isOpen) return null;

  const handleSelectScript = (index: number) => {
    setSelectedScriptIndex(index);
    setCustomMessage(scripts[index].text);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback simples
    }
  };

  const handleSendWhatsApp = () => {
    // Sanitização do telefone para padrão internacional (E.164)
    let clean = phone.replace(/\D/g, '');
    if (!clean) clean = '5511987654321';

    // Se tiver 10 ou 11 dígitos (DDD + número), adiciona 55 (Brasil)
    if (clean.length === 10 || clean.length === 11) {
      clean = '55' + clean;
    }

    const encoded = encodeURIComponent(customMessage);
    const waUrl = `https://wa.me/${clean}?text=${encoded}`;

    // Abre WhatsApp Web em nova aba
    window.open(waUrl, '_blank');

    // Registro automático de atividade no CRM
    if (autoLogActivity && onMessageSent) {
      onMessageSent(customMessage);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '620px',
          padding: '24px',
          border: '1px solid var(--gold-border)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)'
        }}
      >
        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(37, 211, 102, 0.12)',
                border: '1px solid rgba(37, 211, 102, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#25D366'
              }}
            >
              <WhatsAppIcon size={24} color="#25D366" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  NextForce WhatsApp Hub
                </h2>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(37, 211, 102, 0.15)',
                    color: '#25D366',
                    border: '1px solid rgba(37, 211, 102, 0.3)'
                  }}
                >
                  Direto 1-Clique
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Disparo rápido de mensagens comerciais com scripts inteligentes e registro automático.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Informações do Destinatário */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: '16px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.2fr 1fr',
            gap: '12px',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <User size={15} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                Contato
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                {recipientName}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <Building2 size={15} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                Empresa
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                {companyName}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={15} color="#25D366" style={{ flexShrink: 0 }} />
            <div style={{ width: '100%' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                WhatsApp
              </span>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Seleção de Scripts Contextuais */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={13} color="var(--brand-primary)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Selecione um Script Sugerido
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {scripts.map((script, idx) => {
              const isSelected = selectedScriptIndex === idx;
              return (
                <button
                  key={script.id}
                  type="button"
                  onClick={() => handleSelectScript(idx)}
                  style={{
                    textAlign: 'left',
                    padding: '9px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--brand-light)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        backgroundColor: isSelected ? 'rgba(212, 175, 55, 0.25)' : 'var(--bg-primary)',
                        color: isSelected ? 'var(--brand-primary)' : 'var(--text-muted)'
                      }}
                    >
                      {script.tag}
                    </span>
                    {isSelected && <Check size={12} color="var(--brand-primary)" />}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {script.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor da Mensagem */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            Mensagem Formatada (pode ser personalizada antes de enviar):
          </label>
          <textarea
            value={customMessage}
            onChange={e => setCustomMessage(e.target.value)}
            rows={5}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              lineHeight: 1.5,
              resize: 'vertical',
              fontFamily: 'inherit',
              outline: 'none'
            }}
          />
        </div>

        {/* Checkbox de Automação de Atividade */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <input
            type="checkbox"
            id="autoLogCheckbox"
            checked={autoLogActivity}
            onChange={e => setAutoLogActivity(e.target.checked)}
            style={{ accentColor: '#25D366', cursor: 'pointer' }}
          />
          <label
            htmlFor="autoLogCheckbox"
            style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}
          >
            Registrar automaticamente como atividade concluída no CRM (redefine o status para <strong style={{ color: 'var(--brand-primary)' }}>"Ativo hoje"</strong>)
          </label>
        </div>

        {/* Rodapé com Ações */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button
            type="button"
            onClick={handleCopy}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {copied ? <Check size={14} color="#25D366" /> : <Copy size={14} />}
            <span>{copied ? 'Mensagem Copiada!' : 'Copiar Texto'}</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                fontWeight: 700,
                backgroundColor: '#25D366',
                color: '#0A0A0A',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(37, 211, 102, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              <Send size={15} />
              <span>Abrir no WhatsApp Web</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

