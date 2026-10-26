import { CRMData, PipelineStageConfig } from '../types/crm';

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    id: 'prospeccao',
    label: 'Prospecção',
    probability: 10,
    color: '#52525B',
    badgeBg: 'rgba(161, 161, 170, 0.12)',
    badgeText: 'var(--text-secondary)'
  },
  {
    id: 'qualificacao',
    label: 'Qualificação',
    probability: 25,
    color: '#A1A1AA',
    badgeBg: 'rgba(228, 228, 231, 0.14)',
    badgeText: 'var(--text-primary)'
  },
  {
    id: 'proposta',
    label: 'Proposta de Valor',
    probability: 50,
    color: '#C5A059',
    badgeBg: 'rgba(197, 160, 89, 0.16)',
    badgeText: 'var(--brand-primary)'
  },
  {
    id: 'negociacao',
    label: 'Negociação',
    probability: 75,
    color: '#D4AF37',
    badgeBg: 'rgba(212, 175, 55, 0.18)',
    badgeText: 'var(--brand-primary)'
  },
  {
    id: 'fechado_ganho',
    label: 'Fechado Ganho',
    probability: 100,
    color: '#E5C158',
    badgeBg: 'rgba(212, 175, 55, 0.24)',
    badgeText: 'var(--brand-primary)'
  },
  {
    id: 'fechado_perdido',
    label: 'Fechado Perdido',
    probability: 0,
    color: '#3F3F46',
    badgeBg: 'rgba(113, 113, 122, 0.12)',
    badgeText: 'var(--text-muted)'
  }
];

export const INITIAL_DATA: CRMData = {
  accounts: [
    {
      id: 'acc_1',
      name: 'Nubank Soluções Financeiras',
      industry: 'Fintech / Serviços Financeiros',
      website: 'nubank.com.br',
      annualRevenue: 45000000,
      employees: 3500,
      phone: '(11) 4004-1234',
      city: 'São Paulo, SP',
      type: 'Cliente',
      owner: 'João Silva',
      createdAt: '2026-08-10'
    },
    {
      id: 'acc_2',
      name: 'LogiVrum Transportes Inteligentes',
      industry: 'Logística & Supply Chain',
      website: 'logivrum.com.br',
      annualRevenue: 18500000,
      employees: 480,
      phone: '(41) 3322-9900',
      city: 'Curitiba, PR',
      type: 'Cliente',
      owner: 'Mariana Costa',
      createdAt: '2026-09-01'
    },
    {
      id: 'acc_3',
      name: 'Hospital São Lucas & Saúde',
      industry: 'Saúde / Hospitais',
      website: 'saolucas.med.br',
      annualRevenue: 62000000,
      employees: 1200,
      phone: '(21) 2555-8800',
      city: 'Rio de Janeiro, RJ',
      type: 'Prospect',
      owner: 'João Silva',
      createdAt: '2026-09-15'
    },
    {
      id: 'acc_4',
      name: 'OmniVarejo Brasil S/A',
      industry: 'Varejo & E-commerce',
      website: 'omnivarejo.com.br',
      annualRevenue: 85000000,
      employees: 2100,
      phone: '(11) 3888-7711',
      city: 'Campinas, SP',
      type: 'Prospect',
      owner: 'Pedro Alcantara',
      createdAt: '2026-10-01'
    }
  ],

  contacts: [
    {
      id: 'con_1',
      accountId: 'acc_1',
      name: 'Camila Rocha',
      title: 'Diretora de Operações de Vendas (VP Sales)',
      email: 'camila.rocha@nubank.com.br',
      phone: '(11) 98765-4321',
      role: 'Decisor',
      createdAt: '2026-08-10'
    },
    {
      id: 'con_2',
      accountId: 'acc_2',
      name: 'Eduardo Martins',
      title: 'Gerente Geral de TI & Inovação',
      email: 'eduardo.martins@logivrum.com.br',
      phone: '(41) 99888-1122',
      role: 'Influenciador',
      createdAt: '2026-09-01'
    },
    {
      id: 'con_3',
      accountId: 'acc_3',
      name: 'Dra. Beatriz Ferraz',
      title: 'Diretora Clínica e Compras',
      email: 'beatriz.ferraz@saolucas.med.br',
      phone: '(21) 99123-5566',
      role: 'Decisor',
      createdAt: '2026-09-15'
    },
    {
      id: 'con_4',
      accountId: 'acc_4',
      name: 'Marcos Vinicius',
      title: 'CFO / Diretor Financeiro',
      email: 'm.vinicius@omnivarejo.com.br',
      phone: '(11) 97654-3210',
      role: 'Financeiro',
      createdAt: '2026-10-01'
    }
  ],

  opportunities: [
    {
      id: 'opp_1',
      accountId: 'acc_1',
      contactId: 'con_1',
      name: 'Expansão Enterprise CRM — 250 Licenças',
      amount: 480000,
      stage: 'negociacao',
      probability: 75,
      closeDate: '2026-11-15',
      type: 'Expansão',
      owner: 'João Silva',
      nextStep: 'Assinatura do contrato jurídico e validação de segurança',
      createdAt: '2026-09-10'
    },
    {
      id: 'opp_2',
      accountId: 'acc_2',
      contactId: 'con_2',
      name: 'Plataforma de Rastreamento & CRM Frota',
      amount: 195000,
      stage: 'proposta',
      probability: 50,
      closeDate: '2026-11-30',
      type: 'Novo Negócio',
      owner: 'Mariana Costa',
      nextStep: 'Apresentação da proposta revisada com desconto de volume',
      createdAt: '2026-09-22'
    },
    {
      id: 'opp_3',
      accountId: 'acc_3',
      contactId: 'con_3',
      name: 'Implementação NextForce Saúde Integrada',
      amount: 320000,
      stage: 'qualificacao',
      probability: 25,
      closeDate: '2026-12-10',
      type: 'Novo Negócio',
      owner: 'João Silva',
      nextStep: 'Agendar PoC com equipe clínica e comitê técnico',
      createdAt: '2026-10-05'
    },
    {
      id: 'opp_4',
      accountId: 'acc_4',
      contactId: 'con_4',
      name: 'Módulo de Omnichannel e Atendimento ao Cliente',
      amount: 650000,
      stage: 'prospeccao',
      probability: 10,
      closeDate: '2026-12-20',
      type: 'Novo Negócio',
      owner: 'Pedro Alcantara',
      nextStep: 'Reunião de alinhamento com time de arquitetura',
      createdAt: '2026-10-18'
    },
    {
      id: 'opp_5',
      accountId: 'acc_1',
      contactId: 'con_1',
      name: 'Contrato Anual Suporte Dedicado 24x7',
      amount: 140000,
      stage: 'fechado_ganho',
      probability: 100,
      closeDate: '2026-10-15',
      type: 'Renovação',
      owner: 'João Silva',
      nextStep: 'Onboarding do time concluído com sucesso',
      createdAt: '2026-08-15',
      closedAt: '2026-10-15'
    }
  ],

  leads: [
    {
      id: 'lead_1',
      name: 'Sofia Albuquerque',
      company: 'Zenith Inteligência Artificial',
      title: 'Head de Operações & Receita',
      email: 'sofia@zenithia.com.br',
      phone: '(11) 98111-2233',
      status: 'qualificacao',
      score: 92,
      source: 'Inbound',
      industry: 'Tecnologia & IA',
      estimatedValue: 280000,
      city: 'São Paulo, SP',
      owner: 'Mariana Costa',
      createdAt: '2026-10-20'
    },
    {
      id: 'lead_2',
      name: 'Rodrigo Vasconcelos',
      company: 'Construtora Horizonte Alto',
      title: 'Diretor Comercial',
      email: 'rodrigo.v@horizontealto.eng.br',
      phone: '(31) 99222-4455',
      status: 'contatado',
      score: 78,
      source: 'Indicação',
      industry: 'Construção Civil & Imóveis',
      estimatedValue: 350000,
      city: 'Belo Horizonte, MG',
      owner: 'João Silva',
      createdAt: '2026-10-22'
    },
    {
      id: 'lead_3',
      name: 'Priscila Menezes',
      company: 'BioPharma Laboratórios',
      title: 'Gerente de Compras Corporativas',
      email: 'p.menezes@biopharma.ind.br',
      phone: '(19) 97333-6677',
      status: 'novo',
      score: 65,
      source: 'Website',
      industry: 'Farmacêutica',
      estimatedValue: 190000,
      city: 'Campinas, SP',
      owner: 'Pedro Alcantara',
      createdAt: '2026-10-24'
    },
    {
      id: 'lead_4',
      name: 'Felipe Sato',
      company: 'Kuroda Importações Ltda',
      title: 'Diretor de Novos Negócios',
      email: 'felipe@kuroda.com.br',
      phone: '(11) 96444-8899',
      status: 'novo',
      score: 45,
      source: 'LinkedIn',
      industry: 'Importação / Exportação',
      estimatedValue: 85000,
      city: 'Santos, SP',
      owner: 'Mariana Costa',
      createdAt: '2026-10-25'
    }
  ],

  activities: [
    {
      id: 'act_1',
      parentType: 'opportunity',
      parentId: 'opp_1',
      type: 'call',
      title: 'Ligação com VP Camila sobre minuta jurídica',
      description: 'Cliente aprovou cláusula de SLA e solicitou prazo de pagamento em 30 dias. Encaminhado ao financeiro.',
      outcome: 'Conectada',
      completed: true,
      createdAt: '2026-10-24T14:30:00Z'
    },
    {
      id: 'act_2',
      parentType: 'opportunity',
      parentId: 'opp_1',
      type: 'task',
      title: 'Enviar minuta assinada digitalmente via DocuSign',
      description: 'Prioridade máxima para fechar antes do fim do mês.',
      priority: 'Alta',
      dueDate: '2026-10-28',
      completed: false,
      createdAt: '2026-10-24T15:00:00Z'
    },
    {
      id: 'act_3',
      parentType: 'lead',
      parentId: 'lead_1',
      type: 'meeting',
      title: 'Demo ao vivo do NextForce para Sofia e time',
      description: 'Demonstrar facilidade de conversão de lead e pipeline Kanban.',
      dueDate: '2026-10-27',
      completed: false,
      createdAt: '2026-10-23T11:00:00Z'
    },
    {
      id: 'act_4',
      parentType: 'opportunity',
      parentId: 'opp_2',
      type: 'note',
      title: 'Feedback da reunião de orçamento',
      description: 'Eduardo gostou muito da velocidade da plataforma. Comparou com o sistema antigo e elogiou a fluidez.',
      completed: true,
      createdAt: '2026-10-22T16:45:00Z'
    }
  ]
};
