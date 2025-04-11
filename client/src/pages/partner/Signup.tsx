import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { formatCurrency } from '@/lib/utils';

// Form validation schema
const partnerFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  websiteUrl: z.string().url('Please enter a valid URL'),
  businessType: z.enum(['creator', 'agency', 'hotel', 'airline', 'other']),
  audience: z.string().min(1, 'Please describe your audience'),
  referralSource: z.string().optional(),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(20, 'Subdomain must be less than 20 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens are allowed'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type PartnerFormValues = z.infer<typeof partnerFormSchema>;

export default function PartnerSignup() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  
  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      websiteUrl: '',
      businessType: 'creator',
      audience: '',
      referralSource: '',
      subdomain: '',
      termsAccepted: false,
    },
  });
  
  const onSubmit = async (data: PartnerFormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Partner application submitted:', data, 'Selected plan:', selectedPlan);
      // Would call API here to submit the application
      setTimeout(() => {
        setStep(3); // Move to success step
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error('Error submitting partner application:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Become a JetAI Partner</h1>
        <p className="text-muted-foreground mt-2">
          Earn commissions and get access to powerful travel AI tools
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className="ml-3">
              <div className="font-medium">Partner Information</div>
              <div className="text-sm text-muted-foreground">Your business details</div>
            </div>
          </div>
          <Separator className="w-16" />
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
            <div className="ml-3">
              <div className="font-medium">Choose Plan</div>
              <div className="text-sm text-muted-foreground">Select your partner tier</div>
            </div>
          </div>
          <Separator className="w-16" />
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              3
            </div>
            <div className="ml-3">
              <div className="font-medium">Success</div>
              <div className="text-sm text-muted-foreground">Start referring</div>
            </div>
          </div>
        </div>
      </div>
      
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Partner Information</CardTitle>
            <CardDescription>
              Tell us about your business to apply for the partner program
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(() => setStep(2))} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business/Creator Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="websiteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourwebsite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="creator">Content Creator</SelectItem>
                            <SelectItem value="agency">Travel Agency</SelectItem>
                            <SelectItem value="hotel">Hotel/Accommodation</SelectItem>
                            <SelectItem value="airline">Airline/Transport</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe Your Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., travel enthusiasts, luxury travelers, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subdomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Subdomain</FormLabel>
                      <div className="flex items-center">
                        <FormControl>
                          <Input placeholder="yourname" {...field} />
                        </FormControl>
                        <span className="ml-2 text-muted-foreground">.jetai.app</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        This will be your white-label URL: https://{field.value || 'yourname'}.jetai.app
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Partner Agreement</a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
      
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Partner Plan</CardTitle>
            <CardDescription>
              Select the plan that fits your business needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" onValueChange={setSelectedPlan}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="pro">White-Label</TabsTrigger>
                <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="mt-6">
                <div className="bg-muted/30 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Basic Partner</h3>
                      <p className="text-muted-foreground">Standard affiliate program</p>
                    </div>
                    <div className="text-3xl font-bold">Free</div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>10% commission on all bookings</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>Custom referral link</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>Basic analytics dashboard</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>Monthly payouts via PayPal or bank transfer</div>
                    </div>
                  </div>
                  
                  <Button onClick={() => onSubmit(form.getValues())} className="w-full">
                    Start with Basic Plan
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="pro" className="mt-6">
                <div className="bg-primary/5 rounded-lg p-6 border-2 border-primary">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">White-Label Partner</h3>
                      <p className="text-muted-foreground">Custom branded experience</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{formatCurrency(49.99)}</div>
                      <div className="text-sm text-muted-foreground">per month</div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div><strong>15% commission</strong> on all bookings</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div><strong>Custom subdomain</strong> (yourbrand.jetai.app)</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div><strong>Custom branding</strong> (logo, colors, fonts)</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>Embeddable widget for your website</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>Advanced analytics and reporting</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>Priority payouts and support</div>
                    </div>
                  </div>
                  
                  <Button onClick={() => onSubmit(form.getValues())} className="w-full">
                    Start with White-Label Plan
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="enterprise" className="mt-6">
                <div className="bg-muted/30 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Enterprise Partner</h3>
                      <p className="text-muted-foreground">Full customization and integration</p>
                    </div>
                    <div className="text-xl font-bold">Custom Pricing</div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>Custom commission structure</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>Custom domain support</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>Full API access</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>White-label mobile app</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>Dedicated account manager</div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <div>Custom integration support</div>
                    </div>
                  </div>
                  
                  <Button onClick={() => onSubmit(form.getValues())} className="w-full">
                    Contact Sales
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              onClick={() => onSubmit(form.getValues())}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Complete Application'}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {step === 3 && (
        <Card>
          <CardHeader>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-center">Application Submitted!</CardTitle>
            <CardDescription className="text-center">
              Thank you for applying to the JetAI Partner Program
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>
              We've received your application and will review it shortly. You'll receive an email with next steps within 1-2 business days.
            </p>
            <div className="p-4 bg-muted rounded-md text-sm">
              <p className="font-medium">Selected Plan: {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Partner</p>
              {selectedPlan === 'basic' && <p className="text-muted-foreground">Commission: 10%</p>}
              {selectedPlan === 'pro' && <p className="text-muted-foreground">Commission: 15%</p>}
              {selectedPlan === 'enterprise' && <p className="text-muted-foreground">Custom Commission Structure</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/partner">
                Go to Partner Dashboard
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Have questions? <a href="#" className="text-primary underline">Contact our partnerships team</a>
      </div>
    </div>
  );
}