import { Card, CardContent } from '@/components/ui/Card'
import { Bot, Sparkles } from 'lucide-react'

export function Assistant() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assistant IA</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Votre assistant marketing intelligent.
        </p>
      </div>

      <Card className="accent-gradient-top">
        <CardContent className="p-12">
          <div className="flex flex-col items-center text-center max-w-md mx-auto">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-violet-50 to-emerald-50 mb-6">
              <Bot className="h-12 w-12 text-[var(--sys-violet)]" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full btn-gradient text-sm mb-4">
              <Sparkles className="h-4 w-4" />
              Coming Soon
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              Assistant Marketing IA
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Un assistant marketing intelligent arrive prochainement pour analyser vos performances
              et répondre à vos questions. Il vous aidera à comprendre vos données et à prendre
              les meilleures décisions pour votre croissance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
