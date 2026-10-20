"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Sparkles, Environment, ContactShadows, Ring } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import * as THREE from "three"

function Portal({ intensity }: { intensity: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.scale.setScalar(0.7 + intensity * 0.8 + Math.sin(t * 1.8) * 0.04)
    ref.current.rotation.z = t * 0.35
  })
  return (
    <group ref={ref} position={[0, 0.1, -0.6]}>
      <Ring args={[1.7, 1.95, 64]}>
        <meshBasicMaterial color="#00ff41" transparent opacity={0.65 * intensity} side={THREE.DoubleSide} />
      </Ring>
      <Ring args={[1.25, 1.4, 64]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.4 * intensity} side={THREE.DoubleSide} />
      </Ring>
    </group>
  )
}

function Robot({ phase, dialogueStep }: { phase: string; dialogueStep: number }) {
  const group = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Group>(null)
  const antenna = useRef<THREE.Group>(null)
  const [blink, setBlink] = useState(false)

  // Smooth targets to avoid jumps
  const targetRotY = useRef(0)
  const targetArmZ = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 110)
    }, 2300)
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

    const floatY = Math.sin(t * 1.5) * 0.1
    g.position.y = floatY

    // === PHASE LOGIC (single system, no overlapping writes) ===
    if (phase === "enter") {
      const p = Math.min(t / 2.2, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      g.position.z = THREE.MathUtils.lerp(2, 0, ease)
      g.scale.setScalar(THREE.MathUtils.lerp(0.08, 1.38, ease))
      targetRotY.current = THREE.MathUtils.lerp(Math.PI * 0.8, 0, ease)
      targetArmZ.current = 0
      if (p > 0.8) {
        const land = (p - 0.8) / 0.2
        g.rotation.x = Math.sin(land * Math.PI) * -0.12
      }
    } else if (phase === "greeting") {
      // Look at camera + perform greeting sequence
      targetRotY.current = Math.sin(t * 0.3) * 0.08 // small natural sway, ends near 0

      // Greeting sequence based on dialogue step
      if (dialogueStep === 0) {
        // Anticipate + raise arm
        const waveT = (t % 3)
        if (waveT < 0.4) targetArmZ.current = THREE.MathUtils.lerp(0, -1.4, waveT / 0.4)
        else if (waveT < 2.2) {
          const w = (waveT - 0.4) / 1.8
          targetArmZ.current = -1.4 + Math.sin(w * Math.PI * 4) * 0.45
        } else {
          targetArmZ.current = THREE.MathUtils.lerp(-1.4, 0, (waveT - 2.2) / 0.8)
        }
      } else if (dialogueStep === 1) {
        // Gesture to self
        targetArmZ.current = -0.6 + Math.sin(t * 1.5) * 0.15
      } else {
        // Open invitation
        targetArmZ.current = -0.3 + Math.sin(t * 1.2) * 0.1
      }

      if (h) {
        h.rotation.y = THREE.MathUtils.lerp(h.rotation.y, 0, 0.08)
        h.rotation.x = Math.sin(t * 0.9) * 0.05
      }
    } else if (phase === "exit") {
      const et = Math.max(0, t - 10.5)
      const p = Math.min(et / 1.7, 1)
      const ease = p * p * (3 - 2 * p)
      g.position.z = THREE.MathUtils.lerp(0, 2.4, ease)
      g.scale.setScalar(1.38 * (1 - ease * 0.8))
      targetRotY.current = ease * Math.PI * 0.6
      targetArmZ.current = THREE.MathUtils.lerp(targetArmZ.current, -0.4, 0.1)
    }

    // Apply smoothed rotations (prevents jumps)
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRotY.current, 0.12)
    if (ra) ra.rotation.z = THREE.MathUtils.lerp(ra.rotation.z, targetArmZ.current, 0.15)

    // Secondary motions
    if (la) la.rotation.z = 0.2 + Math.sin(t * 1.1) * 0.12
    if (ant) {
      ant.rotation.z = Math.sin(t * 2.8) * 0.22
      ant.rotation.x = Math.sin(t * 1.6) * 0.08
    }
  })

  return (
    <group ref={group}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[1.2, 1.3, 0.76]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.18, 0.39]}>
        <circleGeometry args={[0.22, 32]} />
        <meshBasicMaterial color="#00ff41" />
      </mesh>

      <group ref={head} position={[0, 1.22, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.92, 0.82, 0.75]} />
          <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[-0.25, 0.03, 0.39]}>
          <sphereGeometry args={[0.145, 16, 16]} />
          <meshBasicMaterial color={blink ? "#001a0a" : "#00ff41"} />
        </mesh>
        <mesh position={[0.25, 0.03, 0.39]}>
          <sphereGeometry args={[0.145, 16, 16]} />
          <meshBasicMaterial color={blink ? "#001a0a" : "#00ff41"} />
        </mesh>
      </group>

      <group ref={antenna} position={[0, 1.68, 0]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 0.44, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#00ff41" />
        </mesh>
      </group>

      <group ref={leftArm} position={[-0.82, 0.26, 0]}>
        <mesh>
          <boxGeometry args={[0.27, 0.8, 0.27]} />
          <meshStandardMaterial color="#111827" metalness={0.65} roughness={0.22} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.82, 0.26, 0]}>
        <mesh>
          <boxGeometry args={[0.27, 0.8, 0.27]} />
          <meshStandardMaterial color="#111827" metalness={0.65} roughness={0.22} />
        </mesh>
      </group>

      <mesh position={[-0.33, -0.74, 0]}>
        <boxGeometry args={[0.33, 0.64, 0.33]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.75} />
      </mesh>
      <mesh position={[0.33, -0.74, 0]}>
        <boxGeometry args={[0.33, 0.64, 0.33]} />
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
      const p = Math.min(t / 2.2, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      camera.position.set(
        THREE.MathUtils.lerp(0.8, 0, ease),
        THREE.MathUtils.lerp(2.6, 0.8, ease),
        THREE.MathUtils.lerp(7.2, 4.3, ease)
      )
    } else if (phase === "exit") {
      const et = Math.max(0, t - 10.5)
      const p = Math.min(et / 1.7, 1)
      camera.position.z = 4.3 + p * 1.2
      camera.position.y = 0.8 + p * 0.4
    }
    camera.lookAt(0, 0.25, 0)
  })
  return null
}

export function WelcomeRobotIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"enter" | "greeting" | "exit">("enter")
  const [dialogueStep, setDialogueStep] = useState(0)
  const [visible, setVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  const dialogues = [
    "¡Hola! ¿Cómo estás? Bienvenido a mi portafolio.",
    "Soy Juan David. Fullstack developer. Sistemas limpios y escalables.",
    "Cuando quieras, entra. El trabajo está aquí.",
  ]

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setPhase("greeting"), 2300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase !== "greeting") return
    if (dialogueStep < dialogues.length) {
      const timer = setTimeout(() => setDialogueStep((s) => s + 1), 2800)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setPhase("exit"), 1800)
      return () => clearTimeout(timer)
    }
  }, [phase, dialogueStep])

  useEffect(() => {
    if (phase !== "exit") return
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 500)
    }, 1800)
    return () => clearTimeout(timer)
  }, [phase, onComplete])

  if (!visible) return null

  const portalIntensity = phase === "enter" ? 1 : phase === "exit" ? 1 : 0.55

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <Canvas
        camera={{ position: [0.8, 2.6, 7.2], fov: isMobile ? 54 : 48 }}
        className="absolute inset-0"
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: !isMobile }}
      >
        <CameraRig phase={phase} />
        <ambientLight intensity={0.28} />
        <pointLight position={[4, 5, 4]} intensity={1.5} color="#00ff41" />
        <pointLight position={[-3, 2, 3]} intensity={0.7} color="#22d3ee" />
        <spotLight position={[0, 6, 1]} angle={0.4} penumbra={0.5} intensity={0.9} color="#00ff41" />
        <Environment preset="night" />

        <Portal intensity={portalIntensity} />
        <Robot phase={phase} dialogueStep={dialogueStep} />

        <Sparkles count={isMobile ? 50 : 110} scale={[8, 6, 4]} size={1.8} speed={0.45} color="#00ff41" opacity={0.6} />
        <ContactShadows position={[0, -1.45, 0]} opacity={0.45} scale={8} blur={2.5} />
      </Canvas>

      <div className="absolute top-[8%] sm:top-[15%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 sm:gap-3 pointer-events-none px-4 w-full max-w-xl">
        {dialogues.slice(0, dialogueStep).map((text, i) => (
          <div
            key={i}
            className="bg-black/80 border border-neon/60 backdrop-blur-md text-neon font-mono text-sm sm:text-base md:text-lg px-5 sm:px-7 py-3 rounded-2xl shadow-[0_0_40px_rgba(0,255,65,0.3)] animate-fade-in-up text-center leading-snug"
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
        ROBOTITO v4.0 · ACTUANDO
      </div>
    </div>
  )
}
