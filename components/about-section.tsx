"use client"

import { useRef, useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import { ArrowDownToLine, Code2, Database, GitBranch, Server, Sparkles } from "lucide-react"
import Image from "next/image"

const focusAreas = [
  {
    icon: Server,
    number: "01",
    title: "Backend y APIs",
    description: "Diseño servicios claros, APIs bien organizadas y lógica de negocio que se pueda mantener y ampliar.",
    tags: ["Node.js", "NestJS", "REST"],
  },
  {
    icon: Database,
    number: "02",
    title: "Datos y arquitectura",
    description: "Me importa cómo se modelan los datos, cómo se relacionan las piezas y qué pasa cuando algo falla.",
    tags: ["PostgreSQL", "Prisma", "SQL"],
  },
  {
    icon: Code2,
    number: "03",
    title: "Experiencia fullstack",
    description: "Conecto interfaces cuidadas con sistemas reales, procurando que la experiencia sea rápida y sencilla.",
    tags: ["React", "Next.js", "TypeScript"],
  },
]

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.12 })
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <section id="about" className="relative scroll-mt-24 px-6 py-24 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center gap-4 sm:mb-16">
          <span className="font-mono text-sm text-neon">01 /</span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">La persona detrás del código</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Sobre mí</h2>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-neon/40 to-transparent" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div className={`transition-all duration-700 ${isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
            <div className="group relative mx-auto max-w-[340px]">
              <div className="absolute -inset-3 rounded-2xl border border-neon/20 transition-transform duration-500 group-hover:rotate-2 group-hover:border-neon/40" />
              <div className="absolute -inset-1 rounded-2xl bg-neon/10 blur-xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-card">
                {!imageFailed ? (
                  <Image
                    src="/juandavid.png"
                    alt="Retrato de Juan David"
                    fill
                    priority={false}
                    sizes="(max-width: 1024px) 80vw, 340px"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(0,255,65,0.12),transparent_68%)] p-8 text-center">
                    <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-neon/40 bg-neon/10 font-mono text-3xl font-bold text-neon">JD</div>
                    <p className="font-mono text-sm text-foreground">Tu foto va aquí</p>
                    <p className="mt-2 max-w-[220px] text-xs leading-relaxed text-muted-foreground">Añade el archivo juandavid.png dentro de la carpeta public del proyecto.</p>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/45 px-3 py-2.5 backdrop-blur-md">
                  <div>
                    <p className="text-sm font-semibold text-white">Juan David Guarin Romero</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-white/65">Desarrollo de software</p>
                  </div>
                  <Sparkles className="h-4 w-4 shrink-0 text-neon" />
                </div>
              </div>
              <div className="absolute -right-4 top-7 hidden items-center gap-2 rounded-lg border border-neon/20 bg-card/90 px-3 py-2 shadow-xl backdrop-blur sm:flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-neon" />
                <span className="font-mono text-[10px] text-muted-foreground">SIEMPRE APRENDIENDO</span>
              </div>
            </div>
            <p className="mx-auto mt-7 max-w-[340px] text-center text-xs leading-relaxed text-muted-foreground">
              Me gusta entender cómo funcionan las cosas por dentro y convertir esa curiosidad en proyectos útiles.
            </p>
          </div>

          <div className={`transition-all delay-100 duration-700 ${isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon">// Hola, soy Juan David</p>
            <h3 className="mt-4 max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
              Me interesa construir software que sea <span className="text-neon">útil, sólido y bien pensado.</span>
            </h3>
            <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
              <p>
                Disfruto trabajar en el recorrido completo de una aplicación: entender el problema, diseñar la solución, modelar los datos, desarrollar la lógica del servidor y crear una interfaz que se sienta natural al usarla.
              </p>
              <p>
                Mi mayor interés está en el backend, las APIs, las bases de datos y la arquitectura. No me conformo con que algo funcione una vez: quiero comprender por qué funciona, qué puede fallar y cómo hacerlo más fácil de mantener.
              </p>
              <p>
                Aprendo construyendo. Por eso mis proyectos son también un laboratorio para experimentar, resolver problemas reales y mejorar mis decisiones técnicas con cada iteración.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "NestJS", "PostgreSQL", "Prisma", "Git"].map((skill) => (
                <span key={skill} className="rounded-md border border-border bg-card/70 px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-neon/30 hover:text-neon">
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a href="#projects" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-neon px-5 py-3 font-mono text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,255,65,0.18)]">
                <GitBranch className="h-4 w-4" /> Explorar proyectos
              </a>
              <a href="#contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-card/50 px-5 py-3 font-mono text-sm text-foreground transition-colors hover:border-neon/40 hover:text-neon">
                Hablemos <ArrowDownToLine className="h-4 w-4 rotate-[-45deg]" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:mt-20 md:grid-cols-3">
          {focusAreas.map(({ icon: Icon, number, title, description, tags }, index) => (
            <article
              key={title}
              className={`group rounded-xl border border-border bg-card/60 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-neon/30 hover:bg-card sm:p-6 ${isInView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="font-mono text-xs text-neon/70">{number}</span>
                <div className="rounded-lg border border-neon/20 bg-neon/5 p-2.5 transition-colors group-hover:bg-neon/10">
                  <Icon className="h-5 w-5 text-neon" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-foreground">{title}</h4>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => <span key={tag} className="font-mono text-[10px] text-neon/75">{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
