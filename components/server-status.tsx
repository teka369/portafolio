"use client"

import { useEffect, useState } from "react"

const serverMetrics = [
  { label: "CPU", baseValue: 23, variance: 12 },
  { label: "RAM", baseValue: 45, variance: 8 },
  { label: "DISK", baseValue: 67, variance: 3 },
  { label: "NET", baseValue: 34, variance: 15 },
]

export function ServerStatus() {
  const [metrics, setMetrics] = useState(
    serverMetrics.map((m) => ({ ...m, current: m.baseValue }))
  )
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          current: Math.min(
            99,
            Math.max(5, m.baseValue + Math.floor(Math.random() * m.variance * 2 - m.variance))
          ),
        }))
      )
      setUptime((prev) => prev + 1)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden lg:block">
      <div className="bg-terminal-bg/90 backdrop-blur-sm border border-border/50 rounded-md p-3 font-mono text-[10px] min-w-[160px]">
        <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-border/30">
          <span className="w-1.5 h-1.5 bg-neon rounded-full animate-[neonPulse_2s_ease-in-out_infinite]" />
          <span className="text-neon/80 uppercase tracking-wider">Server Status</span>
        </div>
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between gap-3 mb-1">
            <span className="text-muted-foreground w-8">{m.label}</span>
            <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${m.current}%`,
                  backgroundColor: m.current > 80 ? "#ff3333" : m.current > 60 ? "#e5c07b" : "#00ff41",
                }}
              />
            </div>
            <span className="text-muted-foreground w-7 text-right">{m.current}%</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between">
          <span className="text-muted-foreground">UPTIME</span>
          <span className="text-neon/70">{formatUptime(uptime)}</span>
        </div>
      </div>
    </div>
  )
}
