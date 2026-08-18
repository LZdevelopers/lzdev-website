import { useReveal } from './hooks/useReveal'
import { Footer } from './components/layout/Footer'
import { GridBackdrop } from './components/layout/GridBackdrop'
import { Navbar } from './components/layout/Navbar'
import { StructuredData } from './components/layout/StructuredData'
import { WhatsAppFab } from './components/layout/WhatsAppFab'
import { Contact } from './components/sections/Contact'
import { Faq } from './components/sections/Faq'
import { Hero } from './components/sections/Hero'
import { InvisibleCost } from './components/sections/InvisibleCost'
import { Projects } from './components/sections/Projects'
import { Services } from './components/sections/Services'
import { Stats } from './components/sections/Stats'
import { Team } from './components/sections/Team'
import { Tools } from './components/sections/Tools'
import { WhyUs } from './components/sections/WhyUs'

export default function App() {
  useReveal()

  return (
    <>
      <StructuredData />
      <GridBackdrop />

      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-bg"
      >
        Ir para o conteúdo
      </a>

      <Navbar />

      <main id="conteudo">
        {/* Jornada: o que fazemos → o que se contrata → prova → capacidade →
            dor → solução → quem entrega → números → objeções → conversão.
            Serviços entra em segundo lugar de propósito: quem acabou de ler o
            H1 quer saber o que pode contratar, e essa resposta não pode estar
            depois de quatro seções de argumento. */}
        <Hero />
        <Services />
        <Projects />
        <Tools />
        <InvisibleCost />
        <WhyUs />
        <Team />
        <Stats />
        <Faq />
        <Contact />
      </main>

      <Footer />
      <WhatsAppFab />
    </>
  )
}
