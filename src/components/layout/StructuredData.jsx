import { faq, projects } from '../../data/site'

/**
 * Dados estruturados derivados de data/site.js — uma única fonte de verdade
 * para o conteúdo visível e para o que os buscadores leem.
 * O schema Organization é estático em index.html; aqui ficam os que dependem
 * de listas do site (FAQPage e portfólio de projetos).
 */
export function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      {
        '@type': 'ItemList',
        name: 'Projetos desenvolvidos pela LZdev',
        itemListElement: projects.items.map((project, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'CreativeWork',
            name: project.name,
            description: project.text,
            genre: project.category,
            keywords: project.stack.join(', '),
          },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // Conteúdo próprio e estático: serialização segura de dados locais.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
