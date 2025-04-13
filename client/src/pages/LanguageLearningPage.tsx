import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  MessageSquare, 
  BookOpen, 
  Headphones, 
  User, 
  Globe,
  Map,
  Mic,
  Volume2,
  BookMarked,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

export default function LanguageLearningPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [proficiencyLevel, setProficiencyLevel] = useState<string>('beginner');
  const [learningGoal, setLearningGoal] = useState<string>('travel');
  const [nextDestination, setNextDestination] = useState<string>('');
  const [recommendedLessons, setRecommendedLessons] = useState<any[]>([]);
  const [userPreferences, setUserPreferences] = useState<any>({});
  const [learningProgress, setLearningProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // List of supported languages
  const languages = [
    { code: 'es', name: 'Spanish', destinations: ['Spain', 'Mexico', 'Argentina'], flagEmoji: '🇪🇸' },
    { code: 'fr', name: 'French', destinations: ['France', 'Canada', 'Switzerland'], flagEmoji: '🇫🇷' },
    { code: 'it', name: 'Italian', destinations: ['Italy'], flagEmoji: '🇮🇹' },
    { code: 'de', name: 'German', destinations: ['Germany', 'Austria', 'Switzerland'], flagEmoji: '🇩🇪' },
    { code: 'ja', name: 'Japanese', destinations: ['Japan'], flagEmoji: '🇯🇵' },
    { code: 'zh', name: 'Mandarin Chinese', destinations: ['China', 'Taiwan', 'Singapore'], flagEmoji: '🇨🇳' },
    { code: 'pt', name: 'Portuguese', destinations: ['Portugal', 'Brazil'], flagEmoji: '🇵🇹' },
    { code: 'ru', name: 'Russian', destinations: ['Russia'], flagEmoji: '🇷🇺' },
  ];

  // Sample travel phrases for different languages
  const travelPhrases: Record<string, any[]> = {
    es: [
      { phrase: 'Hola, ¿cómo estás?', translation: 'Hello, how are you?' },
      { phrase: '¿Dónde está el hotel?', translation: 'Where is the hotel?' },
      { phrase: 'Me gustaría reservar una habitación', translation: 'I would like to book a room' },
      { phrase: '¿Cuánto cuesta esto?', translation: 'How much does this cost?' },
      { phrase: 'La cuenta, por favor', translation: 'The bill, please' },
    ],
    fr: [
      { phrase: 'Bonjour, comment allez-vous?', translation: 'Hello, how are you?' },
      { phrase: 'Où est l\'hôtel?', translation: 'Where is the hotel?' },
      { phrase: 'Je voudrais réserver une chambre', translation: 'I would like to book a room' },
      { phrase: 'Combien ça coûte?', translation: 'How much does this cost?' },
      { phrase: 'L\'addition, s\'il vous plaît', translation: 'The bill, please' },
    ],
    de: [
      { phrase: 'Hallo, wie geht es Ihnen?', translation: 'Hello, how are you?' },
      { phrase: 'Wo ist das Hotel?', translation: 'Where is the hotel?' },
      { phrase: 'Ich möchte ein Zimmer buchen', translation: 'I would like to book a room' },
      { phrase: 'Wie viel kostet das?', translation: 'How much does this cost?' },
      { phrase: 'Die Rechnung, bitte', translation: 'The bill, please' },
    ],
    // Add more languages as needed
  };

  // Sample lessons
  const lessonsByLevel = {
    beginner: [
      { id: 1, title: 'Greetings and Introductions', duration: '15 min', completed: true },
      { id: 2, title: 'Finding Your Way Around', duration: '20 min', completed: true },
      { id: 3, title: 'Ordering Food and Drinks', duration: '25 min', completed: false },
      { id: 4, title: 'Public Transportation', duration: '15 min', completed: false },
      { id: 5, title: 'Shopping and Bargaining', duration: '20 min', completed: false },
    ],
    intermediate: [
      { id: 1, title: 'Making Conversation', duration: '25 min', completed: false },
      { id: 2, title: 'Travel Emergencies', duration: '30 min', completed: false },
      { id: 3, title: 'Cultural Etiquette', duration: '20 min', completed: false },
      { id: 4, title: 'Booking Accommodations', duration: '15 min', completed: false },
      { id: 5, title: 'Local Customs and Traditions', duration: '30 min', completed: false },
    ],
    advanced: [
      { id: 1, title: 'Negotiating and Business Talk', duration: '35 min', completed: false },
      { id: 2, title: 'Medical Emergencies', duration: '25 min', completed: false },
      { id: 3, title: 'Local Slang and Idioms', duration: '30 min', completed: false },
      { id: 4, title: 'Making Friends Locally', duration: '20 min', completed: false },
      { id: 5, title: 'Discussing Arts and Culture', duration: '30 min', completed: false },
    ],
  };

  useEffect(() => {
    // Simulate loading user preferences from localStorage
    const savedLangPrefs = localStorage.getItem('jetai_language_preferences');
    const savedUserPrefs = localStorage.getItem('jetai_user_preferences');
    
    setTimeout(() => {
      if (savedLangPrefs) {
        try {
          const prefs = JSON.parse(savedLangPrefs);
          setSelectedLanguage(prefs.language || '');
          setProficiencyLevel(prefs.level || 'beginner');
          setLearningGoal(prefs.goal || 'travel');
          setNextDestination(prefs.destination || '');
          
          // Calculate progress
          const progress = Math.min(100, ((prefs.completedLessons?.length || 0) / 10) * 100);
          setLearningProgress(progress);
        } catch (e) {
          console.error('Error parsing language preferences:', e);
        }
      }
      
      if (savedUserPrefs) {
        try {
          setUserPreferences(JSON.parse(savedUserPrefs));
        } catch (e) {
          console.error('Error parsing user preferences:', e);
        }
      }
      
      // Set recommended lessons based on level
      if (proficiencyLevel) {
        setRecommendedLessons(lessonsByLevel[proficiencyLevel as keyof typeof lessonsByLevel] || []);
      }
      
      setIsLoading(false);
    }, 1200);
  }, [proficiencyLevel]);

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode);
    
    // Save preferences
    const prefs = {
      language: langCode,
      level: proficiencyLevel,
      goal: learningGoal,
      destination: nextDestination,
      completedLessons: recommendedLessons.filter(lesson => lesson.completed).map(lesson => lesson.id)
    };
    
    localStorage.setItem('jetai_language_preferences', JSON.stringify(prefs));
    
    toast({
      title: "Language Selected",
      description: `You've selected ${languages.find(l => l.code === langCode)?.name}. Your learning preferences have been updated.`,
    });
  };

  const handleLevelChange = (level: string) => {
    setProficiencyLevel(level);
    setRecommendedLessons(lessonsByLevel[level as keyof typeof lessonsByLevel] || []);
    
    // Update preferences
    const prefs = {
      language: selectedLanguage,
      level: level,
      goal: learningGoal,
      destination: nextDestination,
      completedLessons: []
    };
    
    localStorage.setItem('jetai_language_preferences', JSON.stringify(prefs));
  };

  const handleStartLesson = (lessonId: number) => {
    toast({
      title: "Lesson Started",
      description: "This lesson would normally launch an interactive language learning experience.",
    });
    
    // Mark the lesson as completed (for demonstration)
    const updatedLessons = recommendedLessons.map(lesson => 
      lesson.id === lessonId ? { ...lesson, completed: true } : lesson
    );
    
    setRecommendedLessons(updatedLessons);
    
    // Update progress
    const completedCount = updatedLessons.filter(l => l.completed).length;
    const totalLessons = 10; // Example total lesson count
    setLearningProgress(Math.min(100, (completedCount / totalLessons) * 100));
    
    // Save updated lessons to preferences
    const prefs = {
      language: selectedLanguage,
      level: proficiencyLevel,
      goal: learningGoal,
      destination: nextDestination,
      completedLessons: updatedLessons.filter(lesson => lesson.completed).map(lesson => lesson.id)
    };
    
    localStorage.setItem('jetai_language_preferences', JSON.stringify(prefs));
  };

  const playAudio = (phrase: string) => {
    // In a real implementation, this would call a Text-to-Speech API
    toast({
      title: "Audio Playback",
      description: "Playing audio for phrase (this would use Google's Text-to-Speech API in a real implementation)",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050b17] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4a89dc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your language learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b17] text-white">
      {/* Top navigation */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-8">
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-white" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" strokeLinejoin="round" strokeLinecap="round"/>
              </svg>
              <div className="ml-2">
                <div className="font-display text-xl tracking-tight">JET AI</div>
                <div className="text-xs text-white/70 -mt-1 font-serif">TRAVEL COMPANION</div>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="px-3 py-2 text-gray-400 hover:text-white">Dashboard</Link>
              <Link href="/trips" className="px-3 py-2 text-gray-400 hover:text-white">My Trips</Link>
              <Link href="/language-learning" className="px-3 py-2 text-[#4a89dc] border-b-2 border-[#4a89dc]">Language Learning</Link>
              <Link href="/features" className="px-3 py-2 text-gray-400 hover:text-white">AI Features</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-400 hover:text-white p-2">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white p-2">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
          {/* Left column - Language selection and progress */}
          <div className="lg:w-1/3 mb-10 lg:mb-0">
            <h1 className="text-3xl font-display mb-2">Language Learning</h1>
            <p className="text-gray-400 mb-6">Master essential travel phrases for your next destination</p>
            
            {/* Progress card */}
            <Card className="bg-[#0a1021] border-gray-800 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-[#4a89dc]" />
                  Your Learning Progress
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {selectedLanguage ? 
                    `Learning ${languages.find(l => l.code === selectedLanguage)?.name}` : 
                    'Select a language to begin'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Overall Progress</span>
                      <span className="text-sm text-[#4a89dc]">{Math.round(learningProgress)}%</span>
                    </div>
                    <Progress value={learningProgress} className="h-2" />
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-3">Proficiency Level</h4>
                    <RadioGroup 
                      value={proficiencyLevel} 
                      onValueChange={handleLevelChange}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="beginner" />
                        <Label htmlFor="beginner" className="text-gray-300">Beginner</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intermediate" id="intermediate" />
                        <Label htmlFor="intermediate" className="text-gray-300">Intermediate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <Label htmlFor="advanced" className="text-gray-300">Advanced</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-4">
                <Button 
                  disabled={!selectedLanguage} 
                  className="w-full bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
                >
                  Continue Learning
                </Button>
              </CardFooter>
            </Card>
            
            {/* Language selection grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select a Language</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language.code)}
                    className={`p-3 rounded-lg text-center border transition-all ${
                      selectedLanguage === language.code 
                        ? 'bg-[#4a89dc]/10 border-[#4a89dc] text-white' 
                        : 'border-gray-800 bg-[#0a1021]/50 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{language.flagEmoji}</div>
                    <div className="text-sm font-medium">{language.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right column - Learning content */}
          <div className="lg:w-2/3">
            <Tabs defaultValue="lessons" className="w-full">
              <TabsList className="bg-[#0a1021] border-b border-gray-800 w-full justify-start mb-6">
                <TabsTrigger value="lessons" className="data-[state=active]:bg-[#4a89dc]/10 data-[state=active]:text-[#4a89dc]">
                  <BookMarked className="mr-2 h-4 w-4" />
                  Lessons
                </TabsTrigger>
                <TabsTrigger value="phrases" className="data-[state=active]:bg-[#4a89dc]/10 data-[state=active]:text-[#4a89dc]">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Phrases
                </TabsTrigger>
                <TabsTrigger value="practice" className="data-[state=active]:bg-[#4a89dc]/10 data-[state=active]:text-[#4a89dc]">
                  <Mic className="mr-2 h-4 w-4" />
                  Practice
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="lessons" className="mt-0">
                <div className="bg-[#0a1021] border border-gray-800 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-[#4a89dc]" />
                    {selectedLanguage ? 
                      `Recommended ${proficiencyLevel.charAt(0).toUpperCase() + proficiencyLevel.slice(1)} Lessons` : 
                      'Select a language to see recommended lessons'
                    }
                  </h3>
                  
                  {selectedLanguage ? (
                    <div className="space-y-3">
                      {recommendedLessons.map((lesson) => (
                        <div key={lesson.id} className="p-3 border border-gray-800 rounded-lg bg-[#050b17] hover:border-gray-700 transition-colors">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-[#4a89dc]/10 flex items-center justify-center mr-3">
                                {lesson.completed ? 
                                  <CheckCircle className="h-5 w-5 text-green-500" /> :
                                  <PlayCircle className="h-5 w-5 text-[#4a89dc]" />
                                }
                              </div>
                              <div>
                                <h4 className="font-medium">{lesson.title}</h4>
                                <p className="text-xs text-gray-400">{lesson.duration}</p>
                              </div>
                            </div>
                            <Button
                              variant={lesson.completed ? "outline" : "default"}
                              size="sm"
                              className={lesson.completed ? 
                                "border-green-500/30 text-green-500 hover:bg-green-500/10" : 
                                "bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
                              }
                              onClick={() => handleStartLesson(lesson.id)}
                            >
                              {lesson.completed ? "Review" : "Start"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Globe className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                      <h3 className="font-medium text-lg mb-1">Select a language to begin</h3>
                      <p className="text-gray-500">Choose a language from the selection panel to see personalized lessons</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="phrases" className="mt-0">
                <div className="bg-[#0a1021] border border-gray-800 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-[#4a89dc]" />
                    Essential Travel Phrases
                  </h3>
                  
                  {selectedLanguage && travelPhrases[selectedLanguage] ? (
                    <div className="space-y-3">
                      {travelPhrases[selectedLanguage].map((item, index) => (
                        <div key={index} className="p-3 border border-gray-800 rounded-lg bg-[#050b17]">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-medium">{item.phrase}</h4>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button 
                                        onClick={() => playAudio(item.phrase)}
                                        className="ml-2 text-[#4a89dc] hover:text-[#3a79cc]"
                                      >
                                        <Volume2 className="h-4 w-4" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Listen to pronunciation</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <p className="text-sm text-gray-400">{item.translation}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-[#4a89dc] border-[#4a89dc]/30">
                                {proficiencyLevel}
                              </Badge>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-[#4a89dc] hover:text-[#3a79cc] hover:bg-[#4a89dc]/10"
                              >
                                Practice
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <Button variant="outline" className="w-full mt-4 border-[#4a89dc]/30 text-[#4a89dc] hover:bg-[#4a89dc]/10">
                        Load More Phrases
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                      <h3 className="font-medium text-lg mb-1">No phrases available</h3>
                      <p className="text-gray-500">
                        {selectedLanguage ? 
                          "Phrases for this language are coming soon!" : 
                          "Select a language to see travel phrases"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="practice" className="mt-0">
                <div className="bg-[#0a1021] border border-gray-800 rounded-lg p-6 mb-6 text-center">
                  <div className="py-8">
                    <Mic className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                    <h3 className="font-medium text-xl mb-2">Voice Practice Mode</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Practice your pronunciation with our AI-powered voice recognition system. 
                      Speak into your microphone and receive instant feedback.
                    </p>
                    <Button 
                      disabled={!selectedLanguage}
                      className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white"
                    >
                      Start Speaking Practice
                    </Button>
                    {!selectedLanguage && (
                      <p className="text-sm text-gray-500 mt-3">Please select a language first</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-[#0a1021] border border-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Practice Activities</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-[#050b17] border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Conversation Scenarios</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">Practice real-world conversations for travel situations like hotels, restaurants, and transportation.</p>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button
                          variant="outline"
                          disabled={!selectedLanguage}
                          className="w-full text-[#4a89dc] border-[#4a89dc]/30 hover:bg-[#4a89dc]/10"
                        >
                          Start Activity
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-[#050b17] border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Listening Comprehension</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">Test your ability to understand native speakers in different travel scenarios and contexts.</p>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button
                          variant="outline"
                          disabled={!selectedLanguage}
                          className="w-full text-[#4a89dc] border-[#4a89dc]/30 hover:bg-[#4a89dc]/10"
                        >
                          Start Activity
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-[#050b17] border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Vocabulary Flashcards</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">Build your travel vocabulary with interactive flashcards tailored to your destination.</p>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button
                          variant="outline"
                          disabled={!selectedLanguage}
                          className="w-full text-[#4a89dc] border-[#4a89dc]/30 hover:bg-[#4a89dc]/10"
                        >
                          Start Activity
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="bg-[#050b17] border-gray-800">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Cultural Quiz</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">Test your knowledge of cultural customs and etiquette for your travel destination.</p>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button
                          variant="outline"
                          disabled={!selectedLanguage}
                          className="w-full text-[#4a89dc] border-[#4a89dc]/30 hover:bg-[#4a89dc]/10"
                        >
                          Start Activity
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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