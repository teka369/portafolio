"use client"

import { useRef, useState, useCallback } from "react"
import { useInView } from "@/hooks/use-in-view"
import { Mail, Github, Linkedin, Twitter, Send, RotateCcw, Copy, Check, Code2, Eye, EyeOff } from "lucide-react"

const DEFAULT_CODE = `const contactForm = {
  nombre: "",
  email: "",
  mensaje: "",
};

async function enviarMensaje(data) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    console.log("Mensaje enviado!");
    return { success: true };
  }
  return { success: false };
}`

function parseFormFromCode(code: string): { nombre: string; email: string; mensaje: string } | null {
  try {
    // Match both single and double quotes
    const nombreMatch = code.match(/nombre:\s*["']([^"']*)["']/)
    const emailMatch = code.match(/email:\s*["']([^"']*)["']/)
    const mensajeMatch = code.match(/mensaje:\s*["']([^"']*)["']/)
    return {
      nombre: nombreMatch?.[1] ?? "",
      email: emailMatch?.[1] ?? "",
      mensaje: mensajeMatch?.[1] ?? "",
    }
  } catch {
    return null
  }
}

function generateCodeFromForm(nombre: string, email: string, mensaje: string): string {
  return `const contactForm = {
  nombre: "${nombre}",
  email: "${email}",
  mensaje: "${mensaje}",
};

async function enviarMensaje(data) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    console.log("Mensaje enviado!");
    return { success: true };
  }
  return { success: false };
}`
}

/* Syntax highlighted code viewer for non-edit mode */
function HighlightedCode({ code }: { code: string }) {
  return (
    <pre className="font-mono text-xs leading-5 whitespace-pre">
      {code.split("\n").map((line, i) => {
        const highlighted = line
          .replace(/(const|async|function|await|if|return)/g, '\x01$1\x02')
          .replace(/("(?:[^"\\]|\\.)*")/g, '\x03$1\x04')
          .replace(/(\/\/.*)/g, '\x05$1\x06')
          .replace(/(console\.log|fetch|JSON\.stringify)/g, '\x07$1\x08')

        const parts: { text: string; cls: string }[] = []
        let current = ""
        let currentCls = "text-foreground/80"
        for (const char of highlighted) {
          if (char === '\x01') { parts.push({ text: current, cls: currentCls }); current = ""; currentCls = "text-neon/90"; continue }
          if (char === '\x02') { parts.push({ text: current, cls: currentCls }); current = ""; currentCls = "text-foreground/80"; continue }
          if (char === '\x03') { parts.push({ text: current, cls: currentCls }); current = ""; currentCls = "text-[#e5c07b]"; continue }
          if (char === '\x04') { parts.push({ text: current, cls: currentCls }); current = ""; currentCls = "text-foreground/80"; continue }
          if (char === '\x05') { parts.push({ text: current, cls: currentCls }); current = ""; currentCls = "text-muted-foreground"; continue }
          if (char === '\x06') { parts.push({ text: current, cls: currentCls }); current = ""; currentCls = "text-foreground/80"; continue }
          if (char === '\x07') { parts.push({ text: current, cls: currentCls }); current = ""; currentCls = "text-[#61afef]"; continue }
          if (char === '\x08') { parts.push({ text: current, cls: currentCls }); current = ""; currentCls = "text-foreground/80"; continue }
          current += char
        }
        parts.push({ text: current, cls: currentCls })

        return (
          <div key={i} className="flex">
            <span className="inline-block w-8 text-right pr-4 text-muted-foreground/30 select-none shrink-0">{i + 1}</span>
            <span>
              {parts.map((p, j) => (
                <span key={j} className={p.cls}>{p.text}</span>
              ))}
            </span>
          </div>
        )
      })}
    </pre>
  )
}

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })

  const [formData, setFormData] = useState({ nombre: "", email: "", mensaje: "" })
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [codeValue, setCodeValue] = useState(DEFAULT_CODE)
  const [syncDirection, setSyncDirection] = useState<"form" | "code" | null>(null)

  /* Form -> Code sync */
  const handleFormChange = useCallback((field: string, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      setCodeValue(generateCodeFromForm(next.nombre, next.email, next.mensaje))
      setSyncDirection("form")
      setTimeout(() => setSyncDirection(null), 600)
      return next
    })
  }, [])

  /* Code -> Form sync */
  const handleCodeChange = useCallback((newCode: string) => {
    setCodeValue(newCode)
    const parsed = parseFormFromCode(newCode)
    if (parsed) {
      setFormData(prev => ({
        ...prev,
        nombre: parsed.nombre,
        email: parsed.email,
        mensaje: parsed.mensaje
      }))
      setSyncDirection("code")
      setTimeout(() => setSyncDirection(null), 600)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleReset = () => {
    setFormData({ nombre: "", email: "", mensaje: "" })
    setCodeValue(DEFAULT_CODE)
    setSubmitted(false)
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  const handleResetCode = () => {
    setCodeValue(DEFAULT_CODE)
    setFormData({ nombre: "", email: "", mensaje: "" })
  }

  return (
    <section id="contact" className="relative py-24 px-6" ref={ref}>
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex-1 h-px bg-border max-w-20" />
          <span className="font-mono text-sm text-neon">{"04."}</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Contacto</h2>
          <div className="flex-1 h-px bg-border max-w-20" />
        </div>

        <p className="text-muted-foreground leading-relaxed mb-4 max-w-lg mx-auto text-center">
          Siempre estoy abierto a nuevas oportunidades, colaboraciones y proyectos
          interesantes. Edita el formulario o el codigo — se sincronizan en tiempo real.
        </p>

        {/* Sync indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className={`h-px w-8 transition-all duration-500 ${syncDirection === "form" ? "bg-neon w-16" : "bg-border"}`} />
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono transition-all duration-500 ${
            syncDirection ? "border-neon/30 bg-neon/5 text-neon" : "border-border bg-secondary/30 text-muted-foreground"
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${syncDirection ? "bg-neon" : "bg-muted-foreground/30"}`} />
            {syncDirection === "form" ? "Form -> Code" : syncDirection === "code" ? "Code -> Form" : "Sync activo"}
          </div>
          <div className={`h-px w-8 transition-all duration-500 ${syncDirection === "code" ? "bg-neon w-16" : "bg-border"}`} />
        </div>

        <div className={`grid lg:grid-cols-2 gap-6 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* ── Contact form ── */}
          <div className={`bg-card border rounded-lg p-6 transition-all duration-500 ${syncDirection === "code" ? "border-neon/30 shadow-[0_0_20px_rgba(0,255,65,0.05)]" : "border-border hover:border-neon/20"}`}>
            <div className="flex items-center gap-2 mb-6">
              <Mail className="h-4 w-4 text-neon" />
              <h3 className="font-mono text-sm text-neon">Enviar mensaje</h3>
              {syncDirection === "code" && (
                <span className="ml-auto font-mono text-[10px] text-neon animate-fade-in-up" style={{ animationDuration: "0.3s" }}>Actualizado desde codigo</span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block font-mono text-xs text-muted-foreground mb-1.5">nombre</label>
                <input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleFormChange("nombre", e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-2.5 bg-terminal-bg border border-border rounded-md font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon/40 focus:shadow-[0_0_10px_rgba(0,255,65,0.1)] transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-mono text-xs text-muted-foreground mb-1.5">email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-2.5 bg-terminal-bg border border-border rounded-md font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon/40 focus:shadow-[0_0_10px_rgba(0,255,65,0.1)] transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label htmlFor="mensaje" className="block font-mono text-xs text-muted-foreground mb-1.5">mensaje</label>
                <textarea
                  id="mensaje"
                  value={formData.mensaje}
                  onChange={(e) => handleFormChange("mensaje", e.target.value)}
                  placeholder="Escribe tu mensaje aqui..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-terminal-bg border border-border rounded-md font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon/40 focus:shadow-[0_0_10px_rgba(0,255,65,0.1)] transition-all duration-300 resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitted}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-neon text-primary-foreground font-mono text-sm font-semibold rounded-md hover:bg-neon-dim transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitted ? (<><Check className="h-4 w-4" />Enviado</>) : (<><Send className="h-4 w-4" />Enviar</>)}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-muted-foreground font-mono text-sm rounded-md hover:border-neon/30 hover:text-foreground transition-all duration-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>
            </form>

            {submitted && (
              <div className="mt-4 p-3 bg-neon/5 border border-neon/20 rounded-md animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                <p className="font-mono text-xs text-neon flex items-center gap-2">
                  <Check className="h-3.5 w-3.5" />
                  Mensaje enviado correctamente
                </p>
              </div>
            )}
          </div>

          {/* ── Editable code block ── */}
          <div className={`bg-terminal-bg border rounded-lg overflow-hidden transition-all duration-500 flex flex-col ${syncDirection === "form" ? "border-neon/30 shadow-[0_0_20px_rgba(0,255,65,0.05)]" : "border-border hover:border-neon/20"}`}>
            {/* Code header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-secondary/30 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-neon/70" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">contact-form.ts</span>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Toggle edit */}
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[10px] transition-all duration-300 ${
                    editMode ? "bg-neon/10 text-neon border border-neon/20" : "text-muted-foreground hover:text-neon hover:bg-neon/5"
                  }`}
                  aria-label={editMode ? "Ver codigo" : "Editar codigo"}
                >
                  {editMode ? <><EyeOff className="h-3 w-3" />Editando</> : <><Code2 className="h-3 w-3" />Editar</>}
                </button>
                {/* Copy */}
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-muted-foreground hover:text-neon hover:bg-neon/5 transition-all duration-300 font-mono text-[10px]"
                  aria-label="Copiar codigo"
                >
                  {copied ? <><Check className="h-3 w-3 text-neon" />Copiado</> : <><Copy className="h-3 w-3" />Copiar</>}
                </button>
              </div>
            </div>

            {/* Code body */}
            <div className="flex-1 overflow-auto px-4 py-4 min-h-[320px] max-h-[480px]">
              {editMode ? (
                <textarea
                  key="code-editor"
                  value={codeValue}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="w-full h-full min-h-[300px] bg-terminal-bg border border-neon/20 rounded p-2 text-foreground/80 font-mono text-xs leading-5 resize-none focus:outline-none focus:border-neon/50"
                  spellCheck={false}
                  autoFocus
                  placeholder="Edita el código aquí..."
                />
              ) : (
                <HighlightedCode code={codeValue} />
              )}
            </div>

            {/* Code footer */}
            <div className="px-4 py-2 border-t border-border/50 bg-secondary/20 flex items-center justify-between shrink-0 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-muted-foreground">TypeScript | UTF-8</span>
                {syncDirection === "form" && (
                  <span className="font-mono text-[10px] text-neon animate-fade-in-up" style={{ animationDuration: "0.3s" }}>Sincronizado</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-muted-foreground hover:text-neon hover:bg-neon/5 font-mono text-[10px] transition-all duration-300"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                  Reset
                </button>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-muted-foreground hover:text-neon hover:bg-neon/5 font-mono text-[10px] transition-all duration-300"
                >
                  {editMode ? <><Eye className="h-2.5 w-2.5" />Vista previa</> : <><Code2 className="h-2.5 w-2.5" />Editar</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="mt-16 flex items-center justify-center gap-6">
          {[
            { icon: Github, href: "https://github.com/teka369", label: "GitHub" },
            { icon: Mail, href: "mailto:guarinromerojuandavid@gmail.com", label: "Email" },
          ].map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} aria-label={label} className="text-muted-foreground hover:text-neon transition-all duration-300 hover:-translate-y-1">
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
