import { absolute, site } from '../../data/seo'
import { contact, faq, projects, services, team } from '../../data/site'

/**
 * Dados estruturados (JSON-LD) — como o Google lê esta página.
 *
 * REGRA ÚNICA DESTE ARQUIVO: nada aqui é escrito à mão. Todo campo sai de
 * data/site.js ou data/seo.js, isto é, do MESMO conteúdo que o visitante vê na
 * tela. Marcar em schema um serviço, um preço ou uma nota que a página não
 * mostra é exatamente o que o Google classifica como marcação enganosa, e
 * custa a elegibilidade a resultados enriquecidos do site inteiro.
 *
 * O que mudou em relação à versão anterior, e por quê:
 *
 *   · o tipo era `ProfessionalService`, uma especialização de LocalBusiness —
 *     ou seja, uma declaração de negócio com endereço físico e área de
 *     atendimento local. A LZdev atende remotamente e não publica endereço, e
 *     um LocalBusiness sem `address` é justamente o erro que o Search Console
 *     reporta. Agora é `Organization`, que descreve o que a empresa é sem
 *     prometer uma vitrine que não existe.
 *   · `serviceType` anunciava "SaaS", "Automações" e "APIs". A página não tinha
 *     (e não tem) nada sobre isso; a LZdev confirmou que não vende esses
 *     serviços hoje. Agora a lista de serviços é gerada de `services`, a mesma
 *     que desenha os cards da seção Serviços — se sair da tela, sai do schema.
 *   · nenhum `Offer` e nenhum preço: o site não publica valor em lugar nenhum,
 *     e o schema acompanha o que está na tela.
 *
 * O que deliberadamente NÃO está aqui: `aggregateRating` e `review`. O site
 * exibe "100% de satisfação", mas isso não é avaliação de cliente com autor e
 * nota — transformar um número de vitrine em estrela de resultado de busca é
 * fraude de marcação, e é a primeira coisa que uma revisão manual derruba.
 */
export function StructuredData() {
  const orgId = `${absolute('/')}#organizacao`
  const siteId = `${absolute('/')}#site`

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      /* QUEM É A EMPRESA. `@id` fixo para os outros nós apontarem para cá em
         vez de repetir nome, logo e contato. */
      {
        '@type': 'Organization',
        '@id': orgId,
        name: site.name,
        url: absolute('/'),
        description: site.description,
        logo: {
          '@type': 'ImageObject',
          url: absolute('/logo-mark-256.png'),
          width: 256,
          height: 256,
        },
        image: absolute(site.ogImage.path),
        email: contact.email,
        /* Os dois números aparecem na seção de contato, com o nome de quem
           atende — é o mesmo dado, na mesma forma. */
        telephone: contact.whatsapps.map((channel) => `+${channel.number}`),
        contactPoint: contact.whatsapps.map((channel) => ({
          '@type': 'ContactPoint',
          contactType: 'customer support',
          name: `WhatsApp · ${channel.person}`,
          telephone: `+${channel.number}`,
          email: contact.email,
          availableLanguage: site.lang,
        })),
        /* Atendimento remoto em todo o país — a resposta que está no FAQ. */
        areaServed: { '@type': 'Country', name: 'Brasil' },
        knowsLanguage: site.lang,
        /* As duas pessoas do time, com o nome e a função que o card mostra. */
        employee: team.members.map((member) => ({
          '@type': 'Person',
          name: member.name,
          jobTitle: member.role,
          url: member.links.portfolio || undefined,
          sameAs: [member.links.github, member.links.portfolio].filter(Boolean),
        })),
      },

      /* O SITE em si — é o nó que dá nome e idioma ao domínio. Sem
         `SearchAction`: o site não tem busca interna, e declarar uma que não
         existe é prometer ao Google um recurso inexistente. */
      {
        '@type': 'WebSite',
        '@id': siteId,
        url: absolute('/'),
        name: site.name,
        description: site.description,
        inLanguage: site.lang,
        publisher: { '@id': orgId },
      },

      /* A PÁGINA. Uma só, e é a home: as seções são âncoras dela. */
      {
        '@type': 'WebPage',
        '@id': `${absolute('/')}#pagina`,
        url: absolute('/'),
        name: site.title,
        description: site.description,
        inLanguage: site.lang,
        isPartOf: { '@id': siteId },
        about: { '@id': orgId },
        primaryImageOfPage: absolute(site.ogImage.path),
      },

      /* O QUE SE CONTRATA — um nó por card da seção Serviços.
         SEM `offers`: havia um `Offer` com `minPrice` por serviço, espelhando o
         "a partir de R$ …" que os cards mostravam. O preço saiu da tela, e o
         schema acompanha a tela — anunciar ao Google um valor que o visitante
         não vê é a marcação que o Search Console reporta como inconsistente, e
         renderia um resultado de busca com um preço que a página não confirma. */
      ...services.items.map((service) => ({
        '@type': 'Service',
        name: service.name,
        description: `${service.what} ${service.audience}`,
        serviceType: service.name,
        provider: { '@id': orgId },
        areaServed: { '@type': 'Country', name: 'Brasil' },
      })),

      /* AS DÚVIDAS, palavra por palavra como o acordeão do FAQ mostra. */
      {
        '@type': 'FAQPage',
        '@id': `${absolute('/')}#faq`,
        isPartOf: { '@id': siteId },
        mainEntity: faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },

      /* O PORTFÓLIO. `url` só nos projetos que estão de fato no ar — apontar o
         Google para um endereço que não existe é pior que não apontar. */
      {
        '@type': 'ItemList',
        name: `Projetos desenvolvidos pela ${site.name}`,
        itemListElement: projects.items.map((project, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'CreativeWork',
            name: project.name,
            description: project.text,
            genre: project.category,
            keywords: project.stack.join(', '),
            creator: { '@id': orgId },
            ...(project.url ? { url: project.url } : {}),
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
