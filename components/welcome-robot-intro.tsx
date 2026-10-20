"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Sparkles, Environment, ContactShadows } from "@react-three/drei"
import { useRef, useState, useEffect } from "react"
import * as THREE from "three"

function Robot() {
  const group = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)
  const antenna = useRef<THREE.Mesh>(null)
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 150)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.4) * 0.3
      group.current.position.y = Math.sin(t * 1.2) * 0.15
    }
    if (leftArm.current) {
      leftArm.current.rotation.z = Math.sin(t * 2) * 0.4 + 0.3
    }
    if (rightArm.current) {
      rightArm.current.rotation.z = -Math.sin(t * 2.2) * 0.5 - 0.2
    }
    if (antenna.current) {
      antenna.current.rotation.z = Math.sin(t * 3) * 0.15
    }
  })

  return (
    <group ref={group} scale={1.4}>
      {/* Body */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[1.1, 1.2, 0.7]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Chest light */}
      <mesh position={[0, 0.25, 0.36]}>
        <circleGeometry args={[0.18, 32]} />
        <meshBasicMaterial color="#00ff41" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.85, 0.75, 0.7]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.25} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.22, 1.2, 0.36]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={blink ? "#001a0a" : "#00ff41"} />
      </mesh>
      <mesh position={[0.22, 1.2, 0.36]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={blink ? "#001a0a" : "#00ff41"} />
      </mesh>

      {/* Antenna */}
      <group ref={antenna} position={[0, 1.55, 0]}>
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 0.35, 8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#00ff41" />
        </mesh>
      </group>

      {/* Arms */}
      <group ref={leftArm} position={[-0.75, 0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.75, 0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.22, 0.7, 0.22]} />
          <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.28, -0.65, 0]}>
        <boxGeometry args={[0.28, 0.55, 0.28]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.28, -0.65, 0]}>
        <boxGeometry args={[0.28, 0.55, 0.28]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  )
}

export function WelcomeRobotIntro({ onComplete }: { onComplete: () => void }) {
  const [bubbleIndex, setBubbleIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  const bubbles = [
    "Hola...",
    "¿Cómo estás?",
    "¿Listo para la aventura?",
  ]

  useEffect(() => {
    if (bubbleIndex < bubbles.length) {
      const timer = setTimeout(() => setBubbleIndex((i) => i + 1), 2200)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onComplete, 600)
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [bubbleIndex, onComplete])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-700">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0.8, 4.5], fov: 45 }}
        className="absolute inset-0"
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={1.2} color="#00ff41" />
        <pointLight position={[-3, 2, 2]} intensity={0.6} color="#22d3ee" />
        <Environment preset="night" />
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
          <Robot />
        </Float>
        <Sparkles
          count={80}
          scale={[8, 6, 4]}
          size={2}
          speed={0.4}
          color="#00ff41"
          opacity={0.6}
        />
        <ContactShadows position={[0, -1.4, 0]} opacity={0.4} scale={6} blur={2.5} />
      </Canvas>

      {/* Speech bubbles */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none">
        {bubbles.slice(0, bubbleIndex).map((text, i) => (
          <div
            key={i}
            className="bg-black/70 border border-neon/40 backdrop-blur-md text-neon font-mono text-lg sm:text-xl px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(0,255,65,0.25)] animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {text}
          </div>
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(onComplete, 300)
        }}
        className="absolute bottom-8 right-8 font-mono text-xs text-muted-foreground hover:text-neon transition-colors z-20"
      >
        Saltar →
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] text-neon/40 tracking-widest">
        ROBOTITO v1.0 · INICIALIZANDO
      </div>
    </div>
  )
}
