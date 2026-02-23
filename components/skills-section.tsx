"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { ProcessorChip } from "@/components/animated-servers"

const skills = [
  {
    category: "Frontend",
    techs: [
      {
        name: "React",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
            <ellipse cx="12" cy="12" rx="10" ry="4" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          </svg>
        ),
      },
      {
        name: "Next.js",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 15V9.5l7 8.25h-2L10.5 12v5h-1.5zm5.5-8h-1.5v5.25l1.5 1.75V9z" />
          </svg>
        ),
      },
      {
        name: "TypeScript",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="2" opacity="0.15" />
            <text x="12" y="17" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="monospace">TS</text>
          </svg>
        ),
      },
      {
        name: "JavaScript",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="2" opacity="0.15" />
            <text x="12" y="17" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="monospace">JS</text>
          </svg>
        ),
      },
      {
        name: "Tailwind CSS",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.99 1 2.13 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.61 7.15 14.47 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C8.39 16.85 9.53 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C10.61 13.15 9.47 12 7 12z" />
          </svg>
        ),
      },
      {
        name: "HTML/CSS",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <path d="M4 2l1.5 17L12 22l6.5-3L20 2H4zm12.45 6H9l.25 2.5h6.95l-.75 8.5L12 20.25 8.55 19l-.35-4h2.35l.15 2 1.3.45 1.3-.45.2-2.5H8.1L7.5 6.5h9l-.05 1.5z" />
          </svg>
        ),
      },
    ],
  },
  {
    category: "Backend",
    techs: [
      {
        name: "Node.js",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <path d="M12 2l-1 .5L4 6.5v11l1 .5 7 4 1 .5 1-.5 7-4 1-.5v-11l-1-.5-7-4-1-.5zm0 2.15L18 8v8l-6 3.45L6 16V8l6-3.85z" />
            <text x="12" y="15" textAnchor="middle" fontSize="6" fontWeight="bold" fontFamily="monospace">N</text>
          </svg>
        ),
      },
      {
        name: "NestJS",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c.83 0 1.5.67 1.5 1.5 0 .16-.03.31-.07.46.88.36 1.6.99 2.07 1.79.14-.03.28-.05.43-.05A1.5 1.5 0 0117.43 10a1.49 1.49 0 01-.67 1.24c.15.56.24 1.15.24 1.76 0 3.87-3.13 7-7 7s-7-3.13-7-7c0-3.52 2.6-6.44 5.98-6.93A1.5 1.5 0 0112 5z" />
          </svg>
        ),
      },
      {
        name: "Express",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="2" opacity="0.15" />
            <text x="12" y="17" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="monospace">Ex</text>
          </svg>
        ),
      },
      {
        name: "REST APIs",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            <circle cx="8" cy="6" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="16" cy="18" r="1.5" fill="currentColor" />
          </svg>
        ),
      },
      {
        name: "GraphQL",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="12" cy="2" r="1.5" />
            <circle cx="22" cy="7" r="1.5" />
            <circle cx="22" cy="17" r="1.5" />
            <circle cx="12" cy="22" r="1.5" />
            <circle cx="2" cy="17" r="1.5" />
            <circle cx="2" cy="7" r="1.5" />
          </svg>
        ),
      },
      {
        name: "WebSockets",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12c0 0 2-4 4-4s4 8 8 8 4-4 4-4" strokeLinecap="round" />
            <path d="M4 12c0 0 2 4 4 4s4-8 8-8 4 4 4 4" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
  {
    category: "Bases de Datos",
    techs: [
      {
        name: "PostgreSQL",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <ellipse cx="12" cy="6" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        name: "MySQL",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <ellipse cx="12" cy="7" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 7v10c0 1.66 3.58 3 8 3s8-1.34 8-3V7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="12" y1="10" x2="12" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          </svg>
        ),
      },
      {
        name: "Redis",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1" />
            <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="1" />
            <circle cx="7" cy="6" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="17" cy="18" r="1" />
          </svg>
        ),
      },
      {
        name: "Prisma ORM",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5L17.5 8 12 11.5 6.5 8 12 4.5z" opacity="0.8" />
          </svg>
        ),
      },
      {
        name: "TypeORM",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="2" opacity="0.15" />
            <text x="12" y="17" textAnchor="middle" fontSize="8" fontWeight="bold" fontFamily="monospace">TO</text>
          </svg>
        ),
      },
    ],
  },
  {
    category: "DevOps & Herramientas",
    techs: [
      {
        name: "Docker",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <rect x="2" y="10" width="4" height="3" rx="0.5" opacity="0.5" />
            <rect x="7" y="10" width="4" height="3" rx="0.5" opacity="0.5" />
            <rect x="12" y="10" width="4" height="3" rx="0.5" opacity="0.5" />
            <rect x="7" y="6" width="4" height="3" rx="0.5" opacity="0.5" />
            <rect x="12" y="6" width="4" height="3" rx="0.5" opacity="0.5" />
            <rect x="17" y="10" width="4" height="3" rx="0.5" opacity="0.5" />
            <path d="M1 14c1 4 5 6 11 6s10-2 12-5c-1.5-1-3-.8-4.5 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        name: "GitHub",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        ),
      },
      {
        name: "Git",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <circle cx="7" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="17" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="7" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="7" y1="9" x2="7" y2="15" stroke="currentColor" strokeWidth="1.5" />
            <path d="M15 7H12c-1.1 0-2 .9-2 2v2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        name: "CI/CD",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v4m0 10v4M3 12h4m10 0h4" strokeLinecap="round" />
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        ),
      },
      {
        name: "Linux",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <path d="M12 2c-2 0-4 2-4 5v4c-2 1-3 3-3 4 0 2 2 3 3 3h8c1 0 3-1 3-3 0-1-1-3-3-4V7c0-3-2-5-4-5z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="10" cy="8" r="1" />
            <circle cx="14" cy="8" r="1" />
            <path d="M10 11h4" strokeLinecap="round" stroke="currentColor" strokeWidth="1" />
          </svg>
        ),
      },
      {
        name: "Vercel",
        icon: (
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
            <path d="M12 3L2 20h20L12 3z" />
          </svg>
        ),
      },
    ],
  },
]

export function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })

  return (
    <section id="skills" className="relative py-24 px-6 overflow-hidden" ref={ref}>
      {/* Decorative processor chips */}
      <div className="absolute top-12 right-6 opacity-20 hidden xl:block animate-float" aria-hidden="true">
        <ProcessorChip size="sm" delay={200} />
      </div>
      <div className="absolute bottom-16 left-6 opacity-15 hidden xl:block animate-float [animation-delay:1.2s]" aria-hidden="true">
        <ProcessorChip size="sm" delay={800} />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="flex items-center gap-4 mb-16">
          <span className="font-mono text-sm text-neon">{"02."}</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Habilidades
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skills.map((group, gi) => (
            <div
              key={group.category}
              className={`bg-card border border-border rounded-lg p-6 hover:border-neon/20 transition-all duration-500 hover:shadow-[0_0_25px_rgba(0,255,65,0.04)] ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isInView ? `${gi * 150}ms` : "0ms" }}
            >
              <h3 className="font-mono text-sm text-neon mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-neon rounded-full inline-block animate-[neonPulse_3s_ease-in-out_infinite]" />
                {group.category}
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {group.techs.map((tech, ti) => (
                  <div
                    key={tech.name}
                    className="group/tech flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/30 border border-transparent hover:border-neon/20 hover:bg-neon/5 transition-all duration-300 cursor-default hover:shadow-[0_0_15px_rgba(0,255,65,0.06)]"
                    style={{
                      transitionDelay: isInView ? `${gi * 150 + ti * 60}ms` : "0ms",
                    }}
                  >
                    <div className="text-muted-foreground group-hover/tech:text-neon transition-colors duration-300 group-hover/tech:drop-shadow-[0_0_6px_rgba(0,255,65,0.4)]">
                      {tech.icon}
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground group-hover/tech:text-foreground transition-colors duration-300 text-center leading-tight">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
