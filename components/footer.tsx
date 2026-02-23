"use client"

import { useEffect, useState } from "react"
import { Terminal, Github, Mail, Heart, ArrowUp, Cpu, Zap } from "lucide-react"

const quickLinks = [
  { label: "Inicio", href: "#hero" },
  { label: "Sobre mi", href: "#about" },
  { label: "Habilidades", href: "#skills" },
  { label: "Proyectos", href: "#projects" },
  { label: "Contacto", href: "#contact" },
]

const techStack = ["Next.js", "TypeScript", "Node.js", "NestJS", "PostgreSQL", "Tailwind CSS"]

const socialLinks = [
  { icon: Github, href: "https://github.com/teka369", label: "GitHub" },
  { icon: Mail, href: "mailto:guarinromerojuandavid@gmail.com", label: "Email" },
]

function MiniTerminal() {
  const [lines, setLines] = useState<string[]>([])
  const messages = [
    "$ ping portfolio.dev",
    "PONG 12ms",
    "$ uptime",
    "System up 365d 23h 59m",
    "$ status --all",
    "All services: OPERATIONAL",
  ]

  useEffect(() => {
    let idx = 0
    const interval = setInterval(() => {
      setLines((prev) => {
        const next = [...prev, messages[idx % messages.length]]
        if (next.length > 4) next.shift()
        return next
      })
      idx++
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-terminal-bg border border-border/30 rounded-md p-3 max-w-[240px]">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-neon/60" />
        <span className="font-mono text-[9px] text-muted-foreground/60">footer.sh</span>
      </div>
      <div className="space-y-0.5 min-h-[52px]">
        {lines.map((line, i) => (
          <div key={`${i}-${line}`} className={`font-mono text-[10px] transition-opacity duration-500 ${line.startsWith("$") ? "text-muted-foreground/60" : "text-neon/50"}`}>
            {line}
          </div>
        ))}
        <div className="flex items-center">
          <span className="font-mono text-[10px] text-muted-foreground/40">$ </span>
          <span className="w-1.5 h-3 bg-neon/40 animate-terminal-blink ml-0.5" />
        </div>
      </div>
    </div>
  )
}

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative border-t border-border/50 overflow-hidden">
      {/* Subtle circuit background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" aria-hidden="true">
        <svg className="w-full h-full">
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#00ff41" strokeWidth="1" strokeDasharray="2 10" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#00ff41" strokeWidth="1" strokeDasharray="2 10" />
          <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#00ff41" strokeWidth="1" strokeDasharray="2 10" />
        </svg>
      </div>

      {/* Main footer content */}
      <div className="mx-auto max-w-6xl px-6 py-16 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-neon/10 border border-neon/20 rounded-md">
                <Terminal className="h-4 w-4 text-neon" />
              </div>
              <span className="font-mono text-sm text-neon tracking-wider font-semibold">
                {"~/dev"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Desarrollador fullstack especializado en backend, apasionado por crear sistemas
              escalables y de alto rendimiento con JavaScript y Node.js.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={label === "GitHub" ? "_blank" : undefined}
                  rel={label === "GitHub" ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="p-2 bg-secondary/50 border border-border/50 rounded-md text-muted-foreground hover:text-neon hover:border-neon/30 hover:bg-neon/5 hover:shadow-[0_0_12px_rgba(0,255,65,0.1)] transition-all duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-xs text-neon/80 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap className="w-3 h-3" />
              Navegacion
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-mono text-sm text-muted-foreground hover:text-neon transition-all duration-300 flex items-center gap-1.5 group"
                  >
                    <span className="text-neon/30 text-xs group-hover:text-neon/70 transition-colors duration-300">{">"}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="font-mono text-xs text-neon/80 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              Tech Stack
            </h4>
            <ul className="space-y-2.5">
              {techStack.map((tech) => (
                <li key={tech}>
                  <span className="font-mono text-sm text-muted-foreground flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 bg-neon/40 rounded-full inline-block group-hover:bg-neon transition-colors duration-300" />
                    {tech}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Status & terminal */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs text-neon/80 uppercase tracking-widest mb-4">
              Estado
            </h4>
            <div className="p-3 bg-terminal-bg border border-border/50 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-neon rounded-full animate-[neonPulse_2s_ease-in-out_infinite]" />
                <span className="font-mono text-xs text-neon">Disponible</span>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                Abierto a nuevas oportunidades y colaboraciones.
              </p>
            </div>
            <MiniTerminal />
            <div className="space-y-1.5">
              <a
                href="mailto:guarinromerojuandavid@gmail.com"
                className="font-mono text-xs text-muted-foreground hover:text-neon transition-colors duration-300 block"
              >
                guarinromerojuandavid@gmail.com
              </a>
              <span className="font-mono text-xs text-muted-foreground block">
                Remoto / Global
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/30">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <span className="text-neon/40">{"$"}</span>
            <span>Construido con</span>
            <Heart className="h-3 w-3 text-neon/60" />
            <span>y Next.js, TypeScript & Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">
              {new Date().getFullYear()} | Todos los derechos reservados
            </span>
            <button
              onClick={scrollToTop}
              className="p-1.5 bg-secondary/50 border border-border/50 rounded-md text-muted-foreground hover:text-neon hover:border-neon/30 hover:shadow-[0_0_10px_rgba(0,255,65,0.15)] transition-all duration-300"
              aria-label="Volver arriba"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
