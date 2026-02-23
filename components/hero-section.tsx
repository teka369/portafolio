"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronDown } from "lucide-react"

interface TerminalLine {
  text: string
  type: "command" | "output" | "success" | "info" | "blank"
}

const commandSequences: TerminalLine[][] = [
  [
    { text: "$ npm run build", type: "command" },
    { text: "info  - Compiling...", type: "info" },
    { text: "info  - Compiled successfully in 2.3s", type: "success" },
    { text: "Route (app)              Size    First Load JS", type: "output" },
    { text: "/                        5.2 kB    89 kB", type: "output" },
    { text: "/api/health              0 B       79 kB", type: "output" },
    { text: "Build completado exitosamente.", type: "success" },
  ],
  [
    { text: "$ docker compose up -d", type: "command" },
    { text: "[+] Running 4/4", type: "info" },
    { text: " Container api-server     Started", type: "success" },
    { text: " Container postgres-db    Started", type: "success" },
    { text: " Container redis-cache    Started", type: "success" },
    { text: " Container nginx-proxy    Started", type: "success" },
    { text: "Todos los servicios activos.", type: "success" },
  ],
  [
    { text: "$ node server.js", type: "command" },
    { text: "Cargando variables de entorno...", type: "info" },
    { text: "Conectando a PostgreSQL... OK", type: "success" },
    { text: "Conectando a Redis... OK", type: "success" },
    { text: "Registrando rutas API...", type: "info" },
    { text: "POST   /api/auth/login", type: "output" },
    { text: "GET    /api/users/:id", type: "output" },
    { text: "GET    /api/health", type: "output" },
    { text: "Servidor escuchando en puerto 3000", type: "success" },
  ],
  [
    { text: "$ git push origin main", type: "command" },
    { text: "Enumerating objects: 15, done.", type: "info" },
    { text: "Counting objects: 100% (15/15), done.", type: "info" },
    { text: "Writing objects: 100% (10/10), 4.2 KiB", type: "output" },
    { text: "remote: Deploying to production...", type: "info" },
    { text: "remote: Build exitoso.", type: "success" },
    { text: "remote: https://mi-app.vercel.app", type: "success" },
    { text: "Deploy completado.", type: "success" },
  ],
]

/* Animated chip / processor visual */
function ChipDecoration({ className }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`} aria-hidden="true">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20">
        {/* Chip body */}
        <div className="absolute inset-2 bg-secondary/60 border border-neon/10 rounded-sm" />
        <div className="absolute inset-3.5 bg-terminal-bg border border-neon/20 rounded-sm flex items-center justify-center">
          <div className="w-2 h-2 bg-neon/30 rounded-full animate-[neonPulse_3s_ease-in-out_infinite]" />
        </div>
        {/* Pins top */}
        {[0, 1, 2, 3].map((i) => (
          <div key={`t${i}`} className="absolute bg-neon/15 rounded-full" style={{ width: 2, height: 6, top: 0, left: `${20 + i * 18}%` }} />
        ))}
        {/* Pins bottom */}
        {[0, 1, 2, 3].map((i) => (
          <div key={`b${i}`} className="absolute bg-neon/15 rounded-full" style={{ width: 2, height: 6, bottom: 0, left: `${20 + i * 18}%` }} />
        ))}
        {/* Pins left */}
        {[0, 1, 2, 3].map((i) => (
          <div key={`l${i}`} className="absolute bg-neon/15 rounded-full" style={{ width: 6, height: 2, left: 0, top: `${20 + i * 18}%` }} />
        ))}
        {/* Pins right */}
        {[0, 1, 2, 3].map((i) => (
          <div key={`r${i}`} className="absolute bg-neon/15 rounded-full" style={{ width: 6, height: 2, right: 0, top: `${20 + i * 18}%` }} />
        ))}
      </div>
    </div>
  )
}

export function HeroSection() {
  const [showContent, setShowContent] = useState(false)
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentChar, setCurrentChar] = useState("")
  const [sequenceIndex, setSequenceIndex] = useState(0)

  const runSequence = useCallback((seqIdx: number) => {
    const sequence = commandSequences[seqIdx % commandSequences.length]
    let lineIdx = 0
    setIsTyping(true)

    const typeCommand = (line: TerminalLine) => {
      return new Promise<void>((resolve) => {
        if (line.type === "command") {
          let charIdx = 0
          const typeInterval = setInterval(() => {
            setCurrentChar(line.text.substring(0, charIdx + 1))
            charIdx++
            if (charIdx >= line.text.length) {
              clearInterval(typeInterval)
              setCurrentChar("")
              setTerminalLines((prev) => [...prev, line])
              setTimeout(resolve, 200)
            }
          }, 40)
        } else {
          setTimeout(() => {
            setTerminalLines((prev) => [...prev, line])
            resolve()
          }, line.type === "blank" ? 100 : 300)
        }
      })
    }

    const runNext = async () => {
      if (lineIdx < sequence.length) {
        await typeCommand(sequence[lineIdx])
        lineIdx++
        runNext()
      } else {
        setIsTyping(false)
        setTimeout(() => {
          setTerminalLines([])
          setSequenceIndex((prev) => prev + 1)
        }, 3000)
      }
    }

    runNext()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (showContent) {
      const delay = setTimeout(() => {
        runSequence(sequenceIndex)
      }, 600)
      return () => clearTimeout(delay)
    }
  }, [showContent, sequenceIndex, runSequence])

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command": return "text-foreground"
      case "output": return "text-muted-foreground"
      case "success": return "text-neon"
      case "info": return "text-[#e5c07b]"
      default: return "text-foreground"
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 animate-grid-pulse"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,65,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.05) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,255,65,0.08) 0%, transparent 70%)" }} aria-hidden="true" />

      {/* Chip decorations */}
      <ChipDecoration className="top-[12%] left-[5%] opacity-40 hidden lg:block animate-float" />
      <ChipDecoration className="top-[18%] right-[7%] opacity-30 hidden lg:block animate-float [animation-delay:1.5s]" />
      <ChipDecoration className="bottom-[15%] left-[8%] opacity-25 hidden xl:block animate-float [animation-delay:0.8s]" />

      {/* Circuit trace decoration */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none hidden lg:block" aria-hidden="true">
        <line x1="0" y1="200" x2="200" y2="200" stroke="#00ff41" strokeWidth="1" />
        <line x1="200" y1="200" x2="200" y2="400" stroke="#00ff41" strokeWidth="1" />
        <line x1="200" y1="400" x2="500" y2="400" stroke="#00ff41" strokeWidth="1" />
        <circle cx="200" cy="200" r="3" fill="#00ff41" />
        <circle cx="200" cy="400" r="3" fill="#00ff41" />
        <circle cx="500" cy="400" r="3" fill="#00ff41" />
        <line x1="100%" y1="150" x2="calc(100% - 200px)" y2="150" stroke="#00ff41" strokeWidth="1" />
        <line x1="calc(100% - 200px)" y1="150" x2="calc(100% - 200px)" y2="350" stroke="#00ff41" strokeWidth="1" />
      </svg>

      {/* Fullstack Developer subtitle */}
      <div className={`relative z-10 text-center mb-2 transition-all duration-700 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}>
        <p className="font-mono text-sm text-neon tracking-[0.3em] uppercase">
          {"// Fullstack Developer"}
        </p>
      </div>

      {/* Title: Construyo el Backend del futuro */}
      <div className={`relative z-10 text-center transition-all duration-1000 delay-100 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight text-balance">
          Construyo el
          <span className="block text-neon animate-neon-pulse mt-1">Backend</span>
          Profesional
        </h1>
      </div>

      {/* Terminal window - directly below the title */}
      <div className={`relative z-10 w-full max-w-2xl mt-8 mb-6 transition-all duration-1000 delay-300 ${showContent ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
        <div className="bg-terminal-bg border border-border rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,255,65,0.06)] hover:shadow-[0_0_60px_rgba(0,255,65,0.1)] transition-shadow duration-700">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-secondary/40">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-neon/70" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">terminal@portfolio ~ %</span>
            <div className="flex-1" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-neon rounded-full animate-[neonPulse_2s_ease-in-out_infinite]" />
              <span className="font-mono text-[10px] text-neon/60">LIVE</span>
            </div>
          </div>
          {/* Terminal body */}
          <div className="px-4 py-4 font-mono text-sm space-y-0.5 min-h-[200px] max-h-[260px] overflow-hidden">
            {terminalLines.map((line, i) => (
              <div key={`${sequenceIndex}-${i}`} className={`flex items-center ${getLineColor(line.type)} animate-fade-in-up`} style={{ animationDelay: `${i * 30}ms`, animationDuration: "0.25s" }}>
                <span>{line.text}</span>
              </div>
            ))}
            {currentChar && (
              <div className="flex items-center text-foreground">
                <span>{currentChar}</span>
                <span className="ml-0.5 w-2 h-4 bg-neon animate-terminal-blink inline-block" />
              </div>
            )}
            {!isTyping && !currentChar && terminalLines.length === 0 && (
              <div className="flex items-center text-muted-foreground">
                <span>$ </span>
                <span className="ml-0.5 w-2 h-4 bg-neon animate-terminal-blink inline-block" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description text - below terminal */}
      <div className={`relative z-10 text-center transition-all duration-1000 delay-500 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Desarrollador fullstack apasionado por JavaScript, arquitectura de servidores y sistemas
          escalables. Transformo ideas en aplicaciones robustas y de alto rendimiento.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="#projects" className="inline-flex items-center gap-2 px-6 py-3 bg-neon text-primary-foreground font-mono text-sm font-semibold rounded-md hover:bg-neon-dim transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]">
            {">"} Ver proyectos
          </a>
          <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 border border-neon/30 text-neon font-mono text-sm font-semibold rounded-md hover:bg-neon/10 transition-all duration-300">
            Contacto
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a href="#about" aria-label="Desplazar hacia abajo" className="block animate-float">
          <ChevronDown className="h-6 w-6 text-neon/50" />
        </a>
      </div>
    </section>
  )
}
