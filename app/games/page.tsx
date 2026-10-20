'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Gamepad2, Keyboard, Mouse, Rocket, Sparkles, Trophy, Zap, Skull } from 'lucide-react'

const games = [
  {
    title: 'Neon Pong',
    eyebrow: 'ARCADE / 01',
    description: 'Duelo de reflejos contra la máquina. Devuelve la pelota con el ángulo adecuado y llega a siete puntos antes que tu rival.',
    href: '/games/pong',
    icon: Zap,
    accent: 'neon',
    difficulty: 'Fácil de aprender',
    controls: 'Ratón o pantalla táctil',
    preview: 'pong',
  },
  {
    title: 'Space Defender',
    eyebrow: 'SURVIVAL / 02',
    description: 'Esquiva oleadas, destruye enemigos, consigue mejoras y prepárate para enfrentarte a jefes cada vez más peligrosos.',
    href: '/games/space-defender',
    icon: Rocket,
    accent: 'red',
    difficulty: 'Desafío progresivo',
    controls: 'Ratón o pantalla táctil',
    preview: 'space',
  },
]

function GamePreview({ type }: { type: 'pong' | 'space' }) {
  if (type === 'pong') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#070c12]">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(0,255,65,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,.12) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute left-1/2 top-0 h-full border-l border-dashed border-neon/30" />
        <div className="absolute left-[10%] top-[32%] h-[36%] w-2 rounded-full bg-neon shadow-[0_0_18px_rgba(0,255,65,.8)]" />
        <div className="absolute right-[10%] top-[23%] h-[30%] w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.8)]" />
        <div className="absolute left-[53%] top-[42%] h-3 w-3 animate-[float_1.8s_ease-in-out_infinite] rounded-full bg-white shadow-[0_0_22px_rgba(255,255,255,.9)]" />
        <div className="absolute bottom-0 h-20 w-full bg-gradient-to-t from-neon/10 to-transparent" />
        <span className="absolute left-1/2 top-4 -translate-x-1/2 font-mono text-xs tracking-[0.4em] text-neon/50">01 : 07</span>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#08070d]">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,.16), transparent 45%), radial-gradient(1px 1px at 20% 20%, white 100%, transparent), radial-gradient(1px 1px at 80% 30%, white 100%, transparent), radial-gradient(1px 1px at 60% 70%, white 100%, transparent), radial-gradient(1px 1px at 30% 80%, white 100%, transparent)' }} />
      <div className="absolute left-[48%] top-[20%] h-5 w-5 animate-pulse rounded-full bg-red-500/80 shadow-[0_0_24px_rgba(239,68,68,.9)]" />
      <div className="absolute right-[23%] top-[35%] h-3 w-3 rounded-full bg-orange-400/80" />
      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2">
        <Rocket className="h-12 w-12 -rotate-45 text-neon drop-shadow-[0_0_18px_rgba(0,255,65,.7)]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-red-500/10 to-transparent" />
      <span className="absolute left-5 top-4 font-mono text-[10px] tracking-[0.25em] text-red-300/60">THREAT DETECTED</span>
    </div>
  )
}

export default function GamesPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 opacity-[0.035]" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(rgba(0,255,65,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,.7) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <header className="relative z-10 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-neon">
            <ArrowLeft className="h-4 w-4" /> Volver al portafolio
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-neon/20 bg-neon/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-neon">
            <Gamepad2 className="h-3.5 w-3.5" /> Arcade personal
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-20">
        <section className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon">// Una pausa entre líneas de código</p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">Pequeños juegos, <span className="text-neon">grandes reflejos.</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Dos experiencias arcade creadas para jugar un rato, competir contra tus propios resultados y explorar otra parte de mi lado creativo. Funcionan con teclado, ratón y controles táctiles.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-2"><Keyboard className="h-3.5 w-3.5 text-neon" /> Teclado</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-2"><Mouse className="h-3.5 w-3.5 text-neon" /> Ratón</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-2"><Sparkles className="h-3.5 w-3.5 text-neon" /> Pantalla táctil</span>
          </div>
        </section>

        <section aria-label="Catálogo de juegos" className="grid gap-6 lg:grid-cols-2">
          {games.map(({ title, eyebrow, description, href, icon: Icon, difficulty, controls, preview }, index) => (
            <article key={href} className="group overflow-hidden rounded-2xl border border-border bg-card/70 transition-all duration-500 hover:-translate-y-1 hover:border-neon/35 hover:shadow-[0_22px_70px_rgba(0,255,65,.07)]">
              <div className="relative h-52 sm:h-64">
                <GamePreview type={preview as 'pong' | 'space'} />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <span className="absolute bottom-4 left-5 rounded-md border border-white/10 bg-black/50 px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-white/75 backdrop-blur">{eyebrow}</span>
                <span className="absolute right-5 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 backdrop-blur">
                  <Icon className="h-5 w-5 text-neon" />
                </span>
              </div>
              <div className="p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Experiencia {String(index + 1).padStart(2, '0')}</p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-neon">{title}</h2>
                  </div>
                  <span className="rounded-full border border-neon/20 bg-neon/5 px-3 py-1.5 text-xs text-neon">{difficulty}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
                <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-neon/80" /> {controls}</div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link href={href} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-neon px-4 py-3 font-mono text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_8px_28px_rgba(0,255,65,.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                    Jugar ahora <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  {title === 'Space Defender' && (
                    <Link href="/games/space-defender?level=20" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/5 px-4 py-3 font-mono text-xs font-semibold text-red-300 transition-all hover:border-red-400 hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                      <Skull className="h-4 w-4" /> Ver jefe final · Nivel 20
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="mt-8 flex flex-col gap-4 rounded-xl border border-border/70 bg-card/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-neon" />
            <div>
              <h2 className="font-semibold text-foreground">Tu reto empieza aquí</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Prueba ambos juegos, supera tu mejor puntuación y cuéntame cuál te gustó más.</p>
            </div>
          </div>
          <Link href="/#contact" className="inline-flex shrink-0 items-center gap-2 font-mono text-sm text-neon transition-colors hover:text-foreground">Enviar comentario <ArrowUpRight className="h-4 w-4" /></Link>
        </aside>
      </main>
    </div>
  )
}
