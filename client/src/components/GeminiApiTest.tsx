import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const GeminiApiTest: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [apiStatus, setApiStatus] = useState<any>(null);

  const testGeminiAPI = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');
    setStatus('idle');

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode: 'luxury-concierge' })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResponse(data.text);
      setStatus('success');
    } catch (error) {
      console.error('Error testing Gemini API:', error);
      setResponse(error instanceof Error ? error.message : 'Unknown error');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const checkApiStatus = async () => {
    setLoading(true);
    setApiStatus(null);
    
    try {
      const response = await fetch('/api/gemini/status');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setApiStatus(data);
    } catch (error) {
      console.error('Error checking API status:', error);
      setApiStatus({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Prueba de API Gemini</CardTitle>
          <CardDescription>
            Este componente te permite verificar la conexión con la API de Gemini de Google y probar consultas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button 
              onClick={checkApiStatus} 
              variant="outline" 
              className="mb-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar estado de API'
              )}
            </Button>
            
            {apiStatus && (
              <div className={`p-4 rounded-md mt-2 ${
                apiStatus.status === 'available' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <p className="font-medium">{apiStatus.message}</p>
                {apiStatus.sample && (
                  <p className="text-sm mt-2">Respuesta de prueba: {apiStatus.sample}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Prompt para Gemini:
            </label>
            <Textarea
              id="prompt"
              placeholder="Escribe tu prompt aquí, por ejemplo: Recomiéndame 3 destinos para viajar con niños"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch space-y-4">
          <Button onClick={testGeminiAPI} disabled={loading || !prompt.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              'Enviar consulta'
            )}
          </Button>
          
          {response && (
            <div className={`p-4 rounded-md ${
              status === 'success' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {response}
              </pre>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default GeminiApiTest;