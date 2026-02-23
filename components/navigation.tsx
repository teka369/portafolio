"use client"

import { useState, useEffect } from "react"
import { Terminal, Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

const navItems = [
  { label: "Inicio", href: "#hero" },
  { label: "Sobre mi", href: "#about" },
  { label: "Habilidades", href: "#skills" },
  { label: "Servidores", href: "#servers" },
  { label: "Proyectos", href: "#projects" },
  { label: "API", href: "#api-playground" },
  { label: "Contacto", href: "#contact" },
]

const desktopOnlyItems = [
  { label: "Juegos", href: "/games" },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-neon/10"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <a href="#hero" className="flex items-center gap-2 group" aria-label="Ir al inicio">
          <Terminal className="h-5 w-5 text-neon transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.6)]" />
          <span className="font-mono text-sm text-neon tracking-wider font-semibold">
            {"~/dev"}
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-mono text-sm text-muted-foreground hover:text-neon transition-colors duration-300 relative group"
              >
                <span className="text-neon/60 mr-1">{">"}</span>
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-neon transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
          {desktopOnlyItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-mono text-sm text-muted-foreground hover:text-neon transition-colors duration-300 relative group"
              >
                <span className="text-neon/60 mr-1">{">"}</span>
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-neon transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-neon"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="hidden md:flex items-center justify-center w-9 h-9 rounded-md border border-border bg-secondary/50 text-muted-foreground hover:text-neon hover:border-neon/30 transition-all duration-300"
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {mounted && (
            theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )
          )}
        </button>
      </nav>

      {/* Mobile nav - NO games link */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-neon/10">
          <ul className="flex flex-col px-6 py-4 gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="font-mono text-sm text-muted-foreground hover:text-neon transition-colors duration-300 block"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-neon/60 mr-2">{"$"}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Theme toggle for mobile */}
          <div className="px-6 pb-4">
            <button
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark')
                setMobileOpen(false)
              }}
              className="flex items-center gap-2 w-full px-4 py-2.5 border border-border rounded-md text-muted-foreground hover:text-neon hover:border-neon/30 transition-all duration-300 font-mono text-sm"
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {mounted && (
                theme === 'dark' ? (
                  <><Sun className="h-4 w-4" />Modo claro</>
                ) : (
                  <><Moon className="h-4 w-4" />Modo oscuro</>
                )
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
