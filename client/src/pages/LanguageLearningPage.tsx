import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Languages, Headphones, FileAudio, Book, GraduationCap, Lightbulb } from 'lucide-react';
import LanguageLearningJourney from '@/components/LanguageLearningJourney';

const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
];

export default function LanguageLearningPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    toast({
      title: `Language changed to ${languages.find(lang => lang.code === value)?.name}`,
      description: 'Your progress has been saved.'
    });
  };

  const handleLevelChange = (value: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedLevel(value);
    toast({
      title: `Level changed to ${value}`,
      description: 'Your learning path has been updated.'
    });
  };

  const selectedLanguageName = languages.find(lang => lang.code === selectedLanguage)?.name || 'Spanish';

  return (
    <div className="min-h-screen bg-[#050b17] text-white">
      {/* Top navigation bar - We're using the existing layout from App.tsx */}
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-display mb-2">Language Learning for Travel</h1>
          <p className="text-gray-400">Master essential phrases for your destination with JET AI's personalized language learning</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar - Language Selection */}
          <div className="space-y-6">
            <Card className="bg-[#0a1021] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Languages className="mr-2 h-5 w-5 text-[#4a89dc]" />
                  Choose Language
                </CardTitle>
                <CardDescription>Select the language you want to learn</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="border-gray-700 bg-[#050b17]">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a1021] border-gray-800">
                    {languages.map(language => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0a1021] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <GraduationCap className="mr-2 h-5 w-5 text-[#4a89dc]" />
                  Proficiency Level
                </CardTitle>
                <CardDescription>Set your current level</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={selectedLevel} onValueChange={(value) => handleLevelChange(value as 'beginner' | 'intermediate' | 'advanced')}>
                  <TabsList className="bg-[#050b17] w-full grid grid-cols-3">
                    <TabsTrigger value="beginner">Beginner</TabsTrigger>
                    <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0a1021] border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Lightbulb className="mr-2 h-5 w-5 text-[#4a89dc]" />
                  Learning Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-[#050b17] rounded-md">
                  <p className="text-sm text-gray-300">Practice daily for at least 15 minutes to maximize retention.</p>
                </div>
                <div className="p-3 bg-[#050b17] rounded-md">
                  <p className="text-sm text-gray-300">Focus on travel-specific vocabulary first to build practical skills.</p>
                </div>
                <div className="p-3 bg-[#050b17] rounded-md">
                  <p className="text-sm text-gray-300">Use the audio tools to perfect your pronunciation before your trip.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="col-span-2">
            <Card className="bg-[#0a1021] border-gray-800 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Learning Journey: {selectedLanguageName}</CardTitle>
                <CardDescription>
                  Track your progress and complete lessons to improve your travel language skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LanguageLearningJourney 
                  language={selectedLanguage} 
                  level={selectedLevel}
                  onProgressUpdate={setProgress}
                />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#0a1021] border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Book className="mr-2 h-5 w-5 text-[#4a89dc]" />
                    Travel Phrases
                  </CardTitle>
                  <CardDescription>Essential phrases for your journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#050b17] rounded-md">
                      <div className="text-sm font-medium mb-1">Hello / Greeting</div>
                      <div className="text-xs text-gray-400 mb-1">
                        {selectedLanguage === 'es' && 'Hola / Buenos días'}
                        {selectedLanguage === 'fr' && 'Bonjour / Salut'}
                        {selectedLanguage === 'it' && 'Ciao / Buongiorno'}
                        {selectedLanguage === 'de' && 'Hallo / Guten Tag'}
                        {selectedLanguage === 'ja' && 'こんにちは (Konnichiwa)'}
                        {selectedLanguage === 'ko' && '안녕하세요 (Annyeonghaseyo)'}
                        {selectedLanguage === 'zh' && '你好 (Nǐ hǎo)'}
                        {selectedLanguage === 'ar' && 'مرحبا (Marhaba)'}
                        {selectedLanguage === 'pt' && 'Olá / Bom dia'}
                        {selectedLanguage === 'ru' && 'Здравствуйте (Zdravstvuyte)'}
                      </div>
                      <Button variant="outline" size="sm" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                        <Headphones className="mr-2 h-4 w-4" />
                        Listen
                      </Button>
                    </div>
                    
                    <div className="p-3 bg-[#050b17] rounded-md">
                      <div className="text-sm font-medium mb-1">Thank you</div>
                      <div className="text-xs text-gray-400 mb-1">
                        {selectedLanguage === 'es' && 'Gracias'}
                        {selectedLanguage === 'fr' && 'Merci'}
                        {selectedLanguage === 'it' && 'Grazie'}
                        {selectedLanguage === 'de' && 'Danke'}
                        {selectedLanguage === 'ja' && 'ありがとう (Arigatou)'}
                        {selectedLanguage === 'ko' && '감사합니다 (Gamsahamnida)'}
                        {selectedLanguage === 'zh' && '谢谢 (Xièxiè)'}
                        {selectedLanguage === 'ar' && 'شكرا (Shukran)'}
                        {selectedLanguage === 'pt' && 'Obrigado/a'}
                        {selectedLanguage === 'ru' && 'Спасибо (Spasibo)'}
                      </div>
                      <Button variant="outline" size="sm" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                        <Headphones className="mr-2 h-4 w-4" />
                        Listen
                      </Button>
                    </div>
                    
                    <div className="p-3 bg-[#050b17] rounded-md">
                      <div className="text-sm font-medium mb-1">Where is...?</div>
                      <div className="text-xs text-gray-400 mb-1">
                        {selectedLanguage === 'es' && '¿Dónde está...?'}
                        {selectedLanguage === 'fr' && 'Où est...?'}
                        {selectedLanguage === 'it' && 'Dov\'è...?'}
                        {selectedLanguage === 'de' && 'Wo ist...?'}
                        {selectedLanguage === 'ja' && 'どこですか？ (Doko desu ka?)'}
                        {selectedLanguage === 'ko' && '어디입니까? (Eodiimnikka?)'}
                        {selectedLanguage === 'zh' && '在哪里？ (Zài nǎlǐ?)'}
                        {selectedLanguage === 'ar' && 'أين...؟ (Ayna...?)'}
                        {selectedLanguage === 'pt' && 'Onde está...?'}
                        {selectedLanguage === 'ru' && 'Где...? (Gde...?)'}
                      </div>
                      <Button variant="outline" size="sm" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                        <Headphones className="mr-2 h-4 w-4" />
                        Listen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#0a1021] border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <FileAudio className="mr-2 h-5 w-5 text-[#4a89dc]" />
                    Audio Practice
                  </CardTitle>
                  <CardDescription>Practice pronunciation with AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-52 border border-dashed border-gray-700 rounded-md bg-[#050b17]">
                    <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white mb-3">
                      <FileAudio className="mr-2 h-4 w-4" />
                      Start Recording
                    </Button>
                    <p className="text-sm text-gray-400 text-center max-w-xs">
                      Record yourself speaking phrases in {selectedLanguageName} and get AI-powered feedback on your pronunciation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#0a1021] border-t border-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 JET AI Travel Companion. All rights reserved.</p>
            <p className="mt-2">Powered by advanced AI models from Google, OpenAI, and Anthropic</p>
          </div>
        </div>
      </footer>
    </div>
  );
}