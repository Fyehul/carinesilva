import { useState, useEffect, useRef } from "react";
import type { FC, ReactNode } from "react";
import "./App.css";
import CarineImg from "./assets/img/Carine.png";

// ── Constantes ────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "5579999267884";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá Carine! Vi seu site e gostaria de saber mais sobre os imóveis disponíveis."
);
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

// Único token ainda usado inline (em <em> e spans de cor)
const GOLD = "#C9A96E";

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface Especialidade {
  icon: string;
  title: string;
  desc: string;
}

interface Empreendimento {
  nome: string;
  tipo: string;
  local: string;
}

// ── Dados ─────────────────────────────────────────────────────────────────────
const especialidades: Especialidade[] = [
  {
    icon: "🏗️",
    title: "Imóveis na Planta",
    desc: "Acesso antecipado aos melhores lançamentos imobiliários de Aracaju e região, com condições exclusivas de pré-venda.",
  },
  {
    icon: "🌿",
    title: "Lotes e Condomínios",
    desc: "Terrenos estrategicamente localizados em condomínios fechados, com toda infraestrutura e segurança.",
  },
  {
    icon: "🏝️",
    title: "Barra dos Coqueiros",
    desc: "Especialista no mercado da Barra: lotes à beira do Rio Pomonga, alto potencial de valorização.",
  },
  {
    icon: "🏙️",
    title: "Grande Aracaju",
    desc: "Portfólio diversificado na capital e entorno, para quem busca praticidade e localização premium.",
  },
];

const empreendimentos: Empreendimento[] = [
  { nome: "Aldeia Aruanã",  tipo: "Condomínio Fechado", local: "Barra dos Coqueiros" },
  { nome: "Mood Farol",     tipo: "Apartamentos",       local: "Farol"               },
  { nome: "Flor de Lótus",  tipo: "Lançamento",         local: "Aracaju"             },
  { nome: "Terraços",       tipo: "Lotes",              local: "Grande Aracaju"      },
  { nome: "Pérolas do Mar", tipo: "Condomínio",         local: "Barra dos Coqueiros" },
  { nome: "Ilha Bela",      tipo: "Lotes",              local: "Barra dos Coqueiros" },
];

// ── Ícones ────────────────────────────────────────────────────────────────────
const WhatsappIcon: FC<{ size?: number; color?: string }> = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const PinIcon: FC = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ── Hook: Reveal on scroll ────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: garante visibilidade mesmo se o observer não disparar
    const fallback = setTimeout(() => el.classList.add("visible"), 800);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallback);
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.04, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);
  return ref;
}

// ── Componentes utilitários ───────────────────────────────────────────────────
interface RevealBoxProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

const RevealBox: FC<RevealBoxProps> = ({ children, delay = 0, className = "" }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const SectionLabel: FC<{ text: string; dark?: boolean }> = ({ text, dark = false }) => (
  <p className={`section-label ${dark ? "section-label--dark" : ""}`}>
    <span className="gold-line" />
    {text}
  </p>
);

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar: FC<{ scrolled: boolean }> = ({ scrolled }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks: [string, string][] = [
    ["Sobre",            "#sobre"],
    ["Especialidades",   "#especialidades"],
    ["Empreendimentos",  "#empreendimentos"],
    ["Contato",          "#contato"],
  ];

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="nav-inner">
          {/* Logo */}
          <a href="#" className="nav-logo">
            Carine<span className="nav-logo__gold"> Silva</span>
          </a>

          {/* Links desktop */}
          <div className="nav-links">
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} className="nav-link">{label}</a>
            ))}
            <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn-gold btn-gold--sm">
              Falar Agora
            </a>
          </div>

          {/* Hamburger mobile */}
          <button
            className={`nav-hamburger ${menuOpen ? "nav-hamburger--open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Menu mobile overlay */}
      <div className={`nav-mobile-menu ${menuOpen ? "nav-mobile-menu--open" : ""}`}>
        {navLinks.map(([label, href]) => (
          <a key={href} href={href} className="nav-mobile-link" onClick={handleLinkClick}>
            {label}
          </a>
        ))}
        <a
          href={WA_LINK}
          target="_blank"
          rel="noreferrer"
          className="btn-gold nav-mobile-wa"
          onClick={handleLinkClick}
        >
          <WhatsappIcon size={18} />
          Falar pelo WhatsApp
        </a>
      </div>
    </>
  );
};

// ── Hero ──────────────────────────────────────────────────────────────────────
const Hero: FC = () => (
  <section className="hero-section">
    <div className="hero-grid-bg" />
    <div className="hero-glow" />

    <div className="hero-inner">
      <div className="hero-grid">

        {/* Coluna de texto */}
        <div className="hero-text">
          <div style={{ animation: "fadeUp 0.9s ease both" }}>
            <p className="hero-creci">CRECI 5180 PF · Sergipe</p>
            <h1 className="hero-name hero-name--light">Carine</h1>
            <h1 className="hero-name hero-name--gold">Silva</h1>
            <p className="hero-desc">
              Corretora especializada em imóveis na planta e lotes em condomínios
              fechados. Barra dos Coqueiros e Grande Aracaju — seu investimento
              começa aqui.
            </p>
          </div>

          <div className="hero-cta" style={{ animation: "fadeUp 0.9s 0.2s ease both", animationFillMode: "both" }}>
            <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn-gold">
              <WhatsappIcon size={18} />
              Falar pelo WhatsApp
            </a>
            <a href="#empreendimentos" className="btn-outline">Ver Imóveis</a>
          </div>

          <div className="hero-stats" style={{ animation: "fadeIn 1s 0.5s ease both", animationFillMode: "both" }}>
            {([["8,5k+", "Seguidores"], ["445+", "Publicações"], ["CRECI", "5180 PF"]] as [string, string][]).map(
              ([val, label]) => (
                <div key={label} className="hero-stat">
                  <p className="hero-stat__val">{val}</p>
                  <p className="hero-stat__label">{label}</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Coluna da foto */}
        <div className="hero-img-wrap" style={{ animation: "fadeIn 1.1s 0.15s ease both", animationFillMode: "both" }}>
          <div className="hero-img-frame">
            <img
              src={CarineImg}
              alt="Carine Silva — Corretora de Imóveis"
              className="hero-img"
            />
          </div>
        </div>

      </div>
    </div>

    <div className="hero-fade-bottom" />
  </section>
);

// ── Sobre ─────────────────────────────────────────────────────────────────────
const Sobre: FC = () => (
  <section id="sobre" className="section-light">
    <div className="section-inner">
      <div className="sobre-grid">

        <RevealBox>
          <SectionLabel text="Sobre mim" />
          <h2 className="heading-serif">
            Especialista em conectar{" "}
            <em style={{ fontStyle: "italic", color: GOLD }}>pessoas</em> ao imóvel ideal
          </h2>
          <p className="body-text" style={{ marginBottom: 20 }}>
            Com atuação focada em imóveis na planta e lotes em condomínios fechados,
            ofereço um atendimento personalizado para quem deseja investir com
            segurança e inteligência no mercado imobiliário de Sergipe.
          </p>
          <p className="body-text">
            Especialista na Barra dos Coqueiros e Grande Aracaju, acompanho cada
            etapa do processo — desde a escolha do empreendimento até a assinatura
            do contrato.
          </p>
          <div style={{ marginTop: 36 }}>
            <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn-gold">
              Agendar Conversa
            </a>
          </div>
        </RevealBox>

        <RevealBox delay={150}>
          <div className="sobre-cards-grid">
            {([
              ["Barra dos Coqueiros", "Especialidade principal"],
              ["Grande Aracaju",      "Área de atuação"],
              ["Na Planta & Lotes",   "Foco de mercado"],
              ["CRECI 5180 PF",       "Registro profissional"],
            ] as [string, string][]).map(([num, sub]) => (
              <div key={sub} className="sobre-card">
                <p className="sobre-card__val">{num}</p>
                <p className="sobre-card__sub">{sub}</p>
              </div>
            ))}
          </div>
        </RevealBox>

      </div>
    </div>
  </section>
);

// ── Especialidades ────────────────────────────────────────────────────────────
const Especialidades: FC = () => (
  <section id="especialidades" className="section-dark">
    <div className="section-inner">
      <RevealBox className="text-center mb-lg">
        <SectionLabel text="O que ofereço" dark />
        <h2 className="heading-serif heading-serif--white">Especialidades</h2>
      </RevealBox>

      <div className="espec-grid">
        {especialidades.map((e, i) => (
          <RevealBox key={e.title} delay={i * 80}>
            <div className="espec-card">
              <span className="espec-card__icon">{e.icon}</span>
              <h3 className="espec-card__title">{e.title}</h3>
              <p className="espec-card__desc">{e.desc}</p>
            </div>
          </RevealBox>
        ))}
      </div>
    </div>
  </section>
);

// ── Empreendimentos ───────────────────────────────────────────────────────────
const Empreendimentos: FC = () => (
  <section id="empreendimentos" className="section-light">
    <div className="section-inner">
      <RevealBox>
        <SectionLabel text="Portfólio" />
        <div className="emp-header">
          <h2 className="heading-serif">Empreendimentos em destaque</h2>
          <a href={WA_LINK} target="_blank" rel="noreferrer" className="emp-see-all">
            Ver todos →
          </a>
        </div>
      </RevealBox>

      <div className="emp-grid">
        {empreendimentos.map((e, i) => (
          <RevealBox key={e.nome} delay={i * 60}>
            <div className="card-imovel">
              <div className="card-imovel__header">
                <span className="card-imovel__badge">{e.tipo}</span>
                <span className="card-imovel__icon">🏡</span>
              </div>
              <h3 className="card-imovel__name">{e.nome}</h3>
              <p className="card-imovel__local">
                <PinIcon />
                {e.local}, SE
              </p>
              <div className="card-imovel__footer">
                <a href={WA_LINK} target="_blank" rel="noreferrer" className="card-imovel__link">
                  Saber mais →
                </a>
              </div>
            </div>
          </RevealBox>
        ))}
      </div>
    </div>
  </section>
);

// ── Contato ───────────────────────────────────────────────────────────────────
const Contato: FC = () => (
  <section id="contato" className="section-dark">
    <div className="contato-inner">
      <RevealBox>
        <SectionLabel text="Vamos conversar" dark />
        <h2 className="heading-serif heading-serif--white contato-heading">
          Encontre seu imóvel<br />
          <em style={{ fontStyle: "italic", color: GOLD }}>dos sonhos</em>
        </h2>
        <p className="contato-desc">
          Entre em contato agora pelo WhatsApp e tire todas as suas dúvidas sobre
          os melhores imóveis disponíveis em Aracaju e Barra dos Coqueiros.
        </p>

        <div className="contato-actions">
          <a href={WA_LINK} target="_blank" rel="noreferrer" className="btn-gold btn-gold--lg">
            <WhatsappIcon size={20} />
            (79) 9 9926-7884
          </a>
          <div className="contato-social">
            <a
              href="https://instagram.com/corretoracarinesilva"
              target="_blank"
              rel="noreferrer"
              className="contato-social__link"
            >
              @corretoracarinesilva
            </a>
            <span className="contato-social__sep">·</span>
            <span className="contato-social__text">CRECI 5180 PF</span>
          </div>
        </div>
      </RevealBox>
    </div>
  </section>
);

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer: FC = () => (
  <footer className="footer">
    <div className="footer-inner">
      <p className="footer-copy">
        © 2026 Carine<span style={{ color: GOLD }}> Silva</span> · Corretora de Imóveis
      </p>
      <p className="footer-dev">
        Desenvolvido por{" "}
        <a
          href="https://heverecstudiocode.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-dev-link"
        >
          Heverec Studio Code
        </a>
      </p>
    </div>
  </footer>
);

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar scrolled={scrolled} />
      <main>
        <Hero />
        <Sobre />
        <Especialidades />
        <Empreendimentos />
        <Contato />
      </main>
      <Footer />

      <a href={WA_LINK} target="_blank" rel="noreferrer" className="wa-float" aria-label="WhatsApp">
        <WhatsappIcon size={28} color="white" />
      </a>
    </>
  );
}