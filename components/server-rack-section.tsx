"use client"

import { useRef, useState, useCallback } from "react"
import { useInView } from "@/hooks/use-in-view"
import { AnimatedServers, ProcessorChip } from "@/components/animated-servers"
import { Server, Activity, Wifi, Cpu, Power, RotateCcw, Play, Square, CheckCircle, XCircle, Clock } from "lucide-react"

interface ServerStatus {
  label: string
  role: string
  status: "online" | "offline" | "starting" | "error"
}

export function ServerRackSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })
  const [servers, setServers] = useState<ServerStatus[]>([
    { label: "API Server", role: "primary", status: "online" },
    { label: "DB Primary", role: "database", status: "online" },
    { label: "Cache Layer", role: "cache", status: "online" },
    { label: "Worker Node", role: "worker", status: "online" },
    { label: "Load Balancer", role: "network", status: "online" },
    { label: "Auth Service", role: "auth", status: "online" },
  ])

  const toggleServer = useCallback((index: number) => {
    setServers(prev => prev.map((server, i) => {
      if (i === index) {
        const newStatus = server.status === "online" ? "offline" : "starting"
        return { ...server, status: newStatus }
      }
      return server
    }))

    // Simulate status change back to online
    setTimeout(() => {
      setServers(prev => prev.map((server, i) => {
        if (i === index && server.status !== "online") {
          return { ...server, status: "online" }
        }
        return server
      }))
    }, 2000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-neon bg-neon/10 border-neon/30"
      case "offline": return "text-red-500 bg-red-500/10 border-red-500/30"
      case "starting": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30"
      case "error": return "text-red-500 bg-red-500/10 border-red-500/30"
      default: return "text-muted-foreground bg-muted/10 border-muted-foreground/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <CheckCircle className="h-3 w-3" />
      case "offline": return <XCircle className="h-3 w-3" />
      case "starting": return <Clock className="h-3 w-3" />
      case "error": return <XCircle className="h-3 w-3" />
      default: return <Activity className="h-3 w-3" />
    }
  }

  const restartAll = useCallback(() => {
    setServers(prev => prev.map(server => ({ ...server, status: "starting" })))
    setTimeout(() => {
      setServers(prev => prev.map(server => ({ ...server, status: "online" })))
    }, 3000)
  }, [])

  const turnOffAll = useCallback(() => {
    setServers(prev => prev.map(server => ({ ...server, status: "offline" })))
  }, [])

  const turnOnAll = useCallback(() => {
    setServers(prev => prev.map(server => ({ ...server, status: "starting" })))
    setTimeout(() => {
      setServers(prev => prev.map(server => ({ ...server, status: "online" })))
    }, 2000)
  }, [])

  return (
    <section id="servers" className="relative py-24 px-6 overflow-hidden" ref={ref}>
      {/* Background circuit traces */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" aria-hidden="true">
        <svg className="w-full h-full">
          <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#00ff41" strokeWidth="1" strokeDasharray="4 8" />
          <line x1="90%" y1="0" x2="90%" y2="100%" stroke="#00ff41" strokeWidth="1" strokeDasharray="4 8" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#00ff41" strokeWidth="1" strokeDasharray="4 8" />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl relative">
        {/* Section heading */}
        <div className={`text-center mb-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="font-mono text-sm text-neon mb-3">{"// Infraestructura"}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">Entorno de Servidores</h2>
          <p className="mt-4 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Simulacion en vivo de un entorno de servidores interactivo. 
            Controla los servicios y observa cómo afectan al sistema.
          </p>
        </div>

        {/* Control buttons */}
        <div className={`flex items-center justify-center gap-3 mb-8 transition-all duration-700 ${isInView ? "opacity-100" : "opacity-0"}`}>
          <button
            onClick={turnOnAll}
            className="flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/30 text-neon rounded-md font-mono text-xs hover:bg-neon/20 transition-all duration-300"
          >
            <Play className="h-3 w-3" />
            Iniciar Todos
          </button>
          <button
            onClick={restartAll}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-md font-mono text-xs hover:bg-yellow-500/20 transition-all duration-300"
          >
            <RotateCcw className="h-3 w-3" />
            Reiniciar
          </button>
          <button
            onClick={turnOffAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-md font-mono text-xs hover:bg-red-500/20 transition-all duration-300"
          >
            <Square className="h-3 w-3" />
            Apagar Todo
          </button>
        </div>

        {/* Processor chips row */}
        <div className={`flex items-center justify-center gap-8 sm:gap-12 lg:gap-16 mb-14 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="hidden sm:block">
            <ProcessorChip size="sm" delay={0} />
          </div>
          <ProcessorChip size="lg" delay={400} />
          <ProcessorChip size="md" delay={200} />
          <div className="hidden sm:block">
            <ProcessorChip size="sm" delay={600} />
          </div>
        </div>

        {/* Architecture label */}
        <div className={`flex items-center justify-center gap-3 mb-8 transition-all duration-700 delay-300 ${isInView ? "opacity-100" : "opacity-0"}`}>
          <div className="h-px flex-1 max-w-16 bg-neon/20" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neon/5 border border-neon/10 rounded-full">
            <Cpu className="w-3 h-3 text-neon/60" />
            <span className="font-mono text-[10px] text-neon/60 uppercase tracking-wider">Arquitectura de procesamiento</span>
          </div>
          <div className="h-px flex-1 max-w-16 bg-neon/20" />
        </div>

        <div className={`grid lg:grid-cols-3 gap-6 transition-all duration-700 delay-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Server Control Panel */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-mono text-xs text-neon">Control de Servicios</h4>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {servers.filter(s => s.status === "online").length}/{servers.length} activos
                </span>
              </div>
              
              {servers.map((server, index) => (
                <button
                  key={server.label}
                  onClick={() => toggleServer(index)}
                  className={`w-full flex items-center justify-between p-2 rounded-md border text-left transition-all duration-300 mb-2 ${
                    server.status === "online" 
                      ? "bg-neon/5 border-neon/20 hover:border-neon/40" 
                      : "bg-red-500/5 border-red-500/20 hover:border-red-500/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={server.status === "online" ? "text-neon" : "text-red-500"}>
                      {getStatusIcon(server.status)}
                    </div>
                    <span className="font-mono text-xs text-foreground">{server.label}</span>
                  </div>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${getStatusColor(server.status)}`}>
                    {server.status === "online" ? "ON" : server.status === "offline" ? "OFF" : "..."}
                  </span>
                </button>
              ))}
            </div>

            {/* Stats - now in column 1 */}
            {[
              { icon: Server, title: "Alta Disponibilidad", value: "99.9%", description: "Uptime en servicios de produccion." },
              { icon: Activity, title: "Tiempo de Respuesta", value: "<50ms", description: "Latencia promedio con cache." },
              { icon: Wifi, title: "Concurrencia", value: "10K+", description: "Conexiones simultaneas." },
            ].map((stat, i) => (
              <div
                key={stat.title}
                className="bg-card border border-border rounded-lg p-4 hover:border-neon/20 transition-all duration-500"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-neon/10 rounded-md border border-neon/20">
                    <stat.icon className="h-3 w-3 text-neon" />
                  </div>
                  <span className="font-mono text-lg font-bold text-neon">{stat.value}</span>
                </div>
                <h4 className="text-xs font-semibold text-foreground mb-1">{stat.title}</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Animated server rack - now in column 2-3 */}
          <div className="lg:col-span-2">
            <AnimatedServers />
          </div>
        </div>
      </div>
    </section>
  )
}
