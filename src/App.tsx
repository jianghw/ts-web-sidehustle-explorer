import { Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RetryBoundary } from '@/components/common/RetryBoundary'
import { QuestionnairePage } from '@/pages/QuestionnairePage'
import { ResultsPage } from '@/pages/ResultsPage'
import { DetailPage } from '@/pages/DetailPage'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <RetryBoundary>
          <Routes>
            <Route path="/" element={<QuestionnairePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="*" element={<QuestionnairePage />} />
          </Routes>
        </RetryBoundary>
      </main>
      <Footer />
    </div>
  )
}
