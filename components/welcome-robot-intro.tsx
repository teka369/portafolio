"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sparkles, Environment, ContactShadows, Ring, Points, PointMaterial } from "@react-three/drei"
import { useRef, useState, useEffect, useMemo } from "react"
import * as THREE from "three"

function Portal({ phase }: { phase: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!ref.current) return
    const intensity = phase === "enter" ? Math.min(t / 1.4, 1) : phase === "exit" ? 1 : 0.6
    ref.current.scale.setScalar(0.8 + intensity * 0.6 + Math.sin(t * 2) * 0.05)
    ref.current.rotation.z = t * 0.4
  })
  return (
    <group ref={ref} position={[0, 0.2, -0.5]}>
      <Ring args={[1.6, 1.85, 64]}>
        <meshBasicMaterial color="#00ff41" transparent opacity={0.7} side={THREE.DoubleSide} />
      </Ring>
      <Ring args={[1.2, 1.35, 64]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} side={THREE.DoubleSide} />
      </Ring>
    </group>
  )
}

function Robot({ phase }: { phase: "enter" | "idle" | "exit" }) {
  const group = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Group>(null)
  const antenna = useRef<THREE.Group>(null)
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 120)
    }, 2400)
    return () => clearInterval(id)
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const g = group.current
    const h = head.current
    const ra = rightArm.current
    const la = leftArm.current
    const ant = antenna.current
    if (!g) return

    // Secondary motion always
    const floatY = Math.sin(t * 1.6) * 0.12
    g.position.y = floatY

    if (phase === "enter") {
      const p = Math.min(t / 2.1, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      // Materialize from portal
      g.position.z = THREE.MathUtils.lerp(1.8, 0, ease)
      g.position.y = floatY + THREE.MathUtils.lerp(1.2, 0, ease)
      g.scale.setScalar(THREE.MathUtils.lerp(0.05, 1.4, ease))
      g.rotation.y = THREE.MathUtils.lerp(Math.PI, 0, ease)
      // Anticipation lean on arrival
      if (p > 0.75) {
        const land = (p - 0.75) / 0.25
        g.rotation.x = Math.sin(land * Math.PI) * -0.15
      }
    } else if (phase === "exit") {
      const exitStart = 11
      const et = Math.max(0, t - exitStart)
      const p = Math.min(et / 1.8, 1)
      const ease = p * p * (3 - 2 * p)
      // Dive into portal
      g.position.z = THREE.MathUtils.lerp(0, 2.2, ease)
      g.position.y = floatY + THREE.MathUtils.lerp(0, 0.8, ease)
      g.scale.setScalar(1.4 * (1 - ease * 0.85))
      g.rotation.y = ease * Math.PI * 1.5
      if (ra) ra.rotation.z = -1.2
    } else {
      // Idle acting
      g.scale.setScalar(1.4)
      g.rotation.y = Math.sin(t * 0.4) * 0.18
      g.rotation.z = Math.sin(t * 0.9) * 0.04

      if (h) {
        h.rotation.y = Math.sin(t * 0.7) * 0.4
        h.rotation.x = Math.sin(t * 1.2) * 0.07
      }

      // Wave with anticipation
      if (ra) {
        const wave = Math.sin(t * 2.8)
        const anticip = Math.max(0, Math.sin(t * 1.4 - 0.8)) * 0.3
        ra.rotation.z = -0.7 + wave * 0.65 - anticip
        ra.rotation.x = Math.sin(t * 2.1) * 0.15
      }
      if (la) la.rotation.z = 0.25 + Math.sin(t * 1.3) * 0.2
      if (ant) {
        ant.rotation.z = Math.sin(t * 3.5) * 0.3
        ant.rotation.x = Math.sin(t * 2) * 0.12
      }
    }
  })

  return (
    <group ref={group}>
      {/* Body */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[1.18, 1.28, 0.75]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.82} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.2, 0.38]}>
        <circleGeometry args={[0.22, 32]} />
        <meshBasicMaterial color="#00ff41" />
      </mesh>

      {/* Head */}
      <group ref={head} position={[0, 1.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.8, 0.74]} />
          <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.18} />
        </mesh>
        <mesh position={[-0.24, 0.04, 0.38]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial color={blink ? "#001a0a" : "#00ff41"} />
        </mesh>
        <mesh position={[0.24, 0.04, 0.38]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshBasicMaterial color={blink ? "#001a0a" : "#00ff41"} />
        </mesh>
      </group>

      {/* Antenna */}
      <group ref={antenna} position={[0, 1.65, 0]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 0.42, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.26, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#00ff41" />
        </mesh>
      </group>

      {/* Arms */}
      <group ref={leftArm} position={[-0.8, 0.28, 0]}>
        <mesh>
          <boxGeometry args={[0.26, 0.78, 0.26]} />
          <meshStandardMaterial color="#111827" metalness={0.65} roughness={0.22} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.8, 0.28, 0]}>
        <mesh>
          <boxGeometry args={[0.26, 0.78, 0.26]} />
          <meshStandardMaterial color="#111827" metalness={0.65} roughness={0.22} />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.32, -0.72, 0]}>
        <boxGeometry args={[0.32, 0.62, 0.32]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.75} />
      </mesh>
      <mesh position={[0.32, -0.72, 0]}>
        <boxGeometry args={[0.32, 0.62, 0.32]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.75} />
      </mesh>
    </group>
  )
}

function CameraRig({ phase }: { phase: string }) {
  const { camera } = useThree()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (phase === "enter") {
      const p = Math.min(t / 2.1, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      camera.position.set(
        THREE.MathUtils.lerp(1.2, 0, ease),
        THREE.MathUtils.lerp(2.8, 0.85, ease),
        THREE.MathUtils.lerp(7.5, 4.4, ease)
      )
    } else if (phase === "exit") {
      const et = Math.max(0, t - 11)
      const p = Math.min(et / 1.8, 1)
      camera.position.z = 4.4 + p * 1.5
      camera.position.y = 0.85 + p * 0.6
    }
    camera.lookAt(0, 0.3, 0)
  })
  return null
}

export function WelcomeRobotIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"enter" | "idle" | "exit">("enter")
  const [bubbleIndex, setBubbleIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const dialogues = [
    "Sistema en línea. Bienvenido.",
    "Juan David Guarin — Fullstack. Arquitectura limpia. Sistemas que escalan.",
    "El portafolio está listo. Entra cuando quieras.",
  ]

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setPhase("idle"), 2200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase !== "idle") return
    if (bubbleIndex < dialogues.length) {
      const timer = setTimeout(() => setBubbleIndex((i) => i + 1), 2600)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setPhase("exit"), 1600)
      return () => clearTimeout(timer)
    }
  }, [phase, bubbleIndex])

  useEffect(() => {
    if (phase !== "exit") return
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 600)
    }, 1900)
    return () => clearTimeout(timer)
  }, [phase, onComplete])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <Canvas
        camera={{ position: [1.2, 2.8, 7.5], fov: isMobile ? 54 : 48 }}
        className="absolute inset-0"
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
      >
        <CameraRig phase={phase} />
        <ambientLight intensity={0.3} />
        <pointLight position={[4, 5, 4]} intensity={1.6} color="#00ff41" />
        <pointLight position={[-3, 2, 3]} intensity={0.8} color="#22d3ee" />
        <spotLight position={[0, 7, 1]} angle={0.35} penumbra={0.6} intensity={1} color="#00ff41" />
        <Environment preset="night" />

        <Portal phase={phase} />
        <Robot phase={phase} />

        <Sparkles
          count={isMobile ? 60 : 140}
          scale={[9, 7, 5]}
          size={2}
          speed={0.6}
          color="#00ff41"
          opacity={0.65}
        />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={9} blur={3} />
      </Canvas>

      <div className="absolute top-[8%] sm:top-[14%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 sm:gap-3 pointer-events-none px-4 w-full max-w-xl">
        {dialogues.slice(0, bubbleIndex).map((text, i) => (
          <div
            key={i}
            className="bg-black/80 border border-neon/60 backdrop-blur-md text-neon font-mono text-sm sm:text-base md:text-lg px-5 sm:px-7 py-3 rounded-2xl shadow-[0_0_50px_rgba(0,255,65,0.35)] animate-fade-in-up text-center leading-snug"
          >
            {text}
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setVisible(false)
          setTimeout(onComplete, 200)
        }}
        className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 font-mono text-xs sm:text-sm text-muted-foreground hover:text-neon transition-colors z-20 px-4 py-2 bg-black/60 rounded-md border border-white/10"
      >
        Saltar →
      </button>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 font-mono text-[9px] sm:text-[10px] text-neon/40 tracking-widest">
        ROBOTITO v3.0 · PORTAL ACTIVO
      </div>
    </div>
  )
}
