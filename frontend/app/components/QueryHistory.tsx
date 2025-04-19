'use client';

import { useState } from 'react';
import { TravelQuery, TravelResponse } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Globe, Calendar, FileText, Plane, AlertTriangle, Clock, Building2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { deleteQuery } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface QueryHistoryProps {
  queries: TravelQuery[];
  onSelectQuery: (query: TravelQuery) => void;
  onDeleteQuery: (queryId: number) => void;
}

export function QueryHistory({ queries, onSelectQuery, onDeleteQuery }: QueryHistoryProps) {
  const [openQueryId, setOpenQueryId] = useState<number | null>(null);

  const handleDelete = async (queryId: number) => {
    try {
      await deleteQuery(queryId);
      onDeleteQuery(queryId);
    } catch (error) {
      console.error('Error deleting query:', error);
    }
  };

  if (queries.length === 0) {
    return (
      <Alert className="bg-[#1e293b] border-[#334155]">
        <AlertTitle className="text-sm text-[#f1f5f9]">No queries yet</AlertTitle>
        <AlertDescription className="text-xs text-[#94a3b8]">
          Your travel queries will appear here
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {queries.map((query) => (
        <Collapsible key={query.id} className="group">
          <Card className="bg-[#1e293b] border-[#334155] hover:border-[#3b82f6]/50 transition-colors">
            <CardHeader className="p-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-[#f1f5f9] line-clamp-1">
                    {query.destination}
                  </CardTitle>
                  {query.origin && (
                    <p className="text-xs text-[#94a3b8]">
                      From: {query.origin}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 text-xs text-[#94a3b8]">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(query.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#0f172a]"
                    onClick={() => handleDelete(query.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0f172a]"
                    >
                      <ChevronDown className="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </CardHeader>
            <CollapsibleContent>
              <CardContent className="p-3 pt-0">
                <div className="space-y-2">
                  <p className="text-xs text-[#cbd5e1] line-clamp-2">
                    {query.query}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs bg-[#0f172a] border-[#334155] text-[#cbd5e1] hover:bg-[#1e293b] hover:text-[#f1f5f9]"
                    onClick={() => onSelectQuery(query)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}

interface QueryHistoryDetailsProps {
  query: TravelQuery;
}

export function QueryHistoryDetails({ query }: QueryHistoryDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
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
            <p className="text-sm text-[#cbd5e1] leading-relaxed">{query.response.visaRequirements}</p>
          </div>
          
          <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155]">
            <h3 className="text-sm font-semibold text-[#22c55e] mb-2">Required Documents</h3>
            <ul className="list-disc list-inside text-sm text-[#cbd5e1] space-y-1">
              {query.response.documents.map((doc: string, index: number) => (
                <li key={index} className="leading-relaxed">{doc}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155]">
            <h3 className="text-sm font-semibold text-[#f59e0b] mb-2">Travel Advisories</h3>
            <ul className="list-disc list-inside text-sm text-[#cbd5e1] space-y-1">
              {query.response.advisories.map((adv: string, index: number) => (
                <li key={index} className="leading-relaxed">{adv}</li>
              ))}
            </ul>
          </div>
          
          {query.response.estimatedProcessingTime && (
            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155]">
              <h3 className="text-sm font-semibold text-[#8b5cf6] mb-2">Estimated Processing Time</h3>
              <p className="text-sm text-[#cbd5e1] leading-relaxed">{query.response.estimatedProcessingTime}</p>
            </div>
          )}
          
          {query.response.embassyInformation && (
            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155]">
              <h3 className="text-sm font-semibold text-[#ec4899] mb-2">Embassy Information</h3>
              <p className="text-sm text-[#cbd5e1] leading-relaxed">{query.response.embassyInformation}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 