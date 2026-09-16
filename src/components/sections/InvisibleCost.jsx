import { invisibleCost, primaryCta } from '../../data/site'
import { Button } from '../primitives/Button'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * O CUSTO INVISÍVEL — problema, agitação e solução na mesma seção.
 *
 * A versão anterior era um mosaico de cinco cartões vermelhos (dois grandes, três
 * pequenos) e um painel de virada no fim. Três problemas com aquele desenho:
 *
 *   · a seção inteira era uma parede de vermelho, e o alerta perdia força
 *     justamente por estar em tudo — cor que aparece cinco vezes seguidas deixa
 *     de ser aviso e vira fundo;
 *   · cinco cartões de mesma forma e mesmo tom se leem como um só, então quase
 *     ninguém chegava ao quinto;
 *   · a saída ficava toda concentrada no rodapé da seção. Quem parava de ler no
 *     meio levava só a dor.
 *
 * O desenho novo mantém os cinco prejuízos e resolve os três pontos com a
 * estrutura, sem inventar recurso visual novo (ver o comentário de
 * `invisibleCost` em data/site.js, que registra a formação):
 *
 *   1 · FALAS · três frases que o dono do negócio já ouviu de um cliente. O
 *       reconhecimento vem antes do argumento, e em texto leve — não é cartão,
 *       não tem ícone, não pesa.
 *   2 · COMPARAÇÃO · um painel só, dividido em duas colunas: à esquerda o custo
 *       de hoje, à direita a saída correspondente, na MESMA linha. O vermelho
 *       fica confinado ao ícone e à consequência de uma coluna, equilibrado pelo
 *       verde da outra — a cor volta a significar algo porque tem contraponto.
 *   3 · FECHAMENTO · a conta que corre todo mês e o CTA.
 *
 * No celular não existe "lado a lado": cada par vira um bloco em que a dor está
 * em cima e a saída embaixo, ligadas pela seta e pelos rótulos que no desktop
 * ficam no cabeçalho das colunas.
 */

/** Rótulo de coluna: ponto colorido + texto, no tom do que a coluna carrega. */
function ColumnLabel({ children, tone, icon, className = '' }) {
  return (
    <p
      className={`flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.16em] uppercase ${tone} ${className}`}
    >
      <Icon name={icon} size={14} className="shrink-0" />
      {children}
    </p>
  )
}

function CompareRow({ item }) {
  return (
    <li className="grid md:grid-cols-2">
      {/* HOJE — o custo. O ícone do prejuízo é o único elemento colorido do
          bloco; o texto fica no cinza de leitura, senão a linha inteira gritaria. */}
      <div className="flex gap-3.5 p-4 sm:p-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-danger/10 text-danger ring-1 ring-danger/20">
          <Icon name={item.icon} size={18} />
        </span>
        <div className="min-w-0">
          <ColumnLabel tone="text-danger/80" icon="xCircle" className="mb-1.5 md:hidden">
            {invisibleCost.columns.now}
          </ColumnLabel>
          <h3 className="text-[0.95rem] leading-snug font-bold text-ink">{item.title}</h3>
          <p className="mt-1.5 text-[0.82rem] leading-snug text-muted">{item.text}</p>
          <p className="mt-2.5 flex items-center gap-1.5 text-[0.75rem] font-semibold text-danger">
            <Icon name="trendingDown" size={13} className="shrink-0" />
            {item.consequence}
          </p>
        </div>
      </div>

      {/* COM SITE — a saída. A lavagem verde levíssima é o que separa as duas
          colunas sem precisar de uma segunda borda: no celular, onde os blocos se
          empilham, ela é o que diz que a virada começou.
          `md:items-center` centra a linha da saída na altura do bloco da dor (que
          tem três partes contra uma): sem isso a frase cola no topo e sobra um
          buraco embaixo em cada linha da comparação. */}
      {/* A borda INTERNA do par é mais fraca (white/5) que a que separa um par do
          seguinte (o `divide-y` white/8 da lista): no celular, onde dor e saída
          ficam empilhadas, é isso que impede a leitura de virar uma lista solta
          de dez blocos alternados em vez de cinco pares. */}
      <div className="flex gap-3.5 border-t border-white/5 bg-success/[0.04] p-4 sm:p-5 md:items-center md:border-t-0 md:border-l md:border-l-white/8">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-success/10 text-success ring-1 ring-success/20 md:hidden">
          <Icon name="arrowDown" size={18} />
        </span>
        <div className="min-w-0">
          <ColumnLabel tone="text-success/80" icon="checkCircle" className="mb-1.5 md:hidden">
            {invisibleCost.columns.after}
          </ColumnLabel>
          <p className="flex gap-2.5 text-[0.88rem] leading-relaxed text-ink">
            <Icon name="check" size={15} className="mt-1 shrink-0 text-success" />
            {item.fix}
          </p>
        </div>
      </div>
    </li>
  )
}

export function InvisibleCost() {
  return (
    <Section id="custo-invisivel">
      <SectionHeader
        title={invisibleCost.title}
        subtitle={invisibleCost.subtitle}
      />

      {/* 1 · As falas. Aspas grandes em vez de moldura de cartão: é fala de
          gente, e o tratamento tipográfico já diz isso. O rótulo fica acima,
          para ninguém ler as três frases como se fossem depoimentos de clientes
          nossos — são o que o visitante ouve, não o que dizem da LZdev. */}
      <Reveal delay={60}>
        <div className="mt-10 sm:mt-12">
          <p className="text-center text-[0.68rem] font-bold tracking-[0.16em] text-faint uppercase">
            {invisibleCost.heard.label}
          </p>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {invisibleCost.heard.quotes.map((quote) => (
              <li
                key={quote}
                className="relative rounded-[var(--radius-card)] border border-white/8 bg-white/[0.02] px-4 py-4 pl-11 transition-[border-color,background-color] duration-400 hover:border-white/16 hover:bg-white/[0.04]"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-2.5 left-3.5 font-display text-[2rem] leading-none text-white/12"
                >
                  “
                </span>
                <p className="text-[0.88rem] leading-snug text-muted italic">{quote}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* 2 · A comparação */}
      <Reveal variant="scale" delay={100}>
        <div className="mt-5 overflow-hidden rounded-[var(--radius-xl2)] border border-white/8 bg-surface/40 border-gradient">
          {/* Cabeçalho das colunas — só onde existem duas colunas. */}
          <div className="hidden border-b border-white/8 md:grid md:grid-cols-2">
            <ColumnLabel tone="text-danger" icon="xCircle" className="px-5 py-3">
              {invisibleCost.columns.now}
            </ColumnLabel>
            <ColumnLabel
              tone="text-success"
              icon="checkCircle"
              className="border-l border-white/8 bg-success/[0.04] px-5 py-3"
            >
              {invisibleCost.columns.after}
            </ColumnLabel>
          </div>

          <ul className="divide-y divide-white/8">
            {invisibleCost.items.map((item) => (
              <CompareRow key={item.title} item={item} />
            ))}
          </ul>
        </div>
      </Reveal>

      {/* 3 · Virada de tom: fecha a seção olhando para a solução, não para a dor */}
      <Reveal variant="scale" delay={120}>
        <div className="mt-6 flex flex-col items-center gap-5 rounded-[var(--radius-xl2)] border border-brand/25 bg-brand/[0.07] px-6 py-7 text-center sm:px-10 border-gradient">
          <div className="max-w-2xl">
            <h3 className="text-[clamp(1.3rem,2.8vw,1.7rem)] text-ink">{invisibleCost.closing.title}</h3>
            <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{invisibleCost.closing.text}</p>
          </div>
          <Button href="/contato" size="lg" icon="arrowRight">
            {primaryCta}
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}
