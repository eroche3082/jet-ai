import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mic, 
  Pause, 
  Play, 
  Save, 
  StopCircle, 
  Trash, 
  Volume2, 
  VolumeX,
  RotateCw,
  Globe,
  FileText,
  MessageSquare
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LANGUAGES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
  { value: 'fr-FR', label: 'French (France)' },
  { value: 'de-DE', label: 'German (Germany)' },
  { value: 'it-IT', label: 'Italian (Italy)' },
  { value: 'ja-JP', label: 'Japanese (Japan)' },
  { value: 'ko-KR', label: 'Korean (South Korea)' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)' },
  { value: 'zh-CN', label: 'Chinese (Simplified)' },
  { value: 'ru-RU', label: 'Russian (Russia)' },
];

export default function AudioToolsPage() {
  // General audio states
  const [activeTab, setActiveTab] = useState<string>('record');
  
  // Recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordingLanguage, setRecordingLanguage] = useState<string>('en-US');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingsList, setRecordingsList] = useState<{name: string, url: string}[]>([]);
  
  // Translation states
  const [textToTranslate, setTextToTranslate] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [sourceLanguage, setSourceLanguage] = useState<string>('en-US');
  const [targetLanguage, setTargetLanguage] = useState<string>('es-ES');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  
  // Text-to-speech states
  const [textToSpeak, setTextToSpeak] = useState<string>('');
  const [ttsLanguage, setTtsLanguage] = useState<string>('en-US');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [ttsVolume, setTtsVolume] = useState<number>(1);
  const [ttsRate, setTtsRate] = useState<number>(1);
  const [ttsPitch, setTtsPitch] = useState<number>(1);
  
  // Transcription states
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  
  // Media recording references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Speech synthesis reference
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Handle recording permission and setup
  useEffect(() => {
    return () => {
      // Clean up when component unmounts
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (window.speechSynthesis && speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioUrl, isRecording]);
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setIsRecording(false);
        setIsPaused(false);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start recording timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone: ' + (error as Error).message);
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };
  
  // Pause/resume recording
  const togglePauseResume = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    
    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    setIsPaused(!isPaused);
  };
  
  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Save recording
  const saveRecording = () => {
    if (!audioUrl) return;
    
    const recordingName = prompt('Enter a name for this recording:', `Recording ${recordingsList.length + 1}`);
    
    if (recordingName) {
      setRecordingsList([
        ...recordingsList,
        { name: recordingName, url: audioUrl }
      ]);
      
      // Reset for new recording
      setAudioUrl(null);
      setAudioBlob(null);
    }
  };
  
  // Delete recording
  const deleteRecording = (index: number) => {
    const updatedList = [...recordingsList];
    URL.revokeObjectURL(updatedList[index].url);
    updatedList.splice(index, 1);
    setRecordingsList(updatedList);
  };
  
  // Play/pause recording in the list
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  
  const togglePlayPause = (index: number) => {
    if (playingIndex === index) {
      if (audioPlayerRef.current?.paused) {
        audioPlayerRef.current.play();
      } else {
        audioPlayerRef.current?.pause();
      }
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      
      audioPlayerRef.current = new Audio(recordingsList[index].url);
      audioPlayerRef.current.play();
      audioPlayerRef.current.onended = () => setPlayingIndex(null);
      setPlayingIndex(index);
    }
  };
  
  // Translate text
  const translateText = () => {
    if (!textToTranslate) return;
    
    setIsTranslating(true);
    
    // Simulate translation API call
    setTimeout(() => {
      // In a real app, this would be an API call to Google Translate or similar
      setTranslatedText(`[${textToTranslate}] translated from ${sourceLanguage} to ${targetLanguage}`);
      setIsTranslating(false);
    }, 1500);
  };
  
  // Text-to-speech functions
  const speakText = () => {
    if (!textToSpeak || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = ttsLanguage;
    utterance.volume = ttsVolume;
    utterance.rate = ttsRate;
    utterance.pitch = ttsPitch;
    
    // Get voices
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === ttsLanguage);
    if (voice) {
      utterance.voice = voice;
    }
    
    // Set up events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  
  // Transcribe audio
  const transcribeAudio = () => {
    if (!audioBlob) return;
    
    setIsTranscribing(true);
    
    // Simulate transcription API call
    setTimeout(() => {
      // In a real app, this would be an API call to a transcription service
      setTranscribedText('This is a simulated transcription of the audio recording. In a real application, this would use a service like Google Speech-to-Text, Amazon Transcribe, or similar to convert the audio to text.');
      setIsTranscribing(false);
    }, 2000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Travel Audio Tools</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="record">
            <Mic className="w-4 h-4 mr-2" />
            Record
          </TabsTrigger>
          <TabsTrigger value="translate">
            <Globe className="w-4 h-4 mr-2" />
            Translate
          </TabsTrigger>
          <TabsTrigger value="tts">
            <MessageSquare className="w-4 h-4 mr-2" />
            Text to Speech
          </TabsTrigger>
        </TabsList>
        
        {/* Voice Recording Tab */}
        <TabsContent value="record" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Record Audio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                      isRecording 
                        ? isPaused
                          ? 'bg-amber-100 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400 animate-pulse'
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                    }`}>
                      <Mic className="w-16 h-16" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-mono">
                      {formatTime(recordingTime)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {isRecording 
                        ? isPaused ? 'Recording paused' : 'Recording...' 
                        : 'Ready to record'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Language</label>
                    <Select
                      value={recordingLanguage}
                      onValueChange={setRecordingLanguage}
                      disabled={isRecording}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-center space-x-2">
                    {!isRecording ? (
                      <Button
                        onClick={startRecording}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={togglePauseResume}
                        >
                          {isPaused ? (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Resume
                            </>
                          ) : (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="destructive"
                          onClick={stopRecording}
                        >
                          <StopCircle className="w-4 h-4 mr-2" />
                          Stop
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {audioUrl && (
                    <div className="border rounded-md p-3">
                      <audio src={audioUrl} controls className="w-full mb-3" />
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={saveRecording}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={transcribeAudio}
                          disabled={isTranscribing}
                          className="flex-1"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Transcribe
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {isTranscribing && (
                    <div className="text-center py-2">
                      <div className="inline-block h-5 w-5 border-2 border-current border-t-transparent text-primary rounded-full animate-spin mr-2"></div>
                      <span>Transcribing...</span>
                    </div>
                  )}
                  
                  {transcribedText && (
                    <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm font-medium mb-1">Transcription:</p>
                      <p className="text-sm">{transcribedText}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Saved Recordings</CardTitle>
              </CardHeader>
              <CardContent>
                {recordingsList.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No recordings saved yet</p>
                    <p className="text-sm mt-1">Your saved recordings will appear here</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {recordingsList.map((recording, index) => (
                        <div 
                          key={index} 
                          className="p-3 border rounded-md flex items-center justify-between"
                        >
                          <div className="flex-1 min-w-0 mr-4">
                            <h4 className="font-medium text-sm truncate">{recording.name}</h4>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => togglePlayPause(index)}
                            >
                              {playingIndex === index && !audioPlayerRef.current?.paused ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteRecording(index)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Translation Tab */}
        <TabsContent value="translate" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Text Translation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">From</label>
                      <Select
                        value={sourceLanguage}
                        onValueChange={setSourceLanguage}
                        disabled={isTranslating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">To</label>
                      <Select
                        value={targetLanguage}
                        onValueChange={setTargetLanguage}
                        disabled={isTranslating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Text to Translate</label>
                    <Textarea
                      placeholder="Enter text to translate..."
                      value={textToTranslate}
                      onChange={(e) => setTextToTranslate(e.target.value)}
                      disabled={isTranslating}
                      rows={5}
                    />
                  </div>
                  
                  <Button
                    onClick={translateText}
                    disabled={!textToTranslate || isTranslating}
                    className="w-full"
                  >
                    {isTranslating ? (
                      <>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent text-primary-foreground rounded-full animate-spin mr-2"></div>
                        Translating...
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-4 h-4 mr-2" />
                        Translate
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Translation Result</CardTitle>
              </CardHeader>
              <CardContent>
                {translatedText ? (
                  <div className="space-y-4">
                    <div className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800/50 min-h-[160px]">
                      <p>{translatedText}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          navigator.clipboard.writeText(translatedText);
                        }}
                      >
                        Copy to Clipboard
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setTextToSpeak(translatedText);
                          setTtsLanguage(targetLanguage);
                          setActiveTab('tts');
                        }}
                      >
                        Text to Speech
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-center p-4">
                    <div className="text-gray-500 dark:text-gray-400">
                      <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Translation results will appear here</p>
                      <p className="text-sm mt-1">Enter text and click Translate to begin</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Text-to-Speech Tab */}
        <TabsContent value="tts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Text to Speech</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <Select
                    value={ttsLanguage}
                    onValueChange={setTtsLanguage}
                    disabled={isSpeaking}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Text to Speak</label>
                  <Textarea
                    placeholder="Enter text to convert to speech..."
                    value={textToSpeak}
                    onChange={(e) => setTextToSpeak(e.target.value)}
                    disabled={isSpeaking}
                    rows={6}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Volume: {ttsVolume.toFixed(1)}
                    </label>
                    <Slider
                      value={[ttsVolume]}
                      min={0}
                      max={1}
                      step={0.1}
                      onValueChange={(value) => setTtsVolume(value[0])}
                      disabled={isSpeaking}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Speed: {ttsRate.toFixed(1)}x
                    </label>
                    <Slider
                      value={[ttsRate]}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onValueChange={(value) => setTtsRate(value[0])}
                      disabled={isSpeaking}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Pitch: {ttsPitch.toFixed(1)}
                    </label>
                    <Slider
                      value={[ttsPitch]}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onValueChange={(value) => setTtsPitch(value[0])}
                      disabled={isSpeaking}
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {!isSpeaking ? (
                    <Button
                      onClick={speakText}
                      disabled={!textToSpeak}
                      className="flex-1"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Speak Text
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={stopSpeaking}
                      className="flex-1"
                    >
                      <VolumeX className="w-4 h-4 mr-2" />
                      Stop Speaking
                    </Button>
                  )}
                </div>
                
                <Alert>
                  <AlertDescription>
                    Text-to-speech uses your device's built-in speech synthesis and may vary by browser and operating system.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}