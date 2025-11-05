'use client';

import { useState } from 'react';
import { Search, Scale, Building2, BookOpen, FileText, Loader2 } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import CourtSelector from '@/components/CourtSelector';
import SearchResults from '@/components/SearchResults';

export default function Home() {
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Scale className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Agente Jurídico IA
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Assistente inteligente para pesquisa de súmulas, jurisprudências e teses dos tribunais brasileiros
          </p>
        </header>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <Building2 className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Múltiplos Tribunais
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              STF, STJ, TST, TRFs, TRTs e Tribunais Estaduais
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Pesquisa Inteligente
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              IA avançada para encontrar precedentes relevantes
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Análise Completa
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Súmulas, teses e jurisprudências organizadas
            </p>
          </div>
        </div>

        {/* Court Selection */}
        <div className="mb-8">
          <CourtSelector
            selectedCourts={selectedCourts}
            setSelectedCourts={setSelectedCourts}
          />
        </div>

        {/* Chat Interface */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 mb-8">
          <ChatInterface
            selectedCourts={selectedCourts}
            setSearchResults={setSearchResults}
            setIsSearching={setIsSearching}
          />
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">
              Pesquisando nos tribunais...
            </span>
          </div>
        )}

        {searchResults.length > 0 && !isSearching && (
          <SearchResults results={searchResults} />
        )}
      </div>
    </main>
  );
}
