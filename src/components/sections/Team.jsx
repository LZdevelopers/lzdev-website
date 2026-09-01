import { team } from '../../data/site'
import { Card } from '../primitives/Card'
import { brandColors, Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Fundo da seção: trama de pontos, uma luz suave vinda de cima e um halo que
 * deriva na direção do cursor. Três divs sem estado nenhum — o desenho inteiro
 * e o porquê de cada camada estão em src/styles/team.css.
 *
 * Sem animação de propósito. Esta é a seção em que o visitante lê nomes e
 * decide falar com alguém; fundo que se mexe compete justamente com isso.
 */
function TeamBackdrop() {
  return (
    <div className="team-fx" aria-hidden="true">
      <div className="team-fx-dots" />
      <div className="team-fx-wash" />
      <div className="team-fx-glow" />
    </div>
  )
}

/**
 * Cada link puxa a sua cor por `--net`: o hover tinge borda e fundo no mesmo
 * tom, então os dois botões se separam de relance sem precisar ler o rótulo.
 */
const SOCIAL_BASE =
  'inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-muted transition-[border-color,background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--net)_50%,transparent)] hover:bg-[color-mix(in_oklab,var(--net)_12%,transparent)] hover:text-ink'

/**
 * Retrato do membro: painel vertical em grafite, com as iniciais e o selo da
 * função. Com `photo` preenchido em data/site.js a foto entra no lugar do
 * gradiente — mesma moldura e mesmo peso visual, então o layout não muda
 * quando as fotos chegarem.
 *
 * No mobile vira uma faixa larga no topo do card; a partir de sm ele estica na
 * altura do conteúdo ao lado (é o flex item que o `items-stretch` da linha
 * acompanha), que é o que mantém as duas colunas do card alinhadas.
 *
 * A placa é grafite, não branca: ela ocupa meia largura do card e em branco
 * roubaria o destaque dos CTAs. O cinza médio ainda deixa as iniciais brancas
 * legíveis e separa o retrato do fundo do card.
 */
function Portrait({ member }) {
  return (
    <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-2xl bg-[linear-gradient(165deg,#4a4a4a_0%,#2a2a2a_50%,#141414_100%)] ring-1 ring-white/12 sm:h-auto sm:w-48 lg:w-56">
      {member.photo ? (
        <img
          src={member.photo}
          alt={`Foto de ${member.name}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <span
          className="absolute inset-0 grid place-items-center font-display text-4xl font-extrabold text-white sm:text-5xl"
          aria-hidden="true"
        >
          {member.initials}
        </span>
      )}

      <span className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-lg border border-white/15 bg-black/45 px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.16em] text-white uppercase backdrop-blur-sm">
        <span className="size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
        {member.tag}
      </span>
    </div>
  )
}

/**
 * `min-h` é o que dá altura ao card: o conteúdo é curto (quatro linhas de texto
 * e dois botões) e sozinho ele fecharia num bloco baixo demais para o par de
 * cartões sustentar a seção. Como a coluna de texto empurra os links com
 * `mt-auto`, a folga entra entre a bio e os botões — vira respiro, não buraco.
 * O retrato acompanha por tabela: no mobile ele é uma faixa de altura fixa; a
 * partir de sm ele estica junto com a linha.
 */
const CARD_INNER =
  'flex h-full min-h-[24rem] flex-col gap-5 p-5 sm:min-h-[21rem] sm:flex-row sm:gap-7 sm:p-7 lg:min-h-[23rem]'

function MemberCard({ member, delay }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Card className="h-full" innerClassName={CARD_INNER}>
        <Portrait member={member} />

        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="text-lg leading-tight font-bold text-ink">{member.name}</h3>
          <p className="mt-1.5 text-sm font-medium text-accent">{member.role}</p>

          {/* A linha destacada responde "o que muda para mim se eu chamar esta
              pessoa?" — e a resposta é sobre CONVÍVIO, não sobre tecnologia.
              Nenhum cartão desta seção divide áreas nem lista stack; o porquê
              está no comentário de `team` em data/site.js. */}
          <p className="mt-5 border-l-2 border-brand pl-3.5 text-sm leading-snug font-semibold text-ink">
            {member.headline}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-muted">{member.bio}</p>

          <div className="mt-auto flex flex-wrap gap-2 border-t border-white/8 pt-5">
            <a
              href={member.links.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--net': brandColors.github }}
              className={SOCIAL_BASE}
            >
              <Icon name="github" size={16} colored />
              GitHub
            </a>
            {/* Portfólio não é marca de terceiro e não tem cor oficial: o ícone
                herda a cor do texto (globe é traço, não logo) e o hover puxa o
                token --accent, o mesmo tom que a página usa para dado. */}
            <a
              href={member.links.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--net': 'var(--color-accent)' }}
              className={SOCIAL_BASE}
            >
              <Icon name="globe" size={16} />
              Portfólio
            </a>
          </div>
        </div>
      </Card>
    </Reveal>
  )
}

/**
 * Leva o halo do fundo na direção do cursor.
 *
 * A escrita é a mais barata possível, e igual à do brilho dos cards: duas
 * custom properties em PORCENTAGEM da seção, num elemento que já existe. O
 * React não re-renderiza nada, não há estado envolvido e o único
 * `getBoundingClientRect` acontece por evento de ponteiro, não por quadro. As
 * duas variáveis são herdadas pelo `.team-fx` lá dentro.
 *
 * `mouse` exclui dedo e caneta: em toque o halo ficaria congelado no último
 * ponto tocado, o que não é resposta nenhuma — no celular ele fica parado no
 * lugar padrão, e ali ele é só um degradê atrás dos cards.
 */
const trackGlow = (event) => {
  if (event.pointerType !== 'mouse') return
  const rect = event.currentTarget.getBoundingClientRect()
  const style = event.currentTarget.style
  style.setProperty('--team-x', `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(2)}%`)
  style.setProperty('--team-y', `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(2)}%`)
}

/** Cursor fora da seção: as variáveis somem e o halo volta ao padrão do CSS. */
const releaseGlow = (event) => {
  event.currentTarget.style.removeProperty('--team-x')
  event.currentTarget.style.removeProperty('--team-y')
}

export function Team() {
  return (
    <Section id="equipe" className="team" onPointerMove={trackGlow} onPointerLeave={releaseGlow}>
      <TeamBackdrop />

      <SectionHeader title={team.title} subtitle={team.subtitle} />

      <div className="mt-10 grid gap-5 sm:mt-12 lg:grid-cols-2">
        {team.members.map((member, i) => (
          <MemberCard key={member.name} member={member} delay={i * 120} />
        ))}
      </div>
    </Section>
  )
}
