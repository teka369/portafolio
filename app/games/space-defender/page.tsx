'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, RotateCcw, Skull, Maximize2, Minimize2 } from 'lucide-react'

interface GameObject {
  x: number
  y: number
  width: number
  height: number
  vx: number
  vy: number
  type: 'asteroid' | 'basic' | 'shooter' | 'dasher' | 'boss' | 'superboss' | 'playerBullet' | 'enemyBullet' | 'powerup' | 'particle'
  health?: number
  maxHealth?: number
  color?: string
  shootTimer?: number
  phase?: string
  lifetime?: number
}

interface GameState {
  playerX: number
  targetX: number
  bullets: GameObject[]
  enemies: GameObject[]
  particles: GameObject[]
  score: number
  lives: number
  isRunning: boolean
  isPaused: boolean
  isGameOver: boolean
  isBossComing: boolean
  bossIntroText: string
  difficulty: number
  level: number
  shield: boolean
  doubleShot: boolean
  invulnerable: number
}

const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 800
const PLAYER_WIDTH = 40
const PLAYER_HEIGHT = 50

// Enemy types
const ENEMY_TYPES = [
  { type: 'basic', health: 1, speed: 2.5, size: 30, color: '#ef4444', score: 10 },
  { type: 'shooter', health: 2, speed: 1.8, size: 35, color: '#f97316', score: 20, shoots: true },
  { type: 'dasher', health: 1, speed: 5, size: 25, color: '#a855f7', score: 15 },
  { type: 'asteroid', health: 2, speed: 1.8, size: 50, color: '#6b7280', score: 5 },
  { type: 'boss', health: 15, speed: 1, size: 100, color: '#dc2626', score: 200 },
  { type: 'superboss', health: 50, speed: 0.5, size: 200, color: '#ff0000', score: 1000, isSuper: true },
]

export default function SpaceDefenderPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)
  const gameStateRef = useRef<GameState>({
    playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    targetX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    bullets: [],
    enemies: [],
    particles: [],
    score: 0,
    lives: 3,
    isRunning: false,
    isPaused: false,
    isGameOver: false,
    isBossComing: false,
    bossIntroText: '',
    difficulty: 1,
    level: 1,
    shield: false,
    doubleShot: false,
    invulnerable: 0,
  })
  const [, forceUpdate] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const lastShotRef = useRef<number>(0)
  const lastSpawnRef = useRef<number>(0)
  const lastLevelUpRef = useRef<number>(0)

  const toggleFullscreen = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    if (!document.fullscreenElement) {
      canvas.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error)
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error)
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const createParticle = (x: number, y: number, color: string): GameObject => ({
    x,
    y,
    width: Math.random() * 8 + 3,
    height: Math.random() * 8 + 3,
    vx: (Math.random() - 0.5) * 15,
    vy: (Math.random() - 0.5) * 15,
    type: 'particle',
    color,
    lifetime: 45, // frames (~0.75 seconds)
  })

  const createExplosion = useCallback((x: number, y: number, color: string, count: number = 25) => {
    const state = gameStateRef.current
    for (let i = 0; i < count; i++) {
      state.particles.push(createParticle(x, y, color))
    }
  }, [])

  const spawnEnemy = useCallback((difficulty: number, level: number, isSuperBoss: boolean = false): GameObject => {
    if (isSuperBoss) {
      const boss = ENEMY_TYPES.find(e => e.type === 'superboss')!
      return {
        x: CANVAS_WIDTH / 2,
        y: -boss.size,
        width: boss.size,
        height: boss.size,
        vx: 0,
        vy: 0.8,
        type: 'superboss',
        health: boss.health + Math.floor(difficulty * 0.5),
        maxHealth: boss.health + Math.floor(difficulty * 0.5),
        color: boss.color,
        phase: 'entering',
      }
    }

    const availableTypes = ENEMY_TYPES.filter(e => e.type !== 'boss' && e.type !== 'superboss').slice(0, 
      level < 3 ? 2 : level < 5 ? 3 : level < 8 ? 4 : 5)
    
    const useBoss = level >= 15 && level % 15 === 0 && Math.random() < 0.05
    const enemyConfig = useBoss 
      ? ENEMY_TYPES.find(e => e.type === 'boss')!
      : availableTypes[Math.floor(Math.random() * availableTypes.length)]!
    
    const baseSpeed = enemyConfig.speed + difficulty * 0.3
    
    return {
      x: Math.random() * (CANVAS_WIDTH - enemyConfig.size * 2) + enemyConfig.size,
      y: -enemyConfig.size,
      width: enemyConfig.size,
      height: enemyConfig.size,
      vx: (Math.random() - 0.5) * (enemyConfig.type === 'dasher' ? 5 : 2),
      vy: baseSpeed + Math.random() * 0.5,
      type: enemyConfig.type as GameObject['type'],
      health: enemyConfig.health + Math.floor(difficulty * 0.2),
      maxHealth: enemyConfig.health + Math.floor(difficulty * 0.2),
      color: enemyConfig.color,
      shootTimer: 0,
    }
  }, [])

  const startGame = useCallback(() => {
    const state = gameStateRef.current
    state.playerX = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2
    state.targetX = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2
    state.bullets = []
    state.enemies = []
    state.particles = []
    state.score = 0
    state.lives = 3
    state.isRunning = true
    state.isPaused = false
    state.isGameOver = false
    state.isBossComing = false
    state.bossIntroText = ''
    state.difficulty = 1
    state.level = 1
    state.shield = false
    state.doubleShot = false
    state.invulnerable = 0
    lastSpawnRef.current = 0
    lastLevelUpRef.current = 0
    forceUpdate(n => n + 1)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const mouseX = (e.clientX - rect.left) * scaleX

    gameStateRef.current.targetX = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_WIDTH, mouseX - PLAYER_WIDTH / 2))
    forceUpdate(n => n + 1)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || e.touches.length === 0) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const touchX = (e.touches[0].clientX - rect.left) * scaleX
    gameStateRef.current.targetX = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_WIDTH, touchX - PLAYER_WIDTH / 2))
  }, [])

  const shoot = useCallback((timestamp: number) => {
    const state = gameStateRef.current
    if (!state.isRunning || state.isPaused) return
    
    if (timestamp - lastShotRef.current < 120) return
    lastShotRef.current = timestamp

    const newBullets: GameObject[] = [
      {
        x: state.playerX + PLAYER_WIDTH / 2 - 4,
        y: CANVAS_HEIGHT - PLAYER_HEIGHT - 10,
        width: 8,
        height: 20,
        vx: 0,
        vy: -18,
        type: 'playerBullet',
        color: '#00ff41',
      },
    ]

    if (state.doubleShot) {
      newBullets.push(
        {
          x: state.playerX + 5,
          y: CANVAS_HEIGHT - PLAYER_HEIGHT - 5,
          width: 5,
          height: 14,
          vx: 0,
          vy: -14,
          type: 'playerBullet',
          color: '#00ff41',
        },
        {
          x: state.playerX + PLAYER_WIDTH - 10,
          y: CANVAS_HEIGHT - PLAYER_HEIGHT - 5,
          width: 5,
          height: 14,
          vx: 0,
          vy: -14,
          type: 'playerBullet',
          color: '#00ff41',
        }
      )
    }

    state.bullets.push(...newBullets)
  }, [])

  // Draw different enemy types
  const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: GameObject, time: number) => {
    ctx.shadowColor = enemy.color || '#fff'
    ctx.shadowBlur = 20
    ctx.fillStyle = enemy.color || '#fff'

    const cx = enemy.x + enemy.width / 2
    const cy = enemy.y + enemy.height / 2

    // Super Boss cinematic
    if (enemy.type === 'superboss') {
      // Outer glow
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, enemy.width)
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)')
      gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.1)')
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(cx - enemy.width, cy - enemy.height, enemy.width * 2, enemy.height * 2)
      
      // Main body - giant eye
      ctx.fillStyle = enemy.color || '#ff0000'
      ctx.beginPath()
      ctx.arc(cx, cy, enemy.width * 0.4, 0, Math.PI * 2)
      ctx.fill()
      
      // Eye ring
      ctx.strokeStyle = '#ff6600'
      ctx.lineWidth = 8
      ctx.beginPath()
      ctx.arc(cx, cy, enemy.width * 0.35, 0, Math.PI * 2)
      ctx.stroke()
      
      // Evil eye
      ctx.fillStyle = '#ffff00'
      ctx.beginPath()
      ctx.arc(cx, cy, enemy.width * 0.2, 0, Math.PI * 2)
      ctx.fill()
      
      // Pupil
      const pupilOffset = Math.sin(time * 0.002) * enemy.width * 0.1
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(cx + pupilOffset, cy, enemy.width * 0.1, 0, Math.PI * 2)
      ctx.fill()
      
      // Teeth/mouth
      ctx.fillStyle = '#fff'
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI + Math.PI
        const px = cx + Math.cos(angle) * enemy.width * 0.5
        const py = cy + Math.sin(angle) * enemy.width * 0.3 + enemy.width * 0.1
        ctx.beginPath()
        ctx.moveTo(px - 10, py)
        ctx.lineTo(px, py + 20)
        ctx.lineTo(px + 10, py)
        ctx.fill()
      }
      
      // Health bar (huge)
      const healthPercent = (enemy.health || 1) / (enemy.maxHealth || 1)
      ctx.fillStyle = '#330000'
      ctx.fillRect(cx - enemy.width * 0.6, cy - enemy.height * 0.6, enemy.width * 1.2, 15)
      ctx.fillStyle = '#ff0000'
      ctx.fillRect(cx - enemy.width * 0.6, cy - enemy.height * 0.6, enemy.width * 1.2 * healthPercent, 15)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.strokeRect(cx - enemy.width * 0.6, cy - enemy.height * 0.6, enemy.width * 1.2, 15)
      return
    }

    switch (enemy.type) {
      case 'basic':
        ctx.beginPath()
        ctx.arc(cx, cy - enemy.height * 0.15, enemy.width * 0.4, Math.PI, 0)
        ctx.lineTo(cx + enemy.width * 0.4, cy + enemy.height * 0.3)
        ctx.lineTo(cx - enemy.width * 0.4, cy + enemy.height * 0.3)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(cx - enemy.width * 0.15, cy, enemy.width * 0.12, 0, Math.PI * 2)
        ctx.arc(cx + enemy.width * 0.15, cy, enemy.width * 0.12, 0, Math.PI * 2)
        ctx.fill()
        break

      case 'shooter':
        ctx.beginPath()
        ctx.arc(cx, cy, enemy.width * 0.4, 0, Math.PI * 2)
        ctx.fill()
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2 + time * 0.006
          ctx.beginPath()
          ctx.moveTo(cx + Math.cos(angle) * enemy.width * 0.35, cy + Math.sin(angle) * enemy.width * 0.35)
          ctx.lineTo(cx + Math.cos(angle) * enemy.width * 0.55, cy + enemy.height * 0.45 + Math.sin(angle) * 0.15)
          ctx.strokeStyle = enemy.color || '#fff'
          ctx.lineWidth = 5
          ctx.stroke()
        }
        ctx.fillStyle = '#ff0'
        ctx.fillRect(cx - 4, cy + enemy.height * 0.25, 8, 15)
        break

      case 'dasher':
        ctx.beginPath()
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
          const radius = i % 2 === 0 ? enemy.width * 0.5 : enemy.width * 0.25
          const px = cx + Math.cos(angle) * radius
          const py = cy + Math.sin(angle) * radius
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
        break

      case 'asteroid':
        ctx.beginPath()
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2
          const radius = enemy.width * 0.4 * (0.85 + Math.sin(i * 4) * 0.15)
          const px = cx + Math.cos(angle) * radius
          const py = cy + Math.sin(angle) * radius
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = 'rgba(0,0,0,0.4)'
        for (let i = 0; i < 3; i++) {
          const craterX = cx + Math.cos(i * 2.5) * enemy.width * 0.2
          const craterY = cy + Math.sin(i * 2.5) * enemy.width * 0.15
          ctx.beginPath()
          ctx.arc(craterX, craterY, enemy.width * 0.12, 0, Math.PI * 2)
          ctx.fill()
        }
        break

      case 'boss':
        ctx.beginPath()
        ctx.arc(cx, cy, enemy.width * 0.45, 0, Math.PI * 2)
        ctx.fill()
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2
          ctx.beginPath()
          ctx.moveTo(cx + Math.cos(angle) * enemy.width * 0.4, cy + Math.sin(angle) * enemy.width * 0.4)
          ctx.lineTo(cx + Math.cos(angle) * enemy.width * 0.65, cy + Math.sin(angle) * enemy.width * 0.65)
          ctx.strokeStyle = enemy.color || '#fff'
          ctx.lineWidth = 8
          ctx.stroke()
        }
        ctx.fillStyle = '#ff0'
        ctx.beginPath()
        ctx.arc(cx - enemy.width * 0.18, cy - enemy.width * 0.08, enemy.width * 0.15, 0, Math.PI * 2)
        ctx.arc(cx + enemy.width * 0.18, cy - enemy.width * 0.08, enemy.width * 0.15, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#f00'
        ctx.beginPath()
        ctx.arc(cx - enemy.width * 0.18, cy - enemy.width * 0.08, enemy.width * 0.08, 0, Math.PI * 2)
        ctx.arc(cx + enemy.width * 0.18, cy - enemy.width * 0.08, enemy.width * 0.08, 0, Math.PI * 2)
        ctx.fill()
        const hp = (enemy.health || 1) / (enemy.maxHealth || 1)
        ctx.fillStyle = '#300'
        ctx.fillRect(cx - enemy.width * 0.5, cy - enemy.height * 0.55, enemy.width, 10)
        ctx.fillStyle = '#f00'
        ctx.fillRect(cx - enemy.width * 0.5, cy - enemy.height * 0.55, enemy.width * hp, 10)
        break
    }
    ctx.shadowBlur = 0
  }

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const gameLoop = (timestamp: number) => {
      const state = gameStateRef.current

      if (state.isRunning && !state.isPaused && !state.isGameOver) {
        const lerpFactor = 0.08
        state.playerX += (state.targetX - state.playerX) * lerpFactor
        
        if (state.invulnerable > 0) state.invulnerable -= 1

        // Update bullets
        state.bullets = state.bullets
          .map(b => ({ ...b, x: b.x + b.vx, y: b.y + b.vy }))
          .filter(b => b.y > -30 && b.y < CANVAS_HEIGHT + 30)

        // Update enemies
        state.enemies = state.enemies
          .map(e => {
            let newX = e.x + e.vx
            let newY = e.y + e.vy
            
            if (e.type === 'dasher') {
              e.vx += Math.sin(timestamp * 0.006) * 0.15
              if (newX < 30 || newX > CANVAS_WIDTH - 30 - e.width) e.vx *= -1
            }
            
            if (e.type === 'boss' || e.type === 'superboss') {
              e.vx = Math.sin(timestamp * 0.001) * 1.5
              // Super boss phases
              if (e.type === 'superboss') {
                if (e.phase === 'entering' && newY > 100) {
                  e.y = 100
                  e.vy = 0
                  e.phase = 'fighting'
                }
                if (e.phase === 'fighting' && timestamp % 3000 < 50) {
                  // Shoot spread pattern
                  for (let i = -2; i <= 2; i++) {
                    state.bullets.push({
                      x: e.x + e.width / 2 - 5,
                      y: e.y + e.height,
                      width: 10,
                      height: 15,
                      vx: i * 3,
                      vy: 6,
                      type: 'enemyBullet',
                      color: '#ff0',
                    })
                  }
                }
              }
            }
            
            if (e.type === 'shooter' || e.type === 'boss' || e.type === 'superboss') {
              e.shootTimer = (e.shootTimer || 0) + 1
              const shootInterval = e.type === 'superboss' ? 40 : e.type === 'boss' ? 50 : 100
              if (e.shootTimer > shootInterval && e.y > 50 && e.y < CANVAS_HEIGHT * 0.6) {
                e.shootTimer = 0
                const bulletCount = e.type === 'superboss' ? 5 : e.type === 'boss' ? 3 : 1
                for (let i = 0; i < bulletCount; i++) {
                  state.bullets.push({
                    x: e.x + e.width / 2 - 4,
                    y: e.y + e.height,
                    width: 8,
                    height: 14,
                    vx: e.type === 'superboss' ? (i - 2) * 4 : 0,
                    vy: e.type === 'superboss' ? 8 : 5,
                    type: 'enemyBullet',
                    color: e.type === 'superboss' ? '#ff0' : e.type === 'boss' ? '#ff0' : '#f97316',
                  })
                }
              }
            }
            
            return { ...e, x: newX, y: newY }
          })
          .filter(e => e.y < CANVAS_HEIGHT + 60)

        // Update particles
        state.particles = state.particles
          .map(p => {
            const newLifetime = (p.lifetime || 0) - 1
            if (newLifetime <= 0) return null
            return { ...p, x: p.x + p.vx, y: p.y + p.vy, vx: p.vx * 0.94, vy: p.vy * 0.94, lifetime: newLifetime }
          })
          .filter(p => p !== null)

        // Spawn enemies
        const spawnRate = Math.max(500 - state.level * 25, 150)
        
        // Check for super boss spawn
        if (state.level >= 20 && !state.enemies.some(e => e.type === 'superboss')) {
          if (!state.isBossComing) {
            state.isBossComing = true
            state.bossIntroText = '⚠️ SUPER BOSS APPROACHING ⚠️'
          }
          if (timestamp - lastSpawnRef.current > 3000) {
            state.enemies.push(spawnEnemy(state.difficulty, state.level, true))
            state.isBossComing = false
            state.bossIntroText = ''
            lastSpawnRef.current = timestamp
          }
        } else if (timestamp - lastSpawnRef.current > spawnRate) {
          state.enemies.push(spawnEnemy(state.difficulty, state.level))
          lastSpawnRef.current = timestamp
        }

        // Level up
        if (timestamp - lastLevelUpRef.current > 18000) {
          state.level = Math.min(state.level + 1, 25)
          state.difficulty += 0.35
          lastLevelUpRef.current = timestamp
        }

        // Collisions
        state.bullets.forEach(bullet => {
          if (bullet.type !== 'playerBullet') return
          state.enemies.forEach(enemy => {
            if (
              bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y
            ) {
              enemy.health = (enemy.health || 1) - 1
              bullet.y = -100

              if (enemy.health <= 0) {
                createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.color || '#fff', 
                  enemy.type === 'superboss' ? 60 : enemy.type === 'boss' ? 40 : 25)
                state.score += ENEMY_TYPES.find(t => t.type === enemy.type)?.score || 10
                
                if (Math.random() < 0.12) {
                  state.enemies.push({
                    x: enemy.x,
                    y: enemy.y,
                    width: 22,
                    height: 22,
                    vx: 0,
                    vy: 2.5,
                    type: 'powerup',
                    color: Math.random() > 0.5 ? '#00ff41' : '#3b82f6',
                  })
                }
              } else {
                createExplosion(bullet.x, bullet.y, '#ff0', 6)
              }
            }
          })
        })

        state.enemies = state.enemies.filter(e => (e.health || 0) > 0 && e.type !== 'powerup')
        state.bullets = state.bullets.filter(b => b.y > -60)

        // Player collision with enemies
        state.enemies = state.enemies.filter(enemy => {
          if (
            state.playerX < enemy.x + enemy.width &&
            state.playerX + PLAYER_WIDTH > enemy.x &&
            CANVAS_HEIGHT - PLAYER_HEIGHT < enemy.y + enemy.height &&
            CANVAS_HEIGHT > enemy.y
          ) {
            if (!state.shield && state.invulnerable <= 0) {
              state.lives -= 1
              state.invulnerable = 150
              createExplosion(state.playerX + PLAYER_WIDTH / 2, CANVAS_HEIGHT - PLAYER_HEIGHT / 2, '#f44', 50)
              
              if (state.lives <= 0) {
                state.isGameOver = true
                state.isRunning = false
                return true
              }
            }
            enemy.health = 0
            return false
          }
          return true
        })

        // Enemy bullets vs player
        state.bullets = state.bullets.filter(bullet => {
          if (bullet.type === 'enemyBullet') {
            if (
              state.playerX < bullet.x + bullet.width &&
              state.playerX + PLAYER_WIDTH > bullet.x &&
              CANVAS_HEIGHT - PLAYER_HEIGHT < bullet.y + bullet.height &&
              CANVAS_HEIGHT > bullet.y
            ) {
              if (!state.shield && state.invulnerable <= 0) {
                state.lives -= 1
                state.invulnerable = 150
                createExplosion(state.playerX + PLAYER_WIDTH / 2, CANVAS_HEIGHT - PLAYER_HEIGHT / 2, '#f44', 35)
                
                if (state.lives <= 0) {
                  state.isGameOver = true
                  state.isRunning = false
                }
              }
              return false
            }
          }
          return true
        })

        // Powerup collection
        state.enemies = state.enemies.filter(enemy => {
          if (enemy.type === 'powerup') {
            if (
              state.playerX < enemy.x + enemy.width &&
              state.playerX + PLAYER_WIDTH > enemy.x &&
              CANVAS_HEIGHT - PLAYER_HEIGHT < enemy.y + enemy.height &&
              CANVAS_HEIGHT > enemy.y
            ) {
              if (enemy.color === '#00ff41') {
                state.doubleShot = true
                setTimeout(() => { gameStateRef.current.doubleShot = false }, 12000)
              } else {
                state.shield = true
                setTimeout(() => { gameStateRef.current.shield = false }, 15000)
              }
              state.score += 5
              createExplosion(enemy.x, enemy.y, enemy.color || '#fff', 12)
              return false
            }
          }
          return true
        })
      }

      // Render
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Stars (more for bigger field)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      for (let i = 0; i < 120; i++) {
        const x = (i * 137) % CANVAS_WIDTH
        const y = (i * 89 + timestamp * 0.01) % CANVAS_HEIGHT
        ctx.beginPath()
        ctx.arc(x, y, Math.random() > 0.9 ? 1.5 : 0.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Boss warning
      if (state.isBossComing && state.bossIntroText) {
        ctx.font = 'bold 48px monospace'
        ctx.fillStyle = `rgba(255, 0, 0, ${0.7 + Math.sin(timestamp * 0.01) * 0.3})`
        ctx.textAlign = 'center'
        ctx.fillText(state.bossIntroText, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      }

      // Bullets
      state.bullets.forEach(bullet => {
        if (bullet.type === 'playerBullet') {
          ctx.shadowColor = bullet.color || '#00ff41'
          ctx.shadowBlur = 20
          ctx.fillStyle = bullet.color || '#00ff41'
        } else {
          ctx.shadowColor = bullet.color || '#f44'
          ctx.shadowBlur = 15
          ctx.fillStyle = bullet.color || '#f44'
        }
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
        ctx.shadowBlur = 0
      })

      // Enemies
      state.enemies.forEach(enemy => {
        if (enemy.type === 'powerup') {
          ctx.shadowColor = enemy.color || '#0f0'
          ctx.shadowBlur = 25
          ctx.fillStyle = enemy.color || '#0f0'
          ctx.beginPath()
          ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = enemy.color || '#0f0'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2 + Math.sin(timestamp * 0.01) * 6, 0, Math.PI * 2)
          ctx.stroke()
          ctx.shadowBlur = 0
        } else {
          drawEnemy(ctx, enemy, timestamp)
        }
      })

      // Particles
      state.particles.forEach(p => {
        ctx.fillStyle = p.color || '#fff'
        ctx.globalAlpha = p.width / 8
        ctx.fillRect(p.x, p.y, p.width, p.height)
        ctx.globalAlpha = 1
      })

      // Player
      const playerY = CANVAS_HEIGHT - PLAYER_HEIGHT
      const isFlashing = state.invulnerable > 0 && Math.floor(state.invulnerable / 5) % 2 === 0
      
      if (!isFlashing) {
        if (state.shield) {
          ctx.shadowColor = '#3b82f6'
          ctx.shadowBlur = 30
          ctx.strokeStyle = '#3b82f6'
          ctx.lineWidth = 5
          ctx.beginPath()
          ctx.arc(state.playerX + PLAYER_WIDTH / 2, playerY + PLAYER_HEIGHT / 2, PLAYER_WIDTH + 15, 0, Math.PI * 2)
          ctx.stroke()
          ctx.shadowBlur = 0
        }

        ctx.shadowColor = '#00ff41'
        ctx.shadowBlur = 30
        ctx.fillStyle = '#00ff41'
        ctx.beginPath()
        ctx.moveTo(state.playerX + PLAYER_WIDTH / 2, playerY)
        ctx.lineTo(state.playerX + PLAYER_WIDTH, playerY + PLAYER_HEIGHT)
        ctx.lineTo(state.playerX + PLAYER_WIDTH / 2, playerY + PLAYER_HEIGHT * 0.7)
        ctx.lineTo(state.playerX, playerY + PLAYER_HEIGHT)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = '#00ff4133'
        ctx.beginPath()
        ctx.moveTo(state.playerX + PLAYER_WIDTH * 0.3, playerY + PLAYER_HEIGHT * 0.8)
        ctx.lineTo(state.playerX + PLAYER_WIDTH / 2, playerY + PLAYER_HEIGHT + Math.random() * 18)
        ctx.lineTo(state.playerX + PLAYER_WIDTH * 0.7, playerY + PLAYER_HEIGHT * 0.8)
        ctx.closePath()
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // HUD
      ctx.font = 'bold 24px monospace'
      ctx.fillStyle = '#00ff41'
      ctx.textAlign = 'left'
      ctx.fillText(`SCORE: ${state.score}`, 30, 40)
      ctx.textAlign = 'right'
      ctx.fillText(`LEVEL: ${state.level}`, CANVAS_WIDTH - 30, 40)

      ctx.textAlign = 'left'
      for (let i = 0; i < state.lives; i++) {
        ctx.fillStyle = '#f44'
        ctx.beginPath()
        ctx.arc(30 + i * 30, 65, 12, 0, Math.PI * 2)
        ctx.fill()
      }

      if (state.shield) {
        ctx.fillStyle = '#3b82f6'
        ctx.fillRect(30, 85, 18, 18)
        ctx.font = '12px monospace'
        ctx.fillText('SHIELD', 55, 100)
      }
      if (state.doubleShot) {
        ctx.fillStyle = '#0f0'
        ctx.fillRect(30, state.shield ? 108 : 85, 18, 18)
        ctx.font = '12px monospace'
        ctx.fillText('2X', 55, state.shield ? 123 : 100)
      }

      ctx.font = '14px monospace'
      ctx.fillStyle = 'rgba(0,255,65,0.5)'
      ctx.textAlign = 'center'
      ctx.fillText(`DIFFICULTY: ${state.difficulty.toFixed(1)}x`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20)

      forceUpdate(n => n + 1)
      requestRef.current = requestAnimationFrame(gameLoop)
    }

    requestRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [createExplosion, spawnEnemy])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        const state = gameStateRef.current
        
        if (!state.isRunning && !state.isGameOver) {
          state.isRunning = true
        } else if (state.isRunning && !state.isGameOver) {
          state.isPaused = !state.isPaused
        } else if (state.isGameOver) {
          startGame()
        }
        forceUpdate(n => n + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [startGame])

  const state = gameStateRef.current

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/games" className="inline-flex items-center gap-2 text-muted-foreground hover:text-neon transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Volver a juegos</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            <span className="text-red-500">Space</span> <span className="text-neon">Defender</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {!state.isRunning && !state.isGameOver ? 'Presiona ESPACIO o toca la pantalla para comenzar' : 
             state.isPaused ? 'Juego pausado - Presiona ESPACIO para continuar' :
             state.isGameOver ? `¡Game Over! Score: ${state.score} - Presiona ESPACIO para jugar de nuevo` : 'Desliza el dedo para moverte y disparar'}
          </p>
        </div>

        <div className="relative mx-auto max-w-[1200px]">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseMove={handleMouseMove}
            onTouchMove={(e) => { handleTouchMove(e); shoot(Date.now()) }}
            onTouchStart={() => { if (!state.isRunning || state.isGameOver) startGame(); shoot(Date.now()) }}
            onClick={() => {
              if (!state.isRunning) startGame()
              else if (state.isGameOver) startGame()
              else shoot(Date.now())
            }}
            className="w-full max-w-[1200px] rounded-xl border-2 border-red-500/30 shadow-[0_0_60px_rgba(239,68,68,0.2)] md:cursor-crosshair"
            style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`, touchAction: "none" }}
          />

          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg border border-red-500/30 text-red-500 transition-all hover:scale-110"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {!state.isRunning && !state.isGameOver && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-red-500 flex items-center justify-center animate-pulse">
                  <span className="text-5xl">🚀</span>
                </div>
                <p className="font-mono text-xl text-red-500">Presiona ESPACIO o toca la pantalla para comenzar</p>
              </div>
            </div>
          )}

          {state.isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl">
              <div className="text-center">
                <p className="font-mono text-3xl text-neon">⏸ PAUSA</p>
              </div>
            </div>
          )}

          {state.isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl">
              <div className="text-center">
                <Skull className="w-20 h-20 mx-auto mb-4 text-red-500" />
                <p className="font-mono text-3xl text-red-500 mb-2">GAME OVER</p>
                <p className="font-mono text-muted-foreground">Score: {state.score} | Nivel: {state.level}</p>
                <button onClick={startGame} className="mt-6 px-8 py-3 bg-red-500 text-white font-mono rounded-md hover:bg-red-600 transition-all">
                  <RotateCcw className="inline h-4 w-4 mr-2" /> Jugar de nuevo
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <span><kbd className="px-2 py-1 bg-secondary rounded text-xs">Mouse</kbd> Mover</span>
          <span><kbd className="px-2 py-1 bg-secondary rounded text-xs">Click</kbd> Disparar</span>
          <span><kbd className="px-2 py-1 bg-secondary rounded text-xs">Espacio</kbd> Iniciar/Pausar</span>
        </div>
      </main>
    </div>
  )
}
