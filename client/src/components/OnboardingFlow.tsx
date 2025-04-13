import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfile } from '@/lib/firebase';
import { Heart, MapPin, Plane, Star, DollarSign, Hotel, Utensils, Camera, Languages, Clock, Users } from 'lucide-react';

// Types for onboarding steps
// TODO: Update OnboardingFlow component to use the 20 questions from onboardingFlow.ts
// The current implementation uses the old steps below, but we've updated the data model
// in onboardingFlow.ts with the new 20 questions format for future implementation
export type OnboardingStep = 'name' | 'email' | 'destinations' | 'travelerType' | 'interests' | 'budget' | 'accommodation' | 'dietary' | 'languages' | 'complete';

export type OnboardingData = {
  travelPreferences?: {
    experienceTypes?: string[];
    budget?: string;
    travelCompanions?: string;
    bucketListDestinations?: string[];
    itineraryPreference?: string;
    tripDuration?: string;
    accommodationPreference?: string[];
    dietaryRestrictions?: string[];
    internationalTravel?: string;
    preferredActivities?: string[];
    ecofriendlyTravel?: string;
    travelFrequency?: string;
    accessibilityNeeds?: string[];
    bookingManagement?: string;
    transportationPreference?: string[];
    languages?: string[];
    socialPreference?: string;
    aiAssistancePreference?: string;
    journeySharing?: string;
    experienceCuration?: string;
  };
};

interface OnboardingFlowProps {
  onComplete: (preferences: UserProfile['travelPreferences']) => void;
  initialStep?: OnboardingStep;
  initialData?: Partial<UserProfile['travelPreferences']>;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  onComplete,
  initialStep = 'name',
  initialData = {}
}) => {
  const { currentUser, userProfile } = useAuth();
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [destinations, setDestinations] = useState<string[]>(initialData.upcomingDestinations || []);
  const [destinationInput, setDestinationInput] = useState('');
  const [travelerType, setTravelerType] = useState(initialData.travelerType || '');
  const [interests, setInterests] = useState<string[]>(initialData.interests || []);
  const [budget, setBudget] = useState(initialData.budget || '');
  const [accommodation, setAccommodation] = useState(initialData.preferredAccommodation || '');
  const [dietary, setDietary] = useState<string[]>(initialData.dietaryRestrictions || []);
  const [languages, setLanguages] = useState<string[]>(initialData.languages || ['English']);
  
  const addDestination = () => {
    if (destinationInput.trim() && !destinations.includes(destinationInput.trim())) {
      setDestinations([...destinations, destinationInput.trim()]);
      setDestinationInput('');
    }
  };
  
  const removeDestination = (dest: string) => {
    setDestinations(destinations.filter(d => d !== dest));
  };
  
  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };
  
  const toggleDietary = (restriction: string) => {
    if (dietary.includes(restriction)) {
      setDietary(dietary.filter(d => d !== restriction));
    } else {
      setDietary([...dietary, restriction]);
    }
  };
  
  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      if (languages.length > 1) { // Always keep at least one language
        setLanguages(languages.filter(l => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };
  
  const nextStep = () => {
    switch (step) {
      case 'name':
        setStep('email');
        break;
      case 'email':
        setStep('destinations');
        break;
      case 'destinations':
        setStep('travelerType');
        break;
      case 'travelerType':
        setStep('interests');
        break;
      case 'interests':
        setStep('budget');
        break;
      case 'budget':
        setStep('accommodation');
        break;
      case 'accommodation':
        setStep('dietary');
        break;
      case 'dietary':
        setStep('languages');
        break;
      case 'languages':
        setStep('complete');
        completeOnboarding();
        break;
      default:
        break;
    }
  };
  
  const prevStep = () => {
    switch (step) {
      case 'email':
        setStep('name');
        break;
      case 'destinations':
        setStep('email');
        break;
      case 'travelerType':
        setStep('destinations');
        break;
      case 'interests':
        setStep('travelerType');
        break;
      case 'budget':
        setStep('interests');
        break;
      case 'accommodation':
        setStep('budget');
        break;
      case 'dietary':
        setStep('accommodation');
        break;
      case 'languages':
        setStep('dietary');
        break;
      default:
        break;
    }
  };
  
  const completeOnboarding = () => {
    setLoading(true);
    
    const preferences: UserProfile['travelPreferences'] = {
      upcomingDestinations: destinations,
      travelerType,
      interests,
      budget,
      preferredAccommodation: accommodation,
      dietaryRestrictions: dietary,
      languages
    };
    
    onComplete(preferences);
    setLoading(false);
  };
  
  const validateStep = (): boolean => {
    switch (step) {
      case 'name':
        return name.trim().length > 0;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      case 'destinations':
        return true; // Optional
      case 'travelerType':
        return travelerType.length > 0;
      case 'interests':
        return interests.length > 0;
      case 'budget':
        return budget.length > 0;
      case 'accommodation':
        return accommodation.length > 0;
      case 'dietary':
        return true; // Optional
      case 'languages':
        return languages.length > 0;
      default:
        return true;
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 'name':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">What's your name?</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
        );
        
      case 'email':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">What's your email address?</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll use this to save your preferences and send you travel updates.
              </p>
            </div>
          </div>
        );
        
      case 'destinations':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Which destinations are you planning to visit?</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter a destination"
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addDestination()}
                />
                <Button type="button" onClick={addDestination} variant="outline">Add</Button>
              </div>
              
              {destinations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {destinations.map((dest) => (
                    <div key={dest} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{dest}</span>
                      <button 
                        type="button" 
                        className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                        onClick={() => removeDestination(dest)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                Don't worry if you don't have specific destinations yet. You can add them later.
              </p>
            </div>
          </div>
        );
        
      case 'travelerType':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>What kind of traveler are you?</Label>
              <RadioGroup value={travelerType} onValueChange={setTravelerType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="luxury" id="traveler-luxury" />
                  <Label htmlFor="traveler-luxury" className="cursor-pointer">Luxury traveler</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="adventure" id="traveler-adventure" />
                  <Label htmlFor="traveler-adventure" className="cursor-pointer">Adventure seeker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cultural" id="traveler-cultural" />
                  <Label htmlFor="traveler-cultural" className="cursor-pointer">Cultural explorer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="budget" id="traveler-budget" />
                  <Label htmlFor="traveler-budget" className="cursor-pointer">Budget conscious</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="family" id="traveler-family" />
                  <Label htmlFor="traveler-family" className="cursor-pointer">Family traveler</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="digital-nomad" id="traveler-digital-nomad" />
                  <Label htmlFor="traveler-digital-nomad" className="cursor-pointer">Digital nomad</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case 'interests':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>What are your travel interests? (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  { id: 'food', label: 'Food & Cuisine', icon: <Utensils className="h-4 w-4 mr-2" /> },
                  { id: 'culture', label: 'Culture & Arts', icon: <Camera className="h-4 w-4 mr-2" /> },
                  { id: 'nature', label: 'Nature & Outdoors', icon: <MapPin className="h-4 w-4 mr-2" /> },
                  { id: 'relaxation', label: 'Relaxation & Wellness', icon: <Heart className="h-4 w-4 mr-2" /> },
                  { id: 'adventure', label: 'Adventure & Sports', icon: <Star className="h-4 w-4 mr-2" /> },
                  { id: 'nightlife', label: 'Nightlife & Entertainment', icon: <Star className="h-4 w-4 mr-2" /> },
                  { id: 'shopping', label: 'Shopping', icon: <DollarSign className="h-4 w-4 mr-2" /> },
                  { id: 'history', label: 'History & Heritage', icon: <Clock className="h-4 w-4 mr-2" /> },
                ].map((interest) => (
                  <div 
                    key={interest.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-muted ${
                      interests.includes(interest.id) ? 'bg-primary/10 border border-primary/30' : 'bg-card border border-input'
                    }`}
                    onClick={() => toggleInterest(interest.id)}
                  >
                    {interest.icon}
                    <span>{interest.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'budget':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>What's your typical budget for travel?</Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your typical budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget (less than $100/day)</SelectItem>
                  <SelectItem value="moderate">Moderate ($100-$300/day)</SelectItem>
                  <SelectItem value="luxury">Luxury ($300-$500/day)</SelectItem>
                  <SelectItem value="ultra-luxury">Ultra Luxury (more than $500/day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'accommodation':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>What's your preferred accommodation type?</Label>
              <RadioGroup value={accommodation} onValueChange={setAccommodation}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="luxury-hotel" id="accommodation-luxury" />
                  <Label htmlFor="accommodation-luxury" className="cursor-pointer">Luxury Hotels & Resorts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mid-range-hotel" id="accommodation-mid" />
                  <Label htmlFor="accommodation-mid" className="cursor-pointer">Mid-range Hotels</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="boutique" id="accommodation-boutique" />
                  <Label htmlFor="accommodation-boutique" className="cursor-pointer">Boutique Hotels</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vacation-rental" id="accommodation-rental" />
                  <Label htmlFor="accommodation-rental" className="cursor-pointer">Vacation Rentals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hostel" id="accommodation-hostel" />
                  <Label htmlFor="accommodation-hostel" className="cursor-pointer">Hostels</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="budget" id="accommodation-budget" />
                  <Label htmlFor="accommodation-budget" className="cursor-pointer">Budget Accommodations</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
        
      case 'dietary':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Do you have any dietary restrictions? (Optional)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  'Vegetarian',
                  'Vegan',
                  'Gluten-free',
                  'Dairy-free',
                  'Kosher',
                  'Halal',
                  'Nut Allergy',
                  'No restrictions'
                ].map((restriction) => (
                  <div 
                    key={restriction}
                    className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-muted ${
                      dietary.includes(restriction) ? 'bg-primary/10 border border-primary/30' : 'bg-card border border-input'
                    }`}
                    onClick={() => toggleDietary(restriction)}
                  >
                    <Checkbox 
                      checked={dietary.includes(restriction)} 
                      onCheckedChange={() => toggleDietary(restriction)}
                      className="mr-2"
                    />
                    <span>{restriction}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'languages':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Which languages do you speak?</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  'English',
                  'Spanish',
                  'French',
                  'German',
                  'Italian',
                  'Portuguese',
                  'Japanese',
                  'Chinese',
                  'Russian',
                  'Arabic'
                ].map((lang) => (
                  <div 
                    key={lang}
                    className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-muted ${
                      languages.includes(lang) ? 'bg-primary/10 border border-primary/30' : 'bg-card border border-input'
                    }`}
                    onClick={() => toggleLanguage(lang)}
                  >
                    <Checkbox 
                      checked={languages.includes(lang)} 
                      onCheckedChange={() => toggleLanguage(lang)}
                      className="mr-2"
                    />
                    <span>{lang}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'complete':
        return (
          <div className="space-y-4 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Plane className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-medium">All Set, {name}!</h3>
            <p>
              Thanks for completing your travel profile. JetAI will now personalize your experience based on your preferences.
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const getStepTitle = (): string => {
    switch (step) {
      case 'name':
        return 'Welcome to JetAI';
      case 'email':
        return 'Contact Information';
      case 'destinations':
        return 'Dream Destinations';
      case 'travelerType':
        return 'Travel Style';
      case 'interests':
        return 'Travel Interests';
      case 'budget':
        return 'Budget Preferences';
      case 'accommodation':
        return 'Accommodation Style';
      case 'dietary':
        return 'Dietary Preferences';
      case 'languages':
        return 'Language Skills';
      case 'complete':
        return 'Profile Complete';
      default:
        return '';
    }
  };
  
  const getStepDescription = (): string => {
    switch (step) {
      case 'name':
        return 'Let\'s get to know you better to personalize your experience';
      case 'email':
        return 'We\'ll keep your travel plans organized';
      case 'destinations':
        return 'Tell us where you\'d like to travel';
      case 'travelerType':
        return 'How would you describe your travel style?';
      case 'interests':
        return 'What do you enjoy most when traveling?';
      case 'budget':
        return 'What\'s your typical spending range when traveling?';
      case 'accommodation':
        return 'Where do you prefer to stay when traveling?';
      case 'dietary':
        return 'Any special dietary needs we should know about?';
      case 'languages':
        return 'Which languages do you speak?';
      case 'complete':
        return 'Your personal travel assistant is ready';
      default:
        return '';
    }
  };
  
  const getProgressPercentage = (): number => {
    const steps: OnboardingStep[] = [
      'name',
      'email',
      'destinations',
      'travelerType',
      'interests',
      'budget',
      'accommodation',
      'dietary',
      'languages',
      'complete'
    ];
    
    const currentIndex = steps.indexOf(step);
    return Math.round((currentIndex / (steps.length - 1)) * 100);
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{getStepTitle()}</CardTitle>
        <CardDescription>{getStepDescription()}</CardDescription>
        
        {step !== 'complete' && (
          <div className="w-full bg-secondary h-2 rounded-full mt-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {renderStep()}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step !== 'name' && step !== 'complete' ? (
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
        ) : (
          <div /> // Empty div for spacing
        )}
        
        {step !== 'complete' ? (
          <Button
            onClick={nextStep}
            disabled={!validateStep() || loading}
          >
            {loading ? 'Processing...' : step === 'languages' ? 'Complete' : 'Next'}
          </Button>
        ) : (
          <Button 
            onClick={() => onComplete({
              upcomingDestinations: destinations,
              travelerType,
              interests,
              budget,
              preferredAccommodation: accommodation,
              dietaryRestrictions: dietary,
              languages
            })}
            className="w-full"
          >
            Start Using JetAI
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default OnboardingFlow;