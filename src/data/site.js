/**
 * Fonte única de verdade do conteúdo do site.
 * Nenhum componente contém texto fixo — alterar copy nunca exige tocar em JSX.
 *
 * Ordem das seções na página (App.jsx):
 *   1 Hero · 2 Projetos · 3 Ferramentas · 4 Custo invisível · 5 Diferenciais
 *   6 Processo · 7 Equipe · 8 Números · 9 FAQ · 10 Contato
 *
 * ⚠️  Ainda pendente de dado real (nada foi inventado; cada ponto está marcado
 *     com `// FALTA` no lugar exato):
 *       · URLs e screenshots dos projetos
 *       · fotos do time
 *       · LinkedIn dos dois desenvolvedores
 *       · perfis próprios da LZdev (hoje o site usa os pessoais)
 *       · os números de `stats` e os valores do FAQ, que ninguém confirmou
 */

/* -------------------------------------------------------------------------- */
/*  PERFIS DO TIME                                                            */
/*                                                                            */
/*  Fonte ÚNICA dos contatos pessoais. Cada link aparece em mais de um lugar   */
/*  (cartão da pessoa na Equipe, redes do rodapé e da seção de contato, canais */
/*  diretos), e repetir a URL em cada um deles é o caminho garantido para um    */
/*  ficar velho quando alguém trocar de usuário.                              */
/*                                                                            */
/*  `whatsapp`: formato internacional, só dígitos (55 + DDD + número).         */
/*  `phone`: o mesmo número como se lê na tela.                               */
/* -------------------------------------------------------------------------- */
const enzo = {
  first: 'Enzo',
  github: 'https://github.com/destypc',
  instagram: 'https://www.instagram.com/enzinxz2',
  whatsapp: '5545998507429',
  phone: '(45) 99850-7429',
  linkedin: '', // FALTA: perfil não informado — o botão só aparece quando preenchido
}

const luis = {
  first: 'Luis',
  github: 'https://github.com/luizeh',
  instagram: 'https://www.instagram.com/luizehofwgkta',
  whatsapp: '5544998483756',
  phone: '(44) 99848-3756',
  linkedin: '', // FALTA: perfil não informado
}

/* -------------------------------------------------------------------------- */
/*  CONTATO                                                                   */
/* -------------------------------------------------------------------------- */
export const contact = {
  email: 'suporte@lzdev.com.br',

  /**
   * Os dois WhatsApp do time, exibidos lado a lado nos canais diretos.
   * O PRIMEIRO da lista é o canal principal: o botão flutuante e o envio do
   * formulário precisam de um destino só, e é dele que eles saem.
   */
  whatsapps: [
    { person: enzo.first, number: enzo.whatsapp, display: enzo.phone },
    { person: luis.first, number: luis.whatsapp, display: luis.phone },
  ],

  location: 'Atendimento remoto em todo o Brasil',
  hours: 'Segunda a sexta, 08h às 18h',

  /**
   * Redes exibidas na seção de contato e no rodapé.
   * A LZdev ainda não tem perfis próprios (FALTA), então estas são as contas
   * pessoais dos dois desenvolvedores — os mesmos links dos cartões da Equipe.
   * O rótulo diz de quem é cada uma: são dois ícones iguais lado a lado, e sem
   * ele o visitante não teria como saber qual GitHub está clicando.
   * Deixar `href` vazio esconde o botão — nada de link morto no ar.
   */
  socials: [
    { icon: 'github', person: enzo.first, label: `GitHub do ${enzo.first}`, href: enzo.github },
    { icon: 'instagram', person: enzo.first, label: `Instagram do ${enzo.first}`, href: enzo.instagram },
    { icon: 'github', person: luis.first, label: `GitHub do ${luis.first}`, href: luis.github },
    { icon: 'instagram', person: luis.first, label: `Instagram do ${luis.first}`, href: luis.instagram },
  ],
}

/** Canal principal — botão flutuante, rodapé e envio do formulário. */
export const primaryWhatsapp = contact.whatsapps[0]

/** Link de conversa. Sem `number`, vai para o canal principal. */
export const whatsappLink = (message, number = primaryWhatsapp.number) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`

/** Redes com link preenchido — usado pelo rodapé. */
export const activeSocials = contact.socials.filter((social) => social.href)

/**
 * As mesmas redes, agrupadas por dono — é assim que a seção de contato lista.
 * Sem o agrupamento, os quatro ícones ficam em fileira única com dois GitHub e
 * dois Instagram idênticos, e não há como saber de quem é cada um antes de
 * clicar. Uma rede sem `person` (um perfil da LZdev, quando existir) cai num
 * grupo sem rótulo e continua aparecendo.
 */
export const socialsByPerson = activeSocials.reduce((groups, social) => {
  const person = social.person || ''
  const group = groups.find((item) => item.person === person)
  if (group) group.links.push(social)
  else groups.push({ person, links: [social] })
  return groups
}, [])

/* -------------------------------------------------------------------------- */
/*  NAVEGAÇÃO                                                                 */
/* -------------------------------------------------------------------------- */
export const navLinks = [
  { label: 'Projetos', href: '#projetos' },
  { label: 'Ferramentas', href: '#ferramentas' },
  { label: 'Diferenciais', href: '#diferenciais' },
  { label: 'Processo', href: '#processo' },
  { label: 'Equipe', href: '#equipe' },
  { label: 'FAQ', href: '#faq' },
]

/* -------------------------------------------------------------------------- */
/*  1 · HERO                                                                  */
/* -------------------------------------------------------------------------- */
export const hero = {
  /**
   * Título em linhas controladas: cada item externo é uma linha do <h1> e cada
   * token interno uma palavra/trecho. `accent: true` marca a palavra em branco
   * pleno, contra o cinza-claro do resto da frase. Ajustar a quebra é mudar o
   * array — o CSS escala a fonte pela largura da coluna, então nada estoura em
   * tela estreita.
   */
  title: [
    [{ text: 'Transformamos' }],
    [{ text: 'desafios em ' }, { text: 'soluções', accent: true }],
    [{ text: 'digitais que ' }, { text: 'geram', accent: true }],
    [{ text: 'resultado.', accent: true }],
  ],

  subtitle:
    'Desenvolvemos soluções digitais completas, do planejamento ao código, para organizar a operação, automatizar o repetitivo e devolver tempo à sua equipe.',
  primaryCta: 'Solicitar projeto',
  secondaryCta: 'Conhecer projetos',

  /** Cards flutuantes ao redor do painel — recortes de `why.items`.
   *  Sem `tone`: os três chips compartilham o mesmo branco translúcido. */
  floatingCards: [
    { icon: 'gauge', title: 'Performance', text: 'Sistemas rápidos e otimizados', at: 'perf' },
    { icon: 'code', title: 'Código limpo', text: 'Escalável, organizado e sustentável', at: 'code' },
    { icon: 'shield', title: 'Segurança', text: 'Seus dados sempre protegidos', at: 'secure' },
  ],

}

/* -------------------------------------------------------------------------- */
/*  2 · PROJETOS — FALTA: URLs reais e screenshots                            */
/* -------------------------------------------------------------------------- */
export const projects = {
  eyebrow: 'Projetos em destaque',
  title: 'Resultado entregue, não portfólio de conceito',
  subtitle: 'Uma amostra do que já está no ar e em uso — do sistema de gestão completo à ferramenta pública.',

  /**
   * `image`: caminho de uma imagem em /public (ex.: '/projetos/sprint-max.png').
   * Enquanto estiver vazio, o card mostra uma moldura de espera com o nome do
   * projeto — nunca uma imagem quebrada. Basta preencher o caminho quando o
   * screenshot existir; nenhum outro ajuste é necessário.
   */
  items: [
    {
      name: 'Sprint Max',
      category: 'Sistema de gestão',
      image: '', // FALTA: screenshot real
      text: 'Sistema completo de gestão de produtos, usuários e vendas. Substituiu o controle por planilha por um painel único, com permissões por perfil e relatórios que fecham sozinhos.',
      stack: ['PHP', 'Laravel', 'MySQL', 'Bootstrap'],
      url: '#', // FALTA: link real
    },
    {
      name: 'Kimori Korean Food',
      category: 'Website',
      image: '', // FALTA: screenshot real
      text: 'Presença digital para restaurante de comida coreana: cardápio navegável, identidade marcante e caminho curto até o pedido pelo WhatsApp.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS'],
      url: '#', // FALTA: link real
    },
    {
      name: 'Horário de Brasília',
      category: 'Ferramenta online',
      image: '', // FALTA: screenshot real
      text: 'Ferramenta pública de consulta ao horário oficial de Brasília. Interface direta, precisa e leve o bastante para abrir instantaneamente em qualquer conexão.',
      stack: ['JavaScript', 'HTML', 'CSS'],
      url: '#', // FALTA: link real
    },
    {
      name: 'Portfólio',
      category: 'Site pessoal',
      image: '', // FALTA: screenshot real
      text: 'Site pessoal moderno com foco em experiência e desempenho: animações refinadas, navegação fluida e apresentação clara de projetos e competências.',
      stack: ['React', 'Tailwind CSS', 'JavaScript'],
      url: '#', // FALTA: link real
    },
  ],
  cta: 'Visualizar projeto',
}

/* -------------------------------------------------------------------------- */
/*  3 · FERRAMENTAS                                                           */
/* -------------------------------------------------------------------------- */
export const tools = {
  eyebrow: 'Ferramentas',
  title: 'A stack que sustenta cada entrega',
  subtitle:
    'Você não precisa entender nada desta lista — escolher certo é o nosso trabalho. Ela está aqui para mostrar que existe critério técnico por trás de cada decisão.',

  /**
   * Agrupado por camada em vez de uma lista solta: mostra que a stack cobre o
   * projeto de ponta a ponta, e não que sabemos catorze nomes.
   * Os totais por grupo (7 · 4 · 3) fecham as linhas do grid de 4 colunas com a
   * última linha centralizada, sem buraco à direita em nenhum breakpoint.
   */
  groups: [
    {
      label: 'Front-end',
      caption: 'O que o seu cliente vê e usa',
      items: [
        { name: 'HTML', icon: 'html', text: 'Marcação semântica: a base do SEO e da acessibilidade.' },
        { name: 'CSS', icon: 'css', text: 'Layouts fluidos e animações leves, sem peso extra.' },
        { name: 'JavaScript', icon: 'javascript', text: 'A linguagem que dá vida à interface no navegador.' },
        { name: 'TypeScript', icon: 'typescript', text: 'Tipagem que revela o erro antes de ele chegar em produção.' },
        { name: 'React', icon: 'react', text: 'Interfaces componentizadas, rápidas e fáceis de evoluir.' },
        { name: 'Tailwind CSS', icon: 'tailwind', text: 'Design consistente e CSS que não cresce sem controle.' },
        { name: 'Bootstrap', icon: 'bootstrap', text: 'Base responsiva madura para telas administrativas.' },
      ],
    },
    {
      label: 'Back-end e dados',
      caption: 'A regra de negócio e a informação',
      items: [
        { name: 'PHP', icon: 'php', text: 'Maturidade e hospedagem acessível para regras de negócio.' },
        { name: 'Laravel', icon: 'laravel', text: 'Estrutura robusta com segurança e autenticação prontas.' },
        { name: 'Node.js', icon: 'nodejs', text: 'APIs e automações de alta performance em tempo real.' },
        { name: 'MySQL', icon: 'mysql', text: 'Dados íntegros, consultas rápidas e backup confiável.' },
      ],
    },
    {
      label: 'Design, build e versionamento',
      caption: 'Como o projeto nasce e fica rastreável',
      items: [
        { name: 'Figma', icon: 'figma', text: 'Protótipo navegável aprovado antes da primeira linha de código.' },
        { name: 'Composer', icon: 'composer', text: 'Dependências PHP com versão travada: mesmo ambiente em todo lugar.' },
        { name: 'Git', icon: 'git', text: 'Histórico completo: qualquer mudança é reversível.' },
      ],
    },
  ],
}

/* -------------------------------------------------------------------------- */
/*  4 · O CUSTO INVISÍVEL                                                     */
/* -------------------------------------------------------------------------- */
export const invisibleCost = {
  eyebrow: 'O custo invisível',
  title: 'Não ter um site profissional não aparece na conta — mas você paga por ele',
  subtitle:
    'Nenhum desses prejuízos vem com aviso ou boleto. Eles acontecem em silêncio, todos os dias, enquanto o cliente decide fechar com outra empresa.',
  items: [
    {
      icon: 'userX',
      title: 'Clientes que desistem por falta de credibilidade',
      text: 'Antes de ligar, o cliente pesquisa. Sem um site que sustente a sua reputação, ele fica na dúvida sobre o tamanho e a seriedade da operação.',
      consequence: 'O contato morre antes de existir',
    },
    {
      icon: 'moon',
      title: 'Perda de vendas fora do horário comercial',
      text: 'A decisão de compra raramente acontece de segunda a sexta, das 8h às 18h. Sem um canal aberto, a intenção esfria até alguém responder.',
      consequence: 'Demanda que chega quando ninguém atende',
    },
    {
      icon: 'share',
      title: 'Dependência excessiva das redes sociais',
      text: 'Perfil suspenso, alcance derrubado por mudança de algoritmo ou conta perdida — e todo o seu histórico comercial vai junto. A regra é de outro dono.',
      consequence: 'Sua presença digital alugada, não sua',
    },
    {
      icon: 'trendingDown',
      title: 'Concorrentes passando na frente',
      text: 'Na comparação lado a lado, quem apresenta melhor a proposta ganha a reunião. Não é sempre quem entrega melhor — é quem parece mais preparado.',
      consequence: 'Você perde antes de poder argumentar',
    },
    {
      icon: 'searchX',
      title: 'Baixa presença no Google',
      text: 'Quem procura pelo seu serviço hoje encontra quem investiu em estrutura e conteúdo. Sem site, você simplesmente não está entre as opções.',
      consequence: 'Demanda pronta indo para outro lugar',
    },
  ],
  closing: {
    title: 'Todo mês sem site é um mês pagando essa conta',
    text: 'A boa notícia: nenhum desses pontos é difícil de resolver. É estrutura, não sorte.',
    cta: 'Quero resolver isso',
  },
}

/* -------------------------------------------------------------------------- */
/*  5 · DIFERENCIAIS                                                          */
/* -------------------------------------------------------------------------- */
export const why = {
  eyebrow: 'Por que escolher a LZdev',
  title: 'Feito certo agora custa menos que refeito depois',
  subtitle:
    'Boa parte do que recebemos para manter foi construído às pressas por alguém que não pensou no ano seguinte. Nosso padrão de engenharia existe para você nunca precisar recomeçar.',

  /**
   * `image`: ilustração do diferencial, em /public/diferenciais/*.svg.
   * São vetores desenhados para ESTE site — mesmo grafite do tema, mesma malha
   * do fundo e o acento categórico na ordem em que o card aparece (azul, ciano,
   * violeta, ciclando). Foto de banco de imagem entraria com outra iluminação e
   * outra paleta; aqui a imagem mostra a própria promessa do card (a régua de
   * medida, o medidor no verde, o editor indentado) em vez de decorar.
   * Vazio → o card volta ao painel só de ícone, sem imagem quebrada.
   */
  items: [
    {
      icon: 'ruler',
      title: 'Desenvolvimento sob medida',
      image: '/diferenciais/sob-medida.svg',
      text: 'Nada de template adaptado. Mapeamos como a sua operação funciona e construímos as regras e os fluxos em cima disso.',
    },
    {
      icon: 'gauge',
      title: 'Performance e velocidade',
      image: '/diferenciais/performance.svg',
      text: 'Otimização de carga, consultas e assets. Página lenta perde cliente antes do primeiro clique — e posição no Google.',
    },
    {
      icon: 'palette',
      title: 'Design moderno',
      image: '/diferenciais/design.svg',
      text: 'Interface limpa, hierarquia clara e navegação óbvia. Bonito de ver e, mais importante, fácil de usar todo dia.',
    },
    {
      icon: 'search',
      title: 'SEO otimizado',
      image: '/diferenciais/seo.svg',
      text: 'Semântica correta, dados estruturados e Core Web Vitals no verde desde a primeira entrega — não como ajuste posterior.',
    },
    {
      icon: 'code',
      title: 'Código limpo',
      image: '/diferenciais/codigo-limpo.svg',
      text: 'Legível, padronizado e documentado. Qualquer desenvolvedor assume o projeto depois sem precisar reescrever tudo.',
    },
    {
      icon: 'lifebuoy',
      title: 'Suporte contínuo',
      image: '/diferenciais/suporte.svg',
      text: 'Entrega não é despedida. Acompanhamos o uso real, corrigimos o que aparecer e evoluímos o produto com o negócio.',
    },
    {
      icon: 'devices',
      title: 'Responsividade completa',
      image: '/diferenciais/responsividade.svg',
      text: 'Testado de verdade em celular, tablet, notebook e telas grandes. Nada quebra, nada desalinha, nada fica escondido.',
    },
  ],
}

/* -------------------------------------------------------------------------- */
/*  6 · NOSSO PROCESSO                                                        */
/* -------------------------------------------------------------------------- */
export const process = {
  eyebrow: 'Nosso processo',
  title: 'Organização e transparência do briefing à entrega',
  subtitle:
    'Sem caixa-preta e sem semanas de silêncio. Cada etapa tem entregável claro, e você acompanha a evolução do começo ao fim.',

  /** Frase destacada ao final da timeline. */
  highlight: 'Você sempre sabe em que etapa o seu projeto está.',
  highlightText:
    'Cada etapa termina num entregável que você aprova. Nada avança sem o seu aval, e nenhuma semana passa sem retorno.',

  /**
   * Descrições curtas de propósito: na timeline horizontal cada etapa ocupa
   * uma coluna estreita, então um parágrafo longo viraria uma torre de texto.
   * `role` diz o que fica na sua mão naquela etapa — é o que sustenta a
   * promessa de transparência da seção.
   */
  steps: [
    {
      icon: 'chat',
      title: 'Briefing',
      text: 'Entendemos o que trava a operação hoje e qual resultado realmente importa.',
      deliverable: 'Diagnóstico e escopo inicial',
      role: 'Você conta o problema',
    },
    {
      icon: 'map',
      title: 'Planejamento',
      text: 'Definimos escopo, prioridades, prazo e investimento antes de codar.',
      deliverable: 'Proposta com escopo fechado',
      role: 'Você aprova a proposta',
    },
    {
      icon: 'palette',
      title: 'Design',
      text: 'Projetamos a interface para quem usa todo dia: pouco clique, nada escondido.',
      deliverable: 'Protótipo navegável',
      role: 'Você valida o layout',
    },
    {
      icon: 'terminal',
      title: 'Desenvolvimento',
      text: 'Construção em ciclos curtos, com ambiente de homologação sempre no ar.',
      deliverable: 'Entregas parciais funcionais',
      role: 'Você acompanha a evolução',
    },
    {
      icon: 'bug',
      title: 'Testes',
      text: 'Validamos regras, formulários, permissões, responsividade e desempenho.',
      deliverable: 'Checklist de qualidade aprovado',
      role: 'Você recebe o relatório',
    },
    {
      icon: 'rocket',
      title: 'Entrega',
      text: 'Publicação, domínio, treinamento da equipe e o código-fonte nas suas mãos.',
      deliverable: 'Sistema no ar + documentação',
      role: 'Você assume o controle',
    },
  ],
}

/* -------------------------------------------------------------------------- */
/*  7 · EQUIPE                                                                */
/* -------------------------------------------------------------------------- */

/**
 * A stack dos dois (os dois são full stack e dominam o mesmo conjunto) NÃO é
 * listada aqui de propósito: quem apresenta tecnologia no site é a seção
 * Ferramentas, uma vez e com descrição. No cartão da pessoa a lista virava
 * repetição — o que importa aqui é quem é, o que faz e como falar com ela.
 */
export const team = {
  eyebrow: 'Quem constrói',
  title: 'Você fala direto com quem escreve o código',
  subtitle:
    'Sem camada de intermediário e sem atendente repassando recado. Time enxuto, contato direto e responsabilidade sobre o que entregamos.',

  /**
   * `photo`: caminho de uma imagem em /public (ex.: '/equipe/enzo.jpg').
   * Vazio → o card usa o avatar de iniciais, mantendo a identidade visual.
   * `tag`: selo sobre o retrato. `focus`: a linha destacada antes da bio.
   * `age`: idade em anos, exibida ao lado da função.
   *
   * As duas descrições dizem a mesma coisa por baixo, com palavras diferentes:
   * função e stack informadas são idênticas para os dois, e diferenciar aqui
   * exigiria atribuir a cada um uma especialidade que ninguém informou.
   */
  members: [
    {
      name: 'Enzo Pontes do Nascimento',
      role: 'Desenvolvedor Full Stack',
      age: 15,
      initials: 'EN',
      tag: 'Full stack',
      photo: '', // FALTA: foto real
      focus: 'Full stack: da interface ao banco de dados',
      bio: 'Interface em React, TypeScript e JavaScript. Regra de negócio em PHP, Laravel e Node.js. Dados em MySQL.',
      links: {
        github: enzo.github,
        instagram: enzo.instagram,
        whatsapp: enzo.whatsapp,
        linkedin: enzo.linkedin,
      },
    },
    {
      name: 'Luis Ricardo Soares',
      role: 'Desenvolvedor Full Stack',
      age: 16,
      initials: 'LS',
      tag: 'Full stack',
      photo: '', // FALTA: foto real
      focus: 'Full stack: da interface ao banco de dados',
      bio: 'React, TypeScript e JavaScript na interface. PHP, Laravel e Node.js na regra de negócio. MySQL no banco.',
      links: {
        github: luis.github,
        instagram: luis.instagram,
        whatsapp: luis.whatsapp,
        linkedin: luis.linkedin,
      },
    },
  ],
}

/* -------------------------------------------------------------------------- */
/*  8 · NOSSOS NÚMEROS                                                        */
/* -------------------------------------------------------------------------- */
export const stats = {
  eyebrow: 'Nossos números',
  title: 'Consistência que dá para medir',
  subtitle:
    'Sem número inflado para impressionar. É o que já foi entregue, está no ar e continua sendo mantido.',
  items: [
    {
      icon: 'rocket',
      value: 30,
      suffix: '+',
      label: 'Projetos entregues',
      text: 'De landing pages a sistemas completos em produção.',
    },
    {
      icon: 'users',
      value: 20,
      suffix: '+',
      label: 'Clientes atendidos',
      text: 'Negócios de segmentos e portes diferentes.',
    },
    {
      icon: 'blocks',
      value: 10,
      suffix: '+',
      label: 'Tecnologias dominadas',
      text: 'Do front-end ao banco de dados e à infraestrutura.',
    },
    {
      icon: 'clock',
      value: 3,
      suffix: ' sem.',
      label: 'Tempo médio de entrega',
      text: 'Média entre projetos de site institucional.',
    },
    {
      icon: 'star',
      value: 100,
      suffix: '%',
      label: 'Satisfação dos clientes',
      text: 'Projetos aprovados e mantidos após a entrega.',
    },
  ],
}

/* -------------------------------------------------------------------------- */
/*  9 · FAQ                                                                   */
/* -------------------------------------------------------------------------- */
export const faq = {
  eyebrow: 'Perguntas frequentes',
  title: 'As dúvidas que chegam antes do primeiro contato',
  helper: {
    text: 'Sua dúvida não está aqui? Pergunte direto — resposta rápida, sem compromisso.',
    cta: 'Fazer uma pergunta',
  },

  /**
   * Ordem = ordem de exibição, e a numeração (01, 02, …) sai do índice.
   * `tag`: o assunto da resposta, exibido como selo no fim dela.
   * Respostas curtas de propósito: duas frases resolvem a dúvida e quem quiser
   * detalhe fala com a gente — é esse o próximo passo que a seção quer.
   */
  items: [
    {
      q: 'Quanto custa um site?',
      tag: 'Investimento',
      a: 'Landing page a partir de R$ 1.800, site institucional de R$ 3.200 e sistema web de R$ 8.500. Você recebe uma proposta com escopo fechado — sem valor surpresa no meio do caminho.',
    },
    {
      q: 'Quanto tempo demora?',
      tag: 'Prazo',
      a: 'Landing page em cerca de uma semana, site institucional entre duas e três e sistema web de cinco a oito. Você acompanha a evolução em ambiente de homologação desde o início, em vez de esperar o resultado no escuro.',
    },
    {
      q: 'Posso solicitar alterações?',
      tag: 'Escopo',
      a: 'Pode, e é esperado que aconteça. Os ajustes previstos no escopo entram sem custo extra; o que amplia o escopo original é orçado antes de qualquer execução, então nenhuma fatura surpreende você.',
    },
    {
      q: 'O site funciona no celular?',
      tag: 'Responsivo',
      a: 'Sim, e essa é a prioridade — a maior parte dos acessos vem de celular. Todo projeto nasce pensando na tela pequena e é testado de verdade em celular, tablet, notebook e monitor grande.',
    },
    {
      q: 'Desenvolvem sistemas personalizados?',
      tag: 'Sob medida',
      a: 'É exatamente o nosso foco. Nada de template nem de encaixar a sua operação num software de prateleira: mapeamos o seu processo e construímos as regras, permissões e fluxos em cima dele. O código é seu.',
    },
    {
      q: 'Vocês oferecem suporte?',
      tag: 'Suporte',
      a: 'Sim, entrega não é despedida. Cuidamos de correções, atualizações de segurança, performance e novas funcionalidades conforme o negócio evolui — de forma pontual ou em plano mensal.',
    },
    {
      q: 'Atendem empresas de fora da região?',
      tag: 'Atendimento',
      a: 'Atendemos todo o Brasil de forma remota: reuniões por vídeo, acompanhamento online e contato por WhatsApp e e-mail. A distância não muda o padrão de entrega nem o tempo de resposta.',
    },
  ],
}

/* -------------------------------------------------------------------------- */
/*  10 · FALE COM A GENTE                                                     */
/* -------------------------------------------------------------------------- */
export const contactSection = {
  eyebrow: 'Fale com a gente',
  title: 'Descreva o desafio. Nós desenhamos a solução.',
  subtitle:
    'Preencha o formulário e receba um retorno em até 2 horas úteis com as próximas etapas. Quanto mais contexto você der, mais preciso será o nosso diagnóstico.',
  projectTypes: [
    { value: 'site', label: 'Site institucional' },
    { value: 'landing', label: 'Landing page' },
    { value: 'system', label: 'Sistema web' },
    { value: 'saas', label: 'SaaS' },
    { value: 'automation', label: 'Automação / API' },
    { value: 'other', label: 'Outro' },
  ],
  budgets: [
    { value: 'a', label: 'Até R$ 3.000' },
    { value: 'b', label: 'R$ 3.000 a R$ 8.000' },
    { value: 'c', label: 'R$ 8.000 a R$ 20.000' },
    { value: 'd', label: 'Acima de R$ 20.000' },
    { value: 'e', label: 'Ainda não sei' },
  ],
  deadlines: [
    { value: 'urgent', label: 'O quanto antes' },
    { value: 'month', label: 'Até 1 mês' },
    { value: 'quarter', label: 'Nos próximos 3 meses' },
    { value: 'planning', label: 'Só planejando' },
  ],
  reassurance: [
    'Retorno em até 2 horas úteis',
    'Diagnóstico inicial sem custo',
    'Seus dados não são compartilhados',
  ],
  direct: {
    title: 'Prefere falar direto?',
    text: 'Escolha o canal que preferir. Respondemos rápido em todos.',
    socialsLabel: 'Também estamos aqui',
  },
}

/* -------------------------------------------------------------------------- */
/*  FOOTER                                                                    */
/* -------------------------------------------------------------------------- */
export const footer = {
  tagline: 'Software house full stack. Transformamos desafios operacionais em soluções digitais que geram resultado.',
  columns: [
    {
      title: 'Navegação',
      links: [
        { label: 'Projetos', href: '#projetos' },
        { label: 'Ferramentas', href: '#ferramentas' },
        { label: 'Diferenciais', href: '#diferenciais' },
        { label: 'Processo', href: '#processo' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Equipe', href: '#equipe' },
        { label: 'Nossos números', href: '#numeros' },
        { label: 'Perguntas frequentes', href: '#faq' },
        { label: 'Fale com a gente', href: '#contato' },
      ],
    },
  ],
}
