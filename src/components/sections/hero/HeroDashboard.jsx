import { Icon } from '../../primitives/Icon'

/**
 * Painel administrativo ilustrativo do Hero.
 *
 * 100% JSX + CSS + SVG: nenhuma imagem, nitidez perfeita em qualquer densidade
 * e peso de rede zero. Todo o dimensionamento interno sai da "unidade" --s
 * (definida em hero.css), que encolhe por container query — o mockup nunca
 * quebra nem estoura, de 320px ao desktop.
 *
 * ⚠️  Os números, nomes e horários abaixo são ELEMENTOS VISUAIS do Hero, não
 *     dados do negócio. Existem apenas para o painel parecer um sistema real.
 */

const RAIL = [
  { icon: 'gauge', active: true },
  { icon: 'cart' },
  { icon: 'blocks' },
  { icon: 'users' },
  { icon: 'trending' },
  { icon: 'layers' },
  { icon: 'shield' },
]

const KPIS = [
  { label: 'Receita', value: 'R$ 48.750,00', delta: '+12,5% este mês' },
  { label: 'Novos clientes', value: '128', delta: '+8,4% este mês' },
  { label: 'Pedidos', value: '342', delta: '+11,7% este mês' },
  { label: 'Conversão', value: '23,6%', delta: '+4,3% este mês' },
]

const CHART_Y = ['50k', '40k', '30k', '20k', '10k']
const CHART_X = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']

// Linha de desempenho — traçado decorativo em coordenadas 0..300 × 0..110
const CHART_LINE =
  'M0,88 C16,82 26,94 44,89 C62,84 70,66 88,62 C104,58 112,75 128,72 C146,69 156,44 176,42 C192,40 200,58 216,54 C232,50 240,29 258,25 C272,22 285,13 300,9'
const CHART_AREA = `${CHART_LINE} L300,110 L0,110 Z`

// Sem `tone`: os cinco chips usam o mesmo branco translúcido (.hero-act-icon).
// Os quatro matizes de antes não têm tradução em cinza que não pareça acidente.
const ACTIVITIES = [
  { icon: 'cart', text: 'Novo pedido #1254', time: '2 min' },
  { icon: 'users', text: 'Cliente Kimori Food', time: '15 min' },
  { icon: 'checkCircle', text: 'Pagamento aprovado', time: '1 h' },
  { icon: 'users', text: 'Novo cliente cadastrado', time: '2 h' },
  { icon: 'blocks', text: 'Atualização de produto', time: '5 h' },
]

export function HeroDashboard() {
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

        <span className="hero-panel-tab">
          Dashboard
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
          {RAIL.map((item) => (
            <li key={item.icon} data-active={String(Boolean(item.active))}>
              <Icon name={item.icon} size="62%" strokeWidth={1.8} />
            </li>
          ))}
        </ul>

        <div className="hero-panel-main">
          <div className="hero-panel-greet">
            <strong>Olá, Admin 👋</strong>
            <span>Veja o desempenho geral do sistema</span>
          </div>

          <div className="hero-panel-kpis">
            {KPIS.map((kpi) => (
              <div className="hero-kpi" key={kpi.label}>
                <span className="hero-kpi-label">{kpi.label}</span>
                <span className="hero-kpi-value">{kpi.value}</span>
                <span className="hero-kpi-delta">{kpi.delta}</span>
              </div>
            ))}
          </div>

          <div className="hero-panel-row">
            {/* gráfico de desempenho */}
            <div className="hero-tile">
              <p className="hero-tile-title">Desempenho</p>
              <p className="hero-tile-sub">Últimos 6 meses</p>
              <span className="hero-tile-close" aria-hidden="true">
                <Icon name="close" size="0.85em" strokeWidth={2.4} />
              </span>

              <div className="hero-chart">
                <div className="hero-chart-y" aria-hidden="true">
                  {CHART_Y.map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>

                <svg
                  className="hero-chart-plot"
                  viewBox="0 0 300 110"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    {/* Curva em escala neutra, como o resto do painel. O que
                        destaca a linha não é matiz, é LUMINOSIDADE: ela abre
                        num cinza médio e chega no branco pleno à direita, então
                        a leitura de crescimento continua de pé sem introduzir
                        uma cor que a página não usa em nenhum outro lugar. */}
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
                      x2="300"
                      y2={y}
                      stroke="rgb(255 255 255 / 0.045)"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}

                  <path d={CHART_AREA} fill="url(#hero-chart-area)" />
                  <path
                    d={CHART_LINE}
                    fill="none"
                    stroke="url(#hero-chart-stroke)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle cx="176" cy="42" r="3" fill="#ffffff" vectorEffect="non-scaling-stroke" />
                </svg>

                <div className="hero-chart-x" aria-hidden="true">
                  {CHART_X.map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* atividades recentes */}
            <div className="hero-tile">
              <p className="hero-tile-title">Atividades recentes</p>

              <div className="hero-acts">
                {ACTIVITIES.map((item) => (
                  <p className="hero-act" key={item.text}>
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
