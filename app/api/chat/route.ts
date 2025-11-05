import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface SearchResult {
  court: string;
  type: string;
  title: string;
  summary: string;
  number?: string;
  date?: string;
  url?: string;
}

const COURT_URLS: Record<string, string> = {
  STF: 'https://portal.stf.jus.br',
  STJ: 'https://www.stj.jus.br',
  TST: 'https://www.tst.jus.br',
  TRF: 'https://www.trf1.jus.br',
  TRT: 'https://www.trt1.jus.br',
  TJ: 'https://www.tjsp.jus.br',
};

function generateMockResults(query: string, courts?: string[]): SearchResult[] {
  const selectedCourts = courts && courts.length > 0 ? courts : ['STF', 'STJ', 'TST', 'TRF', 'TRT', 'TJ'];

  const results: SearchResult[] = [];

  // Gerar resultados para cada tribunal selecionado
  selectedCourts.forEach(court => {
    // Súmula
    results.push({
      court,
      type: 'Súmula',
      title: `Súmula ${Math.floor(Math.random() * 1000)} - ${court}`,
      summary: `Súmula vinculante relacionada a ${query}. Esta súmula estabelece entendimento consolidado do tribunal sobre a matéria em questão, devendo ser observada por todos os órgãos do Judiciário.`,
      number: `${Math.floor(Math.random() * 1000)}`,
      date: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/20${20 + Math.floor(Math.random() * 5)}`,
      url: COURT_URLS[court],
    });

    // Tese de repercussão geral ou recurso repetitivo
    if (court === 'STF' || court === 'STJ') {
      results.push({
        court,
        type: court === 'STF' ? 'Tese de Repercussão Geral' : 'Tese de Recurso Repetitivo',
        title: `Tema ${Math.floor(Math.random() * 1500)} - ${query}`,
        summary: `Tese jurídica firmada sobre ${query}. O tribunal fixou a seguinte tese para julgamento de casos repetitivos: [descrição da tese estabelecida]. Esta decisão tem eficácia vinculante e deve ser aplicada aos casos similares.`,
        number: `Tema ${Math.floor(Math.random() * 1500)}`,
        date: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/20${20 + Math.floor(Math.random() * 5)}`,
        url: COURT_URLS[court],
      });
    }

    // Jurisprudência
    results.push({
      court,
      type: 'Jurisprudência',
      title: `Acórdão sobre ${query}`,
      summary: `Decisão colegiada do ${court} em caso envolvendo ${query}. O tribunal decidiu pela procedência/improcedência do pedido, estabelecendo importantes precedentes sobre a matéria. A decisão foi unânime/por maioria e aborda aspectos relevantes da questão jurídica.`,
      number: `${court} ${Math.floor(Math.random() * 100000)}`,
      date: `${Math.floor(Math.random() * 28) + 1}/${Math.floor(Math.random() * 12) + 1}/20${20 + Math.floor(Math.random() * 5)}`,
      url: COURT_URLS[court],
    });
  });

  return results;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, courts } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Mensagens inválidas' },
        { status: 400 }
      );
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Criar prompt do sistema
    const systemMessage: Message = {
      role: 'system',
      content: `Você é um assistente jurídico especializado em pesquisa de jurisprudência brasileira.
Você ajuda advogados, estudantes de direito e profissionais do direito a encontrar e entender súmulas, teses e jurisprudências dos tribunais superiores e regionais do Brasil.

Tribunais que você pesquisa:
- STF (Supremo Tribunal Federal): Guarda da Constituição
- STJ (Superior Tribunal de Justiça): Uniformização da lei federal
- TST (Tribunal Superior do Trabalho): Matéria trabalhista
- TRF (Tribunais Regionais Federais): Justiça Federal
- TRT (Tribunais Regionais do Trabalho): Justiça do Trabalho
- TJ (Tribunais de Justiça Estaduais): Justiça Estadual

Suas responsabilidades:
1. Interpretar a pergunta do usuário e identificar os temas jurídicos relevantes
2. Explicar de forma clara e didática os conceitos jurídicos
3. Fornecer contexto sobre a aplicação prática das decisões
4. Indicar quais tribunais são mais relevantes para cada tipo de questão
5. Explicar a hierarquia e importância das decisões (súmulas vinculantes, repercussão geral, etc.)

Seja sempre preciso, profissional e educado. Use linguagem técnica quando apropriado, mas explique termos complexos.`
    };

    // Gerar resultados de busca simulados
    const searchResults = generateMockResults(lastUserMessage, courts);

    // Criar contexto com os resultados
    const resultsContext = searchResults.map((r, i) =>
      `${i + 1}. ${r.court} - ${r.type}: ${r.title}\n   ${r.summary}`
    ).join('\n\n');

    // Adicionar contexto ao histórico de mensagens
    const contextualizedMessages: Message[] = [
      systemMessage,
      ...messages.slice(0, -1),
      {
        role: 'user',
        content: `${lastUserMessage}\n\nResultados encontrados:\n${resultsContext}\n\nCom base nesses resultados, forneça uma resposta completa e educativa.`
      }
    ];

    // Chamar OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: contextualizedMessages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const assistantMessage = completion.choices[0]?.message?.content ||
      'Desculpe, não consegui processar sua solicitação.';

    return NextResponse.json({
      message: assistantMessage,
      results: searchResults,
    });

  } catch (error: any) {
    console.error('Erro na API:', error);

    return NextResponse.json(
      {
        error: 'Erro ao processar solicitação',
        details: error.message
      },
      { status: 500 }
    );
  }
}
