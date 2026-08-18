import { why } from '../../data/site'
import { Carousel } from '../primitives/Carousel'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Diferenciais em carrossel, um por vez — mesmo tratamento dos Projetos.
 *
 * Eram 7 cards numa grade de 3 colunas: três linhas de altura para textos de
 * duas linhas cada. Um por vez, cada diferencial recebe a ilustração, o título
 * grande e o texto inteiro em corpo legível, e a seção cabe na altura de um
 * card só.
 *
 * A cor do painel vem das categóricas (--color-cat-*), cicladas pelo índice:
 * ela não classifica nada, só marca que o item MUDOU quando o visitante avança.
 * Sem isso, sete slides de mesma composição parecem o mesmo slide travado. As
 * ilustrações em /public/diferenciais seguem a MESMA ordem de acento, então
 * imagem, moldura e selo do ícone falam a mesma cor em cada slide.
 *
 * A moldura tem altura fixa de 224px no desktop e fica na coluna menor (0.8fr
 * contra 1.2fr do texto): a imagem entra dimensionada, sem virar o assunto do
 * card nem esticar a altura do slide.
 */
const TONES = ['var(--color-cat-1)', 'var(--color-cat-2)', 'var(--color-cat-3)']

function WhySlide({ item, index }) {
  return (
    <article
      style={{ '--cat': TONES[index % TONES.length] }}
      className="group grid gap-6 overflow-hidden rounded-[var(--radius-xl2)] border border-white/8 bg-surface/40 p-5 border-gradient sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-9 lg:p-7"
    >
      <div
        className="relative aspect-16/10 overflow-hidden rounded-[1rem] border border-[color-mix(in_oklab,var(--cat)_25%,transparent)] lg:aspect-auto lg:h-56"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, color-mix(in oklab, var(--cat) 22%, transparent), transparent 68%)',
        }}
      >
        {item.image ? (
          <>
            {/* alt vazio de propósito: a ilustração repete visualmente o que o
                título e o texto ao lado já dizem — descrevê-la seria eco.

                width/height = o viewBox do arquivo (800x440). O CSS é que dá o
                tamanho real (`absolute inset-0 size-full`), mas os atributos
                declaram a proporção intrínseca, e é isso que impede o navegador
                de recalcular o layout quando a ilustração chega. */}
            <img
              src={item.image}
              alt=""
              width={800}
              height={440}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] desktop:group-hover:scale-[1.04]"
            />
            {/* Véu só no pé da imagem: dá contraste ao selo do ícone sem lavar a
                ilustração inteira. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"
            />
            <span className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-xl border border-white/12 bg-black/45 text-[var(--cat)] backdrop-blur-sm transition-transform duration-500 ease-[var(--ease-out-soft)] desktop:group-hover:scale-110">
              <Icon name={item.icon} size={22} strokeWidth={1.5} />
            </span>
          </>
        ) : (
          /* Sem imagem o painel volta ao ícone centralizado — nunca uma moldura
             vazia nem uma imagem quebrada. */
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-20 place-items-center rounded-3xl bg-[color-mix(in_oklab,var(--cat)_16%,transparent)] text-[var(--cat)] ring-1 ring-[color-mix(in_oklab,var(--cat)_35%,transparent)]">
              <Icon name={item.icon} size={38} strokeWidth={1.4} />
            </span>
          </span>
        )}
      </div>

      <div>
        {/* O rótulo "DIFERENCIAL" em caixa alta saiu daqui junto com as
            etiquetas de seção: era o mesmo tique visual (uma palavra em maiúscula
            e espaçada acima do título) dizendo o que a seção inteira já diz. */}
        <h3 className="mt-2.5 text-[clamp(1.45rem,3.2vw,2rem)] text-ink">{item.title}</h3>
        <p className="mt-4 text-[0.98rem] leading-relaxed text-muted sm:text-[1.02rem]">{item.text}</p>
      </div>
    </article>
  )
}

export function WhyUs() {
  return (
    <Section id="diferenciais">
      <SectionHeader title={why.title} subtitle={why.subtitle} align="left" />

      <Reveal variant="scale" className="mt-10 block sm:mt-12">
        <Carousel
          items={why.items}
          label="Diferenciais da LZdev"
          slideKey={(item) => item.title}
          hint={why.hint}
          renderSlide={(item, index) => <WhySlide item={item} index={index} />}
        />
      </Reveal>
    </Section>
  )
}
