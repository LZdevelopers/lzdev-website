import { team, whatsappLink } from '../../data/site'
import { Card } from '../primitives/Card'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

const SOCIAL_BASE =
  'inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-muted transition-[border-color,background-color,color] duration-300 hover:text-ink'

/**
 * Retrato do membro. Com `photo` preenchido em data/site.js mostra a foto;
 * sem ela, o avatar de iniciais no gradiente da marca — mesma silhueta e
 * mesmo peso visual, então o layout não muda quando as fotos chegarem.
 */
function Portrait({ member }) {
  if (member.photo) {
    return (
      <img
        src={member.photo}
        alt={`Foto de ${member.name}`}
        loading="lazy"
        decoding="async"
        className="size-20 shrink-0 rounded-2xl object-cover ring-1 ring-white/12"
      />
    )
  }

  return (
    <span
      className="grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-accent font-display text-2xl font-extrabold text-white shadow-[0_10px_30px_-12px_rgb(124_58_237/0.9)]"
      aria-hidden="true"
    >
      {member.initials}
    </span>
  )
}

function MemberCard({ member, delay }) {
  const message = `Olá, ${member.name.split(' ')[0]}! Vim pelo site da LZdev e gostaria de conversar sobre um projeto.`

  return (
    <Reveal delay={delay} className="h-full">
      <Card className="h-full" innerClassName="flex h-full flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <Portrait member={member} />
          <div className="min-w-0">
            <h3 className="text-lg leading-tight font-bold text-ink">{member.name}</h3>
            <p className="mt-1.5 text-sm font-medium text-accent">{member.role}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted">{member.bio}</p>

        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-faint uppercase">Stacks principais</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {member.stacks.map((stack) => (
              <li
                key={stack}
                className="rounded-md bg-brand/10 px-2.5 py-1 text-[0.7rem] font-medium text-brand-soft ring-1 ring-brand/22"
              >
                {stack}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 border-t border-white/8 pt-6">
          <a
            href={member.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`${SOCIAL_BASE} hover:border-white/25`}
          >
            <Icon name="github" size={16} />
            GitHub
          </a>
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${SOCIAL_BASE} hover:border-[#25D366]/45 hover:bg-[#25D366]/10`}
          >
            <Icon name="whatsapp" size={16} />
            WhatsApp
          </a>
          {/* O botão de LinkedIn só existe quando a URL é preenchida em data/site.js */}
          {member.links.linkedin ? (
            <a
              href={member.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`${SOCIAL_BASE} hover:border-[#0A66C2]/55 hover:bg-[#0A66C2]/12`}
            >
              <Icon name="linkedin" size={16} />
              LinkedIn
            </a>
          ) : null}
        </div>
      </Card>
    </Reveal>
  )
}

export function Team() {
  return (
    <Section id="equipe">
      <SectionHeader eyebrow={team.eyebrow} title={team.title} subtitle={team.subtitle} />

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        {team.members.map((member, i) => (
          <MemberCard key={member.name} member={member} delay={i * 120} />
        ))}
      </div>
    </Section>
  )
}
