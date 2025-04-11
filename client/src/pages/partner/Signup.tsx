import React, { useState } from 'react';
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle2, DollarSign, Users, Globe, Zap } from "lucide-react";

// Partner program features
const features = [
  {
    title: "10% Commission",
    description: "Earn 10% of all bookings and subscription fees from your referred customers.",
    icon: DollarSign
  },
  {
    title: "Unlimited Referrals",
    description: "No cap on the number of customers you can refer to JetAI.",
    icon: Users
  },
  {
    title: "White-Label Solution",
    description: "Get your own custom-branded version of JetAI on your subdomain.",
    icon: Globe
  },
  {
    title: "Embeddable Widget",
    description: "Add the JetAI travel assistant widget directly to your website.",
    icon: Zap
  }
];

export default function PartnerSignup() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    website: '',
    businessType: 'travel_agency',
    subdomain: '',
    plan: 'standard',
    terms: false
  });
  const [step, setStep] = useState(1);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormState(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
      
      // Reset availability check when subdomain changes
      if (name === 'subdomain') {
        setIsAvailable(null);
      }
    }
  };
  
  // Check subdomain availability
  const checkSubdomain = async () => {
    if (!formState.subdomain) return;
    
    setIsChecking(true);
    try {
      // In a real app, this would be an API call
      // Simulate an API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock availability check
      const unavailableSubdomains = ['app', 'www', 'api', 'admin', 'luxury', 'backpackers', 'miami'];
      const isUnavailable = unavailableSubdomains.includes(formState.subdomain.toLowerCase());
      
      setIsAvailable(!isUnavailable);
    } catch (error) {
      toast({
        title: "Error checking availability",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  // Partner registration mutation
  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/partners/register', data);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration successful!",
        description: "Your partner account has been created.",
      });
      
      // Store partner code in local storage
      localStorage.setItem('partnerCode', data.referralCode);
      
      // Redirect to partner dashboard after successful registration
      setTimeout(() => {
        setLocation('/partner/dashboard');
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      if (step === 1 && (!formState.name || !formState.email || !formState.website)) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      
      if (step === 2 && (!formState.subdomain || !isAvailable)) {
        toast({
          title: "Invalid subdomain",
          description: "Please choose an available subdomain",
          variant: "destructive"
        });
        return;
      }
      
      setStep(step + 1);
      return;
    }
    
    // Final submission
    if (!formState.terms) {
      toast({
        title: "Terms and conditions",
        description: "Please accept the terms and conditions to continue",
        variant: "destructive"
      });
      return;
    }
    
    registerMutation.mutate({
      name: formState.name,
      email: formState.email,
      websiteUrl: formState.website,
      businessType: formState.businessType,
      subdomain: formState.subdomain,
      plan: formState.plan
    });
  };
  
  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">JetAI Partner Program</h1>
        <p className="text-lg text-muted-foreground">
          Join our partner program and start earning commissions today
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
        
        <Card className="flex flex-col border-primary">
          <CardHeader>
            <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Easy Setup</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground">
              Get started in minutes with our simple onboarding process. No technical skills required.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Partner Application</CardTitle>
          <CardDescription>
            Complete the form below to join our partner program
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registerMutation.isPending ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg">Processing your application...</p>
            </div>
          ) : registerMutation.isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Application Successful!</h2>
              <p className="text-center mb-4">
                Congratulations! Your partner account has been created. You will be redirected to your dashboard shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <div className="relative">
                  <div className="flex items-center mb-6">
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                      {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                    </div>
                    <div className={`h-0.5 w-full ${step > 1 ? 'bg-primary' : 'bg-border'}`}></div>
                    <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${step > 1 ? 'bg-primary text-white' : 'bg-background border border-border text-muted-foreground'}`}>
                      {step > 2 ? <CheckCircle2 className="h-5 w-5" /> : "2"}
                    </div>
                    <div className={`h-0.5 w-full ${step > 2 ? 'bg-primary' : 'bg-border'}`}></div>
                    <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${step > 2 ? 'bg-primary text-white' : 'bg-background border border-border text-muted-foreground'}`}>
                      {step > 3 ? <CheckCircle2 className="h-5 w-5" /> : "3"}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm mb-8">
                    <div className="text-center">
                      <div className={step === 1 ? "font-medium" : ""}>Business Details</div>
                    </div>
                    <div className="text-center">
                      <div className={step === 2 ? "font-medium" : ""}>Subdomain</div>
                    </div>
                    <div className="text-center">
                      <div className={step === 3 ? "font-medium" : ""}>Confirm</div>
                    </div>
                  </div>
                </div>
                
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Business or Website Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website">Website URL *</Label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          placeholder="https://yourwebsite.com"
                          value={formState.website}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type</Label>
                        <select 
                          id="businessType" 
                          name="businessType" 
                          value={formState.businessType}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="travel_agency">Travel Agency</option>
                          <option value="tour_operator">Tour Operator</option>
                          <option value="travel_blogger">Travel Blogger</option>
                          <option value="hotel">Hotel/Accommodation</option>
                          <option value="destination_marketing">Destination Marketing Organization</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="subdomain">Choose Your Subdomain *</Label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                            <span>https://</span>
                          </div>
                          <Input
                            id="subdomain"
                            name="subdomain"
                            className="pl-20"
                            value={formState.subdomain}
                            onChange={handleChange}
                            onBlur={checkSubdomain}
                            placeholder="yourcompany"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                            <span>.jetai.app</span>
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={checkSubdomain}
                          disabled={isChecking || !formState.subdomain}
                        >
                          {isChecking ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Checking...
                            </>
                          ) : 'Check Availability'}
                        </Button>
                      </div>
                      {isAvailable === true && (
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Subdomain is available
                        </p>
                      )}
                      {isAvailable === false && (
                        <p className="text-sm text-red-600 mt-1">
                          This subdomain is already taken. Please choose another one.
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Your white-label JetAI instance will be available at this subdomain
                      </p>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Choose a Partner Plan</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select the partner plan that best fits your business needs
                        </p>
                      </div>
                      
                      <Tabs defaultValue="standard" value={formState.plan} onValueChange={(value) => setFormState(prev => ({ ...prev, plan: value }))}>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="standard">Standard</TabsTrigger>
                          <TabsTrigger value="professional">Professional</TabsTrigger>
                          <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
                        </TabsList>
                        <TabsContent value="standard" className="p-4 border rounded-md mt-2">
                          <div className="space-y-2">
                            <h4 className="font-medium">Standard Plan</h4>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                10% commission on all referrals
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                Basic white-label customization
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                Embeddable widget
                              </li>
                            </ul>
                          </div>
                        </TabsContent>
                        <TabsContent value="professional" className="p-4 border rounded-md mt-2">
                          <div className="space-y-2">
                            <h4 className="font-medium">Professional Plan</h4>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                15% commission on all referrals
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                Advanced white-label customization
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                Priority support
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                Marketing materials
                              </li>
                            </ul>
                          </div>
                        </TabsContent>
                        <TabsContent value="enterprise" className="p-4 border rounded-md mt-2">
                          <div className="space-y-2">
                            <h4 className="font-medium">Enterprise Plan</h4>
                            <ul className="text-sm space-y-1">
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                Custom commission rates
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                Complete brand customization
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                Dedicated account manager
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                API access
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                                Custom integration options
                              </li>
                            </ul>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                )}
                
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Review Your Application</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Please review your information before submitting
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 rounded-md p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Business Name</p>
                          <p className="text-sm text-muted-foreground">{formState.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Email Address</p>
                          <p className="text-sm text-muted-foreground">{formState.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Website</p>
                          <p className="text-sm text-muted-foreground">{formState.website}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Business Type</p>
                          <p className="text-sm text-muted-foreground">
                            {formState.businessType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Subdomain</p>
                          <p className="text-sm text-muted-foreground">https://{formState.subdomain}.jetai.app</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Partner Plan</p>
                          <p className="text-sm text-muted-foreground">
                            {formState.plan.charAt(0).toUpperCase() + formState.plan.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="terms"
                          name="terms"
                          checked={formState.terms}
                          onChange={handleChange}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the <a href="/terms" className="text-primary underline">Terms and Conditions</a> and <a href="/privacy" className="text-primary underline">Privacy Policy</a>
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={() => setLocation('/')}>
                    Cancel
                  </Button>
                )}
                
                <Button type="submit">
                  {step < 3 ? 'Continue' : 'Submit Application'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already a partner? <a href="/partner/login" className="text-primary underline">Log in to your partner account</a>
        </p>
      </div>
    </div>
  );
}