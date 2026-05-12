import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg: "#0A0A0F",
    bg2: "#111118",
    bg3: "#16161F",
    card: "#1A1A25",
    cardHover: "#1F1F2E",
    border: "#2A2A3A",
    borderAccent: "#FF6B35",
    text: "#F0F0F8",
    muted: "#8888AA",
    dim: "#555570",
    accent: "#FF6B35",
    accentGlow: "#FF6B3540",
    green: "#00D084",
    greenGlow: "#00D08430",
    blue: "#5B9CF6",
    purple: "#A78BFA",
    gradient: "linear-gradient(135deg, #FF6B35 0%, #FF9A6B 100%)",
    termBg: "#0D0D14",
    termBorder: "#2A2A3A",
    shadow: "0 0 0 1px #2A2A3A, 0 20px 60px #00000080",
  },
  light: {
    bg: "#F8F7FF",
    bg2: "#EFEEFC",
    bg3: "#E8E7F7",
    card: "#FFFFFF",
    cardHover: "#F5F4FD",
    border: "#DDD9F5",
    borderAccent: "#FF6B35",
    text: "#1A1828",
    muted: "#6B6890",
    dim: "#9B97B8",
    accent: "#E8521A",
    accentGlow: "#FF6B3520",
    green: "#00955D",
    greenGlow: "#00D08420",
    blue: "#2563EB",
    purple: "#7C3AED",
    gradient: "linear-gradient(135deg, #E8521A 0%, #FF8B5B 100%)",
    termBg: "#1A1A2E",
    termBorder: "#2A2A3A",
    shadow: "0 0 0 1px #DDD9F5, 0 20px 60px #1A182815",
  },
};

// ─── TERMINAL DATA ────────────────────────────────────────────────────────────
const COMMANDS = [
  { cmd: "claude", desc: "Iniciar sesión interactiva con Claude Code" },
  { cmd: "claude 'escribe una función de login'", desc: "Tarea directa desde CLI" },
  { cmd: "claude --continue", desc: "Reanudar la conversación anterior" },
  { cmd: "claude --resume", desc: "Elegir sesión anterior para continuar" },
  { cmd: "claude --print 'explica este código'", desc: "Modo no interactivo (pipe-friendly)" },
  { cmd: "claude config set theme dark", desc: "Cambiar tema de la interfaz" },
  { cmd: "/help", desc: "Ver todos los comandos disponibles (dentro de sesión)" },
  { cmd: "/clear", desc: "Limpiar contexto de la conversación" },
  { cmd: "/compact", desc: "Comprimir historial para ahorrar tokens" },
  { cmd: "/doctor", desc: "Verificar estado de la instalación" },
  { cmd: "/init", desc: "Crear archivo CLAUDE.md con instrucciones del proyecto" },
  { cmd: "/cost", desc: "Mostrar tokens usados en la sesión actual" },
];

const TERMINAL_DEMO = [
  { type: "prompt", text: "$ claude 'crea una API REST con Express y MongoDB'" },
  { type: "thinking", text: "⟳  Analizando el proyecto..." },
  { type: "output", text: "✓  Leyendo estructura de archivos..." },
  { type: "output", text: "✓  Creando src/server.js" },
  { type: "output", text: "✓  Creando src/models/User.js" },
  { type: "output", text: "✓  Creando src/routes/users.js" },
  { type: "output", text: "✓  Actualizando package.json" },
  { type: "success", text: "✓  API REST lista. 4 archivos creados, 0 errores." },
  { type: "prompt", text: "$ claude 'añade autenticación JWT'" },
  { type: "thinking", text: "⟳  Planificando cambios..." },
  { type: "output", text: "✓  Instalando jsonwebtoken, bcryptjs" },
  { type: "output", text: "✓  Creando src/middleware/auth.js" },
  { type: "success", text: "✓  JWT integrado en 6 endpoints. Tests pasando." },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Agente Autónomo",
    desc: "Claude Code actúa como un desarrollador real: lee archivos, escribe código, ejecuta comandos y corrige errores sin que tengas que copiar y pegar nada.",
    color: "#FF6B35",
  },
  {
    icon: "🔍",
    title: "Comprende tu Codebase",
    desc: "Analiza todo tu proyecto de forma inteligente. Entiende dependencias, patrones y arquitectura para hacer cambios coherentes y bien integrados.",
    color: "#00D084",
  },
  {
    icon: "🛠️",
    title: "Herramientas Reales",
    desc: "Ejecuta bash, edita archivos, instala paquetes npm, corre tests y hace commits en Git. Todo desde la conversación en tu terminal.",
    color: "#5B9CF6",
  },
  {
    icon: "🔒",
    title: "Control Total",
    desc: "Tú decides qué puede hacer. Modo de aprobación para revisar cada acción antes de ejecutarla. Transparencia total en cada paso.",
    color: "#A78BFA",
  },
  {
    icon: "🧠",
    title: "Memoria de Proyecto",
    desc: "Con el archivo CLAUDE.md defines convenciones, arquitectura y reglas de tu equipo. Claude las recuerda en cada sesión.",
    color: "#F59E0B",
  },
  {
    icon: "🔌",
    title: "Extensible vía MCP",
    desc: "El protocolo MCP te permite conectar Claude Code con Jira, GitHub, Figma, bases de datos y cualquier API externa que necesites.",
    color: "#EC4899",
  },
];

const INSTALL_STEPS = [
  {
    step: "01",
    title: "Requisitos previos",
    desc: "Necesitas Node.js 18+ instalado en tu sistema.",
    code: "node --version\n# Debe mostrar v18.0.0 o superior",
  },
  {
    step: "02",
    title: "Instalar Claude Code",
    desc: "Instala globalmente via npm en tu terminal.",
    code: "npm install -g @anthropic-ai/claude-code",
  },
  {
    step: "03",
    title: "Autenticar con Anthropic",
    desc: "Inicia Claude Code y sigue el proceso de login con tu cuenta de Anthropic.",
    code: "claude\n# Te pedirá autenticarte en el navegador",
  },
  {
    step: "04",
    title: "¡Listo para usar!",
    desc: "Navega a tu proyecto y empieza a trabajar con Claude Code.",
    code: "cd mi-proyecto\nclaude 'explícame la arquitectura de este proyecto'",
  },
];

const USECASES = [
  {
    tag: "Refactorización",
    title: "Moderniza código legacy",
    desc: 'Dile "refactoriza este módulo a TypeScript con ESM y añade JSDoc" y Claude Code lo hace en segundos, manteniendo la lógica intacta.',
    icon: "🔄",
  },
  {
    tag: "Debug",
    title: "Diagnóstico y reparación",
    desc: 'Comparte el error y escribe "arregla este bug". Claude lee los logs, traza la causa raíz y aplica el fix con un solo comando.',
    icon: "🐛",
  },
  {
    tag: "Testing",
    title: "Cobertura de tests",
    desc: '"Escribe tests unitarios para todos los servicios" — Claude analiza cada función y genera tests con Jest, Vitest o el framework que uses.',
    icon: "✅",
  },
  {
    tag: "Documentación",
    title: "Docs siempre actualizados",
    desc: '"Genera el README completo basado en el código actual" — documentación precisa, siempre sincronizada con la realidad del proyecto.',
    icon: "📄",
  },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useIntersection(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function TerminalLine({ line, delay, visible }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [visible, delay]);

  const colors = {
    prompt: "#FF6B35",
    thinking: "#F59E0B",
    output: "#8888AA",
    success: "#00D084",
  };

  return (
    <div style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateX(0)" : "translateX(-10px)",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      padding: "3px 0",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "13px",
      color: colors[line.type] || "#8888AA",
    }}>
      {line.text}
    </div>
  );
}

function CommandCard({ cmd, desc, t }) {
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? t.cardHover : t.card,
        border: `1px solid ${hover ? t.borderAccent + "60" : t.border}`,
        borderRadius: "10px",
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? `0 8px 24px ${t.accentGlow}` : "none",
      }}
      onClick={copy}
    >
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "13px",
        color: t.accent,
        marginBottom: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span>{cmd}</span>
        <span style={{ fontSize: "11px", color: t.muted, opacity: hover ? 1 : 0, transition: "opacity 0.2s" }}>
          {copied ? "✓ copiado" : "clic para copiar"}
        </span>
      </div>
      <div style={{ fontSize: "13px", color: t.muted }}>{desc}</div>
    </div>
  );
}

function FeatureCard({ feature, t, delay, visible }) {
  const [show, setShow] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [visible, delay]);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: t.card,
        border: `1px solid ${hover ? feature.color + "50" : t.border}`,
        borderRadius: "16px",
        padding: "28px",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms, border-color 0.2s`,
        boxShadow: hover ? `0 12px 40px ${feature.color}20` : "none",
        cursor: "default",
      }}
    >
      <div style={{
        width: "52px", height: "52px",
        background: feature.color + "18",
        border: `1px solid ${feature.color}40`,
        borderRadius: "14px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "26px",
        marginBottom: "18px",
        boxShadow: hover ? `0 0 20px ${feature.color}30` : "none",
        transition: "box-shadow 0.2s",
      }}>
        {feature.icon}
      </div>
      <h3 style={{ fontSize: "17px", fontWeight: "700", color: t.text, marginBottom: "10px", fontFamily: "'Fraunces', serif" }}>
        {feature.title}
      </h3>
      <p style={{ fontSize: "14px", lineHeight: "1.7", color: t.muted }}>{feature.desc}</p>
    </div>
  );
}

function InstallStep({ step, t, delay, visible }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [visible, delay]);

  return (
    <div style={{
      opacity: show ? 1 : 0,
      transform: show ? "translateX(0)" : "translateX(-30px)",
      transition: `all 0.6s cubic-bezier(0.34,1.2,0.64,1)`,
      transitionDelay: `${delay}ms`,
    }}>
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        <div style={{
          minWidth: "52px", height: "52px",
          background: t.gradient,
          borderRadius: "14px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "14px", fontWeight: "700",
          color: "#fff",
          boxShadow: `0 4px 16px ${t.accentGlow}`,
          flexShrink: 0,
        }}>{step.step}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: t.text, marginBottom: "6px", fontFamily: "'Fraunces', serif" }}>
            {step.title}
          </h3>
          <p style={{ fontSize: "14px", color: t.muted, marginBottom: "14px", lineHeight: "1.6" }}>{step.desc}</p>
          <div style={{
            background: t.termBg,
            border: `1px solid ${t.termBorder}`,
            borderRadius: "10px",
            padding: "14px 16px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            color: t.green,
            whiteSpace: "pre",
            overflowX: "auto",
          }}>
            {step.code}
          </div>
        </div>
      </div>
      <div style={{ width: "1px", height: "28px", background: t.border, marginLeft: "25px", marginTop: "8px" }} />
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [show, setShow] = useState(false);
  const [termVisible, setTermVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = THEMES[theme];

  const [featRef, featVisible] = useIntersection(0.1);
  const [installRef, installVisible] = useIntersection(0.1);
  const [cmdRef, cmdVisible] = useIntersection(0.1);
  const [usecaseRef, usecaseVisible] = useIntersection(0.1);

  useEffect(() => {
    // Load fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap";
    document.head.appendChild(link);

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = t.bg;

    setTimeout(() => setShow(true), 100);
    setTimeout(() => setTermVisible(true), 600);
  }, []);

  useEffect(() => {
    document.body.style.background = t.bg;
  }, [theme, t.bg]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "¿Qué es?", id: "features" },
    { label: "Instalación", id: "install" },
    { label: "Comandos", id: "commands" },
    { label: "Casos de uso", id: "usecases" },
  ];

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif",
      background: t.bg,
      color: t.text,
      minHeight: "100vh",
      overflowX: "hidden",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${t.bg2}; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 3px; }
        ::selection { background: ${t.accent}40; color: ${t.text}; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px ${t.accentGlow}; }
          50% { box-shadow: 0 0 40px ${t.accentGlow}, 0 0 60px ${t.accentGlow}; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: ${t.muted};
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: none;
          background: none;
          border: none;
          padding: 0;
        }
        .nav-link:hover { color: ${t.text}; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 44px !important; }
          .hero-sub { font-size: 16px !important; }
          .section-title { font-size: 32px !important; }
          .commands-grid { grid-template-columns: 1fr !important; }
          .usecases-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: `1px solid ${t.border}`,
        backdropFilter: "blur(20px)",
        background: t.bg + "CC",
        padding: "0 24px",
        height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "34px", height: "34px",
            background: t.gradient,
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
            boxShadow: `0 0 16px ${t.accentGlow}`,
          }}>🤖</div>
          <span style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: "700", fontSize: "18px", color: t.text,
          }}>
            Claude <span style={{ color: t.accent }}>Code</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {navLinks.map(l => (
            <button key={l.id} className="nav-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
          ))}
        </nav>

        {/* Right controls */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
              background: t.card, border: `1px solid ${t.border}`,
              borderRadius: "8px", padding: "6px 12px",
              cursor: "pointer", fontSize: "16px", color: t.text,
              transition: "all 0.2s",
            }}
          >{theme === "dark" ? "☀️" : "🌙"}</button>
          <a
            href="https://docs.anthropic.com/es/docs/claude-code/overview"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: t.gradient,
              color: "#fff", border: "none", borderRadius: "8px",
              padding: "8px 16px", fontSize: "13px", fontWeight: "600",
              cursor: "pointer", textDecoration: "none",
              boxShadow: `0 4px 12px ${t.accentGlow}`,
              display: "inline-block",
            }}
          >Docs oficiales →</a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ paddingTop: "140px", paddingBottom: "80px", position: "relative", overflow: "hidden" }}>
        {/* Background orbs */}
        <div style={{
          position: "absolute", top: "10%", right: "10%",
          width: "500px", height: "500px",
          background: `radial-gradient(circle, ${t.accent}12, transparent 70%)`,
          borderRadius: "50%", pointerEvents: "none",
          animation: "float 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "0%", left: "5%",
          width: "400px", height: "400px",
          background: `radial-gradient(circle, ${t.green}10, transparent 70%)`,
          borderRadius: "50%", pointerEvents: "none",
          animation: "float 10s ease-in-out infinite reverse",
        }} />

        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, ${t.border} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.4,
        }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", position: "relative" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: t.card, border: `1px solid ${t.border}`,
            borderRadius: "100px", padding: "6px 16px",
            fontSize: "13px", color: t.muted,
            marginBottom: "32px",
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease 0.1s",
          }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: t.green, display: "inline-block", boxShadow: `0 0 8px ${t.green}` }} />
            Herramienta oficial de Anthropic
          </div>

          {/* Title */}
          <h1
            className="hero-title"
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "72px",
              fontWeight: "900",
              lineHeight: "1.05",
              letterSpacing: "-2px",
              marginBottom: "24px",
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.7s cubic-bezier(0.34,1.2,0.64,1) 0.2s",
            }}
          >
            Desarrolla con IA<br />
            <span style={{ background: t.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              desde tu terminal
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-sub"
            style={{
              fontSize: "20px", lineHeight: "1.65", color: t.muted,
              maxWidth: "560px", marginBottom: "40px",
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease 0.35s",
            }}
          >
            <strong style={{ color: t.text }}>Claude Code</strong> es el agente de IA que vive en tu terminal.
            Lee tu código, escribe cambios, ejecuta comandos y aprende de tu proyecto — todo en lenguaje natural.
          </p>

          {/* CTA buttons */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "12px",
            opacity: show ? 1 : 0,
            transition: "opacity 0.7s ease 0.5s",
          }}>
            <button
              onClick={() => scrollTo("install")}
              style={{
                background: t.gradient, color: "#fff",
                border: "none", borderRadius: "12px",
                padding: "14px 28px", fontSize: "15px", fontWeight: "700",
                cursor: "pointer",
                boxShadow: `0 8px 24px ${t.accentGlow}`,
                animation: "pulse-glow 3s ease-in-out infinite",
              }}
            >Instalar ahora →</button>
            <button
              onClick={() => scrollTo("commands")}
              style={{
                background: "transparent", color: t.text,
                border: `1px solid ${t.border}`, borderRadius: "12px",
                padding: "14px 28px", fontSize: "15px", fontWeight: "600",
                cursor: "pointer",
              }}
            >Ver comandos</button>
          </div>

          {/* Terminal demo */}
          <div style={{
            marginTop: "60px",
            background: t.termBg,
            border: `1px solid ${t.termBorder}`,
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: t.shadow,
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.8s cubic-bezier(0.34,1.2,0.64,1) 0.6s",
          }}>
            {/* Terminal header */}
            <div style={{
              padding: "14px 20px",
              borderBottom: `1px solid ${t.termBorder}`,
              display: "flex", alignItems: "center", gap: "8px",
              background: "#0A0A12",
            }}>
              {["#FF5F56", "#FFBD2E", "#27C93F"].map((c, i) => (
                <div key={i} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />
              ))}
              <span style={{
                marginLeft: "8px", fontFamily: "'JetBrains Mono', monospace",
                fontSize: "13px", color: "#666688",
              }}>claude-code — bash</span>
            </div>
            {/* Terminal body */}
            <div style={{ padding: "24px", minHeight: "260px" }}>
              {TERMINAL_DEMO.map((line, i) => (
                <TerminalLine key={i} line={line} delay={i * 400} visible={termVisible} />
              ))}
              <div style={{
                display: "inline-block", width: "8px", height: "16px",
                background: t.accent, marginTop: "8px",
                animation: "blink 1s infinite",
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div style={{
        borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`,
        padding: "28px 24px",
        background: t.bg2,
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: "24px",
        }}>
          {[
            { label: "Herramientas disponibles", value: "10+" },
            { label: "Sistemas operativos", value: "Mac / Linux / WSL" },
            { label: "Modelos de Claude", value: "Sonnet · Haiku · Opus" },
            { label: "Protocolo de extensiones", value: "MCP Compatible" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: "700", color: t.accent }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: t.muted, marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: t.accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Capacidades</p>
            <h2
              className="section-title"
              style={{ fontFamily: "'Fraunces', serif", fontSize: "44px", fontWeight: "900", letterSpacing: "-1px", lineHeight: "1.1" }}>
              ¿Por qué Claude Code<br />cambia la forma de trabajar?
            </h2>
          </div>
          <div
            ref={featRef}
            className="features-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}
          >
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} feature={f} t={t} delay={i * 100} visible={featVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTALL ── */}
      <section id="install" style={{ padding: "100px 24px", background: t.bg2 }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: t.green, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Instalación</p>
            <h2
              className="section-title"
              style={{ fontFamily: "'Fraunces', serif", fontSize: "44px", fontWeight: "900", letterSpacing: "-1px" }}>
              Listo en 4 pasos
            </h2>
          </div>
          <div ref={installRef}>
            {INSTALL_STEPS.map((s, i) => (
              <InstallStep key={i} step={s} t={t} delay={i * 150} visible={installVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMANDS ── */}
      <section id="commands" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: t.blue, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Referencia rápida</p>
            <h2
              className="section-title"
              style={{ fontFamily: "'Fraunces', serif", fontSize: "44px", fontWeight: "900", letterSpacing: "-1px" }}>
              Comandos esenciales
            </h2>
            <p style={{ fontSize: "15px", color: t.muted, marginTop: "14px" }}>Clic en cualquier comando para copiarlo al portapapeles</p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
            {["CLI (desde bash)", "Slash commands (en sesión)"].map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: "8px 20px", borderRadius: "100px",
                  border: `1px solid ${activeTab === i ? t.accent : t.border}`,
                  background: activeTab === i ? t.accent + "20" : "transparent",
                  color: activeTab === i ? t.accent : t.muted,
                  fontSize: "14px", fontWeight: "500", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >{tab}</button>
            ))}
          </div>

          <div
            ref={cmdRef}
            className="commands-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}
          >
            {(activeTab === 0
              ? COMMANDS.filter(c => !c.cmd.startsWith("/"))
              : COMMANDS.filter(c => c.cmd.startsWith("/"))
            ).map((c, i) => (
              <CommandCard key={i} cmd={c.cmd} desc={c.desc} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section id="usecases" style={{ padding: "100px 24px", background: t.bg2 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: t.purple, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Flujos de trabajo</p>
            <h2
              className="section-title"
              style={{ fontFamily: "'Fraunces', serif", fontSize: "44px", fontWeight: "900", letterSpacing: "-1px" }}>
              ¿Para qué se usa en el día a día?
            </h2>
          </div>
          <div
            ref={usecaseRef}
            className="usecases-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}
          >
            {USECASES.map((u, i) => {
              const [show, setShow] = useState(false);
              const [hover, setHover] = useState(false);
              useEffect(() => {
                if (!usecaseVisible) return;
                const t2 = setTimeout(() => setShow(true), i * 120);
                return () => clearTimeout(t2);
              }, [usecaseVisible]);

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                  style={{
                    background: t.card,
                    border: `1px solid ${hover ? t.borderAccent + "50" : t.border}`,
                    borderRadius: "16px", padding: "32px",
                    opacity: show ? 1 : 0,
                    transform: show ? "translateY(0)" : "translateY(24px)",
                    transition: "all 0.6s cubic-bezier(0.34,1.2,0.64,1)",
                    boxShadow: hover ? `0 12px 40px ${t.accentGlow}` : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "32px" }}>{u.icon}</span>
                    <span style={{
                      fontSize: "12px", fontWeight: "700",
                      background: t.accent + "20", color: t.accent,
                      padding: "3px 10px", borderRadius: "100px",
                      border: `1px solid ${t.accent}40`,
                    }}>{u.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", fontWeight: "700", color: t.text, marginBottom: "10px" }}>
                    {u.title}
                  </h3>
                  <p style={{ fontSize: "14px", lineHeight: "1.7", color: t.muted }}>{u.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CLAUDE.MD EXPLAINER ── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{
            background: `linear-gradient(135deg, ${t.card} 0%, ${t.bg3} 100%)`,
            border: `1px solid ${t.border}`,
            borderRadius: "24px",
            padding: "60px",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px",
            alignItems: "center",
          }}>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "600", color: t.accent, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Memoria persistente</p>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "36px", fontWeight: "900", letterSpacing: "-1px", marginBottom: "16px" }}>
                El archivo <span style={{ color: t.accent }}>CLAUDE.md</span>
              </h2>
              <p style={{ fontSize: "15px", lineHeight: "1.7", color: t.muted }}>
                Crea un archivo <code style={{ background: t.termBg, padding: "2px 6px", borderRadius: "4px", fontSize: "13px", color: t.green }}>CLAUDE.md</code> en la raíz de tu proyecto para que Claude recuerde las reglas de tu equipo: convenciones de código, arquitectura, librerías preferidas y tareas frecuentes.
              </p>
              <button
                onClick={() => scrollTo("install")}
                style={{
                  marginTop: "24px",
                  background: t.gradient, color: "#fff",
                  border: "none", borderRadius: "10px",
                  padding: "12px 22px", fontSize: "14px", fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: `0 6px 20px ${t.accentGlow}`,
                }}
              >Empezar →</button>
            </div>
            <div>
              <div style={{
                background: t.termBg, border: `1px solid ${t.termBorder}`,
                borderRadius: "12px", overflow: "hidden",
              }}>
                <div style={{ padding: "10px 16px", borderBottom: `1px solid ${t.termBorder}`, background: "#0A0A12" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#666688" }}>CLAUDE.md</span>
                </div>
                <pre style={{
                  padding: "20px 16px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px", lineHeight: "1.8",
                  color: "#C8C8E8",
                  overflowX: "auto",
                  margin: 0,
                }}>{`# Proyecto: Mi API

## Stack
- Node.js + Express + TypeScript
- PostgreSQL con Prisma ORM
- Jest para tests

## Convenciones
- Funciones en camelCase
- Rutas en kebab-case
- Commits en español

## Comandos frecuentes
- \`npm run dev\` — servidor local
- \`npm test\` — ejecutar tests`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px", height: "600px",
          background: `radial-gradient(circle, ${t.accent}15, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", maxWidth: "660px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "52px", fontWeight: "900",
            letterSpacing: "-2px", lineHeight: "1.05",
            marginBottom: "20px",
          }}>
            Empieza hoy.<br />
            <span style={{ background: t.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Es gratis instalarlo.
            </span>
          </h2>
          <p style={{ fontSize: "17px", color: t.muted, lineHeight: "1.65", marginBottom: "40px" }}>
            Solo necesitas Node.js y una cuenta de Anthropic. El primer paso es un solo comando.
          </p>
          <div style={{
            background: t.termBg, border: `1px solid ${t.termBorder}`,
            borderRadius: "14px", padding: "20px 28px",
            display: "inline-block", marginBottom: "36px",
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "18px", color: t.green,
            }}>npm install -g @anthropic-ai/claude-code</span>
          </div>
          <br />
          <a
            href="https://docs.anthropic.com/es/docs/claude-code/overview"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: t.gradient, color: "#fff",
              textDecoration: "none",
              borderRadius: "14px", padding: "16px 36px",
              fontSize: "16px", fontWeight: "700",
              boxShadow: `0 8px 32px ${t.accentGlow}`,
            }}
          >Ver documentación oficial →</a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: `1px solid ${t.border}`,
        padding: "32px 24px",
        background: t.bg2,
        textAlign: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
          <span style={{ fontSize: "18px" }}>🤖</span>
          <span style={{ fontFamily: "'Fraunces', serif", fontWeight: "700", fontSize: "16px" }}>
            Claude <span style={{ color: t.accent }}>Code</span>
          </span>
        </div>
        <p style={{ fontSize: "13px", color: t.dim }}>
          Sitio educativo no oficial · Creado con React + Vite · Información basada en la{" "}
          <a href="https://docs.anthropic.com/es/docs/claude-code/overview" target="_blank" rel="noopener noreferrer" style={{ color: t.accent, textDecoration: "none" }}>
            documentación oficial de Anthropic
          </a>
        </p>
      </footer>
    </div>
  );
}
