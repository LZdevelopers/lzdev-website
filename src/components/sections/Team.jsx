import { team } from '../../data/site'
import { Card } from '../primitives/Card'
import { brandColors, Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

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
          {/* Função e idade na mesma linha, separadas por um ponto: a idade é
              dado de apoio e não merece uma linha própria puxando o olho. */}
          <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-sm font-medium text-accent">
            {member.role}
            {member.age ? (
              <>
                <span className="text-white/25" aria-hidden="true">
                  ·
                </span>
                <span className="font-normal text-muted">{member.age} anos</span>
              </>
            ) : null}
          </p>

          {/* A especialidade sai da bio e vira o destaque do card: é a linha que
              responde "para o que eu chamo esta pessoa?" antes do texto corrido. */}
          <p className="mt-5 border-l-2 border-brand pl-3.5 text-sm leading-snug font-semibold text-ink">
            {member.focus}
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

export function Team() {
  return (
    <Section id="equipe">
      <SectionHeader title={team.title} subtitle={team.subtitle} />

      <div className="mt-10 grid gap-5 sm:mt-12 lg:grid-cols-2">
        {team.members.map((member, i) => (
          <MemberCard key={member.name} member={member} delay={i * 120} />
        ))}
      </div>
    </Section>
  )
}
