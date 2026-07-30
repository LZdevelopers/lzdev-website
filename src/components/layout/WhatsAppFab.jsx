import { useScrolled } from '../../hooks/useScrolled'
import { whatsappLink } from '../../data/site'
import { Icon } from '../primitives/Icon'

const MESSAGE =
  'Olá! Vim pelo site da LZdev e gostaria de conversar sobre um projeto.'

/**
 * Botão flutuante de WhatsApp. Aparece só depois que o visitante rola —
 * no primeiro contato o hero fica limpo.
 */
export function WhatsAppFab() {
  const visible = useScrolled(520)

  return (
    <a
      href={whatsappLink(MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar pelo WhatsApp"
      className={`group fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] pl-4 pr-4 py-3.5 text-[#052e16] shadow-[0_14px_40px_-12px_rgb(37_211_102/0.7)] transition-all duration-500 ease-[var(--ease-out-soft)] hover:pr-5 hover:brightness-105 sm:bottom-7 sm:right-7 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      {/* Halo estático e suave — chama atenção sem piscar na cara do visitante */}
      <span
        className="absolute -inset-1.5 -z-10 rounded-full bg-[#25D366]/25 blur-md"
        aria-hidden="true"
      />
      <Icon name="whatsapp" size={24} className="relative shrink-0" />
      <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-500 ease-[var(--ease-out-soft)] group-hover:max-w-40 sm:inline-block">
        Falar agora
      </span>
    </a>
  )
}
