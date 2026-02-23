"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { Braces, GitBranch, Layers, Rocket, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Alto Rendimiento",
    description: "Optimizacion constante para respuestas rapidas y baja latencia en cada endpoint.",
  },
  {
    icon: Shield,
    title: "Seguridad Primero",
    description: "Autenticacion robusta, validacion de datos y proteccion contra vulnerabilidades.",
  },
  {
    icon: Layers,
    title: "Arquitectura Limpia",
    description: "Codigo modular con separacion de responsabilidades y patrones de diseno solidos.",
  },
  {
    icon: GitBranch,
    title: "Control de Versiones",
    description: "Flujo de trabajo Git profesional con CI/CD automatizado y despliegues continuos.",
  },
  {
    icon: Braces,
    title: "TypeScript First",
    description: "Tipado estricto en todo el stack para mayor confiabilidad y mantenibilidad.",
  },
  {
    icon: Rocket,
    title: "Deploy Automatizado",
    description: "Infraestructura como codigo con Docker, pipelines y escalado automatico.",
  },
]

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })

  return (
    <section className="relative py-24 px-6" ref={ref}>
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="text-center mb-16">
          <p className="font-mono text-sm text-neon mb-3">{"// Lo que me define"}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
            Principios de Desarrollo
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative p-6 bg-card border border-border rounded-lg hover:border-neon/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,255,65,0.06)] ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isInView ? `${i * 100}ms` : "0ms" }}
            >
              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-border group-hover:border-neon/30 transition-colors duration-500 rounded-tr-lg" />

              <div className="p-2 bg-neon/10 rounded-md border border-neon/20 w-fit mb-4 group-hover:bg-neon/15 transition-colors duration-300">
                <feature.icon className="h-5 w-5 text-neon" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-neon transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
