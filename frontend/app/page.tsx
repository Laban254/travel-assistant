'use client';

import { useState, useEffect } from 'react';
import { QueryHistory } from './components/QueryHistory';
import { createTravelQuery, getQueryHistory, getQueryById, TravelQuery } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, History, Globe, Clock, ChevronUp, ChevronDown, ChevronLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function extractTravelInfo(query: string): { destination: string; origin?: string } {
  const fromMatch = query.match(/from\s+([a-zA-Z\s]+)\s+to\s+([a-zA-Z\s]+)/i);
  const toMatch = query.match(/to\s+([a-zA-Z\s]+)/i);
  
  if (fromMatch) {
    return {
      origin: fromMatch[1].trim(),
      destination: fromMatch[2].trim()
    };
  } else if (toMatch) {
    return {
      destination: toMatch[1].trim()
    };
  }
  
  return {
    destination: query.trim()
  };
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<TravelQuery | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState<TravelQuery[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const queries = await getQueryHistory();
      setHistory(queries);
    } catch (error) {
      console.error('Error loading history:', error);
      setError('Failed to load query history');
    }
  };

  const handleDeleteQuery = async (queryId: number) => {
    try {
      setHistory(history.filter(query => query.id !== queryId));
    } catch (error) {
      console.error('Error deleting query:', error);
      setError('Failed to delete query');
    }
  };

  const handleSelectQuery = async (query: TravelQuery) => {
    try {
      const response = await getQueryById(query.id);
      setResponse(response);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading query details:', error);
      setError('Failed to load query details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a travel query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { destination, origin } = extractTravelInfo(query);
      
      const data = await createTravelQuery({
        query,
        destination,
        origin
      });

      setResponse(data);
      setIsModalOpen(true);
      
      setHistory(prev => [data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#0f172a] text-[#f1f5f9]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] border-b border-[#334155]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-[#3b82f6]/20 blur-xl rounded-full"></div>
                <div className="relative p-3 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 backdrop-blur-sm">
                  <Globe className="h-6 w-6 text-[#3b82f6]" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#f1f5f9]">Travel Query Assistant</h1>
                <p className="mt-1 text-sm text-[#94a3b8]">
                  Get detailed information about visa requirements, necessary documents, and travel advisories
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-2 text-sm text-[#94a3b8]">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex h-[calc(100vh-7rem)]">
        {/* Mobile History Button */}
        <div className="fixed bottom-4 right-4 z-50 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
            className="h-10 w-10 rounded-full bg-[#1e293b] text-[#cbd5e1] border-[#334155] hover:bg-[#0f172a] hover:text-[#f1f5f9] shadow-lg"
          >
            <History className="h-4 w-4" />
          </Button>
        </div>

        {/* History Sidebar - Mobile Slide-out */}
        <div className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${showHistory ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute inset-0 bg-[#020617]/50" onClick={() => setShowHistory(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-[#1e293b] border-r border-[#334155] overflow-y-auto">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-[#f1f5f9]">Query History</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHistory(false)}
                  className="text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f172a]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <QueryHistory
                queries={history}
                onSelectQuery={handleSelectQuery}
                onDeleteQuery={handleDeleteQuery}
              />
            </div>
          </div>
        </div>

        {/* Desktop History Sidebar */}
        <div className="hidden lg:block w-72 border-r border-[#334155] bg-[#1e293b] overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-[#f1f5f9]">Query History</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(false)}
                className="text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f172a]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <QueryHistory
              queries={history}
              onSelectQuery={handleSelectQuery}
              onDeleteQuery={handleDeleteQuery}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4">
            <Card className="bg-[#1e293b] border-[#334155]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#f1f5f9]">Ask about travel requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2 relative">
                    <Label htmlFor="query" className="text-sm text-[#cbd5e1]">Your travel query</Label>
                    <div className="relative">
                      <Input
                        id="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="What documents do I need to travel from USA to Japan?"
                        className="bg-[#0f172a] border-[#334155] text-[#f1f5f9] placeholder:text-[#94a3b8] focus:border-[#3b82f6] focus:ring-[#3b82f6] pr-24 h-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowExamples(!showExamples)}
                        className="absolute right-2 bottom-1.5 text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f172a]/50"
                      >
                        <span className="text-xs">Examples</span>
                        {showExamples ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white h-10"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        <span className="text-sm">Processing...</span>
                      </>
                    ) : (
                      <span className="text-sm">Get Information</span>
                    )}
                  </Button>
                </form>

                {error && (
                  <Alert variant="destructive" className="mt-4 bg-[#1e293b] border-[#ef4444]">
                    <AlertDescription className="text-sm text-[#ef4444]">{error}</AlertDescription>
                  </Alert>
                )}

                {showExamples && (
                  <div className="mt-4 space-y-2">
                    {[
                      "What documents do I need to travel from USA to Japan?",
                      "Visa requirements for Indian citizens visiting Australia",
                      "Do UK citizens need a visa to visit Canada?",
                      "What vaccinations are required for travel to Mexico?",
                      "Travel advisories for Mexico from USA"
                    ].map((example, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full text-left p-2 text-xs text-[#cbd5e1] hover:bg-[#0f172a] hover:text-[#f1f5f9] whitespace-normal h-auto border-0"
                        onClick={() => {
                          setQuery(example);
                          setShowExamples(false);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <Search className="h-3 w-3 text-[#94a3b8]" />
                          <span>{example}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Response Modal */}
      {response && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1e293b] border-[#334155]">
            <DialogHeader className="sticky top-0 bg-[#1e293b] z-10 border-b border-[#334155] pb-4">
              <DialogTitle className="text-lg font-semibold text-[#f1f5f9]">
                Travel Information
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155]">
                <h3 className="text-sm font-semibold text-[#3b82f6] mb-2">Visa Requirements</h3>
                <p className="text-sm text-[#cbd5e1] leading-relaxed">{response.response.visaRequirements}</p>
              </div>
              
              <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155]">
                <h3 className="text-sm font-semibold text-[#22c55e] mb-2">Required Documents</h3>
                <ul className="list-disc list-inside text-sm text-[#cbd5e1] space-y-1">
                  {response.response.documents.map((doc: string, index: number) => (
                    <li key={index} className="leading-relaxed">{doc}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155]">
                <h3 className="text-sm font-semibold text-[#f59e0b] mb-2">Travel Advisories</h3>
                <ul className="list-disc list-inside text-sm text-[#cbd5e1] space-y-1">
                  {response.response.advisories.map((adv: string, index: number) => (
                    <li key={index} className="leading-relaxed">{adv}</li>
                  ))}
                </ul>
              </div>
              
              {response.response.estimatedProcessingTime && (
                <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155]">
                  <h3 className="text-sm font-semibold text-[#8b5cf6] mb-2">Estimated Processing Time</h3>
                  <p className="text-sm text-[#cbd5e1] leading-relaxed">{response.response.estimatedProcessingTime}</p>
                </div>
              )}
              
              {response.response.embassyInformation && (
                <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155]">
                  <h3 className="text-sm font-semibold text-[#ec4899] mb-2">Embassy Information</h3>
                  <p className="text-sm text-[#cbd5e1] leading-relaxed">{response.response.embassyInformation}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
