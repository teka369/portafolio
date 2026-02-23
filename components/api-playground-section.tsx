"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Server, 
  Database, 
  Zap, 
  Shield, 
  Activity, 
  Globe, 
  Cpu, 
  HardDrive,
  Play,
  Square,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Code,
  Layout,
  Layers
} from "lucide-react"

interface ServiceStatus {
  name: string
  status: "online" | "offline" | "starting" | "error"
  icon: React.ReactNode
  description: string
}

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  description: string
  response?: string
}

export function ApiPlaygroundSection() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "API Server", status: "online", icon: <Server className="h-4 w-4" />, description: "RESTful API Gateway" },
    { name: "Database", status: "online", icon: <Database className="h-4 w-4" />, description: "PostgreSQL Cluster" },
    { name: "Cache", status: "online", icon: <Zap className="h-4 w-4" />, description: "Redis Cache Layer" },
    { name: "Auth", status: "online", icon: <Shield className="h-4 w-4" />, description: "JWT Authentication" },
    { name: "CDN", status: "online", icon: <Globe className="h-4 w-4" />, description: "Global Content Delivery" },
  ])

  const [activeEndpoint, setActiveEndpoint] = useState<ApiEndpoint | null>(null)
  const [response, setResponse] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const endpoints: ApiEndpoint[] = [
    { method: "GET", path: "/api/users", description: "List all users" },
    { method: "POST", path: "/api/auth/login", description: "Authenticate user" },
    { method: "GET", path: "/api/projects", description: "Get portfolio projects" },
    { method: "POST", path: "/api/contact", description: "Send contact message" },
    { method: "PUT", path: "/api/profile", description: "Update user profile" },
  ]

  const toggleService = useCallback((index: number) => {
    setServices(prev => prev.map((service, i) => {
      if (i === index) {
        const newStatus = service.status === "online" ? "offline" : "starting"
        return { ...service, status: newStatus }
      }
      return service
    }))

    // Simulate status change
    setTimeout(() => {
      setServices(prev => prev.map((service, i) => {
        if (i === index && service.status !== "online") {
          return { ...service, status: "online" }
        }
        return service
      }))
    }, 2000)
  }, [])

  const simulateApiCall = useCallback(async (endpoint: ApiEndpoint) => {
    setIsLoading(true)
    setActiveEndpoint(endpoint)
    setResponse("")

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

    const mockResponses: Record<string, string> = {
      "/api/users": `{\n  "users": [\n    {"id": 1, "name": "John Doe", "role": "admin"},\n    {"id": 2, "name": "Jane Smith", "role": "user"}\n  ],\n  "total": 2\n}`,
      "/api/auth/login": `{\n  "token": "eyJhbGciOiJIUzI1NiIs...",\n  "expiresIn": 3600,\n  "user": {"id": 1, "email": "user@example.com"}\n}`,
      "/api/projects": `{\n  "projects": [\n    {\n      "id": "proj_001",\n      "name": "E-commerce Platform",\n      "tech": ["Node.js", "React", "PostgreSQL"]\n    }\n  ]\n}`,
      "/api/contact": `{\n  "success": true,\n  "message": "Message sent successfully",\n  "id": "msg_abc123"\n}`,
      "/api/profile": `{\n  "updated": true,\n  "user": {\n    "name": "Updated Name",\n    "avatar": "https://..."\n  }\n}`,
    }

    setResponse(mockResponses[endpoint.path] || '{"error": "Unknown endpoint"}')
    setIsLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-neon bg-neon/10 border-neon/30"
      case "offline": return "text-red-500 bg-red-500/10 border-red-500/30"
      case "starting": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30"
      case "error": return "text-red-500 bg-red-500/10 border-red-500/30"
      default: return "text-muted-foreground bg-muted/10 border-muted-foreground/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <CheckCircle className="h-3 w-3" />
      case "offline": return <XCircle className="h-3 w-3" />
      case "starting": return <Clock className="h-3 w-3" />
      case "error": return <XCircle className="h-3 w-3" />
      default: return <Activity className="h-3 w-3" />
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "POST": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "PUT": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "DELETE": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-muted/20 text-muted-foreground border-muted-foreground/30"
    }
  }

  return (
    <section id="api-playground" className="relative py-24 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-transparent" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0,255,65,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(0,255,65,0.05) 0%, transparent 50%)`
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Section header */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex-1 h-px bg-border max-w-20" />
          <span className="font-mono text-sm text-neon">{"05."}</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">API Playground</h2>
          <div className="flex-1 h-px bg-border max-w-20" />
        </div>

        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Demo interactiva de mis habilidades como Fullstack Developer. 
          Controla los servicios backend y prueba los endpoints de la API.
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Service Control Panel */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-neon/20 transition-colors">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="h-4 w-4 text-neon" />
              <h3 className="font-mono text-sm text-neon">Control de Servicios</h3>
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {services.filter(s => s.status === "online").length}/{services.length} activos
              </span>
            </div>

            <div className="space-y-3">
              {services.map((service, index) => (
                <div 
                  key={service.name}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                    service.status === "online" 
                      ? "bg-neon/5 border-neon/20" 
                      : "bg-secondary/30 border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${
                      service.status === "online" ? "bg-neon/10 text-neon" : "bg-secondary text-muted-foreground"
                    }`}>
                      {service.icon}
                    </div>
                    <div>
                      <p className="font-mono text-sm text-foreground">{service.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleService(index)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs transition-all duration-300 ${
                      service.status === "online"
                        ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                        : "bg-neon/10 text-neon border border-neon/30 hover:bg-neon/20"
                    }`}
                  >
                    {service.status === "online" ? (
                      <><Square className="h-3 w-3" /> Apagar</>
                    ) : (
                      <><Play className="h-3 w-3" /> Iniciar</>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* System metrics */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-mono text-xs text-muted-foreground mb-4">MÉTRICAS DEL SISTEMA</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Cpu className="h-3 w-3 text-neon" />
                    <span className="font-mono text-lg text-foreground">78%</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">CPU</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <HardDrive className="h-3 w-3 text-neon" />
                    <span className="font-mono text-lg text-foreground">2.4GB</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">RAM</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Activity className="h-3 w-3 text-neon" />
                    <span className="font-mono text-lg text-foreground">143</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">REQ/s</span>
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoint Tester */}
          <div className="bg-card border border-border rounded-lg p-6 hover:border-neon/20 transition-colors">
            <div className="flex items-center gap-2 mb-6">
              <Code className="h-4 w-4 text-neon" />
              <h3 className="font-mono text-sm text-neon">API Endpoint Tester</h3>
            </div>

            <div className="space-y-2 mb-4">
              {endpoints.map((endpoint) => (
                <button
                  key={endpoint.path}
                  onClick={() => simulateApiCall(endpoint)}
                  disabled={isLoading}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-300 ${
                    activeEndpoint?.path === endpoint.path
                      ? "bg-neon/10 border-neon/30"
                      : "bg-secondary/30 border-border hover:border-neon/20"
                  } disabled:opacity-50`}
                >
                  <span className={`px-2 py-0.5 rounded font-mono text-xs border ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <span className="font-mono text-sm text-foreground flex-1">{endpoint.path}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>

            {/* Response viewer */}
            <div className="bg-terminal-bg border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-secondary/30">
                <span className="font-mono text-xs text-muted-foreground">
                  {isLoading ? "Ejecutando..." : activeEndpoint ? `Response: ${activeEndpoint.path}` : "Response"}
                </span>
                {isLoading && <RefreshCw className="h-3 w-3 text-neon animate-spin" />}
              </div>
              <div className="p-4 min-h-[200px] max-h-[250px] overflow-auto">
                {response ? (
                  <pre className="font-mono text-xs text-neon whitespace-pre-wrap">
                    {response}
                  </pre>
                ) : (
                  <p className="font-mono text-xs text-muted-foreground text-center py-8">
                    Haz clic en un endpoint para ver la respuesta
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills demonstration */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-card/50 border border-border rounded-lg p-6 text-center hover:border-neon/20 transition-colors">
            <Layout className="h-8 w-8 text-neon mx-auto mb-3" />
            <h4 className="font-bold text-foreground mb-2">Frontend Design</h4>
            <p className="text-sm text-muted-foreground">
              Interfaces modernas con React, Tailwind CSS y animaciones fluidas.
              Diseño UX/UI centrado en el usuario.
            </p>
          </div>
          <div className="bg-card/50 border border-border rounded-lg p-6 text-center hover:border-neon/20 transition-colors">
            <Server className="h-8 w-8 text-neon mx-auto mb-3" />
            <h4 className="font-bold text-foreground mb-2">Backend Architecture</h4>
            <p className="text-sm text-muted-foreground">
              APIs RESTful/GraphQL, bases de datos PostgreSQL, Redis cache,
              autenticación JWT y microservicios.
            </p>
          </div>
          <div className="bg-card/50 border border-border rounded-lg p-6 text-center hover:border-neon/20 transition-colors">
            <Globe className="h-8 w-8 text-neon mx-auto mb-3" />
            <h4 className="font-bold text-foreground mb-2">API Integration</h4>
            <p className="text-sm text-muted-foreground">
              Integración con APIs de terceros, webhooks, pagos Stripe,
              servicios cloud y部署(Deployment).
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
