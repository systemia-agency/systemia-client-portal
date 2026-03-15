import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Accueil } from '@/pages/Accueil'
import { Resultats } from '@/pages/Resultats'
import { Projets } from '@/pages/Projets'
import { Demandes } from '@/pages/Demandes'
import { Services } from '@/pages/Services'
import { Facturation } from '@/pages/Facturation'
import { Ressources } from '@/pages/Ressources'
import { Assistant } from '@/pages/Assistant'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/resultats" element={<Resultats />} />
          <Route path="/projets" element={<Projets />} />
          <Route path="/demandes" element={<Demandes />} />
          <Route path="/services" element={<Services />} />
          <Route path="/facturation" element={<Facturation />} />
          <Route path="/ressources" element={<Ressources />} />
          <Route path="/assistant" element={<Assistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
