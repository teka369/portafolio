'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, Volume2, VolumeX, Trophy } from 'lucide-react'

interface GameState {
  playerY: number
  aiY: number
  ballX: number
  ballY: number
  ballVX: number
  ballVY: number
  playerScore: number
  aiScore: number
  isRunning: boolean
  isPaused: boolean
  isGameOver: boolean
  winner: 'player' | 'ai' | null
  difficulty: number
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 500
const PADDLE_WIDTH = 15
const PADDLE_HEIGHT = 100
const BALL_SIZE = 12
const WINNING_SCORE = 7

export default function PongPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)
  const gameStateRef = useRef<GameState>({
    playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballVX: 5,
    ballVY: 2,
    playerScore: 0,
    aiScore: 0,
    isRunning: false,
    isPaused: false,
    isGameOver: false,
    winner: null,
    difficulty: 1,
  })
  const [, forceUpdate] = useState(0)

  const resetBall = useCallback((direction: 1 | -1 = 1) => {
    const state = gameStateRef.current
    state.ballX = CANVAS_WIDTH / 2
    state.ballY = CANVAS_HEIGHT / 2
    state.ballVX = direction * (5 + Math.random() * 2)
    state.ballVY = (Math.random() - 0.5) * 6
  }, [])

  const startGame = useCallback(() => {
    const state = gameStateRef.current
    state.isRunning = true
    state.isPaused = false
    state.isGameOver = false
    state.winner = null
    state.playerScore = 0
    state.aiScore = 0
    state.difficulty = 1
    state.playerY = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2
    state.aiY = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2
    resetBall(1)
    forceUpdate(n => n + 1)
  }, [resetBall])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleY = CANVAS_HEIGHT / rect.height
    const mouseY = (e.clientY - rect.top) * scaleY

    gameStateRef.current.playerY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, mouseY - PADDLE_HEIGHT / 2))
    forceUpdate(n => n + 1)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleY = CANVAS_HEIGHT / rect.height
    const touchY = (e.touches[0].clientY - rect.top) * scaleY

    gameStateRef.current.playerY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, touchY - PADDLE_HEIGHT / 2))
    forceUpdate(n => n + 1)
  }, [])

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let lastTime = performance.now()

    const gameLoop = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time

      const state = gameStateRef.current

      if (state.isRunning && !state.isPaused && !state.isGameOver) {
        // Update ball position
        state.ballX += state.ballVX
        state.ballY += state.ballVY

        // Ball collision with top/bottom walls
        if (state.ballY <= 0 || state.ballY >= CANVAS_HEIGHT - BALL_SIZE) {
          state.ballVY = -state.ballVY
          state.ballY = state.ballY <= 0 ? 0 : CANVAS_HEIGHT - BALL_SIZE
        }

        // Ball collision with player paddle
        if (
          state.ballX <= PADDLE_WIDTH + 10 &&
          state.ballY + BALL_SIZE >= state.playerY &&
          state.ballY <= state.playerY + PADDLE_HEIGHT
        ) {
          state.ballVX = Math.abs(state.ballVX) * 1.05
          const hitPos = (state.ballY - state.playerY) / PADDLE_HEIGHT
          state.ballVY = (hitPos - 0.5) * 8
          state.ballX = PADDLE_WIDTH + 10
          state.difficulty = Math.min(state.difficulty + 0.02, 2)
        }

        // Ball collision with AI paddle
        if (
          state.ballX >= CANVAS_WIDTH - PADDLE_WIDTH - 10 - BALL_SIZE &&
          state.ballY + BALL_SIZE >= state.aiY &&
          state.ballY <= state.aiY + PADDLE_HEIGHT
        ) {
          state.ballVX = -Math.abs(state.ballVX) * 1.05
          const hitPos = (state.ballY - state.aiY) / PADDLE_HEIGHT
          state.ballVY = (hitPos - 0.5) * 8
          state.ballX = CANVAS_WIDTH - PADDLE_WIDTH - 10 - BALL_SIZE
        }

        // Ball out of bounds - score
        if (state.ballX < 0) {
          state.aiScore++
          if (state.aiScore >= WINNING_SCORE) {
            state.isGameOver = true
            state.winner = 'ai'
            state.isRunning = false
          } else {
            resetBall(1)
          }
        }
        if (state.ballX > CANVAS_WIDTH) {
          state.playerScore++
          if (state.playerScore >= WINNING_SCORE) {
            state.isGameOver = true
            state.winner = 'player'
            state.isRunning = false
          } else {
            resetBall(-1)
          }
        }

        // AI movement - add some imperfection
        const aiSpeed = 3 + state.difficulty * 1.5
        const aiCenter = state.aiY + PADDLE_HEIGHT / 2
        const reactionDelay = Math.random() > 0.3 // AI only reacts 70% of the time
        
        if (reactionDelay) {
          if (aiCenter < state.ballY - 15) {
            state.aiY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.aiY + aiSpeed)
          } else if (aiCenter > state.ballY + 15) {
            state.aiY = Math.max(0, state.aiY - aiSpeed)
          }
        }
      }

      // Render
      // Clear canvas with dark background
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.05)'
      ctx.lineWidth = 1
      for (let i = 0; i < CANVAS_WIDTH; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, CANVAS_HEIGHT)
        ctx.stroke()
      }
      for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(CANVAS_WIDTH, i)
        ctx.stroke()
      }

      // Draw center line
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.2)'
      ctx.setLineDash([10, 10])
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(CANVAS_WIDTH / 2, 0)
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw player paddle with glow
      ctx.shadowColor = '#00ff41'
      ctx.shadowBlur = 20
      ctx.fillStyle = '#00ff41'
      ctx.fillRect(10, state.playerY, PADDLE_WIDTH, PADDLE_HEIGHT)
      ctx.shadowBlur = 0

      // Draw AI paddle with glow
      ctx.shadowColor = 'rgba(0, 255, 65, 0.5)'
      ctx.shadowBlur = 15
      ctx.fillStyle = 'rgba(0, 255, 65, 0.5)'
      ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH - 10, state.aiY, PADDLE_WIDTH, PADDLE_HEIGHT)
      ctx.shadowBlur = 0

      // Draw ball with glow
      ctx.shadowColor = '#00ff41'
      ctx.shadowBlur = 25
      ctx.fillStyle = '#00ff41'
      ctx.beginPath()
      ctx.arc(
        state.ballX + BALL_SIZE / 2,
        state.ballY + BALL_SIZE / 2,
        BALL_SIZE / 2,
        0,
        Math.PI * 2
      )
      ctx.fill()
      ctx.shadowBlur = 0

      // Draw scores
      ctx.font = 'bold 48px monospace'
      ctx.fillStyle = 'rgba(0, 255, 65, 0.3)'
      ctx.textAlign = 'center'
      ctx.fillText(state.playerScore.toString(), CANVAS_WIDTH / 4, 60)
      ctx.fillText(state.aiScore.toString(), (CANVAS_WIDTH * 3) / 4, 60)

      // Draw "first to 7" text
      ctx.font = '14px monospace'
      ctx.fillStyle = 'rgba(0, 255, 65, 0.4)'
      ctx.fillText('FIRST TO 7', CANVAS_WIDTH / 2, 30)

      // Force re-render to update React state
      forceUpdate(n => n + 1)

      requestRef.current = requestAnimationFrame(gameLoop)
    }

    requestRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [resetBall])

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        const state = gameStateRef.current
        
        if (!state.isRunning && !state.isGameOver) {
          // Start game
          state.isRunning = true
          resetBall(1)
        } else if (state.isRunning && !state.isGameOver) {
          // Toggle pause
          state.isPaused = !state.isPaused
        } else if (state.isGameOver) {
          // Restart game
          state.isRunning = true
          state.isPaused = false
          state.isGameOver = false
          state.winner = null
          state.playerScore = 0
          state.aiScore = 0
          state.difficulty = 1
          state.playerY = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2
          state.aiY = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2
          resetBall(1)
        }
        forceUpdate(n => n + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [resetBall])

  const state = gameStateRef.current

  const state = gameStateRef.current

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link 
            href="/games"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-neon transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Volver a juegos</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            <span className="text-neon">Neon</span> Pong
          </h1>
          <p className="text-muted-foreground">
            {!state.isRunning && !state.isGameOver 
              ? 'Presiona ESPACIO o toca la pantalla para comenzar' 
              : state.isPaused 
                ? 'Juego pausado - Presiona ESPACIO para continuar'
                : state.isGameOver
                  ? `¡${state.winner === 'player' ? 'Ganaste!' : 'La computadora ganó!'} Presiona ESPACIO para jugar de nuevo`
                  : 'Mueve el ratón o desliza el dedo para controlar la paleta'
            }
          </p>
        </div>

        {/* Game Canvas */}
        <div className="relative mx-auto max-w-[800px]">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={() => {
              if (!state.isRunning) startGame()
              else if (state.isGameOver) startGame()
            }}
            className="w-full max-w-[800px] rounded-xl border border-border/50 shadow-[0_0_40px_rgba(0,255,65,0.1)] md:cursor-none"
            style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`, touchAction: "none" }}
          />

          {/* Overlay messages */}
          {!state.isRunning && !state.isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-neon flex items-center justify-center animate-pulse">
                  <span className="text-4xl">🎮</span>
                </div>
                <p className="font-mono text-neon">Presiona ESPACIO o toca la pantalla para comenzar</p>
              </div>
            </div>
          )}

          {state.isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
              <div className="text-center">
                <p className="font-mono text-2xl text-neon">⏸ PAUSA</p>
                <p className="font-mono text-sm text-muted-foreground mt-2">Presiona ESPACIO para continuar</p>
              </div>
            </div>
          )}

          {state.isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl">
              <div className="text-center">
                <Trophy className={`w-16 h-16 mx-auto mb-4 ${state.winner === 'player' ? 'text-neon' : 'text-muted-foreground'}`} />
                <p className={`font-mono text-2xl mb-2 ${state.winner === 'player' ? 'text-neon' : 'text-muted-foreground'}`}>
                  {state.winner === 'player' ? '¡VICTORIA!' : 'DERROTA'}
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  {state.playerScore} - {state.aiScore}
                </p>
                <button
                  onClick={startGame}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-neon text-primary-foreground font-mono text-sm font-semibold rounded-md hover:bg-neon-dim transition-all"
                >
                  <RotateCcw className="h-4 w-4" />
                  Jugar de nuevo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls info */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-secondary rounded text-xs">Mouse</kbd>
            <span>Mover paleta</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-secondary rounded text-xs">Espacio</kbd>
            <span>Iniciar/Pausar</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-secondary rounded text-xs">7</kbd>
            <span>Puntos para ganar</span>
          </div>
        </div>
      </main>
    </div>
  )
}
