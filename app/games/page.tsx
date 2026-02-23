'use client'

import Link from 'next/link'
import { Gamepad2, Zap, ArrowLeft, Monitor } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function GamesPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [stars, setStars] = useState<{ left: string; top: string; animationDelay: string }[]>([])
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Generate stars only on client to avoid hydration mismatch
    const generatedStars = [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
    }))
    setStars(generatedStars)
  }, [])

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Monitor className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Solo para Computadora
          </h1>
          <p className="text-muted-foreground mb-8">
            Los juegos están diseñados para jugarse en una computadora de escritorio con mouse y teclado.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neon text-black font-mono rounded-md hover:bg-neon/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al portafolio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-neon transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Volver al portafolio</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/20 rounded-full mb-6">
            <Gamepad2 className="h-4 w-4 text-neon" />
            <span className="font-mono text-sm text-neon">Arcade Collection</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Elige tu <span className="text-neon">aventura</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Dos juegos clásicos reinventados con estética neon terminal. 
            ¿Listo para el desafío?
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Neon Pong */}
          <Link href="/games/pong" className="group">
            <div className="relative bg-card border border-border rounded-xl overflow-hidden hover:border-neon/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,255,65,0.15)]">
              {/* Game Preview */}
              <div className="relative h-48 bg-terminal-bg overflow-hidden">
                {/* Pong Preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full max-w-[200px]">
                    {/* Center line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-neon/20 -translate-x-1/2" />
                    {/* Player paddle */}
                    <div className="absolute left-4 bottom-8 w-2 h-16 bg-neon rounded-sm animate-pulse" />
                    {/* AI paddle */}
                    <div className="absolute right-4 top-8 w-2 h-16 bg-neon/50 rounded-sm" />
                    {/* Ball */}
                    <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-neon rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping" />
                  </div>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-neon/5 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-neon" />
                  <h2 className="text-xl font-bold text-foreground group-hover:text-neon transition-colors">
                    Neon Pong
                  </h2>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  El clásico juego de mesa ahora en versión neon. 
                  Juega contra la computadora en este adictivo juego de reflejos.
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-neon rounded-full" />
                    1 jugador
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-neon/50 rounded-full" />
                    Dificultad media
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Space Defender */}
          <Link href="/games/space-defender" className="group">
            <div className="relative bg-card border border-border rounded-xl overflow-hidden hover:border-neon/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,255,65,0.15)]">
              {/* Game Preview */}
              <div className="relative h-48 bg-terminal-bg overflow-hidden">
                {/* Space Preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Stars */}
                  <div className="absolute inset-0">
                    {stars.map((star, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                          left: star.left,
                          top: star.top,
                          animationDelay: star.animationDelay,
                        }}
                      />
                    ))}
                  </div>
                  {/* Ship */}
                  <div className="relative -mt-8">
                    <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-neon" />
                    <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-3 h-4 bg-neon/50 rounded-sm" />
                  </div>
                  {/* Enemies */}
                  <div className="absolute top-4 left-8 w-4 h-4 bg-red-500/70 rounded-full" />
                  <div className="absolute top-8 right-12 w-3 h-3 bg-red-500/50 rounded-full" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-red-500" />
                  <h2 className="text-xl font-bold text-foreground group-hover:text-red-500 transition-colors">
                    Space Defender
                  </h2>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Defiende tu nave de oleadas de asteroides y naves enemigas. 
                  ¡Supervivencia extrema en el espacio!
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    1 jugador
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                    Dificultad alta
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Instructions */}
        <div className="mt-16 p-6 bg-card border border-border rounded-xl max-w-2xl mx-auto">
          <h3 className="font-mono text-sm text-neon mb-4">Cómo jugar</h3>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex items-start gap-2">
              <span className="text-neon">›</span>
              <span>Usa el <strong>mouse</strong> para mover tu paleta/nave</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon">›</span>
              <span>En Pong, la paleta sigue el movimiento vertical del mouse</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon">›</span>
              <span>En Space Defender, la nave sigue el movimiento horizontal</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neon">›</span>
              <span>Presiona <strong>ESPACIO</strong> o haz clic para iniciar/pausar</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
