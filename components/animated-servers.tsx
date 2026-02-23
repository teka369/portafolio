"use client"

import { useEffect, useState, useRef } from "react"

/* ── Animated Processor Chip ── */
function ProcessorChip({ size = "md", delay = 0 }: { size?: "sm" | "md" | "lg"; delay?: number }) {
  const [load, setLoad] = useState(0)
  const [coreActive, setCoreActive] = useState([false, false, false, false])

  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(Math.floor(40 + Math.random() * 55))
      setCoreActive([Math.random() > 0.2, Math.random() > 0.3, Math.random() > 0.25, Math.random() > 0.35])
    }, 1200 + delay)
    return () => clearInterval(interval)
  }, [delay])

  const dim = size === "sm" ? "w-20 h-20" : size === "lg" ? "w-32 h-32" : "w-24 h-24"
  const pinCount = size === "sm" ? 3 : size === "lg" ? 6 : 4

  return (
    <div className={`relative ${dim} group`}>
      {/* Outer glow */}
      <div className="absolute -inset-1 bg-neon/5 rounded-md blur-sm group-hover:bg-neon/10 transition-all duration-700" />
      {/* Chip body */}
      <div className="relative w-full h-full bg-secondary/80 border border-neon/15 rounded-md overflow-hidden group-hover:border-neon/30 transition-all duration-500">
        {/* Inner die */}
        <div className="absolute inset-[18%] bg-terminal-bg border border-neon/20 rounded-sm group-hover:border-neon/40 transition-all duration-500">
          {/* 4 cores */}
          <div className="absolute inset-1 grid grid-cols-2 grid-rows-2 gap-0.5">
            {coreActive.map((active, i) => (
              <div
                key={i}
                className="rounded-sm transition-all duration-500"
                style={{
                  backgroundColor: active ? "rgba(0,255,65,0.2)" : "rgba(0,255,65,0.03)",
                  boxShadow: active ? "inset 0 0 8px rgba(0,255,65,0.3)" : "none",
                }}
              />
            ))}
          </div>
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-neon/50 animate-[neonPulse_2s_ease-in-out_infinite]" style={{ animationDelay: `${delay}ms` }} />
          </div>
        </div>
        {/* Load indicator bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
          <div className="h-full bg-neon/40 transition-all duration-700" style={{ width: `${load}%` }} />
        </div>
      </div>
      {/* Pins: top */}
      <div className="absolute -top-1.5 left-[18%] right-[18%] flex justify-around">
        {Array.from({ length: pinCount }).map((_, i) => (
          <div key={i} className="w-[2px] h-1.5 bg-neon/20 rounded-full" />
        ))}
      </div>
      {/* Pins: bottom */}
      <div className="absolute -bottom-1.5 left-[18%] right-[18%] flex justify-around">
        {Array.from({ length: pinCount }).map((_, i) => (
          <div key={i} className="w-[2px] h-1.5 bg-neon/20 rounded-full" />
        ))}
      </div>
      {/* Pins: left */}
      <div className="absolute top-[18%] bottom-[18%] -left-1.5 flex flex-col justify-around">
        {Array.from({ length: pinCount }).map((_, i) => (
          <div key={i} className="h-[2px] w-1.5 bg-neon/20 rounded-full" />
        ))}
      </div>
      {/* Pins: right */}
      <div className="absolute top-[18%] bottom-[18%] -right-1.5 flex flex-col justify-around">
        {Array.from({ length: pinCount }).map((_, i) => (
          <div key={i} className="h-[2px] w-1.5 bg-neon/20 rounded-full" />
        ))}
      </div>
      {/* Label */}
      <div className="absolute -bottom-5 left-0 right-0 text-center font-mono text-[8px] text-muted-foreground/60 group-hover:text-neon/50 transition-colors duration-300">
        {load}% load
      </div>
    </div>
  )
}

/* ── Single Server Unit ── */
function ServerUnit({ delay, label, role }: { delay: number; label: string; role: string }) {
  const [leds, setLeds] = useState([false, false, false, false])
  const [activity, setActivity] = useState(0)
  const [rxTx, setRxTx] = useState({ rx: 0, tx: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setLeds([Math.random() > 0.3, Math.random() > 0.4, Math.random() > 0.5, Math.random() > 0.6])
      setActivity(Math.random() * 100)
      setRxTx({ rx: Math.floor(Math.random() * 500), tx: Math.floor(Math.random() * 300) })
    }, 800 + delay)
    return () => clearInterval(interval)
  }, [delay])

  return (
    <div className="group relative bg-terminal-bg border border-border/60 rounded-md p-3 hover:border-neon/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,255,65,0.06)]">
      <div className="flex items-center gap-3">
        {/* LED cluster */}
        <div className="flex flex-col gap-1">
          {leds.map((on, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: on ? "#00ff41" : "#1e1e32",
                boxShadow: on ? "0 0 6px rgba(0,255,65,0.6)" : "none",
              }}
            />
          ))}
        </div>
        {/* Drive bay */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="h-2 flex-1 bg-secondary rounded-sm overflow-hidden">
              <div className="h-full bg-neon/30 rounded-sm transition-all duration-700" style={{ width: `${activity}%` }} />
            </div>
            <div className="h-2 flex-1 bg-secondary rounded-sm overflow-hidden">
              <div className="h-full bg-neon/20 rounded-sm transition-all duration-1000" style={{ width: `${(activity * 0.7 + 20) % 100}%` }} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{label}</span>
            <span className="font-mono text-[9px] text-neon/60">{activity.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-[8px] text-muted-foreground/50">RX: {rxTx.rx} KB/s</span>
            <span className="font-mono text-[8px] text-muted-foreground/50">TX: {rxTx.tx} KB/s</span>
          </div>
        </div>
        {/* Role tag */}
        <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-neon/5 border border-neon/10 rounded text-[8px] font-mono text-neon/60 shrink-0">
          {role}
        </div>
        {/* Vent */}
        <div className="grid grid-cols-3 gap-px shrink-0">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-border/50 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Data Flow Particle ── */
function DataParticle({ index, height }: { index: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let pos = -10
    const speed = 0.3 + Math.random() * 0.8
    const startDelay = index * 600 + Math.random() * 2000
    let raf: number
    let started = false

    const timeout = setTimeout(() => {
      started = true
    }, startDelay)

    const animate = () => {
      if (started && ref.current) {
        pos += speed
        if (pos > 110) pos = -10
        ref.current.style.top = `${pos}%`
        ref.current.style.opacity = pos < 0 || pos > 100 ? "0" : "0.7"
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timeout)
    }
  }, [index, height])

  return (
    <div
      ref={ref}
      className="absolute w-1 h-3 rounded-full"
      style={{
        left: `${10 + index * 22}%`,
        background: "linear-gradient(to bottom, transparent, #00ff41, transparent)",
        boxShadow: "0 0 6px rgba(0,255,65,0.5)",
        opacity: 0,
      }}
    />
  )
}

/* ── Main Component ── */
export function AnimatedServers() {
  const rackRef = useRef<HTMLDivElement>(null)
  const [rackHeight, setRackHeight] = useState(400)

  useEffect(() => {
    if (rackRef.current) setRackHeight(rackRef.current.offsetHeight)
  }, [])

  const servers = [
    { label: "API Server", delay: 0, role: "primary" },
    { label: "DB Primary", delay: 200, role: "database" },
    { label: "Cache Layer", delay: 400, role: "cache" },
    { label: "Worker Node", delay: 600, role: "worker" },
    { label: "Load Balancer", delay: 100, role: "network" },
    { label: "Auth Service", delay: 300, role: "auth" },
  ]

  return (
    <div className="relative" ref={rackRef}>
      {/* Data particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <DataParticle key={i} index={i} height={rackHeight} />
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-4 relative overflow-hidden">
        {/* Rack header */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
          <div className="w-2 h-2 bg-neon rounded-full animate-[neonPulse_2s_ease-in-out_infinite]" />
          <span className="font-mono text-xs text-neon/80 uppercase tracking-wider">Server Rack A-01</span>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-neon rounded-full" />
            <span className="font-mono text-[10px] text-muted-foreground">6/6 ONLINE</span>
          </div>
        </div>

        {/* Server units */}
        <div className="space-y-2">
          {servers.map((server) => (
            <ServerUnit key={server.label} delay={server.delay} label={server.label} role={server.role} />
          ))}
        </div>

        {/* Bottom status bar */}
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-neon rounded-full" />
              <span className="font-mono text-[10px] text-muted-foreground">Healthy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#e5c07b] rounded-full" />
              <span className="font-mono text-[10px] text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[#ff5f56] rounded-full" />
              <span className="font-mono text-[10px] text-muted-foreground">Critical</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-neon/50">Region: us-east-1</span>
        </div>

        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.01) 2px, rgba(0,255,65,0.01) 4px)" }} aria-hidden="true" />
      </div>
    </div>
  )
}

export { ProcessorChip }
