import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const features = [
  {
    title: "Smart Analytics",
    description:
      "Real-time dashboards with AI-powered insights that predict trends before they happen.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "Client Portal",
    description:
      "Give clients their own branded portal with project tracking, messaging, and file sharing.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: "AI Assistant",
    description:
      "Built-in AI that drafts emails, generates reports, and automates repetitive tasks.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    title: "Team Collaboration",
    description:
      "Shared workspaces, real-time editing, and smart notifications to keep everyone aligned.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: "Billing & Invoicing",
    description:
      "Automated invoicing, subscription management, and payment tracking in one place.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    title: "Enterprise Security",
    description:
      "SOC 2 compliant, end-to-end encryption, SSO, and granular role-based permissions.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

const steps = [
  {
    num: "01",
    title: "Connect",
    description: "Integrate your existing tools and import your data in minutes.",
  },
  {
    num: "02",
    title: "Automate",
    description: "Set up AI-powered workflows that handle the busywork.",
  },
  {
    num: "03",
    title: "Grow",
    description: "Focus on strategy while Gravitiq handles the rest.",
  },
];

const stats = [
  { value: "40%", label: "Average time saved on client management" },
  { value: "3x", label: "Faster report generation with AI" },
  { value: "99.9%", label: "Uptime guaranteed SLA" },
  { value: "10k+", label: "Active users worldwide" },
];

const testimonials = [
  {
    quote:
      "Gravitiq transformed how we manage client relationships. The AI assistant alone saves our team 15 hours a week on report generation.",
    name: "Sarah Chen",
    title: "VP of Operations",
    company: "Meridian Growth",
  },
  {
    quote:
      "We consolidated five different tools into Gravitiq and cut our software spend by 60%. The analytics are genuinely predictive, not just reactive.",
    name: "Marcus Thompson",
    title: "CEO",
    company: "Apex Digital",
  },
  {
    quote:
      "The client portal changed everything for us. Our clients feel more connected and our NPS score jumped 40 points in three months.",
    name: "Elena Rodriguez",
    title: "Director of Client Success",
    company: "BrightPath Consulting",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    description: "For freelancers and small teams",
    features: ["5 projects", "2 team members", "Basic analytics", "Email support"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/mo",
    description: "For growing businesses",
    features: [
      "Unlimited projects",
      "10 team members",
      "AI Assistant",
      "Priority support",
      "Client portal",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "SSO & SAML",
      "Dedicated account manager",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const logos = ["Streamline", "Orbitex", "Pinnacle", "NovaBridge", "ClearEdge", "Luminos"];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-5px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-15px) translateX(-10px); }
          66% { transform: translateY(-25px) translateX(8px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 20%, transparent)' }} />
          <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 15%, transparent)' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40rem] h-64 rounded-full blur-3xl" style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)' }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="animate-float-slow absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-primary/40" />
          <div className="animate-float-medium absolute top-[25%] left-[25%] w-1.5 h-1.5 rounded-full bg-accent/30" style={{ animationDelay: "0.5s" }} />
          <div className="animate-float-fast absolute top-[10%] right-[20%] w-2.5 h-2.5 rounded-full bg-primary/25" style={{ animationDelay: "1s" }} />
          <div className="animate-float-slow absolute top-[40%] right-[10%] w-1.5 h-1.5 rounded-full bg-accent/30" style={{ animationDelay: "2s" }} />
          <div className="animate-float-medium absolute top-[60%] left-[15%] w-2 h-2 rounded-full bg-primary/25" style={{ animationDelay: "1.5s" }} />
          <div className="animate-float-fast absolute top-[50%] right-[30%] w-1 h-1 rounded-full bg-accent/40" style={{ animationDelay: "0.8s" }} />
          <div className="animate-pulse-glow absolute top-[20%] left-[50%] w-3 h-3 rounded-full bg-primary/20" style={{ animationDelay: "0.3s" }} />
          <div className="animate-float-slow absolute top-[70%] left-[40%] w-2 h-2 rounded-full bg-primary/25" style={{ animationDelay: "3s" }} />
          <div className="animate-pulse-glow absolute top-[35%] right-[40%] w-1.5 h-1.5 rounded-full bg-accent/20" style={{ animationDelay: "2.5s" }} />
          <div className="animate-float-medium absolute bottom-[15%] right-[15%] w-2.5 h-2.5 rounded-full bg-primary/20" style={{ animationDelay: "1.2s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
            Pull your business into
            <br />
            orbit with{" "}
            <span className="text-primary">
              Gravitiq
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-muted leading-relaxed">
            The all-in-one AI-powered platform for analytics, client management, and intelligent automation.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/get-started"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-primary-hover transition-all duration-200"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-lg border px-8 py-3.5 text-base font-semibold text-foreground hover:bg-muted-light transition-all duration-200"
              style={{ borderColor: 'var(--border)' }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ===== LOGOS / SOCIAL PROOF ===== */}
      <section className="py-12 sm:py-16 border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-muted uppercase tracking-wider">
            Trusted by 2,000+ companies worldwide
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
            {logos.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center h-12 rounded-lg bg-muted-light px-6"
              >
                <span className="text-sm font-semibold text-muted tracking-wide">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              Features
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Everything you need to scale
            </h2>
            <p className="mt-4 text-lg text-muted">
              Six powerful modules that work together seamlessly to run your entire business.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-2xl border bg-surface p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-light text-primary group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 sm:py-28" style={{ backgroundColor: 'var(--surface-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              How It Works
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Up and running in three steps
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden lg:block absolute top-7 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-border" />

            {steps.map((step) => (
              <div key={step.num} className="relative text-center">
                <div className="relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white text-lg font-bold shadow-lg">
                  {step.num}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-muted max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat) => (
              <div key={stat.value} className="text-center">
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm sm:text-base text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-20 sm:py-28" style={{ backgroundColor: 'var(--surface-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              Testimonials
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Loved by teams everywhere
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border bg-surface p-8 flex flex-col"
                style={{ borderColor: 'var(--border)' }}
              >
                <svg className="w-8 h-8 text-primary/30 mb-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
                <p className="text-foreground/80 leading-relaxed flex-1">
                  {t.quote}
                </p>
                <div className="mt-6 flex items-center gap-3 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted">
                      {t.title}, {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">
              Pricing
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted">
              Start free for 14 days. No credit card required.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border bg-surface p-8 flex flex-col ${
                  tier.popular
                    ? "shadow-xl scale-[1.02] lg:scale-105"
                    : ""
                }`}
                style={{
                  borderColor: tier.popular ? 'var(--primary)' : 'var(--border)',
                }}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                    Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {tier.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-muted">
                      {tier.period}
                    </span>
                  )}
                </div>
                <ul className="mt-8 space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-muted">
                      <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/get-started"
                  className={`mt-8 inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                    tier.popular
                      ? "bg-primary text-white shadow-lg hover:bg-primary-hover"
                      : "border text-foreground hover:bg-muted-light"
                  }`}
                  style={!tier.popular ? { borderColor: 'var(--border)' } : undefined}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 sm:px-16 sm:py-24 text-center">
            {/* Subtle background decoration */}
            <div className="absolute inset-0 -z-0" aria-hidden="true">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Ready to transform your workflow?
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-lg text-white/80">
                Join thousands of teams already using Gravitiq to work smarter.
              </p>
              <Link
                href="/get-started"
                className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-lg hover:bg-white/90 transition-all duration-200"
                style={{ color: 'var(--primary)' }}
              >
                Start your free 14-day trial
              </Link>
            </div>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
