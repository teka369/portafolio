"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Sparkles, Environment, ContactShadows, Ring } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import * as THREE from "three"

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
      setTimeout(() => setBlink(false), 140)
    }, 2600)
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

    // Base floating + slight body lean
    g.position.y = Math.sin(t * 1.4) * 0.18
    g.rotation.z = Math.sin(t * 0.7) * 0.06

    if (phase === "enter") {
      // Fly in from far + spin settle
      const progress = Math.min(t / 1.8, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      g.position.z = THREE.MathUtils.lerp(8, 0, ease)
      g.position.y += THREE.MathUtils.lerp(3, 0, ease)
      g.rotation.y = THREE.MathUtils.lerp(Math.PI * 2, 0, ease)
      g.scale.setScalar(THREE.MathUtils.lerp(0.2, 1.35, ease))
    } else if (phase === "exit") {
      const exitT = Math.max(0, t - 12)
      const p = Math.min(exitT / 1.6, 1)
      const ease = p * p
      g.position.y += ease * 4
      g.position.z -= ease * 3
      g.rotation.y += ease * Math.PI
      g.scale.setScalar(1.35 * (1 - ease * 0.7))
    } else {
      // Idle: look at camera + wave
      g.rotation.y = Math.sin(t * 0.35) * 0.25
      g.scale.setScalar(1.35)

      if (h) {
        // Head tracks / nods
        h.rotation.y = Math.sin(t * 0.8) * 0.35
        h.rotation.x = Math.sin(t * 1.1) * 0.08
      }

      if (ra) {
        // Right arm waves more expressively
        ra.rotation.z = -0.9 + Math.sin(t * 3.2) * 0.55
        ra.rotation.x = Math.sin(t * 2.4) * 0.2
      }
      if (la) {
        la.rotation.z = 0.35 + Math.sin(t * 1.6) * 0.25
      }
      if (ant) {
        ant.rotation.z = Math.sin(t * 4) * 0.25
        ant.rotation.x = Math.sin(t * 2.5) * 0.1
      }
    }
  })

  return (
    <group ref={group}>
      {/* Holographic base ring */}
      <Ring args={[1.4, 1.55, 64]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
        <meshBasicMaterial color="#00ff41" transparent opacity={0.35} side={THREE.DoubleSide} />
      </Ring>

      {/* Body */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[1.15, 1.25, 0.72]} />
        <meshStandardMaterial color="#0c1222" metalness={0.75} roughness={0.22} />
      </mesh>
      {/* Chest core */}
      <mesh position={[0, 0.22, 0.37]}>
        <circleGeometry args={[0.2, 32]} />
        <meshBasicMaterial color="#00ff41" />
      </mesh>

      {/* Head group (for looking) */}
      <group ref={head} position={[0, 1.18, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.88, 0.78, 0.72]} />
          <meshStandardMaterial color="#151c2e" metalness={0.55} roughness={0.2} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.23, 0.05, 0.37]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshBasicMaterial color={blink ? "#001a0a" : "#00ff41"} />
        </mesh>
        <mesh position={[0.23, 0.05, 0.37]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshBasicMaterial color={blink ? "#001a0a" : "#00ff41"} />
        </mesh>
      </group>

      {/* Antenna */}
      <group ref={antenna} position={[0, 1.62, 0]}>
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 0.4, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshBasicMaterial color="#00ff41" />
        </mesh>
      </group>

      {/* Arms */}
      <group ref={leftArm} position={[-0.78, 0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.24, 0.75, 0.24]} />
          <meshStandardMaterial color="#151c2e" metalness={0.6} roughness={0.25} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.78, 0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.24, 0.75, 0.24]} />
          <meshStandardMaterial color="#151c2e" metalness={0.6} roughness={0.25} />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.3, -0.7, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.3]} />
        <meshStandardMaterial color="#0c1222" metalness={0.7} />
      </mesh>
      <mesh position={[0.3, -0.7, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.3]} />
        <meshStandardMaterial color="#0c1222" metalness={0.7} />
      </mesh>
    </group>
  )
}

function CameraRig({ phase }: { phase: string }) {
  const { camera } = useThree()
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (phase === "enter") {
      const p = Math.min(t / 1.8, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      camera.position.z = THREE.MathUtils.lerp(9, 4.6, ease)
      camera.position.y = THREE.MathUtils.lerp(2.2, 0.9, ease)
    } else if (phase === "exit") {
      const exitT = Math.max(0, t - 12)
      const p = Math.min(exitT / 1.6, 1)
      camera.position.z = 4.6 + p * 2
      camera.position.y = 0.9 + p * 1.2
    }
    camera.lookAt(0, 0.4, 0)
  })
  return null
}

export function WelcomeRobotIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"enter" | "idle" | "exit">("enter")
  const [bubbleIndex, setBubbleIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const dialogues = [
    "Bienvenido al portafolio de Juan David.",
    "Fullstack developer. Sistemas escalables. Código limpio.",
    "Explora los proyectos. Construye conmigo.",
  ]

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  // Entrance done -> idle
  useEffect(() => {
    const t = setTimeout(() => setPhase("idle"), 1900)
    return () => clearTimeout(t)
  }, [])

  // Dialogue sequence
  useEffect(() => {
    if (phase !== "idle") return
    if (bubbleIndex < dialogues.length) {
      const timer = setTimeout(() => setBubbleIndex((i) => i + 1), 2400)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setPhase("exit"), 1400)
      return () => clearTimeout(timer)
    }
  }, [phase, bubbleIndex])

  // Exit complete
  useEffect(() => {
    if (phase !== "exit") return
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 500)
    }, 1700)
    return () => clearTimeout(timer)
  }, [phase, onComplete])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 2.2, 9], fov: isMobile ? 52 : 46 }}
        className="absolute inset-0"
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
      >
        <CameraRig phase={phase} />
        <ambientLight intensity={0.35} />
        <pointLight position={[5, 5, 5]} intensity={1.4} color="#00ff41" />
        <pointLight position={[-4, 3, 2]} intensity={0.7} color="#22d3ee" />
        <spotLight position={[0, 6, 2]} angle={0.4} penumbra={0.5} intensity={0.8} color="#00ff41" />
        <Environment preset="night" />

        <Robot phase={phase} />

        <Sparkles
          count={isMobile ? 50 : 120}
          scale={isMobile ? [7, 6, 4] : [10, 8, 6]}
          size={isMobile ? 1.6 : 2.2}
          speed={0.5}
          color="#00ff41"
          opacity={0.7}
        />
        <ContactShadows position={[0, -1.4, 0]} opacity={0.45} scale={8} blur={2.8} />
      </Canvas>

      {/* Professional speech bubbles */}
      <div className="absolute top-[10%] sm:top-[16%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 sm:gap-3 pointer-events-none px-4 w-full max-w-lg">
        {dialogues.slice(0, bubbleIndex).map((text, i) => (
          <div
            key={i}
            className="bg-black/75 border border-neon/50 backdrop-blur-md text-neon font-mono text-sm sm:text-base md:text-lg px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-[0_0_40px_rgba(0,255,65,0.3)] animate-fade-in-up text-center leading-snug"
          >
            {text}
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setVisible(false)
          setTimeout(onComplete, 250)
        }}
        className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 font-mono text-xs sm:text-sm text-muted-foreground hover:text-neon transition-colors z-20 px-3 py-2 bg-black/50 rounded-md border border-white/10"
      >
        Saltar →
      </button>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 font-mono text-[9px] sm:text-[10px] text-neon/50 tracking-widest">
        ROBOTITO v2.0 · INICIALIZANDO SISTEMA
      </div>
    </div>
  )
}
