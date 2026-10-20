"use client"

import { useRef, useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import { ExternalLink, X } from "lucide-react"
import Image from "next/image"

const projects = [
  {
    title: "Dusklight",
    description:
      "Pagina web de galeria de fotos profesional. Showcase visual con transiciones fluidas y diseño moderno adaptado para fotografia.",
    techs: ["React", "Tailwind", "TypeScript", "HTML", "CSS"],
    image: "/dusklight.png",
    live: "https://dusklight.pro",
    comingSoon: false,
  },
  {
    title: "Luxentium",
    description:
      "Pagina web empresarial para ofrecer servicios de creacion de paginas web a negocios que estan iniciando. Diseño profesional y moderno.",
    techs: ["React", "Tailwind", "TypeScript", "HTML", "CSS"],
    image: "/luxentium.png",
    live: "https://luxentium.top",
    comingSoon: false,
  },
  {
    title: "Dulce Calle",
    description:
      "PWA de gestión de ventas, inventario, clientes y fiados para dulcería de barrio. Soporte offline con sincronización automática al recuperar conexión.",
    techs: ["Next.js", "TypeScript", "Tailwind", "NestJS", "Prisma", "PostgreSQL", "Dexie"],
    image: "/dulcecalle.png",
    live: "https://dulcecalle.vercel.app",
    comingSoon: false,
  },
  {
    title: "R.E.C",
    description:
      "Refuerzo Educativo Complementario - Plataforma web para ayudar a estudiantes de multiples colegios a mejorar academicamente en sus estudios.",
    techs: ["React", "TypeScript", "NestJS", "PostgreSQL", "Prisma"],
    image: "/R.E.C-image.jpg",
    live: "https://recedu.co",
    comingSoon: true,
  },
]

export function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.05 })
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const activeProjects = projects.filter(p => !p.comingSoon)
  const comingSoonProjects = projects.filter(p => p.comingSoon)

  return (
    <section id="projects" className="relative py-24 px-6" ref={ref}>
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="flex items-center gap-4 mb-16">
          <span className="font-mono text-sm text-neon">{"03."}</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Proyectos
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Active projects - 3 in a row */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {activeProjects.map((project, i) => (
            <div
              key={project.title}
              className={`group relative bg-card border border-border rounded-lg overflow-hidden hover:border-neon/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,65,0.06)] ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isInView ? `${i * 150}ms` : "0ms" }}
            >
              {/* Project Image - clickable for lightbox */}
              <div 
                className="relative h-48 w-full overflow-hidden cursor-pointer"
                onClick={() => setLightboxImage(project.image)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                  <span className="text-white font-mono text-sm">Ver imagen</span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <h3 className="text-base font-bold text-foreground group-hover:text-neon transition-colors duration-300">
                    {project.title}
                  </h3>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neon text-primary-foreground font-mono text-xs font-semibold rounded-md hover:bg-neon-dim transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Visitar
                  </a>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.techs.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[10px] px-2 py-1 bg-neon/5 border border-neon/15 rounded-md text-neon/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon projects */}
        {comingSoonProjects.length > 0 && (
          <>
            <h3 className="font-mono text-sm text-muted-foreground text-center mb-8">
              Proximamente
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {comingSoonProjects.map((project, i) => (
                <div
                  key={project.title}
                  className={`group bg-card border border-border rounded-lg p-5 hover:border-neon/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(0,255,65,0.06)] hover:-translate-y-1 ${
                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: isInView ? `${(i + 3) * 150}ms` : "0ms" }}
                >
                  {/* Project Image - clickable for lightbox */}
                  <div 
                    className="relative h-32 w-full overflow-hidden rounded-md mb-4 cursor-pointer opacity-60"
                    onClick={() => setLightboxImage(project.image)}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="text-white font-mono text-xs">Ver imagen</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground group-hover:text-neon transition-colors duration-300">
                      {project.title}
                    </h4>
                    <span className="font-mono text-[10px] px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded">
                      Pronto
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techs.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] px-2 py-0.5 text-neon/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-neon transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={lightboxImage}
            alt="Project preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </section>
  )
}
