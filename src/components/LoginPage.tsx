import { useState, useCallback, type FormEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Lock, Mail } from 'lucide-react'
import { WelcomeAnimation } from './WelcomeAnimation'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeTarget, setWelcomeTarget] = useState('')
  const [welcomeName, setWelcomeName] = useState('')
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  // If already authenticated, redirect (skip animation)
  if (isAuthenticated && user && !showWelcome) {
    const target = user.role === 'admin' ? '/admin' : `/client/${user.slug}`
    return <Navigate to={target} replace />
  }

  const handleAnimationComplete = useCallback(() => {
    navigate(welcomeTarget, { replace: true })
  }, [navigate, welcomeTarget])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(email, password)
    setLoading(false)

    if (result.success) {
      const session = JSON.parse(localStorage.getItem('systemia_auth') || '{}')
      const loggedUser = session.user
      if (loggedUser) {
        const target = loggedUser.role === 'admin' ? '/admin' : `/client/${loggedUser.slug}`
        setWelcomeTarget(target)
        setWelcomeName(loggedUser.companyName || 'Admin')
        setShowWelcome(true)
      }
    } else {
      setError(result.error || 'Erreur de connexion.')
    }
  }

  return (
    <>
    {showWelcome && <WelcomeAnimation companyName={welcomeName} onComplete={handleAnimationComplete} />}
    <div className="min-h-screen systemia-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md accent-gradient-top">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img src="/logo-systemia.png" alt="Systemia" className="w-14 h-14 rounded-xl object-cover mb-4" />
            <h1 className="text-xl font-bold text-foreground">Systemia</h1>
            <p className="text-sm text-muted-foreground mt-1">Connectez-vous à votre espace</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full h-11" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <p className="text-[11px] text-muted-foreground text-center mt-6">
            Plateforme sécurisée Systemia
          </p>
        </CardContent>
      </Card>
    </div>
    </>
  )
}
