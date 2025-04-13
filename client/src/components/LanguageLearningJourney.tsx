import { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Check, 
  Globe, 
  Headphones, 
  MessageSquare, 
  Play, 
  Volume2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  getLanguageLearningProgress, 
  getLanguageName, 
  getPhrasesForLanguage, 
  getLessonsForLanguage,
  textToSpeech,
  UserLanguageLearningProgress,
  saveLanguageLearningProgress
} from '@/lib/languageLearningService';

interface LanguageLearningJourneyProps {
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  onProgressUpdate?: (progress: number) => void;
}

export default function LanguageLearningJourney({ 
  language, 
  level = 'beginner',
  onProgressUpdate 
}: LanguageLearningJourneyProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lessons, setLessons] = useState<any[]>([]);
  const [phrases, setPhrases] = useState<any[]>([]);
  const [learningGoal, setLearningGoal] = useState<string>('travel');
  const { toast } = useToast();

  useEffect(() => {
    // Load lessons based on language and level
    setIsLoading(true);
    
    setTimeout(() => {
      // Get saved progress
      const savedProgress = getLanguageLearningProgress();
      
      // Get lessons for this language/level
      const availableLessons = getLessonsForLanguage(language, level);
      
      // Apply completed status from saved progress
      if (savedProgress && savedProgress.language === language) {
        const updatedLessons = availableLessons.map(lesson => ({
          ...lesson,
          completed: savedProgress.completedLessons.includes(lesson.id)
        }));
        setLessons(updatedLessons);
        
        // Calculate progress
        const completedCount = updatedLessons.filter(l => l.completed).length;
        const progressValue = Math.min(100, (completedCount / updatedLessons.length) * 100);
        setProgress(progressValue);
        
        if (onProgressUpdate) {
          onProgressUpdate(progressValue);
        }
      } else {
        setLessons(availableLessons);
      }
      
      // Get phrases for this language
      const availablePhrases = getPhrasesForLanguage(language, 'travel' as any);
      setPhrases(availablePhrases);
      
      setIsLoading(false);
    }, 800);
  }, [language, level, onProgressUpdate]);

  const handleStartLesson = (lessonId: number) => {
    // Mark lesson as completed
    const updatedLessons = lessons.map(lesson => 
      lesson.id === lessonId ? { ...lesson, completed: true } : lesson
    );
    
    setLessons(updatedLessons);
    
    // Update progress
    const completedCount = updatedLessons.filter(l => l.completed).length;
    const progressValue = Math.min(100, (completedCount / updatedLessons.length) * 100);
    setProgress(progressValue);
    
    if (onProgressUpdate) {
      onProgressUpdate(progressValue);
    }
    
    // Save progress
    const completedLessons = updatedLessons
      .filter(lesson => lesson.completed)
      .map(lesson => lesson.id);
    
    const userProgress: UserLanguageLearningProgress = {
      language,
      level,
      completedLessons,
      lastActivity: new Date()
    };
    
    saveLanguageLearningProgress(userProgress);
    
    toast({
      title: "Lesson Started",
      description: "This lesson would normally launch an interactive language learning experience.",
    });
  };

  const playAudio = (phrase: string) => {
    // In a real implementation, this would call the Text-to-Speech API
    toast({
      title: "Audio Playback",
      description: "Playing audio for the phrase (using Google's Text-to-Speech API)",
    });
    
    // Actual implementation would be:
    /*
    textToSpeech({
      text: phrase,
      languageCode: language,
      speakingRate: 0.9 // Slightly slower for language learning
    }).then(response => {
      if (response.audioContent) {
        // Create audio element and play
        const audio = new Audio(`data:audio/mp3;base64,${response.audioContent}`);
        audio.play();
      }
    });
    */
  };

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#4a89dc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading language learning content...</p>
        </div>
      </div>
    );
  }

  if (!language) {
    return (
      <div className="py-10 text-center">
        <Globe className="h-16 w-16 mx-auto text-gray-600 mb-4" />
        <h3 className="text-xl font-medium mb-2">Select a language to begin</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Choose a language from the selection panel to view personalized learning content
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#0a1021] border border-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <BookMarked className="mr-2 h-5 w-5 text-[#4a89dc]" />
            {level.charAt(0).toUpperCase() + level.slice(1)} Lessons for {getLanguageName(language)}
          </h3>
          <div className="text-sm text-gray-400">
            Progress: {Math.round(progress)}%
          </div>
        </div>
        
        <Progress value={progress} className="h-2 mb-4" />
        
        {lessons.length > 0 ? (
          <div className="space-y-3">
            {lessons.map((lesson) => (
              <div 
                key={lesson.id} 
                className={`p-3 border rounded-lg ${
                  lesson.completed 
                  ? 'border-green-500/30 bg-green-500/5' 
                  : 'border-gray-800 bg-[#050b17] hover:border-gray-700'
                } transition-colors`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      lesson.completed 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-[#4a89dc]/10 text-[#4a89dc]'
                    }`}>
                      {lesson.completed ? <Check className="h-5 w-5" /> : <Play className="h-5 w-5" />}
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
          <div className="text-center p-6">
            <p className="text-gray-400">No lessons available for this language and level.</p>
          </div>
        )}
      </div>
      
      <div className="bg-[#0a1021] border border-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-[#4a89dc]" />
            Essential Phrases
          </h3>
          <Button variant="outline" size="sm" className="text-[#4a89dc] border-[#4a89dc]/30 hover:bg-[#4a89dc]/10">
            <Headphones className="h-4 w-4 mr-2" />
            Practice All
          </Button>
        </div>
        
        {phrases.length > 0 ? (
          <div className="space-y-3">
            {phrases.map((item, index) => (
              <Card key={index} className="bg-[#050b17] border-gray-800">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-base flex items-center justify-between">
                    {item.phrase}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[#4a89dc] hover:text-[#3a79cc] h-8 w-8 p-0"
                      onClick={() => playAudio(item.phrase)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-0 px-4">
                  <p className="text-sm text-gray-400">{item.translation}</p>
                </CardContent>
                <CardFooter className="py-2 px-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#4a89dc] hover:text-[#3a79cc] text-xs ml-auto"
                  >
                    Practice Pronunciation
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-6">
            <p className="text-gray-400">No phrases available for this language.</p>
          </div>
        )}
      </div>
    </div>
  );
}