/**
 * Fonte única de verdade do conteúdo do site.
 * Nenhum componente contém texto fixo — alterar copy nunca exige tocar em JSX.
 *
 * Metadados (title, description, Open Graph, domínio) NÃO moram aqui: eles têm
 * arquivo próprio em src/data/seo.js.
 *
 * Ordem das seções na página (App.jsx):
 *   1 Hero · 2 Serviços · 3 Projetos · 4 Tecnologias · 5 Custo invisível
 *   6 Diferenciais · 7 Equipe · 8 Números · 9 FAQ · 10 Contato
 *
 * ⚠️  Ainda pendente de dado real (nada foi inventado; cada ponto está marcado
 *     com `// FALTA` no lugar exato):
 *       · URLs dos projetos ainda não hospedados e screenshots de todos
 *       · fotos do time
 *       · LinkedIn dos dois desenvolvedores
 *       · perfis próprios da LZdev (hoje o site usa os pessoais)
 *       · os números de `stats`, que ninguém confirmou
 *
 * ⚠️  O que o site OFERECE está em `services`, e essa lista é contrato: os dados
 *     estruturados (JSON-LD) são gerados a partir dela. Anunciar em schema um
 *     serviço que a página não mostra é exatamente o que o Google trata como
 *     marcação enganosa — se um serviço novo entrar, ele entra AQUI primeiro.
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
  portfolio: 'https://destypc.github.io/Portfolio-Enzo/',
  instagram: 'https://www.instagram.com/enzinxz2',
  whatsapp: '5545998507429',
  phone: '(45) 99850-7429',
  linkedin: '', // FALTA: perfil não informado — o botão só aparece quando preenchido
}

const luis = {
  first: 'Luis',
  github: 'https://github.com/luizeh',
  portfolio: 'https://luizeh.github.io/Portfolio-Oficial/',
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

  /**
   * Redes exibidas na seção de contato — e SÓ nela: o rodapé não repete nenhum
   * canal, e assim os mesmos perfis não aparecem duas vezes na mesma tela.
   * A LZdev ainda não tem perfis próprios (FALTA), então estas são as contas
   * pessoais dos dois desenvolvedores.
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

/**
 * E-mail já composto, nas duas formas que o visitante pode ter à mão:
 * `mailto` entrega para o app de e-mail do sistema; `gmail` abre o compositor do
 * Gmail no navegador — a saída de quem usa webmail e não tem app configurado,
 * caso em que um `mailto:` simplesmente não faz nada ao ser clicado.
 */
export const emailLink = {
  mailto: (subject, body, to = contact.email) =>
    `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  gmail: (subject, body, to = contact.email) =>
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`,
}

/** Redes com link preenchido — base do agrupamento da seção de contato. */
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
/**
 * Menu principal. Cinco destinos, todos com nome de coisa concreta — quem lê
 * "Serviços" sabe que vai ver o que pode contratar, e quem lê "Projetos" sabe
 * que vai ver trabalho entregue. Nada de rótulo criativo onde o óbvio serve.
 *
 * "Contato" NÃO está na lista de propósito: ele é o CTA da barra, e repetir o
 * mesmo destino como link discreto ao lado do botão só divide o clique.
 *
 * `label` é também o texto que o leitor de tela anuncia, e `href` a âncora da
 * seção correspondente — a mesma string que o id do <section> usa.
 */
export const navLinks = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Tecnologias', href: '#tecnologias' },
  { label: 'Equipe', href: '#equipe' },
  { label: 'FAQ', href: '#faq' },
]

/**
 * Rótulo do CTA principal, em UM lugar só.
 * Ele aparece na barra, no Hero, no fechamento do custo invisível e no envio do
 * formulário — quatro pontos da página que precisam prometer a MESMA coisa. Com
 * quatro strings soltas, uma sempre ficava diferente das outras.
 */
export const primaryCta = 'Solicitar orçamento'

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
   *
   * O H1 DIZ O SERVIÇO, não a promessa. "Transformamos desafios em soluções
   * digitais que geram resultado" descrevia qualquer empresa de tecnologia do
   * mundo: o visitante lia a frase inteira e ainda não sabia se aqui se compra
   * um site, uma consultoria ou um curso. Agora a primeira linha da página
   * responde "o que vocês fazem?" — e é essa a frase que o Google usa como
   * assunto principal.
   *
   * As duas palavras em destaque são justamente os dois serviços (`services`).
   */
  title: [
    [{ text: 'Desenvolvemos' }],
    [{ text: 'sites', accent: true }, { text: ' e ' }, { text: 'sistemas web', accent: true }],
    [{ text: 'sob medida.' }],
  ],

  subtitle:
    'Landing pages, sites institucionais e sistemas de gestão feitos do zero para o seu processo — da tela ao banco de dados, com escopo fechado antes de começar.',

  /** O CTA primário sai de `primaryCta`: é o mesmo rótulo da barra e do envio. */
  secondaryCta: 'Ver projetos',

  /** Cards flutuantes ao redor do painel — recortes de `why.items`.
   *  Sem `tone`: os três chips compartilham o mesmo branco translúcido. */
  floatingCards: [
    { icon: 'gauge', title: 'Performance', text: 'Sistemas rápidos e otimizados', at: 'perf' },
    { icon: 'code', title: 'Código limpo', text: 'Escalável, organizado e sustentável', at: 'code' },
    { icon: 'shield', title: 'Segurança', text: 'Seus dados sempre protegidos', at: 'secure' },
  ],

}

/* -------------------------------------------------------------------------- */
/*  2 · SERVIÇOS                                                              */
/*                                                                            */
/*  A seção que faltava na página. O site apresentava projetos, stack,         */
/*  diferenciais, equipe e números — e em nenhum lugar dizia O QUE SE CONTRATA */
/*  aqui. Pior: o title e o JSON-LD anunciavam SaaS, automações e APIs, que    */
/*  seção nenhuma sustentava. A LZdev confirmou (18/08/2026) que o que vende   */
/*  hoje são as DUAS famílias abaixo, e o schema passou a sair desta lista.    */
/*                                                                            */
/*  NADA aqui é inventado. Cada linha vem de informação que já estava no site: */
/*    · o que cada formato entrega → respostas do FAQ                        */
/*    · login, permissão por perfil, relatório e painel único → Sprint Max     */
/*    · caminho curto até o WhatsApp → Kimori e Tio Preto                     */
/*    · "sem template" e "o código é seu" → diferenciais e FAQ                */
/*    · atendimento remoto em todo o Brasil → FAQ                             */
/* -------------------------------------------------------------------------- */
export const services = {
  title: 'O que a gente desenvolve',
  subtitle:
    'Três formatos, um jeito de trabalhar: proposta com escopo fechado, acompanhamento em ambiente de teste e o código entregue no seu nome.',

  /**
   * SEM PREÇO E SEM PRAZO, e é regra do site — não descuido.
   *
   * Cada card tinha um pé com "A partir de R$ 1.800" e "cerca de 1 semana".
   * Os dois saíram por decisão da LZdev: valor e cronograma sem escopo definido
   * são chute, e chute publicado vira âncora contra a própria proposta (o
   * visitante decide por um número antes de saber o que está comprando) e
   * promessa que alguém cobra depois. Os dois voltam na conversa, onde existe
   * escopo para sustentá-los.
   *
   * A trava está em `scripts/check-seo.mjs`: ela varre o HTML publicado e
   * REPROVA o build se um preço ou um prazo reaparecer em qualquer lugar.
   */
  items: [
    {
      icon: 'rocket',
      name: 'Landing page',
      what: 'Uma página só, com um objetivo só.',
      audience: 'Para divulgar um serviço, produto ou campanha.',
      includes: [
        'Toda a decisão em uma rolagem',
        'Caminho curto até o WhatsApp ou formulário',
        'Pronta para receber tráfego de anúncio',
      ],
    },
    {
      icon: 'globe',
      name: 'Site institucional',
      what: 'A presença completa da empresa na internet.',
      audience: 'Para quem precisa ser encontrado e passar credibilidade.',
      includes: [
        'Serviços, prova de trabalho e contato',
        'Estrutura preparada para o Google',
        'Conteúdo fácil de crescer depois',
      ],
    },
    {
      icon: 'blocks',
      name: 'Sistema web sob medida',
      what: 'O software que roda a sua operação, feito para o seu processo.',
      audience: 'Para operação que hoje vive em planilha, papel ou WhatsApp.',
      includes: [
        'Login com permissão por perfil',
        'Cadastros, vendas e relatórios num painel único',
        'As suas regras, não as de um software de prateleira',
      ],
    },
  ],

  /**
   * Rodapé da seção: a resposta para quem não se encaixou em nenhum dos três
   * cards, e o único botão da seção. Três cards com três botões iguais
   * transformariam a página numa fileira de CTAs disputando o mesmo clique.
   */
  closing: {
    text: 'Não sabe qual formato encaixa no seu caso? Descreva a operação e a gente indica — inclusive se a resposta for o formato mais simples.',
    note: 'Atendimento remoto em todo o Brasil, por vídeo, WhatsApp e e-mail.',
  },
}

/* -------------------------------------------------------------------------- */
/*  3 · PROJETOS — FALTA: URLs dos 3 não hospedados e screenshots             */
/* -------------------------------------------------------------------------- */
export const projects = {
  title: 'Resultado entregue',
  subtitle: 'Uma amostra do que já está no ar e em uso — do sistema de gestão completo à ferramenta pública.',

  /**
   * Convite a rolar, exibido ao lado das setas até o visitante mexer no
   * carrossel. Sem número no texto de propósito: a lista cresce, e a frase
   * continuaria prometendo "os 4 projetos".
   */
  hint: 'Arraste para o lado para ver os outros projetos',

  /**
   * `image`: caminho de uma imagem em /public (ex.: '/projetos/sprint-max.png').
   * Enquanto estiver vazio, o card mostra uma moldura de espera com o nome do
   * projeto — nunca uma imagem quebrada. Basta preencher o caminho quando o
   * screenshot existir; nenhum outro ajuste é necessário.
   *
   * `url`: endereço público do projeto no ar. VAZIO ESCONDE O BOTÃO, e é por
   * isso que ele existe assim: os quatro cards apontavam para `#`, um link que
   * recarrega a própria página e volta ao topo. Para o visitante é um botão
   * quebrado; para o Google, quatro links internos que não levam a nada. Sem
   * URL, o card diz honestamente que a publicação está a caminho.
   */
  items: [
    {
      name: 'Sprint Max',
      category: 'Sistema de gestão',
      image: '', // FALTA: screenshot real
      text: 'Sistema completo de gestão de produtos, usuários e vendas. Substituiu o controle por planilha por um painel único, com permissões por perfil e relatórios que fecham sozinhos.',
      stack: ['PHP', 'Laravel', 'MySQL', 'Bootstrap'],
      url: '', // FALTA: ainda não hospedado — sem URL o card não mostra botão
    },
    {
      name: 'Kimori Korean Food',
      category: 'Website',
      image: '', // FALTA: screenshot real
      text: 'Presença digital para restaurante de comida coreana: cardápio navegável, identidade marcante e caminho curto até o pedido pelo WhatsApp.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS'],
      url: '', // FALTA: ainda não hospedado — sem URL o card não mostra botão
    },
    {
      name: 'Horário de Brasília',
      category: 'Ferramenta online',
      image: '', // FALTA: screenshot real
      text: 'Ferramenta pública de consulta ao horário oficial de Brasília. Interface direta, precisa e leve o bastante para abrir instantaneamente em qualquer conexão.',
      stack: ['JavaScript', 'HTML', 'CSS'],
      url: '', // FALTA: ainda não hospedado — sem URL o card não mostra botão
    },
    {
      name: 'Tio Preto Barbearia',
      category: 'Site para barbearia',
      image: '', // FALTA: screenshot real
      // FALTA: confirmar o texto com o que o site realmente tem (a descrição
      // abaixo cobre o escopo típico de barbearia — serviços, equipe e contato).
      text: 'Presença digital para barbearia: serviços e preços na tela inicial, apresentação da equipe e caminho curto até o agendamento pelo WhatsApp.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS'], // FALTA: confirmar stack real
      url: 'https://tiopretobarbearia.lzdev.com.br',
    },
  ],
  /**
   * `cta` diz o que o clique faz: abre o projeto REAL, no ar, em outra aba —
   * "Visualizar projeto" podia ser um modal, uma galeria ou nada. `soon` é o
   * lugar do card que ainda não tem endereço público: um selo honesto no lugar
   * de um botão que não leva a nada.
   */
  cta: 'Abrir o site no ar',
  soon: 'Publicação em breve',
}

/* -------------------------------------------------------------------------- */
/*  4 · TECNOLOGIAS                                                           */
/*                                                                            */
/*  A âncora e o rótulo do menu dizem "tecnologias", não "ferramentas": o que  */
/*  a seção lista são linguagens, frameworks e bancos — "ferramenta" é o nome  */
/*  interno de quem escreve o código, não o de quem lê a página.              */
/* -------------------------------------------------------------------------- */
export const tools = {
  title: 'A stack que sustenta cada entrega',
  subtitle:
    'Você não precisa entender nada desta lista — escolher certo é o nosso trabalho. Ela está aqui para mostrar que existe critério técnico por trás de cada decisão.',

  /**
   * Agrupado por camada em vez de uma lista solta: mostra que a stack cobre o
   * projeto de ponta a ponta, e não que sabemos quinze nomes.
   *
   * DOIS NÍVEIS por grupo, e é isso que impede a seção de virar um paredão de
   * logos:
   *
   *   `items`  · no máximo QUATRO por grupo, cada um com card e descrição. São
   *              as escolhas que definem o projeto — o que muda a arquitetura,
   *              o prazo e a manutenção. Quatro é o número de colunas do grid,
   *              então todo grupo fecha em UMA linha exata no desktop: nenhuma
   *              fileira quebrada, nenhum buraco à direita.
   *   `extras` · a base que vem junto de qualquer projeto web. Continua listada
   *              (omitir seria esconder parte do trabalho), mas como pastilha de
   *              ícone e nome, sem descrição. HTML, CSS e JavaScript não são uma
   *              DECISÃO técnica: existem em todo site do mundo, e dar a eles o
   *              mesmo card do React inflava o front-end para sete cards, três
   *              deles dizendo o óbvio. O que ENTRA no card é o que muda o
   *              projeto — a biblioteca, a tipagem, o sistema de estilo.
   */
  groups: [
    {
      label: 'Front-end',
      caption: 'O que o seu cliente vê e usa',
      items: [
        { name: 'React', icon: 'react', text: 'Interfaces componentizadas, rápidas e fáceis de evoluir.' },
        { name: 'TypeScript', icon: 'typescript', text: 'Tipagem que revela o erro antes de ele chegar em produção.' },
        { name: 'Tailwind CSS', icon: 'tailwind', text: 'Design consistente e CSS que não cresce sem controle.' },
        { name: 'Bootstrap', icon: 'bootstrap', text: 'Base responsiva madura para telas administrativas.' },
      ],
      extrasLabel: 'Base de todo projeto',
      extras: [
        { name: 'HTML', icon: 'html' },
        { name: 'CSS', icon: 'css' },
        { name: 'JavaScript', icon: 'javascript' },
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
      caption: 'Como o projeto nasce, é montado e fica rastreável',
      items: [
        { name: 'Figma', icon: 'figma', text: 'Protótipo navegável aprovado antes da primeira linha de código.' },
        { name: 'Git', icon: 'git', text: 'Histórico completo: qualquer mudança é reversível.' },
        { name: 'GitHub', icon: 'github', text: 'Código hospedado e revisado: o projeto nunca mora numa máquina só.' },
        { name: 'Composer', icon: 'composer', text: 'Dependências PHP com versão travada: mesmo ambiente em todo lugar.' },
      ],
    },
  ],
}

/* -------------------------------------------------------------------------- */
/*  5 · O CUSTO INVISÍVEL                                                     */
/* -------------------------------------------------------------------------- */
/**
 * A seção segue a fórmula PAS (problema → agitação → solução), que é o padrão
 * das seções de dor que convertem, com os três dispositivos que os estudos de
 * página apontam como os que funcionam — e nenhum enfeite além deles:
 *
 *   1 · RECONHECIMENTO (`heard`) · falas que o dono do negócio já ouviu de um
 *       cliente. É o "isso é sobre mim" em dois segundos, e vem antes de
 *       qualquer argumento nosso: o visitante chega à lista de prejuízos já
 *       tendo concordado.
 *   2 · COMPARAÇÃO LADO A LADO (`items[].text` × `items[].fix`) · cada prejuízo
 *       aparece junto da saída correspondente, na mesma linha. Era o dispositivo
 *       que faltava: cinco cartões vermelhos empilhados agitavam a dor e paravam
 *       ali, deixando a virada toda para o rodapé da seção. Agora a própria
 *       estrutura entrega a solução, item por item.
 *   3 · FECHAMENTO (`closing`) · a conta que corre todo mês e o próximo passo.
 *
 * O que NÃO entrou: número de pesquisa de mercado. A estatística aumentaria a
 * credibilidade, mas as que encontrei sobre comportamento do consumidor
 * brasileiro (Opinion Box, Reclame AQUI) medem preço e avaliação de produto, não
 * "procurei a empresa e não achei site" — citá-las aqui seria esticar o dado
 * para um argumento que ele não sustenta. Se algum dia houver um número da
 * própria LZdev (quantos clientes chegaram pelo Google, por exemplo), ele entra
 * aqui e vale mais que qualquer pesquisa de terceiro.
 */
export const invisibleCost = {
  title: 'Não ter um site profissional não aparece na conta — mas você paga por ele',
  subtitle:
    'Nenhum desses prejuízos vem com aviso ou boleto. Eles acontecem em silêncio, todos os dias, enquanto o cliente decide fechar com outra empresa.',

  /**
   * Frases genéricas de situação, não depoimento de cliente real — são o retrato
   * do que qualquer negócio sem site escuta, e é assim que a seção as apresenta.
   */
  heard: {
    label: 'Frases que você já ouviu',
    quotes: [
      'Vocês têm site? Pesquisei e não achei nada.',
      'Me manda tudo no WhatsApp que depois eu vejo.',
      'Fechei com a outra empresa — a apresentação deles me deu mais segurança.',
    ],
  },

  /** Rótulos das duas colunas da comparação. */
  columns: {
    now: 'Hoje, sem site',
    after: 'Com o site no ar',
  },

  /**
   * `text` é a dor e `fix` é a saída — os dois na mesma linha da comparação, e
   * por isso escritos curtos e em paralelo: um par que não fecha no mesmo
   * tamanho desalinha a leitura das duas colunas.
   */
  items: [
    {
      icon: 'userX',
      title: 'Credibilidade em dúvida',
      text: 'Antes de ligar, o cliente pesquisa. Sem site, ele fica sem saber o tamanho e a seriedade da operação.',
      consequence: 'O contato morre antes de existir',
      fix: 'Quem pesquisa encontra estrutura, trabalhos entregues e um canal de contato — e liga com a decisão meio tomada.',
    },
    {
      icon: 'moon',
      title: 'Venda perdida fora do horário',
      text: 'A decisão de compra raramente acontece de segunda a sexta, das 8h às 18h. A intenção esfria até alguém responder.',
      consequence: 'Demanda que chega quando ninguém atende',
      fix: 'O site apresenta, responde a dúvida comum e recebe o pedido às 23h de um domingo, sem ninguém de plantão.',
    },
    {
      icon: 'share',
      title: 'Presença alugada nas redes',
      text: 'Perfil suspenso, alcance derrubado por algoritmo ou conta perdida — e todo o histórico comercial vai junto.',
      consequence: 'A regra é de outro dono',
      fix: 'Domínio, conteúdo e contatos no seu nome. A rede social volta a ser vitrine, e não o seu endereço.',
    },
    {
      icon: 'trendingDown',
      title: 'Concorrente na frente',
      text: 'Na comparação lado a lado, ganha quem apresenta melhor a proposta — não sempre quem entrega melhor.',
      consequence: 'Você perde antes de poder argumentar',
      fix: 'Você entra na reunião já apresentado, no mesmo nível de quem investiu em estrutura há anos.',
    },
    {
      icon: 'searchX',
      title: 'Invisível no Google',
      text: 'Quem procura pelo seu serviço hoje encontra quem investiu em conteúdo. Você não está entre as opções.',
      consequence: 'Demanda pronta indo para outro lugar',
      fix: 'Páginas indexáveis, SEO e dados estruturados desde a primeira entrega: você aparece para quem já quer comprar.',
    },
  ],
  closing: {
    title: 'Todo mês sem site é um mês pagando essa conta',
    text: 'A boa notícia: nenhum desses pontos é difícil de resolver. É estrutura, não sorte.',
    /* O rótulo sai de `primaryCta`: "Quero resolver isso" era entusiasmo, não
       informação — o visitante não sabia se ia para um formulário, uma tabela
       de preços ou uma chamada de vídeo. */
  },
}

/* -------------------------------------------------------------------------- */
/*  6 · DIFERENCIAIS                                                          */
/* -------------------------------------------------------------------------- */
export const why = {
  title: 'Feito certo agora custa menos que refeito depois',
  subtitle:
    'Boa parte do que recebemos para manter foi construído às pressas por alguém que não pensou no ano seguinte. Nosso padrão de engenharia existe para você nunca precisar recomeçar.',

  /** Convite a rolar do carrossel — ver `projects.hint`. */
  hint: 'Arraste para o lado para ver os outros diferenciais',

  /**
   * `image`: ilustração do diferencial, em /public/diferenciais/*.svg.
   * São vetores desenhados para ESTE site — mesmo grafite do tema, mesma malha
   * do fundo e o acento categórico na ordem em que o card aparece (azul, ciano,
   * violeta, ciclando). A imagem mostra a própria promessa do card (a régua de
   * medida, o medidor no verde, o editor indentado) em vez de decorar.
   * Vazio → o card volta ao painel só de ícone, sem imagem quebrada.
   *
   * FOTOGRAFIA FOI TESTADA E RECUSADA (18/08/2026). As sete ilustrações foram
   * trocadas por foto real e a LZdev preferiu voltar ao vetor — o que faz
   * sentido: as ilustrações nascem na paleta do site, e sete fotos de sete
   * fotógrafos diferentes chegam com sete iluminações, o que aparece na hora
   * numa página preta. Se um dia forem retomadas, as escolhidas estavam no
   * Unsplash (ids wdnpaTNwOEQ, JKUTrJ4vK00, h7v_38e3iGE, c4aT8MfEzdw,
   * _SgRNwAVNKw, Im_cQ6hQo10, 2mc2B5iX6as, nesta ordem de card).
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
/*  7 · EQUIPE                                                                */
/* -------------------------------------------------------------------------- */

/**
 * A stack dos dois (os dois são full stack e dominam o mesmo conjunto) NÃO é
 * listada aqui de propósito: quem apresenta tecnologia no site é a seção
 * Ferramentas, uma vez e com descrição. No cartão da pessoa a lista virava
 * repetição — o que importa aqui é quem é, o que faz e como falar com ela.
 */
export const team = {
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
        portfolio: enzo.portfolio,
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
        portfolio: luis.portfolio,
      },
    },
  ],
}

/* -------------------------------------------------------------------------- */
/*  8 · NOSSOS NÚMEROS                                                        */
/* -------------------------------------------------------------------------- */
export const stats = {
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
    /* A métrica "Tempo médio de entrega · 3 sem." saiu daqui: era um prazo de
       entrega publicado, e o site não publica prazo. */
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
    /**
     * As duas primeiras perguntas mudaram de RESPOSTA, não de assunto: elas
     * publicavam tabela de preço e de semanas. Continuam sendo as duas dúvidas
     * que chegam primeiro, e agora explicam COMO se chega ao número — que é a
     * resposta honesta quando ninguém sabe ainda o escopo.
     */
    {
      q: 'Como funciona o orçamento?',
      tag: 'Orçamento',
      a: 'A primeira conversa é para entender o que você precisa: o que o site ou o sistema tem de fazer, quem vai usar e o que já existe hoje. Com isso na mão você recebe uma proposta de escopo fechado, e nada muda no meio do caminho sem você aprovar antes.',
    },
    {
      q: 'Como funciona do primeiro contato até a entrega?',
      tag: 'Processo',
      a: 'Conversa, proposta com escopo fechado, protótipo aprovado no Figma, desenvolvimento em ambiente de homologação que você acompanha, entrega e suporte. Cada etapa é aprovada antes de a próxima começar.',
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
/* 10 · FALE COM A GENTE                                                     */
/* -------------------------------------------------------------------------- */
export const contactSection = {
  title: 'Descreva o desafio. Nós desenhamos a solução.',
  subtitle:
    'Quatro campos e a gente responde com as próximas etapas. Se quiser adiantar o diagnóstico, conte o desafio na descrição — o campo é opcional.',
  /* "Retorno em até 2 horas úteis" saiu: era um prazo publicado — e um que um
     time de duas pessoas não controla em dia de entrega —, do tipo que o
     visitante cobra no minuto 121. As duas linhas que sobraram são as que a
     LZdev consegue cumprir sempre. */
  reassurance: ['Diagnóstico inicial sem custo', 'Seus dados não são compartilhados'],

  /**
   * O que acontece DEPOIS de clicar, escrito antes do clique.
   * O botão não envia um e-mail: ele monta a mensagem e abre o WhatsApp com ela
   * pronta. Descobrir isso só quando a aba abre é a diferença entre "que bom,
   * já está escrito" e "espera, eu não pedi isso" — e a segunda reação fecha a
   * aba. `submitNote` fica ao lado do botão; `sent` é a confirmação.
   */
  submitNote:
    'Ao enviar, abrimos o WhatsApp com a sua solicitação já escrita. Você lê, ajusta se quiser e manda.',
  sent: 'Tudo pronto — abrimos o WhatsApp com a sua solicitação preenchida. Se a aba não abriu, verifique o bloqueador de pop-ups ou use um dos canais ao lado.',
  direct: {
    title: 'Prefere falar direto?',
    text: 'Escolha o canal que preferir. Respondemos rápido em todos.',
    socialsLabel: 'Também estamos aqui',

    /**
     * Painel do canal de e-mail.
     *
     * Um `mailto:` sozinho é aposta: em máquina sem cliente de e-mail
     * configurado — a maioria de quem usa webmail no navegador — o clique não
     * faz absolutamente nada, e o visitante conclui que o site está quebrado.
     * Por isso o botão abre um painel com TRÊS saídas: o Gmail na web (o caso
     * mais comum no Brasil), o app de e-mail do sistema e o endereço para
     * copiar. Assunto e corpo já vão preenchidos nos dois primeiros — o mesmo
     * tratamento que os botões de WhatsApp recebem.
     *
     * `\n` no corpo: o roteiro de campos existe para o visitante não travar no
     * "não sei o que escrever". Ele pode apagar tudo e escrever à mão.
     */
    email: {
      openLabel: 'Enviar um e-mail',
      /** O endereço em si NÃO mora aqui: ele vem de `contact.email`. */
      panelTitle: 'Enviar para',
      subject: 'Solicitação de projeto — site LZdev',
      body: 'Olá, equipe LZdev!\n\nVim pelo site e gostaria de conversar sobre um projeto.\n\nNome:\nEmpresa:\nTelefone:\nO que eu preciso:\n',
      gmail: 'Abrir no Gmail',
      app: 'Abrir meu app de e-mail',
      copy: 'Copiar endereço',
      copied: 'Endereço copiado',
      note: 'O assunto e o texto inicial já vão preenchidos. Você revisa antes de enviar.',
    },
  },
}

/* -------------------------------------------------------------------------- */
/*  FOOTER                                                                    */
/* -------------------------------------------------------------------------- */
export const footer = {
  /* A tagline diz o serviço, como o H1 — é o texto que fecha a página e o que
     um leitor de tela lê no rodapé para saber onde está. */
  tagline:
    'Desenvolvimento de sites, landing pages e sistemas web sob medida — da tela ao banco de dados.',

  /**
   * Atalhos do rodapé: são OITO, e juntos com os cinco do menu cobrem TODAS as
   * dez seções da página — nenhuma fica órfã, sem nada que aponte para ela.
   * Por isso "Tecnologias" não está aqui (já está no menu) e "Nossos números"
   * está (não está no menu).
   *
   * Oito é o número máximo antes de a grade quebrar feio: em 2 colunas
   * (celular) e 4 (a partir de sm), oito fecham duas fileiras exatas. Um nono
   * link deixaria um item órfão numa terceira linha.
   *
   * O texto de cada link nomeia o destino: nenhum "clique aqui" e nenhum rótulo
   * que só faz sentido depois de chegar lá.
   */
  columns: [
    {
      title: 'Navegação',
      links: [
        { label: 'Serviços', href: '#servicos' },
        { label: 'Projetos', href: '#projetos' },
        { label: 'Diferenciais', href: '#diferenciais' },
        { label: 'Custo invisível', href: '#custo-invisivel' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Nossos números', href: '#numeros' },
        { label: 'Equipe', href: '#equipe' },
        { label: 'Perguntas frequentes', href: '#faq' },
        { label: 'Fale com a gente', href: '#contato' },
      ],
    },
  ],
}
