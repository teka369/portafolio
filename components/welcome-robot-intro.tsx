"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { ContactShadows, Environment, Ring, Sparkles } from "@react-three/drei"
import { useCallback, useEffect, useRef, useState } from "react"
import * as THREE from "three"

type IntroPhase = "enter" | "greeting" | "exit"

const ENTER_DURATION = 2.45
const EXIT_DURATION = 2.2

function smooth01(value: number) {
  const t = THREE.MathUtils.clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

function Portal({ intensity }: { intensity: number }) {
  const portal = useRef<THREE.Group>(null)

  useFrame(({ clock }, delta) => {
    if (!portal.current) return
    const t = clock.elapsedTime
    portal.current.rotation.z += delta * 0.22
    const pulse = 1 + Math.sin(t * 1.7) * 0.025
    portal.current.scale.setScalar(pulse)
  })

  return (
    <group ref={portal} position={[0, 0.05, -0.7]}>
      <Ring args={[1.45, 1.62, 96]}>
        <meshBasicMaterial
          color="#00ff78"
          transparent
          opacity={0.72 * intensity}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </Ring>
      <Ring args={[1.18, 1.25, 96]}>
        <meshBasicMaterial
          color="#38d9ff"
          transparent
          opacity={0.68 * intensity}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </Ring>
      <Ring args={[0.82, 0.87, 96]}>
        <meshBasicMaterial
          color="#b8ffcb"
          transparent
          opacity={0.42 * intensity}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </Ring>
    </group>
  )
}

function Robot({ phase, dialogueStep }: { phase: IntroPhase; dialogueStep: number }) {
  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const rightShoulder = useRef<THREE.Group>(null)
  const leftShoulder = useRef<THREE.Group>(null)
  const rightForearm = useRef<THREE.Group>(null)
  const leftForearm = useRef<THREE.Group>(null)
  const rightHand = useRef<THREE.Group>(null)
  const leftHand = useRef<THREE.Group>(null)
  const antenna = useRef<THREE.Group>(null)
  const leftEye = useRef<THREE.Mesh>(null)
  const rightEye = useRef<THREE.Mesh>(null)
  const phaseSeen = useRef<IntroPhase>(phase)
  const phaseStartedAt = useRef(0)

  useFrame(({ clock }, delta) => {
    const now = clock.elapsedTime
    if (phaseSeen.current !== phase) {
      phaseSeen.current = phase
      phaseStartedAt.current = now
    }
    const local = Math.max(0, now - phaseStartedAt.current)
    const robot = root.current
    if (!robot) return

    const enter = smooth01(local / ENTER_DURATION)
    const exit = smooth01(local / EXIT_DURATION)

    let targetY = 0
    let targetX = 0
    let targetZ = 0
    let targetScale = 0.9
    let rightArmZ = 0.04
    let leftArmZ = -0.04
    let rightArmX = 0
    let leftArmX = 0
    let rightWristZ = 0
    let leftWristZ = 0
    let headY = 0
    let headX = 0
    let headZ = 0

    if (phase === "enter") {
      // Approach facing the visitor, then absorb the landing instead of snapping into place.
      targetZ = THREE.MathUtils.lerp(-2.35, 1.05, enter)
      targetScale = THREE.MathUtils.lerp(0.08, 0.9, enter)
      targetY = THREE.MathUtils.lerp(-0.3, -0.3, enter) + Math.sin(enter * Math.PI) * 0.12
      targetY += local > 1.85 ? -Math.sin(((local - 1.85) / 0.6) * Math.PI) * 0.06 : 0
      targetX = THREE.MathUtils.lerp(-0.45, 0, enter)
      robot.rotation.y = THREE.MathUtils.damp(robot.rotation.y, THREE.MathUtils.lerp(0, 0, enter), 5, delta)
      rightArmZ = THREE.MathUtils.lerp(0.3, 0.04, enter)
      leftArmZ = THREE.MathUtils.lerp(-0.3, -0.04, enter)
    } else if (phase === "greeting") {
      // Idle is alive but restrained: breathing, small head movements and responsive gestures.
      targetY = Math.sin(local * 1.8) * 0.035
      targetX = Math.sin(local * 1.15) * 0.018
      targetScale = 0.9
      headY = Math.sin(local * 0.8) * 0.045
      headX = Math.sin(local * 1.35) * 0.025

      if (dialogueStep === 0) {
        // Clear, readable wave: raise, wave at the wrist, then lower before the next line.
        const raise = smooth01(local / 0.48)
        const lower = smooth01((local - 2.0) / 0.52)
        rightArmZ = THREE.MathUtils.lerp(0.04, 2.25, raise)
        rightArmZ = THREE.MathUtils.lerp(rightArmZ, 0.04, lower)
        rightArmX = 0.08
        rightWristZ = local > 0.48 && local < 2.0 ? Math.sin((local - 0.48) * 12) * 0.24 : 0
        leftArmZ = -0.04
        leftWristZ = 0.02
        headY += Math.sin(local * 2.5) * 0.025
      } else if (dialogueStep === 1) {
        // Self-introduction: one hand comes toward the chest, with a small nod.
        const gesture = smooth01(local / 0.42) * (1 - smooth01((local - 2.05) / 0.48))
        rightArmZ = THREE.MathUtils.lerp(0.04, -0.82, gesture)
        rightArmX = -0.35 * gesture
        rightWristZ = -0.12 * gesture
        leftArmZ = THREE.MathUtils.lerp(-0.04, 0.28, gesture * 0.55)
        headX = -0.07 * (1 - smooth01((local - 0.28) / 0.4)) + Math.sin(local * 1.2) * 0.018
      } else {
        // Open invitation: both arms open toward the portfolio.
        const open = smooth01(local / 0.55)
        const settle = 1 - smooth01((local - 2.0) / 0.5)
        const gesture = open * settle
        rightArmZ = THREE.MathUtils.lerp(0.04, -0.72, gesture)
        leftArmZ = THREE.MathUtils.lerp(-0.04, 0.72, gesture)
        rightArmX = -0.22 * gesture
        leftArmX = -0.22 * gesture
        rightWristZ = -0.1 * gesture
        leftWristZ = 0.1 * gesture
      }

      // The eyes and face remain aimed at the camera; head motion is intentionally subtle.
      headY = THREE.MathUtils.clamp(headY, -0.12, 0.12)
    } else {
      // A distinct exit: acknowledge the visitor, turn smoothly, and travel through the portal.
      const turn = smooth01(local / 0.8)
      targetZ = THREE.MathUtils.lerp(1.05, -2.25, exit)
      targetY = THREE.MathUtils.lerp(-0.3, -0.3, exit)
      targetX = THREE.MathUtils.lerp(0, 0.12, exit)
      targetScale = THREE.MathUtils.lerp(0.9, 0.08, exit)
      robot.rotation.y = THREE.MathUtils.damp(robot.rotation.y, THREE.MathUtils.lerp(0, -0.68, turn), 4.5, delta)
      rightArmZ = THREE.MathUtils.lerp(0.04, -1.75, smooth01(local / 0.42))
      rightWristZ = local < 0.55 ? Math.sin(local * 13) * 0.18 : 0
      leftArmZ = THREE.MathUtils.lerp(-0.04, 0.22, turn)
      headY = THREE.MathUtils.lerp(0, 0.18, turn)
    }

    // One writer per transform, with frame-rate-independent smoothing.
    robot.position.x = THREE.MathUtils.damp(robot.position.x, 0, 7, delta)
    robot.position.y = THREE.MathUtils.damp(robot.position.y, targetY, 5.5, delta)
    robot.position.z = THREE.MathUtils.damp(robot.position.z, targetZ, 5.5, delta)
    robot.scale.setScalar(THREE.MathUtils.damp(robot.scale.x, targetScale, 5.5, delta))
    robot.rotation.x = THREE.MathUtils.damp(robot.rotation.x, targetX, 5.5, delta)

    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, headY, 5, delta)
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, headX, 5, delta)
      head.current.rotation.z = THREE.MathUtils.damp(head.current.rotation.z, headZ, 5, delta)
    }
    if (rightShoulder.current) {
      rightShoulder.current.rotation.z = THREE.MathUtils.damp(rightShoulder.current.rotation.z, rightArmZ, 8, delta)
      rightShoulder.current.rotation.x = THREE.MathUtils.damp(rightShoulder.current.rotation.x, rightArmX, 7, delta)
    }
    if (leftShoulder.current) {
      leftShoulder.current.rotation.z = THREE.MathUtils.damp(leftShoulder.current.rotation.z, leftArmZ, 8, delta)
      leftShoulder.current.rotation.x = THREE.MathUtils.damp(leftShoulder.current.rotation.x, leftArmX, 7, delta)
    }
    if (rightForearm.current) {
      rightForearm.current.rotation.z = THREE.MathUtils.damp(rightForearm.current.rotation.z, rightWristZ * 0.45, 10, delta)
    }
    if (leftForearm.current) {
      leftForearm.current.rotation.z = THREE.MathUtils.damp(leftForearm.current.rotation.z, leftWristZ * 0.45, 10, delta)
    }
    if (rightHand.current) {
      rightHand.current.rotation.z = THREE.MathUtils.damp(rightHand.current.rotation.z, rightWristZ, 10, delta)
    }
    if (leftHand.current) {
      leftHand.current.rotation.z = THREE.MathUtils.damp(leftHand.current.rotation.z, leftWristZ, 10, delta)
    }
    if (antenna.current) {
      antenna.current.rotation.z = Math.sin(now * 2.2) * 0.09
      antenna.current.rotation.x = Math.sin(now * 1.4) * 0.035
    }

    // Procedural blink without interval timers or state updates in the render loop.
    const blinkCycle = now % 3.4
    const blinkAmount = blinkCycle > 3.22 ? Math.sin(((blinkCycle - 3.22) / 0.18) * Math.PI) : 0
    if (leftEye.current) leftEye.current.scale.y = 1 - blinkAmount * 0.88
    if (rightEye.current) rightEye.current.scale.y = 1 - blinkAmount * 0.88
  })

  return (
    <group ref={root} position={[0, -0.3, -2.35]} rotation={[0, 0, 0]} scale={0.08}>
      {/* Body */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[1.12, 1.25, 0.72]} />
        <meshStandardMaterial color="#0a1020" metalness={0.78} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.19, 0.371]}>
        <circleGeometry args={[0.19, 32]} />
        <meshBasicMaterial color="#00ff78" toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.22, 0.372]}>
        <boxGeometry args={[0.52, 0.055, 0.025]} />
        <meshBasicMaterial color="#23433a" />
      </mesh>

      {/* Head and face */}
      <group ref={head} position={[0, 1.08, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.92, 0.82, 0.74]} />
          <meshStandardMaterial color="#121b2d" metalness={0.64} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.015, 0.382]}>
          <boxGeometry args={[0.73, 0.55, 0.025]} />
          <meshStandardMaterial color="#050b12" metalness={0.2} roughness={0.18} />
        </mesh>
        <mesh ref={leftEye} position={[-0.22, 0.055, 0.405]}>
          <sphereGeometry args={[0.105, 24, 16]} />
          <meshBasicMaterial color="#00ff78" toneMapped={false} />
        </mesh>
        <mesh ref={rightEye} position={[0.22, 0.055, 0.405]}>
          <sphereGeometry args={[0.105, 24, 16]} />
          <meshBasicMaterial color="#00ff78" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.14, 0.407]}>
          <boxGeometry args={[0.19, 0.028, 0.025]} />
          <meshBasicMaterial color="#38d9ff" toneMapped={false} />
        </mesh>
        <mesh position={[-0.46, 0.03, 0.02]}>
          <boxGeometry args={[0.06, 0.24, 0.13]} />
          <meshStandardMaterial color="#38d9ff" emissive="#0a4250" />
        </mesh>
        <mesh position={[0.46, 0.03, 0.02]}>
          <boxGeometry args={[0.06, 0.24, 0.13]} />
          <meshStandardMaterial color="#38d9ff" emissive="#0a4250" />
        </mesh>
      </group>

      {/* Antenna */}
      <group ref={antenna} position={[0, 1.51, 0]}>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.035, 0.045, 0.32, 10]} />
          <meshStandardMaterial color="#26354a" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <sphereGeometry args={[0.085, 18, 12]} />
          <meshBasicMaterial color="#00ff78" toneMapped={false} />
        </mesh>
      </group>

      {/* Articulated arms: shoulder, upper arm, forearm and hand all have real pivots. */}
      <group ref={leftShoulder} position={[-0.66, 0.48, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.24, 0.48, 0.27]} />
          <meshStandardMaterial color="#17243a" metalness={0.7} roughness={0.22} />
        </mesh>
        <mesh position={[0, -0.46, 0]}>
          <sphereGeometry args={[0.145, 16, 12]} />
          <meshStandardMaterial color="#38d9ff" metalness={0.45} roughness={0.24} />
        </mesh>
        <group ref={leftForearm} position={[0, -0.46, 0]}>
          <mesh position={[0, -0.17, 0]} castShadow>
            <boxGeometry args={[0.2, 0.38, 0.23]} />
            <meshStandardMaterial color="#101a2b" metalness={0.72} roughness={0.24} />
          </mesh>
          <group ref={leftHand} position={[0, -0.38, 0]}>
            <mesh position={[0, 0, 0.09]} castShadow>
              <boxGeometry args={[0.22, 0.25, 0.075]} />
              <meshStandardMaterial color="#d2e8e5" metalness={0.3} roughness={0.28} />
            </mesh>
            {[-0.082, -0.027, 0.027, 0.082].map((x, index) => (
              <mesh key={index} position={[x, 0.17, 0.09]} castShadow>
                <boxGeometry args={[0.038, 0.13 - Math.abs(index - 1.5) * 0.012, 0.055]} />
                <meshStandardMaterial color="#d2e8e5" metalness={0.3} roughness={0.28} />
              </mesh>
            ))}
            <mesh position={[0.15, -0.025, 0.09]} rotation={[0, 0, -0.55]} castShadow>
              <boxGeometry args={[0.055, 0.13, 0.055]} />
              <meshStandardMaterial color="#d2e8e5" metalness={0.3} roughness={0.28} />
            </mesh>
            <mesh position={[0, -0.01, 0.135]}>
              <sphereGeometry args={[0.025, 12, 8]} />
              <meshBasicMaterial color="#00ff78" toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>

      <group ref={rightShoulder} position={[0.66, 0.48, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[0.24, 0.48, 0.27]} />
          <meshStandardMaterial color="#17243a" metalness={0.7} roughness={0.22} />
        </mesh>
        <mesh position={[0, -0.46, 0]}>
          <sphereGeometry args={[0.145, 16, 12]} />
          <meshStandardMaterial color="#38d9ff" metalness={0.45} roughness={0.24} />
        </mesh>
        <group ref={rightForearm} position={[0, -0.46, 0]}>
          <mesh position={[0, -0.17, 0]} castShadow>
            <boxGeometry args={[0.2, 0.38, 0.23]} />
            <meshStandardMaterial color="#101a2b" metalness={0.72} roughness={0.24} />
          </mesh>
          <group ref={rightHand} position={[0, -0.38, 0]}>
            <mesh position={[0, 0, 0.09]} castShadow>
              <boxGeometry args={[0.22, 0.25, 0.075]} />
              <meshStandardMaterial color="#d2e8e5" metalness={0.3} roughness={0.28} />
            </mesh>
            {[-0.082, -0.027, 0.027, 0.082].map((x, index) => (
              <mesh key={index} position={[x, 0.17, 0.09]} castShadow>
                <boxGeometry args={[0.038, 0.13 - Math.abs(index - 1.5) * 0.012, 0.055]} />
                <meshStandardMaterial color="#d2e8e5" metalness={0.3} roughness={0.28} />
              </mesh>
            ))}
            <mesh position={[0.15, -0.025, 0.09]} rotation={[0, 0, -0.55]} castShadow>
              <boxGeometry args={[0.055, 0.13, 0.055]} />
              <meshStandardMaterial color="#d2e8e5" metalness={0.3} roughness={0.28} />
            </mesh>
            <mesh position={[0, -0.01, 0.135]}>
              <sphereGeometry args={[0.025, 12, 8]} />
              <meshBasicMaterial color="#00ff78" toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Legs */}
      <group position={[-0.3, -0.62, 0]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <boxGeometry args={[0.3, 0.48, 0.32]} />
          <meshStandardMaterial color="#0c1423" metalness={0.76} roughness={0.24} />
        </mesh>
        <mesh position={[0, -0.38, 0.06]}>
          <boxGeometry args={[0.38, 0.14, 0.48]} />
          <meshStandardMaterial color="#18263a" metalness={0.68} roughness={0.3} />
        </mesh>
      </group>
      <group position={[0.3, -0.62, 0]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <boxGeometry args={[0.3, 0.48, 0.32]} />
          <meshStandardMaterial color="#0c1423" metalness={0.76} roughness={0.24} />
        </mesh>
        <mesh position={[0, -0.38, 0.06]}>
          <boxGeometry args={[0.38, 0.14, 0.48]} />
          <meshStandardMaterial color="#18263a" metalness={0.68} roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

function CameraRig({ phase }: { phase: IntroPhase }) {
  const { camera } = useThree()
  const phaseSeen = useRef<IntroPhase>(phase)
  const phaseStartedAt = useRef(0)

  useFrame(({ clock }, delta) => {
    const now = clock.elapsedTime
    if (phaseSeen.current !== phase) {
      phaseSeen.current = phase
      phaseStartedAt.current = now
    }
    const local = Math.max(0, now - phaseStartedAt.current)

    let x = 0
    let y = 0.72
    let z = 5.9
    if (phase === "enter") {
      const p = smooth01(local / ENTER_DURATION)
      x = THREE.MathUtils.lerp(0.35, 0, p)
      y = THREE.MathUtils.lerp(1.9, 0.45, p)
      z = THREE.MathUtils.lerp(8.5, 5.9, p)
    } else if (phase === "greeting") {
      x = Math.sin(local * 0.42) * 0.035
      y = 0.45 + Math.sin(local * 0.65) * 0.018
      z = 4.8
    } else {
      const p = smooth01(local / EXIT_DURATION)
      x = THREE.MathUtils.lerp(0, 0.12, p)
      y = THREE.MathUtils.lerp(0.45, 0.65, p)
      z = THREE.MathUtils.lerp(5.9, 7.4, p)
    }

    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 5, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 5, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 5, delta)
    camera.lookAt(0, 0.25, 0)
  })

  return null
}

export function WelcomeRobotIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<IntroPhase>("enter")
  const [dialogueStep, setDialogueStep] = useState(0)
  const [visible, setVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const completed = useRef(false)

  const dialogues = [
    "¡Hola! ¿Cómo estás? Bienvenido a mi portafolio.",
    "Soy Juan David, desarrollador Fullstack. Me gusta construir sistemas limpios y sólidos.",
    "Date una vuelta. Aquí vas a conocer lo que puedo crear.",
  ]

  const finish = useCallback(() => {
    if (completed.current) return
    completed.current = true
    setVisible(false)
    onComplete()
  }, [onComplete])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase("greeting"), 2600)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (phase !== "greeting") return
    if (dialogueStep < dialogues.length - 1) {
      const timer = window.setTimeout(() => setDialogueStep((step) => step + 1), 2900)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => setPhase("exit"), 2900)
    return () => window.clearTimeout(timer)
  }, [phase, dialogueStep, dialogues.length])

  useEffect(() => {
    if (phase !== "exit") return
    const timer = window.setTimeout(finish, 2300)
    return () => window.clearTimeout(timer)
  }, [phase, finish])

  if (!visible) return null

  const portalIntensity = phase === "enter" || phase === "exit" ? 1 : 0.48

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-[#03060b]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,120,0.09),transparent_48%)]" />
      <Canvas
        camera={{ position: [0.35, 1.9, 8.5], fov: isMobile ? 58 : 52 }}
        className="absolute inset-0"
        dpr={isMobile ? [1, 1.35] : [1, 1.75]}
        gl={{ antialias: !isMobile, alpha: true }}
      >
        <CameraRig phase={phase} />
        <color attach="background" args={["#03060b"]} />
        <fog attach="fog" args={["#03060b", 8, 18]} />
        <ambientLight intensity={0.48} />
        <pointLight position={[3.5, 4, 3]} intensity={2.1} color="#00ff78" />
        <pointLight position={[-3, 2, 2]} intensity={1.2} color="#38d9ff" />
        <spotLight position={[0, 5, 1]} angle={0.55} penumbra={0.8} intensity={1.3} color="#e2fff0" />
        <Environment preset="night" />
        <Portal intensity={portalIntensity} />
        <Robot phase={phase} dialogueStep={dialogueStep} />
        <Sparkles count={isMobile ? 35 : 80} scale={[7, 5, 3]} size={1.6} speed={0.25} color="#69ffad" opacity={0.5} />
        <ContactShadows position={[0, -1.3, 0]} opacity={0.38} scale={7} blur={2.8} />
      </Canvas>

      <div className="pointer-events-none absolute left-1/2 top-[8%] z-10 flex w-full max-w-2xl -translate-x-1/2 flex-col items-center px-5 sm:top-[10%]">
        <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.34em] text-[#75ffb0]/60 sm:text-xs">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00ff78]" />
          System online
        </div>
        <div
          key={phase === "greeting" ? dialogueStep : phase}
          className="max-w-xl rounded-2xl border border-[#75ffb0]/25 bg-[#03060b]/75 px-5 py-4 text-center font-mono text-sm leading-relaxed text-[#d9ffe8] shadow-[0_0_50px_rgba(0,255,120,0.10)] backdrop-blur-xl animate-fade-in-up sm:px-8 sm:py-5 sm:text-base"
          aria-live="polite"
        >
          {phase === "enter" ? "Iniciando protocolo de bienvenida…" : phase === "exit" ? "Abriendo el portafolio…" : dialogues[dialogueStep]}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-[0.28em] text-[#75ffb0]/35 sm:bottom-8 sm:text-[10px]">
        JUAN DAVID GUARÍN · ENTER THE SYSTEM
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-5 right-4 z-20 rounded-lg border border-white/15 bg-black/45 px-4 py-2 font-mono text-xs text-white/65 transition-colors hover:border-[#00ff78]/50 hover:text-[#baffd1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ff78] sm:bottom-7 sm:right-8 sm:text-sm"
      >
        Saltar intro <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}
