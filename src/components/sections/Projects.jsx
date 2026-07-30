import { projects } from '../../data/site'
import { Card } from '../primitives/Card'
import { Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'
import { ProjectPreview } from './ProjectPreview'

export function Projects() {
  return (
    <Section id="projetos">
      <SectionHeader eyebrow={projects.eyebrow} title={projects.title} subtitle={projects.subtitle} />

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        {projects.items.map((project, i) => {
          const external = project.url.startsWith('http')

          return (
            <Reveal key={project.name} delay={i * 90} className="h-full">
              <Card
                as="article"
                className="h-full"
                innerClassName="flex h-full flex-col gap-5 p-5 sm:p-6"
              >
                {/* Imagem real quando existe; caso contrário, o mockup desenhado */}
                <ProjectPreview kind={project.mockup} image={project.image} name={project.name} />

                <div className="flex flex-1 flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
                      {project.category}
                    </p>
                    <h3 className="mt-1.5 text-xl font-bold text-ink">{project.name}</h3>
                  </div>

                  <p className="text-sm leading-relaxed text-muted">{project.text}</p>

                  <div>
                    <p className="text-[0.7rem] font-semibold tracking-[0.16em] text-faint uppercase">
                      Tecnologias
                    </p>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-md bg-white/[0.05] px-2.5 py-1 text-[0.7rem] font-medium text-muted ring-1 ring-white/8"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={project.url}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-ink transition-[border-color,background-color,gap] duration-300 hover:gap-3 hover:border-brand/45 hover:bg-brand/12"
                  >
                    {projects.cta}
                    <Icon name="arrowUpRight" size={16} className="text-accent" />
                  </a>
                </div>
              </Card>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
