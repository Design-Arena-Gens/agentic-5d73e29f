'use client';

import { Check } from 'lucide-react';

interface CourtSelectorProps {
  selectedCourts: string[];
  setSelectedCourts: (courts: string[]) => void;
}

const COURTS = [
  { id: 'STF', name: 'Supremo Tribunal Federal (STF)', description: 'Guarda da Constituição' },
  { id: 'STJ', name: 'Superior Tribunal de Justiça (STJ)', description: 'Uniformização da lei federal' },
  { id: 'TST', name: 'Tribunal Superior do Trabalho (TST)', description: 'Matéria trabalhista' },
  { id: 'TRF', name: 'Tribunais Regionais Federais (TRF)', description: 'Justiça Federal' },
  { id: 'TRT', name: 'Tribunais Regionais do Trabalho (TRT)', description: 'Justiça do Trabalho' },
  { id: 'TJ', name: 'Tribunais de Justiça Estaduais (TJ)', description: 'Justiça Estadual' },
];

export default function CourtSelector({ selectedCourts, setSelectedCourts }: CourtSelectorProps) {
  const toggleCourt = (courtId: string) => {
    setSelectedCourts(
      selectedCourts.includes(courtId)
        ? selectedCourts.filter(id => id !== courtId)
        : [...selectedCourts, courtId]
    );
  };

  const selectAll = () => {
    setSelectedCourts(COURTS.map(c => c.id));
  };

  const clearAll = () => {
    setSelectedCourts([]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Selecionar Tribunais
        </h2>
        <div className="space-x-2">
          <button
            onClick={selectAll}
            className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            Todos
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {selectedCourts.length === 0
          ? 'Pesquisará em todos os tribunais'
          : `${selectedCourts.length} tribunal(is) selecionado(s)`}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {COURTS.map(court => (
          <button
            key={court.id}
            onClick={() => toggleCourt(court.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedCourts.includes(court.id)
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                  {court.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {court.description}
                </p>
              </div>
              {selectedCourts.includes(court.id) && (
                <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
