import { projects } from '../../data/site'
import { Button } from '../primitives/Button'
import { Carousel } from '../primitives/Carousel'
import { brandColors, Icon, techIcons } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * Projetos em carrossel: UM card grande por vez, em vez da grade de dois.
 *
 * A troca resolve dois problemas de uma vez. A seção passa a ocupar a altura de
 * um card (antes, a de dois) e cada projeto ganha espaço para a tela cheia, o
 * texto inteiro e a stack — o card pequeno cortava a descrição em três linhas.
 *
 * Os mockups desenhados em SVG saíram: as capturas reais entram em `image` no
 * data/site.js e ocupam exatamente a mesma moldura, então nada aqui muda quando
 * elas chegarem.
 */

/** Moldura da captura. Mostra a imagem real quando existe; senão, espera. */
function ProjectShot({ image, name }) {
  return (
    <div className="relative aspect-16/10 overflow-hidden rounded-[1rem] border border-white/10 bg-surface-2 lg:aspect-auto lg:h-full">
      {image ? (
        <img
          src={image}
          alt={`Interface do projeto ${name}`}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
        />
      ) : (
        <div className="grid size-full place-items-center bg-[radial-gradient(120%_90%_at_50%_0%,rgb(255_255_255/0.05),transparent_65%)] p-6 text-center">
          <div>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-faint">
              <Icon name="globe" size={22} />
            </span>
            <p className="mt-3 font-display text-sm font-bold text-muted">{name}</p>
            <p className="mt-1 text-xs text-faint">Captura em breve</p>
          </div>
        </div>
      )}
    </div>
  )
}

function ProjectSlide({ project }) {
  const external = project.url.startsWith('http')

  return (
    <article className="group grid gap-6 rounded-[var(--radius-xl2)] border border-white/8 bg-surface/40 p-5 border-gradient sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-stretch lg:gap-8 lg:p-7">
      <ProjectShot image={project.image} name={project.name} />

      <div className="flex flex-col">
        <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
          {project.category}
        </p>
        <h3 className="mt-2 text-[clamp(1.5rem,3.4vw,2.1rem)] text-ink">{project.name}</h3>

        <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{project.text}</p>

        <div className="mt-6">
          <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-faint uppercase">
            Tecnologias
          </p>
          {/* Chips na cor de cada tecnologia — mesma leitura da seção de
              ferramentas, então a stack do projeto é reconhecida de relance. */}
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.stack.map((tech) => {
              const icon = techIcons[tech]
              const color = icon ? brandColors[icon] : null

              return (
                <li
                  key={tech}
                  style={color ? { '--tech': color } : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.75rem] font-medium ring-1 transition-colors duration-300 ${
                    color
                      ? 'bg-[color-mix(in_oklab,var(--tech)_10%,transparent)] text-ink ring-[color-mix(in_oklab,var(--tech)_28%,transparent)]'
                      : 'bg-white/[0.05] text-muted ring-white/10'
                  }`}
                >
                  {icon ? <Icon name={icon} size={13} colored /> : null}
                  {tech}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mt-auto pt-7">
          <Button
            href={project.url}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            variant="outline"
            icon="arrowUpRight"
          >
            {projects.cta}
          </Button>
        </div>
      </div>
    </article>
  )
}

export function Projects() {
  return (
    <Section id="projetos">
      <SectionHeader eyebrow={projects.eyebrow} title={projects.title} subtitle={projects.subtitle} />

      <Reveal variant="scale" className="mt-12 block">
        <Carousel
          items={projects.items}
          label="Projetos em destaque"
          slideKey={(project) => project.name}
          renderSlide={(project) => <ProjectSlide project={project} />}
        />
      </Reveal>
    </Section>
  )
}
