"use client"

import { useState } from "react"
import { MatrixRain } from "@/components/matrix-rain"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { SkillsSection } from "@/components/skills-section"
import { FeaturesSection } from "@/components/features-section"
import { ServerRackSection } from "@/components/server-rack-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"
import { ApiPlaygroundSection } from "@/components/api-playground-section"
import { Footer } from "@/components/footer"
import { ServerStatus } from "@/components/server-status"
import { WelcomeRobotIntro } from "@/components/welcome-robot-intro"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <>
      {showIntro && <WelcomeRobotIntro onComplete={() => setShowIntro(false)} />}

      <div className={showIntro ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-700"}>
        <MatrixRain />
        <Navigation />
        <ServerStatus />
        <main className="relative z-10">
          <HeroSection />
          <div className="relative">
            {/* Decorative side lines */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border/30 hidden xl:block" aria-hidden="true">
              <div className="sticky top-1/2 w-1 h-1 -translate-x-[1.5px] bg-neon rounded-full shadow-[0_0_8px_rgba(0,255,65,0.5)]" />
            </div>
            <div className="absolute right-8 top-0 bottom-0 w-px bg-border/30 hidden xl:block" aria-hidden="true">
              <div className="sticky top-1/3 w-1 h-1 -translate-x-[1.5px] bg-neon/50 rounded-full" />
            </div>

            <AboutSection />
            <SkillsSection />
            <ServerRackSection />
            <FeaturesSection />
            <ProjectsSection />
            <ApiPlaygroundSection />
            <ContactSection />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
