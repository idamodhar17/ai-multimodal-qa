import React, { useState } from 'react';
import { useFile } from '@/contexts/FileContext';
import { getSummary } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, Sparkles } from 'lucide-react';

const SummaryCard = () => {
  const { uploadedFile } = useFile();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateSummary = async () => {
    if (!uploadedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      // Mock response for demo purposes
      // In production, this would call the real API
      const mockSummary = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            `This is a simulated summary of the uploaded ${uploadedFile.type} file "${uploadedFile.name}". In production, this would contain an AI-generated summary of the actual file content, highlighting key points, themes, and important information extracted from the document.`
          );
        }, 1500);
      });

      setSummary(mockSummary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  if (!uploadedFile) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Summary
        </CardTitle>
        <CardDescription>
          Generate an AI summary of your uploaded file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!summary && !isLoading && (
          <Button onClick={handleGenerateSummary} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Summary
          </Button>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Generating summary...</p>
            </div>
          </div>
        )}

        {summary && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm leading-relaxed">{summary}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleGenerateSummary}
              className="w-full"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Regenerate Summary
            </Button>
          </div>
        )}

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
