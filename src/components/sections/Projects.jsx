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
function ProjectShot({ image, shot, name }) {
  return (
    <div className="relative aspect-16/10 overflow-hidden rounded-[1rem] border border-white/10 bg-surface-2 lg:aspect-auto lg:h-full">
      {image ? (
        <img
          src={image}
          alt={`Interface do projeto ${name}`}
          /* Dimensão real do arquivo, vinda de `shot` no data/site.js: reserva o
             espaço antes da imagem chegar — sem isso o card salta quando ela
             carrega. A moldura tem proporção própria e recorta por cima. */
          width={shot?.width}
          height={shot?.height}
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
  /* Sem URL não existe botão. Os quatro cards apontavam para `href="#"`, que
     recarrega a âncora vazia e joga o visitante de volta ao topo da página —
     ou seja, um botão que promete abrir o projeto e não abre. Enquanto o
     endereço não existir, o card mostra um selo dizendo isso com palavras. */
  const live = Boolean(project.url)

  return (
    <article className="group grid gap-6 rounded-[var(--radius-xl2)] border border-white/8 bg-surface/40 p-5 border-gradient sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-stretch lg:gap-8 lg:p-7">
      <ProjectShot image={project.image} shot={project.shot} name={project.name} />

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
          {live ? (
            <Button
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              icon="arrowUpRight"
            >
              {/* O rótulo avisa que abre fora: o ícone diagonal diz isso para
                  quem vê, e o texto diz para quem ouve. */}
              {projects.cta}
              <span className="sr-only"> (abre em nova aba)</span>
            </Button>
          ) : (
            <p className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.78rem] font-medium text-faint">
              <Icon name="clock" size={14} className="shrink-0" aria-hidden="true" />
              {projects.soon}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export function Projects() {
  return (
    <Section id="projetos">
      <SectionHeader title={projects.title} subtitle={projects.subtitle} />

      <Reveal variant="scale" className="mt-12 block">
        <Carousel
          items={projects.items}
          label="Projetos em destaque"
          slideKey={(project) => project.name}
          hint={projects.hint}
          renderSlide={(project) => <ProjectSlide project={project} />}
        />
      </Reveal>
    </Section>
  )
}
