import React from 'react'
import ServiceQuiz from './ServiceQuiz.jsx'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="px-6 py-5 bg-white border-b">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">FASTLI.pl</h1>
          <span className="text-sm text-neutral-500">Interaktywny quiz</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto p-4 md:p-8">
        <ServiceQuiz />
      </main>
      <footer className="text-center text-xs text-neutral-500 py-6">
        © {new Date().getFullYear()} FASTLI.pl
      </footer>
    </div>
  )
}