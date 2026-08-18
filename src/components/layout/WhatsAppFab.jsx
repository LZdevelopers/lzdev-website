import { useScrolled } from '../../hooks/useScrolled'
import { whatsappLink } from '../../data/site'
import { Icon } from '../primitives/Icon'

const MESSAGE =
  'Olá! Vim pelo site da LZdev e gostaria de conversar.'

/**
 * Botão flutuante de WhatsApp. Aparece só depois que o visitante rola —
 * no primeiro contato o hero fica limpo.
 *
 * Círculo puro, sem rótulo que abre no hover: o glifo do WhatsApp já é lido de
 * imediato e a bolha fica com a mesma silhueta no mobile e no desktop.
 *
 * Verde oficial (#25D366) com o glifo branco. É a única mancha de cor saturada
 * fixa na tela, e ela se justifica: o reconhecimento do canal vem da dupla
 * cor + forma, e o verde do WhatsApp não colide com nenhum tom da página.
 */
export function WhatsAppFab() {
  const visible = useScrolled(520)

  return (
    <a
      href={whatsappLink(MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      /* O rótulo diz o canal E que a conversa abre fora do site: para quem
         ouve a página, um ícone verde não informa nenhuma das duas coisas. */
      aria-label="Conversar pelo WhatsApp (abre em nova aba)"
      title="Conversar pelo WhatsApp"
      className={`fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_14px_40px_-12px_rgb(37_211_102/0.7)] transition-[transform,opacity,filter] duration-500 ease-[var(--ease-out-soft)] hover:scale-110 hover:brightness-110 active:scale-100 sm:bottom-7 sm:right-7 sm:size-15 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      {/* Halo estático e suave — chama atenção sem piscar na cara do visitante */}
      <span
        className="absolute -inset-1.5 -z-10 rounded-full bg-[#25D366]/25 blur-md"
        aria-hidden="true"
      />
      <Icon name="whatsapp" size={26} className="relative" />
    </a>
  )
}
