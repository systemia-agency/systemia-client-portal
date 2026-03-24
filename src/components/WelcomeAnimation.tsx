import { useEffect, useState } from 'react'

interface Props {
  companyName: string
  onComplete: () => void
}

export function WelcomeAnimation({ companyName, onComplete }: Props) {
  const [phase, setPhase] = useState<'orbits' | 'converge' | 'logo' | 'done'>('orbits')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('converge'), 1800)
    const t2 = setTimeout(() => setPhase('logo'), 2800)
    const t3 = setTimeout(() => setPhase('done'), 4200)
    const t4 = setTimeout(onComplete, 4600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden welcome-bg">
      {/* Stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="welcome-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Orbital system */}
      <div className={`relative transition-all duration-1000 ${phase === 'converge' || phase === 'logo' || phase === 'done' ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/20 blur-md" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/40" />

        {/* Orbit 1 — Blue */}
        <div className="welcome-orbit welcome-orbit-1">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div className="w-4 h-4 rounded-full bg-[#4FA6FF] shadow-[0_0_20px_#4FA6FF,0_0_40px_rgba(79,166,255,0.3)]" />
          </div>
        </div>
        {/* Orbit ring 1 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-full border border-[#4FA6FF]/15" />

        {/* Orbit 2 — Violet */}
        <div className="welcome-orbit welcome-orbit-2">
          <div className="absolute -top-[5px] left-1/2 -translate-x-1/2">
            <div className="w-[10px] h-[10px] rounded-full bg-[#6B5BFF] shadow-[0_0_16px_#6B5BFF,0_0_32px_rgba(107,91,255,0.3)]" />
          </div>
        </div>
        {/* Orbit ring 2 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] rounded-full border border-[#6B5BFF]/10 rotate-[20deg]" />

        {/* Orbit 3 — Green */}
        <div className="welcome-orbit welcome-orbit-3">
          <div className="absolute -top-[3px] left-1/2 -translate-x-1/2">
            <div className="w-[7px] h-[7px] rounded-full bg-[#12D6A7] shadow-[0_0_14px_#12D6A7,0_0_28px_rgba(18,214,167,0.3)]" />
          </div>
        </div>
        {/* Orbit ring 3 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full border border-[#12D6A7]/8 -rotate-[10deg]" />

        {/* Orbit 4 — small accent */}
        <div className="welcome-orbit welcome-orbit-4">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2">
            <div className="w-2 h-2 rounded-full bg-white/60 shadow-[0_0_10px_white]" />
          </div>
        </div>

        {/* Connection lines (SVG) */}
        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] welcome-connections" viewBox="0 0 460 460">
          <line x1="230" y1="230" x2="230" y2="150" stroke="url(#grad1)" strokeWidth="0.5" opacity="0.3" />
          <line x1="230" y1="230" x2="310" y2="280" stroke="url(#grad2)" strokeWidth="0.5" opacity="0.2" />
          <line x1="230" y1="230" x2="150" y2="310" stroke="url(#grad3)" strokeWidth="0.5" opacity="0.15" />
          <defs>
            <linearGradient id="grad1"><stop offset="0%" stopColor="#4FA6FF" /><stop offset="100%" stopColor="transparent" /></linearGradient>
            <linearGradient id="grad2"><stop offset="0%" stopColor="#6B5BFF" /><stop offset="100%" stopColor="transparent" /></linearGradient>
            <linearGradient id="grad3"><stop offset="0%" stopColor="#12D6A7" /><stop offset="100%" stopColor="transparent" /></linearGradient>
          </defs>
        </svg>
      </div>

      {/* Logo + welcome text reveal */}
      <div className={`absolute flex flex-col items-center transition-all duration-700 ${
        phase === 'logo' || phase === 'done'
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-90 translate-y-4'
      }`}>
        {/* Logo glow */}
        <div className="relative mb-6">
          <div className={`absolute inset-0 rounded-2xl blur-2xl transition-opacity duration-1000 ${phase === 'logo' || phase === 'done' ? 'opacity-40' : 'opacity-0'}`}
            style={{ background: 'linear-gradient(135deg, #4FA6FF, #6B5BFF, #12D6A7)' }} />
          <img
            src="/logo-systemia.png"
            alt="Systemia"
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover"
          />
        </div>

        {/* Text */}
        <h1 className={`text-white text-2xl sm:text-3xl font-bold tracking-tight mb-2 transition-all duration-500 delay-200 ${
          phase === 'logo' || phase === 'done' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}>
          Bienvenue
        </h1>
        <p className={`text-white/60 text-sm sm:text-base transition-all duration-500 delay-400 ${
          phase === 'logo' || phase === 'done' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}>
          {companyName}
        </p>

        {/* Gradient line */}
        <div className={`h-[2px] mt-6 rounded-full transition-all duration-700 delay-300 ${
          phase === 'done' ? 'w-32 opacity-100' : 'w-0 opacity-0'
        }`} style={{ background: 'var(--sys-gradient)' }} />
      </div>

      {/* Fade out */}
      <div className={`absolute inset-0 bg-[hsl(228,40%,6%)] transition-opacity duration-400 pointer-events-none ${
        phase === 'done' ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  )
}
