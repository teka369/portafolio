"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { Server, Code, Database } from "lucide-react"

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })

  return (
    <section id="about" className="relative py-24 px-6" ref={ref}>
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="flex items-center gap-4 mb-16">
          <span className="font-mono text-sm text-neon">{"01."}</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Sobre mi</h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Bio */}
          <div
            className={`space-y-5 transition-all duration-700 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <p className="text-muted-foreground leading-relaxed">
              Soy un desarrollador fullstack con una fuerte inclinación hacia el backend y la
              arquitectura de servidores. Me especializo en construir APIs robustas, sistemas
              escalables y soluciones de alto rendimiento que impulsan aplicaciones modernas.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Mi pasión por JavaScript y su ecosistema me ha llevado a dominar tanto el frontend
              como el backend, aunque mi corazón late al ritmo de los servidores, las bases de
              datos y las arquitecturas de microservicios.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cuando no estoy programando, me encontrarás explorando nuevas tecnologías,
              contribuyendo a proyectos open source o profundizando en patrones de diseño
              y arquitectura de software.
            </p>

            {/* Terminal-style code snippet */}
            <div className="mt-6 bg-terminal-bg border border-border/50 rounded-md p-4 font-mono text-xs">
              <div className="text-muted-foreground mb-2">
                {"// stack.config.ts"}
              </div>
              <div>
                <span className="text-neon/70">const</span>{" "}
                <span className="text-foreground">developer</span>{" "}
                <span className="text-neon/70">= </span>
                <span className="text-muted-foreground">{"{"}</span>
              </div>
              <div className="pl-4">
                <span className="text-neon">nombre</span>
                <span className="text-muted-foreground">{": "}</span>
                <span className="text-[#e5c07b]">{'"Juan David Guarin Romero"'}</span>
                <span className="text-muted-foreground">,</span>
              </div>
              <div className="pl-4">
                <span className="text-neon">rol</span>
                <span className="text-muted-foreground">{": "}</span>
                <span className="text-[#e5c07b]">{'"Fullstack Developer"'}</span>
                <span className="text-muted-foreground">,</span>
              </div>
              <div className="pl-4">
                <span className="text-neon">enfoque</span>
                <span className="text-muted-foreground">{": "}</span>
                <span className="text-[#e5c07b]">{'"Backend & Servidores"'}</span>
                <span className="text-muted-foreground">,</span>
              </div>
              <div className="pl-4">
                <span className="text-neon">pasion</span>
                <span className="text-muted-foreground">{": "}</span>
                <span className="text-[#e5c07b]">{'"JavaScript Ecosystem"'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{"}"}</span>
              </div>
            </div>
          </div>

          {/* Right: Stats cards */}
          <div
            className={`space-y-4 transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {[
              {
                icon: Server,
                title: "Arquitectura Backend",
                description:
                  "Diseño e implemento APIs RESTful y GraphQL, microservicios y sistemas distribuidos con Node.js, NestJS y Express.",
              },
              {
                icon: Database,
                title: "Bases de Datos",
                description:
                  "Experto en modelado de datos, optimización de consultas y administración con PostgreSQL, MySQL y ORMs modernos.",
              },
              {
                icon: Code,
                title: "Fullstack Development",
                description:
                  "Creo interfaces modernas y responsivas con React, Next.js y TypeScript, conectadas a backends solidos.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group p-6 bg-card border border-border rounded-lg hover:border-neon/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,255,65,0.08)]"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-neon/10 rounded-md border border-neon/20 group-hover:bg-neon/15 transition-colors duration-300">
                    <card.icon className="h-5 w-5 text-neon" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
