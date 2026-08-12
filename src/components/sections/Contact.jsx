import { useState } from 'react'
import { activeSocials, contact, contactSection, whatsappLink } from '../../data/site'
import { Button } from '../primitives/Button'
import { brandColors, Icon } from '../primitives/Icon'
import { Reveal } from '../primitives/Reveal'
import { Section, SectionHeader } from '../primitives/Section'

const EMPTY = {
  name: '',
  company: '',
  phone: '',
  email: '',
  type: '',
  budget: '',
  deadline: '',
  message: '',
}

const labelFor = (list, value) => list.find((o) => o.value === value)?.label || '—'

/** Máscara progressiva de telefone brasileiro: (99) 99999-9999 */
function maskPhone(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function validate(form) {
  const errors = {}
  if (form.name.trim().length < 3) errors.name = 'Informe seu nome completo.'
  if (!/^\S+@\S+\.\S{2,}$/.test(form.email.trim())) errors.email = 'Informe um e-mail válido.'
  if (form.phone.replace(/\D/g, '').length < 10) errors.phone = 'Informe um telefone com DDD.'
  if (!form.type) errors.type = 'Selecione o tipo de projeto.'
  if (form.message.trim().length < 20) errors.message = 'Descreva o projeto em pelo menos 20 caracteres.'
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

/** Select com rótulo, erro e placeholder — usado pelos três campos de escolha. */
function SelectField({ id, label, options, value, onChange, error, required, className }) {
  return (
    <Field id={id} label={label} error={error} required={required} className={className}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${fieldClass(error)} select-arrow`}
      >
        <option value="">Selecione…</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

/**
 * Botão de canal direto (WhatsApp / e-mail).
 * `tone` é a cor do canal: o verde oficial no WhatsApp, branco no e-mail (que
 * não é marca de terceiro). Ela tinge moldura, tile e anel por `color-mix`, e o
 * hover só aumenta a mistura — é o que põe o WhatsApp visualmente à frente sem
 * precisar de um segundo tamanho.
 */
function ChannelButton({ icon, label, value, href, external, tone }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{ '--ch': tone }}
      className="group flex items-center gap-3 rounded-lg border border-[color-mix(in_oklab,var(--ch)_28%,transparent)] bg-[color-mix(in_oklab,var(--ch)_7%,transparent)] p-3 transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--ch)_55%,transparent)] hover:bg-[color-mix(in_oklab,var(--ch)_13%,transparent)]"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[color-mix(in_oklab,var(--ch)_15%,transparent)] ring-1 ring-[color-mix(in_oklab,var(--ch)_30%,transparent)]">
        <Icon name={icon} size={18} colored />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block text-[0.65rem] font-semibold tracking-wide text-faint uppercase">{label}</span>
        <span className="block truncate text-[0.82rem] font-semibold text-ink">{value}</span>
      </span>
      <Icon
        name="arrowUpRight"
        size={15}
        className="ml-auto shrink-0 text-faint transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:text-ink"
      />
    </a>
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

    const message = [
      '*Nova solicitação de projeto — site LZdev*',
      '',
      `*Nome:* ${form.name}`,
      form.company ? `*Empresa:* ${form.company}` : null,
      `*Telefone:* ${form.phone}`,
      `*E-mail:* ${form.email}`,
      `*Tipo de projeto:* ${labelFor(contactSection.projectTypes, form.type)}`,
      form.budget ? `*Investimento:* ${labelFor(contactSection.budgets, form.budget)}` : null,
      form.deadline ? `*Prazo:* ${labelFor(contactSection.deadlines, form.deadline)}` : null,
      '',
      '*Descrição:*',
      form.message,
    ]
      .filter(Boolean)
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
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-[var(--radius-xl2)] border border-white/8 bg-surface/45 p-5 sm:p-6 border-gradient"
          >
            {/* Grade de 6 colunas: nome/empresa e telefone/e-mail ocupam meia
                largura, e os TRÊS selects dividem uma linha só (2 colunas cada).
                Num grid de 2 colunas eles gastavam duas linhas e meia — é a
                maior economia de altura do formulário. */}
            <div className="grid gap-3.5 sm:grid-cols-6">
              <Field id="name" label="Nome" error={errors.name} required className="sm:col-span-3">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  value={form.name}
                  onChange={update('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={fieldClass(errors.name)}
                />
              </Field>

              <Field id="company" label="Empresa" className="sm:col-span-3">
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

              <Field id="phone" label="Telefone" error={errors.phone} required className="sm:col-span-3">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  value={form.phone}
                  onChange={update('phone')}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={fieldClass(errors.phone)}
                />
              </Field>

              <Field id="email" label="E-mail" error={errors.email} required className="sm:col-span-3">
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="voce@empresa.com.br"
                  value={form.email}
                  onChange={update('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={fieldClass(errors.email)}
                />
              </Field>

              <SelectField
                id="type"
                label="Tipo de projeto"
                options={contactSection.projectTypes}
                value={form.type}
                onChange={update('type')}
                error={errors.type}
                required
                className="sm:col-span-2"
              />

              <SelectField
                id="budget"
                label="Investimento"
                options={contactSection.budgets}
                value={form.budget}
                onChange={update('budget')}
                className="sm:col-span-2"
              />

              <SelectField
                id="deadline"
                label="Prazo"
                options={contactSection.deadlines}
                value={form.deadline}
                onChange={update('deadline')}
                className="sm:col-span-2"
              />

              <Field
                id="message"
                label="Descrição do projeto"
                error={errors.message}
                hint="Quanto mais contexto, mais preciso o diagnóstico."
                required
                className="sm:col-span-6"
              >
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Ex.: hoje controlamos os pedidos em planilha e perdemos informação toda semana. Precisamos de um sistema onde a equipe registre tudo em um só lugar."
                  value={form.message}
                  onChange={update('message')}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : 'message-hint'}
                  className={`${fieldClass(errors.message)} resize-y min-h-20`}
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
                Solicitar projeto
              </Button>
            </div>

            {/* aria-live no container que já existe: a mensagem visível é a mesma
                que o leitor de tela anuncia, sem texto duplicado só para ele. */}
            <div aria-live="polite">
              {sent ? (
                <p className="mt-4 flex items-start gap-2.5 rounded-lg border border-success/30 bg-success/10 p-3.5 text-[0.82rem] leading-relaxed text-success">
                  <Icon name="checkCircle" size={16} className="mt-px shrink-0" />
                  Tudo pronto — abrimos o WhatsApp com a sua solicitação preenchida. Se a aba não abriu,
                  verifique o bloqueador de pop-ups ou fale com a gente pelos canais ao lado.
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
              <ChannelButton
                icon="whatsapp"
                label="WhatsApp"
                value={contact.whatsapp.display}
                href={whatsappLink('Olá! Vim pelo site da LZdev e gostaria de conversar sobre um projeto.')}
                external
                tone={brandColors.whatsapp}
              />
              <ChannelButton
                icon="mail"
                label="E-mail"
                value={contact.email}
                href={`mailto:${contact.email}`}
                tone="#ffffff"
              />
            </div>

            {/* Redes sociais — só as que têm link preenchido em data/site.js */}
            {activeSocials.length ? (
              <div className="mt-5 border-t border-white/8 pt-4">
                <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-faint uppercase">
                  {contactSection.direct.socialsLabel}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {activeSocials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        style={{ '--net': brandColors[social.icon] || '#ffffff' }}
                        className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.03] transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--net)_50%,transparent)] hover:bg-[color-mix(in_oklab,var(--net)_14%,transparent)]"
                      >
                        <Icon name={social.icon} size={17} colored />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <ul className="mt-5 flex flex-col gap-2.5 border-t border-white/8 pt-4 text-[0.8rem]">
              <li className="flex items-start gap-2.5">
                <Icon name="clock" size={15} className="mt-0.5 shrink-0 text-info" />
                <span className="text-muted">{contact.hours}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="globe" size={15} className="mt-0.5 shrink-0 text-info" />
                <span className="text-muted">{contact.location}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="shield" size={15} className="mt-0.5 shrink-0 text-success" />
                <span className="text-muted">
                  Suas informações são usadas apenas para responder ao seu contato.
                </span>
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
