'use client';

import { ExternalLink, FileText, Calendar, Building2 } from 'lucide-react';

interface SearchResult {
  court: string;
  type: string;
  title: string;
  summary: string;
  number?: string;
  date?: string;
  url?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) return null;

  const getCourtColor = (court: string) => {
    const colors: Record<string, string> = {
      STF: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      STJ: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      TST: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      TRF: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      TRT: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      TJ: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    };
    return colors[court] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getTypeIcon = (type: string) => {
    if (type.toLowerCase().includes('súmula')) return '📋';
    if (type.toLowerCase().includes('tese')) return '📖';
    if (type.toLowerCase().includes('jurisprudência')) return '⚖️';
    return '📄';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <FileText className="w-7 h-7 mr-2 text-blue-600" />
        Resultados da Pesquisa ({results.length})
      </h2>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCourtColor(result.court)}`}>
                  {result.court}
                </span>
                <span className="text-xl">{getTypeIcon(result.type)}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {result.type}
                </span>
              </div>
              {result.url && (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {result.title}
            </h3>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
              {result.number && (
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  <span>{result.number}</span>
                </div>
              )}
              {result.date && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{result.date}</span>
                </div>
              )}
            </div>

            {/* Summary */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {result.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
