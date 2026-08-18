import { useState } from 'react'
import { contact, contactSection, emailLink, primaryCta, socialsByPerson, whatsappLink } from '../../data/site'
import { Button } from '../primitives/Button'
import { brandColors, Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

/**
 * O formulário pede QUATRO dados: nome, empresa, telefone e e-mail — e mais nada
 * obrigatório. Tipo de projeto, faixa de investimento e prazo saíram: eram três
 * escolhas antes da primeira conversa, e cada campo a mais é gente que fecha a
 * aba. Essas três respostas aparecem naturalmente na primeira mensagem de volta.
 * A descrição do projeto virou opcional pelo mesmo motivo — quem tem o problema
 * na ponta da língua escreve, quem só quer contato manda o contato.
 */
const EMPTY = {
  name: '',
  company: '',
  phone: '',
  email: '',
  message: '',
}

/** Máscara progressiva de telefone brasileiro: (99) 99999-9999 */
function maskPhone(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/**
 * Só o que é preciso para responder: como te chamar e por onde. `message` não
 * entra — campo opcional que reprova o envio seria opcional só no rótulo.
 */
function validate(form) {
  const errors = {}
  if (form.name.trim().length < 3) errors.name = 'Informe seu nome completo.'
  if (!/^\S+@\S+\.\S{2,}$/.test(form.email.trim())) errors.email = 'Informe um e-mail válido.'
  if (form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Informe um telefone com DDD.'
  return errors
}

const fieldClass = (invalid) =>
  `w-full rounded-lg border bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-faint transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/22 focus:border-brand focus:bg-white/[0.05] focus:outline-none ${
    invalid ? 'border-danger/70 bg-danger/[0.06]' : 'border-white/10'
  }`

function Field({ id, label, error, hint, required, className = '', children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-[0.8rem] font-medium text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 text-[0.7rem] font-normal text-faint">(opcional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs font-medium text-danger">
          <Icon name="xCircle" size={13} />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Canal direto (WhatsApp / e-mail).
 * `--ch` é a cor do canal: o verde oficial no WhatsApp, branco no e-mail (que
 * não é marca de terceiro). Ela tinge moldura, tile e anel por `color-mix`, e o
 * hover só aumenta a mistura — é o que põe o WhatsApp visualmente à frente sem
 * precisar de um segundo tamanho.
 *
 * As classes ficam em constantes porque o canal de e-mail não é um link: é um
 * botão que abre painel (ver `EmailChannel`), e as duas formas têm de ser
 * indistinguíveis na coluna.
 */
const CHANNEL_SHELL =
  'rounded-lg border border-[color-mix(in_oklab,var(--ch)_28%,transparent)] bg-[color-mix(in_oklab,var(--ch)_7%,transparent)] transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-soft)]'
const CHANNEL_ROW = 'flex w-full items-center gap-3 p-3 text-left'
const CHANNEL_TILE =
  'grid size-9 shrink-0 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--ch)_15%,transparent)] ring-1 ring-[color-mix(in_oklab,var(--ch)_30%,transparent)]'
const CHANNEL_HOVER =
  'hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--ch)_55%,transparent)] hover:bg-[color-mix(in_oklab,var(--ch)_13%,transparent)]'

/** Rótulo em duas linhas do canal: o que é em cima, o endereço embaixo. */
function ChannelText({ label, value }) {
  return (
    <span className="min-w-0 leading-tight">
      <span className="block text-[0.65rem] font-semibold tracking-wide text-faint uppercase">{label}</span>
      <span className="block truncate text-[0.82rem] font-semibold text-ink">{value}</span>
    </span>
  )
}

function ChannelButton({ icon, label, value, href, external, tone }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{ '--ch': tone }}
      className={`group ${CHANNEL_SHELL} ${CHANNEL_ROW} ${CHANNEL_HOVER}`}
    >
      <span className={CHANNEL_TILE}>
        <Icon name={icon} size={18} colored />
      </span>
      <ChannelText label={label} value={value} />
      <Icon
        name="arrowUpRight"
        size={15}
        className="ml-auto shrink-0 text-faint transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:text-ink"
      />
    </a>
  )
}

/**
 * Canal de e-mail: abre um painel na própria página em vez de disparar um
 * `mailto:` no clique.
 *
 * O motivo é prático. `mailto:` depende de haver um cliente de e-mail associado
 * no sistema; em quem usa Gmail pelo navegador — a maioria — o clique não faz
 * nada visível, e o visitante conclui que o botão está quebrado. O painel dá as
 * três saídas: Gmail na web, app do sistema e o endereço para copiar. Assunto e
 * corpo já vão preenchidos nas duas primeiras, como nos botões de WhatsApp.
 *
 * A altura anima por `grid-template-rows`, o mesmo recurso do acordeão do FAQ —
 * nada de medir conteúdo em JS.
 */
function EmailChannel() {
  const copy = contactSection.direct.email
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      // Sem permissão de área de transferência (contexto não seguro, navegador
      // antigo): o endereço continua à vista no painel para seleção manual.
    }
  }

  return (
    <div
      style={{ '--ch': '#ffffff' }}
      className={`${CHANNEL_SHELL} ${
        open ? 'border-[color-mix(in_oklab,var(--ch)_55%,transparent)]' : CHANNEL_HOVER
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="email-panel"
        className={`group ${CHANNEL_ROW}`}
      >
        <span className={CHANNEL_TILE}>
          <Icon name="mail" size={18} />
        </span>
        <ChannelText label={copy.openLabel} value={contact.email} />
        <Icon
          name="chevronDown"
          size={16}
          className={`ml-auto shrink-0 text-faint transition-[transform,color] duration-400 ease-[var(--ease-out-soft)] group-hover:text-ink ${
            open ? 'rotate-180 text-ink' : ''
          }`}
        />
      </button>

      <div
        id="email-panel"
        className={`grid transition-[grid-template-rows] duration-450 ease-[var(--ease-out-soft)] ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2.5 border-t border-white/10 p-3">
            <div>
              <p className="text-[0.65rem] font-semibold tracking-wide text-faint uppercase">
                {copy.panelTitle}
              </p>
              <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-white/8 bg-black/30 px-2.5 py-1.5">
                <span className="min-w-0 flex-1 truncate font-display text-[0.78rem] font-semibold text-ink">
                  {contact.email}
                </span>
                <button
                  type="button"
                  onClick={onCopy}
                  className="flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[0.7rem] font-semibold text-muted transition-[border-color,color,background-color] duration-300 hover:border-white/25 hover:bg-white/[0.08] hover:text-ink"
                >
                  <Icon name={copied ? 'check' : 'copy'} size={13} className={copied ? 'text-success' : ''} />
                  {copied ? copy.copied : copy.copy}
                </button>
              </div>
              {/* Confirmação anunciada uma vez, sem texto duplicado na tela */}
              <span className="sr-only" aria-live="polite">
                {copied ? copy.copied : ''}
              </span>
            </div>

            <Button
              href={emailLink.gmail(copy.subject, copy.body)}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              icon="arrowUpRight"
              className="w-full"
            >
              {copy.gmail}
            </Button>
            <Button href={emailLink.mailto(copy.subject, copy.body)} variant="outline" icon="mail" iconPosition="left" className="w-full">
              {copy.app}
            </Button>

            <p className="text-[0.72rem] leading-snug text-faint">{copy.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (key) => (event) => {
    const value = key === 'phone' ? maskPhone(event.target.value) : event.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
    // Limpa o erro do campo assim que o visitante começa a corrigi-lo
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)

    if (Object.keys(found).length) {
      const first = document.getElementById(Object.keys(found)[0])
      first?.focus()
      first?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }

    // Campos vazios não viram linha: a descrição é opcional, e um "*Descrição:*"
    // seguido de nada só faria a mensagem parecer truncada do outro lado.
    const message = [
      '*Nova solicitação de projeto — site LZdev*',
      '',
      `*Nome:* ${form.name}`,
      form.company ? `*Empresa:* ${form.company}` : null,
      `*Telefone:* ${form.phone}`,
      `*E-mail:* ${form.email}`,
      form.message.trim() ? '' : null,
      form.message.trim() ? '*Descrição:*' : null,
      form.message.trim() || null,
    ]
      .filter((line) => line !== null)
      .join('\n')

    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <Section id="contato" tight>
      <SectionHeader
        eyebrow={contactSection.eyebrow}
        title={contactSection.title}
        subtitle={contactSection.subtitle}
      />

      <div className="mt-9 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
        {/* Formulário */}
        <Reveal variant="left">
          {/* `noValidate` desliga a validação do navegador porque a nossa é mais
              específica (telefone com DDD, e-mail com domínio) e escreve em
              português; `required` continua nos campos para o leitor de tela
              anunciar "obrigatório" ANTES de o visitante digitar, em vez de
              descobrir no erro. `aria-describedby` liga o formulário à frase que
              explica o que acontece no envio. */}
          <form
            onSubmit={onSubmit}
            noValidate
            aria-label="Solicitação de orçamento"
            aria-describedby="form-nota"
            className="rounded-[var(--radius-xl2)] border border-white/8 bg-surface/45 p-5 sm:p-6 border-gradient"
          >
            {/* Duas colunas: os quatro campos de contato em pares e a descrição
                atravessando a largura. Eram seis colunas quando havia três
                selects para encaixar numa linha só — sem eles, a grade de 2
                resolve com metade das classes. */}
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field id="name" label="Nome" error={errors.name} required>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={update('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={fieldClass(errors.name)}
                />
              </Field>

              <Field id="company" label="Empresa">
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  placeholder="Nome da sua empresa"
                  value={form.company}
                  onChange={update('company')}
                  className={fieldClass(false)}
                />
              </Field>

              <Field id="phone" label="Telefone" error={errors.phone} required>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  placeholder="(00) 00000-0000"
                  value={form.phone}
                  onChange={update('phone')}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={fieldClass(errors.phone)}
                />
              </Field>

              <Field id="email" label="E-mail" error={errors.email} required>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder="voce@empresa.com.br"
                  value={form.email}
                  onChange={update('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={fieldClass(errors.email)}
                />
              </Field>

              <Field
                id="message"
                label="Descrição do projeto"
                hint="Quanto mais contexto, mais preciso o diagnóstico — mas dá para conversar sem isso."
                className="sm:col-span-2"
              >
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Ex.: hoje controlamos os pedidos em planilha e perdemos informação toda semana. Precisamos de um sistema onde a equipe registre tudo em um só lugar."
                  value={form.message}
                  onChange={update('message')}
                  aria-describedby="message-hint"
                  className={`${fieldClass(false)} resize-y min-h-20`}
                />
              </Field>
            </div>

            {/* Garantias em linha (e não empilhadas): três itens curtos cabem numa
                faixa só ao lado do botão e economizam duas linhas de altura. */}
            <div className="mt-5 flex flex-col gap-3 border-t border-white/8 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem] text-muted">
                {contactSection.reassurance.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Icon name="check" size={12} className="shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button type="submit" icon="send" iconPosition="left" className="w-full shrink-0 sm:w-auto">
                {primaryCta}
              </Button>
            </div>

            {/* O que o botão faz, escrito antes do clique: ele não envia um
                e-mail, ele abre o WhatsApp com a mensagem já montada. Descobrir
                isso só quando a aba abre assusta mais do que ajuda. */}
            <p id="form-nota" className="mt-3 flex items-start gap-2 text-[0.75rem] leading-snug text-faint">
              <Icon name="whatsapp" size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
              {contactSection.submitNote}
            </p>

            {/* aria-live no container que já existe: a mensagem visível é a mesma
                que o leitor de tela anuncia, sem texto duplicado só para ele. */}
            <div aria-live="polite">
              {sent ? (
                <p className="mt-4 flex items-start gap-2.5 rounded-lg border border-success/30 bg-success/10 p-3.5 text-[0.82rem] leading-relaxed text-success">
                  <Icon name="checkCircle" size={16} className="mt-px shrink-0" aria-hidden="true" />
                  {contactSection.sent}
                </p>
              ) : null}
            </div>
          </form>
        </Reveal>

        {/* Canais diretos — um cartão só. Eram dois empilhados (canais + horários),
            com duas molduras e dois paddings de 28px; fundidos, a coluna encurta
            perto de 100px e continua acompanhando a rolagem do formulário. */}
        <Reveal variant="right" delay={120} className="lg:sticky lg:top-28">
          <div className="rounded-[var(--radius-xl2)] border border-white/8 bg-surface/45 p-5 sm:p-6">
            <h3 className="text-base font-bold text-ink">{contactSection.direct.title}</h3>
            <p className="mt-1.5 text-[0.82rem] leading-relaxed text-muted">
              {contactSection.direct.text}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {/* Um botão por desenvolvedor: o rótulo diz com quem a conversa
                  abre, então dois WhatsApp na mesma coluna não viram escolha às
                  cegas. A mensagem já chega personalizada. */}
              {contact.whatsapps.map((channel) => (
                <ChannelButton
                  key={channel.number}
                  icon="whatsapp"
                  label={`WhatsApp · ${channel.person}`}
                  value={channel.display}
                  href={whatsappLink(
                    `Olá, ${channel.person}! Vim pelo site da LZdev e gostaria de conversar sobre um projeto.`,
                    channel.number
                  )}
                  external
                  tone={brandColors.whatsapp}
                />
              ))}
              <EmailChannel />
            </div>

            {/* Redes sociais — só as que têm link preenchido em data/site.js.
                Uma linha por pessoa: numa fileira única, os dois GitHub e os
                dois Instagram são ícones idênticos e ninguém sabe de quem é cada
                um antes de clicar. O nome à esquerda resolve isso sem tirar a
                compactação do cartão. */}
            {socialsByPerson.length ? (
              <div className="mt-5 border-t border-white/8 pt-4">
                <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-faint uppercase">
                  {contactSection.direct.socialsLabel}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {socialsByPerson.map((group) => (
                    <li key={group.person} className="flex items-center gap-3">
                      {group.person ? (
                        <span className="w-11 shrink-0 text-[0.8rem] font-semibold text-ink">
                          {group.person}
                        </span>
                      ) : null}
                      <ul className="flex flex-wrap gap-2">
                        {group.links.map((social) => (
                          <li key={social.label}>
                            <a
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={social.label}
                              title={social.label}
                              style={{ '--net': brandColors[social.icon] || '#ffffff' }}
                              className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--net)_50%,transparent)] hover:bg-[color-mix(in_oklab,var(--net)_14%,transparent)]"
                            >
                              <Icon name={social.icon} size={16} colored />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Horário de atendimento e área de cobertura saíram: prometer
                "segunda a sexta, 08h às 18h" ao lado de dois WhatsApp pessoais
                cria uma expectativa que o time não controla. Sobrou a linha que
                é sempre verdadeira — o que acontece com o dado de quem escreve. */}
            <p className="mt-5 flex items-start gap-2.5 border-t border-white/8 pt-4 text-[0.8rem]">
              <Icon name="shield" size={15} className="mt-0.5 shrink-0 text-success" />
              <span className="text-muted">
                Suas informações são usadas apenas para responder ao seu contato.
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
