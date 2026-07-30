import { useState } from 'react'
import { activeSocials, contact, contactSection, whatsappLink } from '../../data/site'
import { Button } from '../primitives/Button'
import { Icon } from '../primitives/Icon'
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
  `w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-ink placeholder:text-faint transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/22 focus:border-brand focus:bg-white/[0.05] focus:outline-none ${
    invalid ? 'border-warn/60' : 'border-white/10'
  }`

function Field({ id, label, error, hint, required, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-warn" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-faint">(opcional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-xs font-medium text-warn">
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
function SelectField({ id, label, options, value, onChange, error, required }) {
  return (
    <Field id={id} label={label} error={error} required={required}>
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
 * `toneClass` pinta a moldura inteira na cor do canal, então o WhatsApp fica
 * visualmente à frente do e-mail sem precisar de um segundo tamanho.
 */
function ChannelButton({ icon, label, value, href, external, toneClass, iconClass }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`group flex items-center gap-4 rounded-xl border p-4 transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 ${toneClass}`}
    >
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ring-1 ${iconClass}`}>
        <Icon name={icon} size={20} />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block text-xs font-semibold tracking-wide text-faint uppercase">{label}</span>
        <span className="block truncate text-sm font-semibold text-ink">{value}</span>
      </span>
      <Icon
        name="arrowUpRight"
        size={16}
        className="ml-auto shrink-0 text-faint transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:text-accent"
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
    <Section id="contato">
      <SectionHeader
        eyebrow={contactSection.eyebrow}
        title={contactSection.title}
        subtitle={contactSection.subtitle}
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
        {/* Formulário */}
        <Reveal variant="left">
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-[var(--radius-xl2)] border border-white/8 bg-surface/45 p-6 sm:p-8 border-gradient"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Nome" error={errors.name} required>
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
              />

              <SelectField
                id="budget"
                label="Faixa de investimento"
                options={contactSection.budgets}
                value={form.budget}
                onChange={update('budget')}
              />

              <SelectField
                id="deadline"
                label="Prazo desejado"
                options={contactSection.deadlines}
                value={form.deadline}
                onChange={update('deadline')}
              />

              <div className="sm:col-span-2">
                <Field
                  id="message"
                  label="Descrição do projeto"
                  error={errors.message}
                  hint="Conte o problema que precisa resolver — quanto mais contexto, mais preciso o diagnóstico."
                  required
                >
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Ex.: hoje controlamos os pedidos em planilha e perdemos informação toda semana. Precisamos de um sistema onde a equipe registre tudo em um só lugar e a diretoria veja os números do dia."
                    value={form.message}
                    onChange={update('message')}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : 'message-hint'}
                    className={`${fieldClass(errors.message)} resize-y min-h-32`}
                  />
                </Field>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <ul className="flex flex-col gap-1.5 text-xs text-muted">
                {contactSection.reassurance.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Icon name="check" size={12} className="text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button type="submit" size="lg" icon="send" iconPosition="left" className="w-full sm:w-auto">
                Solicitar projeto
              </Button>
            </div>

            {/* aria-live no container que já existe: a mensagem visível é a mesma
                que o leitor de tela anuncia, sem texto duplicado só para ele. */}
            <div aria-live="polite">
              {sent ? (
                <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-emerald-400/25 bg-emerald-400/8 p-4 text-sm leading-relaxed text-emerald-200">
                  <Icon name="checkCircle" size={17} className="mt-px shrink-0" />
                  Tudo pronto — abrimos o WhatsApp com a sua solicitação preenchida. Se a aba não abriu,
                  verifique o bloqueador de pop-ups ou fale com a gente pelos canais ao lado.
                </p>
              ) : null}
            </div>
          </form>
        </Reveal>

        {/* Canais diretos */}
        <Reveal variant="right" delay={120} className="lg:sticky lg:top-28">
          <div className="flex flex-col gap-5">
            <div className="rounded-[var(--radius-xl2)] border border-white/8 bg-surface/45 p-6 sm:p-7">
              <h3 className="text-lg font-bold text-ink">{contactSection.direct.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{contactSection.direct.text}</p>

              <div className="mt-6 flex flex-col gap-2.5">
                <ChannelButton
                  icon="whatsapp"
                  label="WhatsApp"
                  value={contact.whatsapp.display}
                  href={whatsappLink('Olá! Vim pelo site da LZdev e gostaria de conversar sobre um projeto.')}
                  external
                  toneClass="border-[#25D366]/30 bg-[#25D366]/[0.07] hover:border-[#25D366]/55 hover:bg-[#25D366]/12"
                  iconClass="bg-[#25D366]/14 text-[#25D366] ring-[#25D366]/28"
                />
                <ChannelButton
                  icon="mail"
                  label="E-mail"
                  value={contact.email}
                  href={`mailto:${contact.email}`}
                  toneClass="border-brand/30 bg-brand/[0.07] hover:border-brand/55 hover:bg-brand/12"
                  iconClass="bg-brand/14 text-brand-soft ring-brand/28"
                />
              </div>

              {/* Redes sociais — só as que têm link preenchido em data/site.js */}
              {activeSocials.length ? (
                <div className="mt-7 border-t border-white/8 pt-6">
                  <p className="text-xs font-semibold tracking-[0.16em] text-faint uppercase">
                    {contactSection.direct.socialsLabel}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2.5">
                    {activeSocials.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted transition-[border-color,color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand/45 hover:bg-brand/10 hover:text-ink"
                        >
                          <Icon name={social.icon} size={18} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="rounded-[var(--radius-xl2)] border border-white/8 bg-surface/30 p-6 sm:p-7">
              <ul className="flex flex-col gap-4 text-sm">
                <li className="flex items-start gap-3">
                  <Icon name="clock" size={17} className="mt-0.5 shrink-0 text-accent" />
                  <span className="text-muted">{contact.hours}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="globe" size={17} className="mt-0.5 shrink-0 text-accent" />
                  <span className="text-muted">{contact.location}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="shield" size={17} className="mt-0.5 shrink-0 text-accent" />
                  <span className="text-muted">
                    Suas informações são usadas apenas para responder ao seu contato.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
