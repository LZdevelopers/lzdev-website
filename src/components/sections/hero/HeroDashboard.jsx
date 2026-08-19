import { useState } from 'react'
import { Icon } from '../../primitives/Icon'

/**
 * Painel administrativo ilustrativo do Hero — e a única peça da página com que
 * dá para BRINCAR.
 *
 * 100% JSX + CSS + SVG: nenhuma imagem, nitidez perfeita em qualquer densidade
 * e peso de rede zero. Todo o dimensionamento interno sai da "unidade" --s
 * (definida em hero.css), que encolhe por container query — o mockup nunca
 * quebra nem estoura, de 320px ao desktop.
 *
 * O QUE RESPONDE AO VISITANTE
 *   · a trilha lateral troca de tela: cada ícone tem KPIs, gráfico e atividades
 *     próprios, e o nome da aba lá em cima acompanha;
 *   · o gráfico tem leitura por ponto — o ponteiro sobre um mês acende a linha
 *     guia, move a bolinha e abre o valor daquele mês;
 *   · o palco inteiro se inclina atrás do cursor (isso mora em HeroStage.jsx).
 *
 * ⚠️  ACESSIBILIDADE — por que nada aqui é focável pelo teclado.
 *     O painel é um `role="img"` com uma descrição inteira no `aria-label`:
 *     para quem usa leitor de tela ele é UMA ilustração, não um aplicativo, e o
 *     conteúdo de um `role="img"` é ignorado por definição. Botão que existe
 *     na tela mas não existe na árvore de acessibilidade não pode receber
 *     foco — daí o `tabIndex={-1}`. Nada se perde: os números são fictícios e
 *     nenhuma informação real do site mora aqui dentro.
 *
 *     (Esse `role="img"` também é o que faz scripts/check-seo.mjs ignorar o
 *     "R$ 48.750,00" abaixo na varredura de preço. Se ele sair, o build passa a
 *     reprovar por um preço que não é preço.)
 *
 * ⚠️  Os números, nomes e horários abaixo são ELEMENTOS VISUAIS do Hero, não
 *     dados do negócio. Existem apenas para o painel parecer um sistema real.
 */

/* -------------------------------------------------------------------------- */
/*  AS TELAS                                                                  */
/*  Cinco, uma por ícone da trilha — trilha em que todo ícone leva a algum     */
/*  lugar. Ícone decorativo no meio de ícones que funcionam é armadilha: o     */
/*  visitante clica, não acontece nada, e ele conclui que o painel travou.     */
/* -------------------------------------------------------------------------- */
const VIEWS = [
  {
    id: 'geral',
    icon: 'gauge',
    label: 'Visão geral',
    greet: 'Veja o desempenho geral do sistema',
    kpis: [
      { label: 'Receita', value: 'R$ 48.750,00', delta: '+12,5% este mês' },
      { label: 'Novos clientes', value: '128', delta: '+8,4% este mês' },
      { label: 'Pedidos', value: '342', delta: '+11,7% este mês' },
      { label: 'Conversão', value: '23,6%', delta: '+4,3% este mês' },
    ],
    chart: {
      title: 'Desempenho',
      sub: 'Últimos 6 meses',
      max: 50,
      ticks: ['50k', '40k', '30k', '20k', '10k'],
      points: [
        { m: 'Jan', v: 21, label: 'R$ 21.400' },
        { m: 'Fev', v: 26, label: 'R$ 26.100' },
        { m: 'Mar', v: 24, label: 'R$ 24.800' },
        { m: 'Abr', v: 33, label: 'R$ 33.500' },
        { m: 'Mai', v: 39, label: 'R$ 39.900' },
        { m: 'Jun', v: 48, label: 'R$ 48.750' },
      ],
    },
    acts: [
      { icon: 'cart', text: 'Novo pedido #1254', time: '2 min' },
      { icon: 'users', text: 'Cliente Kimori Food', time: '15 min' },
      { icon: 'checkCircle', text: 'Pagamento aprovado', time: '1 h' },
      { icon: 'users', text: 'Novo cliente cadastrado', time: '2 h' },
      { icon: 'blocks', text: 'Atualização de produto', time: '5 h' },
    ],
  },
  {
    id: 'vendas',
    icon: 'cart',
    label: 'Vendas',
    greet: 'Acompanhe as vendas do mês em andamento',
    kpis: [
      { label: 'Faturamento', value: 'R$ 31.980,00', delta: '+9,2% este mês' },
      { label: 'Ticket médio', value: 'R$ 187,40', delta: '+5,6% este mês' },
      { label: 'Pedidos pagos', value: '271', delta: '+7,3% este mês' },
      { label: 'Recompra', value: '38,2%', delta: '+2,9% este mês' },
    ],
    chart: {
      title: 'Vendas por mês',
      sub: 'Últimos 6 meses',
      max: 36,
      ticks: ['36k', '29k', '22k', '15k', '8k'],
      points: [
        { m: 'Jan', v: 14, label: 'R$ 14.200' },
        { m: 'Fev', v: 19, label: 'R$ 19.600' },
        { m: 'Mar', v: 17, label: 'R$ 17.300' },
        { m: 'Abr', v: 25, label: 'R$ 25.100' },
        { m: 'Mai', v: 28, label: 'R$ 28.700' },
        { m: 'Jun', v: 32, label: 'R$ 31.980' },
      ],
    },
    acts: [
      { icon: 'checkCircle', text: 'Pedido #1254 pago', time: '4 min' },
      { icon: 'cart', text: 'Cupom BLACK10 usado', time: '22 min' },
      { icon: 'trending', text: 'Meta de vendas batida', time: '1 h' },
      { icon: 'cart', text: 'Pedido #1249 enviado', time: '3 h' },
      { icon: 'checkCircle', text: 'Reembolso concluído', time: '6 h' },
    ],
  },
  {
    id: 'catalogo',
    icon: 'blocks',
    label: 'Catálogo',
    greet: 'Produtos, estoque e margem em um lugar só',
    kpis: [
      { label: 'Produtos ativos', value: '486', delta: '+24 este mês' },
      { label: 'Em estoque', value: '92,4%', delta: '+1,8% este mês' },
      { label: 'Mais vendido', value: '74 un.', delta: '+18,5% este mês' },
      { label: 'Margem média', value: '41,3%', delta: '+2,2% este mês' },
    ],
    chart: {
      title: 'Saída de estoque',
      sub: 'Últimos 6 meses',
      max: 800,
      ticks: ['800', '640', '480', '320', '160'],
      points: [
        { m: 'Jan', v: 320, label: '320 unidades' },
        { m: 'Fev', v: 415, label: '415 unidades' },
        { m: 'Mar', v: 380, label: '380 unidades' },
        { m: 'Abr', v: 520, label: '520 unidades' },
        { m: 'Mai', v: 610, label: '610 unidades' },
        { m: 'Jun', v: 780, label: '780 unidades' },
      ],
    },
    acts: [
      { icon: 'blocks', text: 'Estoque de Camisa P ajustado', time: '8 min' },
      { icon: 'checkCircle', text: 'Novo produto publicado', time: '35 min' },
      { icon: 'layers', text: 'Categoria Verão criada', time: '2 h' },
      { icon: 'blocks', text: 'Preço ajustado em 12 itens', time: '4 h' },
      { icon: 'checkCircle', text: 'Importação de planilha concluída', time: '7 h' },
    ],
  },
  {
    id: 'clientes',
    icon: 'users',
    label: 'Clientes',
    greet: 'Quem chegou, quem voltou e quem está ativo',
    kpis: [
      { label: 'Cadastrados', value: '2.480', delta: '+128 este mês' },
      { label: 'Ativos no mês', value: '964', delta: '+7,9% este mês' },
      { label: 'Recorrentes', value: '41,6%', delta: '+3,4% este mês' },
      { label: 'Satisfação', value: '4,8 / 5', delta: '+0,2 este mês' },
    ],
    chart: {
      title: 'Base de clientes',
      sub: 'Últimos 6 meses',
      max: 2500,
      ticks: ['2,5k', '2,0k', '1,5k', '1,0k', '0,5k'],
      points: [
        { m: 'Jan', v: 1180, label: '1.180 clientes' },
        { m: 'Fev', v: 1420, label: '1.420 clientes' },
        { m: 'Mar', v: 1610, label: '1.610 clientes' },
        { m: 'Abr', v: 1890, label: '1.890 clientes' },
        { m: 'Mai', v: 2130, label: '2.130 clientes' },
        { m: 'Jun', v: 2480, label: '2.480 clientes' },
      ],
    },
    acts: [
      { icon: 'users', text: 'Cliente Kimori Food cadastrado', time: '11 min' },
      { icon: 'chat', text: 'Mensagem respondida no chat', time: '40 min' },
      { icon: 'userCheck', text: 'Cadastro confirmado', time: '2 h' },
      { icon: 'users', text: 'Novo cliente cadastrado', time: '5 h' },
      { icon: 'star', text: 'Avaliação 5 estrelas recebida', time: '9 h' },
    ],
  },
  {
    id: 'relatorios',
    icon: 'trending',
    label: 'Relatórios',
    greet: 'Os números que você leva para a reunião',
    kpis: [
      { label: 'Sessões', value: '18.940', delta: '+14,2% este mês' },
      { label: 'Páginas / sessão', value: '3,4', delta: '+0,4 este mês' },
      { label: 'Novos acessos', value: '61,2%', delta: '+6,7% este mês' },
      { label: 'Taxa de retorno', value: '46,8%', delta: '+5,1% este mês' },
    ],
    chart: {
      title: 'Acessos',
      sub: 'Últimos 6 meses',
      max: 20,
      ticks: ['20k', '16k', '12k', '8k', '4k'],
      points: [
        { m: 'Jan', v: 9.2, label: '9.240 sessões' },
        { m: 'Fev', v: 11.4, label: '11.400 sessões' },
        { m: 'Mar', v: 10.8, label: '10.800 sessões' },
        { m: 'Abr', v: 14.6, label: '14.600 sessões' },
        { m: 'Mai', v: 16.9, label: '16.900 sessões' },
        { m: 'Jun', v: 18.9, label: '18.940 sessões' },
      ],
    },
    acts: [
      { icon: 'checkCircle', text: 'Relatório de junho gerado', time: '18 min' },
      { icon: 'trending', text: 'Pico de acessos registrado', time: '1 h' },
      { icon: 'share', text: 'Painel compartilhado com o time', time: '3 h' },
      { icon: 'copy', text: 'Exportação em CSV concluída', time: '6 h' },
      { icon: 'gauge', text: 'Meta de tráfego atingida', time: '8 h' },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*  GEOMETRIA DO GRÁFICO                                                      */
/*  A curva é CALCULADA a partir dos valores, não escrita à mão. É o que       */
/*  permite cinco gráficos diferentes sem cinco strings de path para manter    */
/*  sincronizadas com os números que estão logo ao lado.                       */
/* -------------------------------------------------------------------------- */
const PLOT_W = 300 // largura do viewBox
const PLOT_H = 110 // altura do viewBox
const PLOT_TOP = 8 // folga no topo: a curva nunca encosta na borda
const PLOT_FLOOR = 104 // piso do traçado

/** Valores → coordenadas do viewBox, distribuídos por igual na horizontal. */
const toPoints = (points, max) =>
  points.map((point, i) => ({
    ...point,
    x: (i / (points.length - 1)) * PLOT_W,
    y: PLOT_FLOOR - (point.v / max) * (PLOT_FLOOR - PLOT_TOP),
  }))

/**
 * Curva suave por Catmull-Rom convertida em Bézier cúbica: cada ponto vira um
 * `C` cujos controles saem da direção entre o ponto anterior e o seguinte.
 * Passa exatamente por cima de todos os pontos (uma média simples não passaria,
 * e a bolinha do valor ficaria fora da linha).
 *
 * Os números saem com `toFixed`: a string precisa ser IDÊNTICA no build e no
 * navegador, senão a hidratação reclama de um atributo diferente.
 */
function smoothPath(points) {
  let d = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`

  for (let i = 0; i < points.length - 1; i += 1) {
    const previous = points[i - 1] ?? points[i]
    const from = points[i]
    const to = points[i + 1]
    const next = points[i + 2] ?? to

    const c1x = from.x + (to.x - previous.x) / 6
    const c1y = from.y + (to.y - previous.y) / 6
    const c2x = to.x - (next.x - from.x) / 6
    const c2y = to.y - (next.y - from.y) / 6

    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${to.x.toFixed(1)},${to.y.toFixed(1)}`
  }

  return d
}

/**
 * Gráfico de linha com leitura por ponto.
 *
 * A bolinha, a linha guia e o balão são elementos HTML sobre o SVG, não formas
 * dentro dele. Motivo: o `preserveAspectRatio="none"` estica o viewBox para
 * preencher a caixa, e dentro dele um `<circle>` viraria uma elipse achatada.
 * Em HTML, posicionado pelas mesmas porcentagens, o ponto continua redondo.
 */
function Chart({ chart }) {
  const [hovered, setHovered] = useState(null)

  const points = toPoints(chart.points, chart.max)
  const line = smoothPath(points)
  const area = `${line} L${PLOT_W},${PLOT_H} L0,${PLOT_H} Z`

  /* Em repouso a bolinha fica no último mês — o valor "de agora", que é o que
     um painel real destaca. O balão só abre quando alguém aponta. */
  const active = points[hovered ?? points.length - 1]
  const percentX = (active.x / PLOT_W) * 100
  const percentY = (active.y / PLOT_H) * 100
  /* O balão é preso entre 12% e 88% para não ser cortado pela borda do painel;
     a linha guia continua no x verdadeiro do mês. */
  const tipX = Math.min(Math.max(percentX, 12), 88)
  /* Ponto alto (e o último mês quase sempre é o mais alto): o balão abre para
     BAIXO, senão ele subiria por cima do título do bloco. */
  const tipBelow = percentY < 32

  return (
    <div className="hero-chart">
      <div className="hero-chart-y" aria-hidden="true">
        {chart.ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>

      <div className="hero-chart-plot" onPointerLeave={() => setHovered(null)}>
        <svg className="hero-chart-svg" viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            {/* Curva em escala neutra, como o resto do painel. O que destaca a
                linha não é matiz, é LUMINOSIDADE: ela abre num cinza médio e
                chega no branco pleno à direita, então a leitura de crescimento
                continua de pé sem introduzir uma cor que a página não usa em
                nenhum outro lugar. */}
            <linearGradient id="hero-chart-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="hero-chart-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6b7280" />
              <stop offset="55%" stopColor="#b6bcc6" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          {[16, 39, 62, 85].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2={PLOT_W}
              y2={y}
              stroke="rgb(255 255 255 / 0.045)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <path d={area} fill="url(#hero-chart-area)" />
          <path
            d={line}
            fill="none"
            stroke="url(#hero-chart-stroke)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span
          className="hero-chart-guide"
          data-on={String(hovered !== null)}
          style={{ left: `${percentX}%` }}
          aria-hidden="true"
        />
        <span className="hero-chart-dot" style={{ left: `${percentX}%`, top: `${percentY}%` }} aria-hidden="true" />
        <span
          className="hero-chart-tip"
          data-on={String(hovered !== null)}
          data-below={String(tipBelow)}
          style={{ left: `${tipX}%`, top: `${percentY}%` }}
          aria-hidden="true"
        >
          <strong>{active.label}</strong>
          {active.m}
        </span>

        {/* Faixas de captura: uma por mês, cada uma cobrindo a metade do
            caminho até os vizinhos (daí 1fr nas pontas e 2fr no meio). Assim o
            mês que acende é sempre o mais PRÓXIMO do ponteiro — não o da
            coluna em que ele calhou de entrar. */}
        <div className="hero-chart-hit" aria-hidden="true">
          {points.map((point, i) => (
            <span key={point.m} onPointerEnter={() => setHovered(i)} />
          ))}
        </div>
      </div>

      <div className="hero-chart-x" aria-hidden="true">
        {chart.points.map((point, i) => (
          <span key={point.m} data-on={String(hovered === i)}>
            {point.m}
          </span>
        ))}
      </div>
    </div>
  )
}

export function HeroDashboard() {
  const [viewId, setViewId] = useState(VIEWS[0].id)
  const view = VIEWS.find((item) => item.id === viewId) ?? VIEWS[0]

  return (
    <div
      className="hero-panel"
      role="img"
      aria-label="Exemplo ilustrativo de painel administrativo desenvolvido pela LZdev: indicadores de receita, clientes, pedidos e conversão, gráfico de desempenho e lista de atividades recentes."
    >
      {/* — barra superior — */}
      <div className="hero-panel-top">
        <span className="hero-panel-mark" aria-hidden="true">
          <Icon name="bolt" size="58%" strokeWidth={2.2} />
        </span>

        {/* A aba acompanha a trilha: é o retorno visual de que o clique lá
            embaixo mudou de tela, e não só os números. */}
        <span className="hero-panel-tab">
          {view.label}
          <Icon name="close" size="0.85em" strokeWidth={2.4} />
        </span>

        <span className="hero-panel-search">
          <Icon name="search" size="1.15em" strokeWidth={2} />
          <span className="hero-panel-ph">Buscar no sistema…</span>
          <span className="hero-panel-kbd">⌘K</span>
        </span>

        <span className="hero-panel-avatar" aria-hidden="true">
          A
        </span>
      </div>

      {/* — corpo — */}
      <div className="hero-panel-body">
        <ul className="hero-panel-rail" aria-hidden="true">
          {VIEWS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                tabIndex={-1}
                data-active={String(item.id === view.id)}
                onClick={() => setViewId(item.id)}
              >
                <Icon name={item.icon} size="62%" strokeWidth={1.8} />
                <span className="hero-rail-tip">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="hero-panel-main">
          <div className="hero-panel-greet">
            <strong>Olá, Admin 👋</strong>
            <span className="hero-swap" key={view.id}>
              {view.greet}
            </span>
          </div>

          {/* `key` por tela em cada bloco: trocar de aba REMONTA o bloco, e a
              animação de entrada roda de novo. Sem isso o React só trocaria os
              textos no lugar e a mudança passaria despercebida. */}
          <div className="hero-panel-kpis hero-swap" key={`kpis-${view.id}`}>
            {view.kpis.map((kpi) => (
              <div className="hero-kpi" key={kpi.label}>
                <span className="hero-kpi-label">{kpi.label}</span>
                <span className="hero-kpi-value">{kpi.value}</span>
                <span className="hero-kpi-delta">{kpi.delta}</span>
              </div>
            ))}
          </div>

          <div className="hero-panel-row">
            {/* gráfico de desempenho */}
            <div className="hero-tile hero-swap" key={`chart-${view.id}`}>
              <p className="hero-tile-title">{view.chart.title}</p>
              <p className="hero-tile-sub">{view.chart.sub}</p>
              <span className="hero-tile-close" aria-hidden="true">
                <Icon name="close" size="0.85em" strokeWidth={2.4} />
              </span>

              <Chart chart={view.chart} />
            </div>

            {/* atividades recentes */}
            <div className="hero-tile">
              <p className="hero-tile-title">Atividades recentes</p>

              <div className="hero-acts" key={`acts-${view.id}`}>
                {view.acts.map((item, i) => (
                  <p className="hero-act" key={item.text} style={{ '--i': i }}>
                    <span className="hero-act-icon" aria-hidden="true">
                      <Icon name={item.icon} size="62%" strokeWidth={2} />
                    </span>
                    <span className="hero-act-text">{item.text}</span>
                    {/* <span>, não <time>: "2 min" não é um instante válido para
                        um datetime, e o painel é uma ILUSTRAÇÃO — marcar como
                        tempo real um horário que não existe é dar semântica a
                        uma informação inventada. */}
                    <span className="hero-act-time">{item.time}</span>
                  </p>
                ))}

                <span className="hero-acts-more">Ver todas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
