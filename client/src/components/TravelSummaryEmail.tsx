import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Send, Mail, Calendar, MapPin, Hash } from 'lucide-react';

interface TravelSummaryFormData {
  destination: string;
  tripDuration: number;
  travelCategory: string;
  totalSpent: number;
  pointsEarned: number;
  mediaUrl?: string;
  postCaption?: string;
  postHashtags?: string;
}

export default function TravelSummaryEmail() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<TravelSummaryFormData>({
    destination: '',
    tripDuration: 7,
    travelCategory: 'Luxury',
    totalSpent: 0,
    pointsEarned: 0,
    postCaption: '',
    postHashtags: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tripDuration' || name === 'totalSpent' || name === 'pointsEarned' 
        ? parseFloat(value) 
        : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const generatePreview = async () => {
    if (!formData.destination || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and make sure you're logged in",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiRequest(
        'POST',
        '/api/notifications/preview-travel-summary',
        {
          userName: user.username,
          ...formData,
          travelAccessCode: generateAccessCode(formData.destination, formData.travelCategory)
        }
      );
      
      const data = await response.json();
      setPreviewHtml(data.html);
      
      toast({
        title: "Preview Generated",
        description: "Your travel summary email preview is ready"
      });
    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        title: "Preview Generation Failed",
        description: "Could not generate email preview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendEmail = async () => {
    if (!formData.destination || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and make sure you're logged in",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiRequest(
        'POST',
        '/api/notifications/send-travel-summary',
        {
          email: user.email,
          userName: user.username,
          ...formData,
          travelAccessCode: generateAccessCode(formData.destination, formData.travelCategory)
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Email Sent",
          description: "Your travel summary email has been sent successfully"
        });
      } else {
        throw new Error(data.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Email Sending Failed",
        description: "Could not send the email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate a unique travel access code
  const generateAccessCode = (destination: string, category: string): string => {
    const prefix = 'TRAVEL';
    const categoryCode = category.slice(0, 3).toUpperCase();
    const destCode = destination.slice(0, 2).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    
    return `${prefix}-${categoryCode}-${destCode}-${randomNum}`;
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle>Travel Summary Email</CardTitle>
            <CardDescription>
              Create a personalized travel summary to reflect on your journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="e.g., Paris, France"
                    value={formData.destination}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="tripDuration">Trip Duration (days)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="tripDuration"
                    name="tripDuration"
                    type="number"
                    min="1"
                    max="365"
                    value={formData.tripDuration}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="travelCategory">Travel Category</Label>
                <Select 
                  onValueChange={value => handleSelectChange('travelCategory', value)}
                  defaultValue={formData.travelCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Luxury">Luxury</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Budget">Budget</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalSpent">Total Spent ($)</Label>
                <Input
                  id="totalSpent"
                  name="totalSpent"
                  type="number"
                  min="0"
                  value={formData.totalSpent}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="pointsEarned">JetPoints Earned</Label>
                <Input
                  id="pointsEarned"
                  name="pointsEarned"
                  type="number"
                  min="0"
                  value={formData.pointsEarned}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="mediaUrl">Image URL (optional)</Label>
              <Input
                id="mediaUrl"
                name="mediaUrl"
                placeholder="https://example.com/your-image.jpg"
                value={formData.mediaUrl}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="postCaption">Social Media Caption</Label>
              <Textarea
                id="postCaption"
                name="postCaption"
                placeholder="Write a caption for social media sharing"
                value={formData.postCaption}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="postHashtags">Hashtags</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="postHashtags"
                  name="postHashtags"
                  placeholder="e.g., #travel #adventure #paris"
                  value={formData.postHashtags}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={generatePreview}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Generate Preview
            </Button>
            <Button 
              onClick={sendEmail}
              className="bg-[#4a89dc] hover:bg-[#3a79cc]"
              disabled={isLoading}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </CardFooter>
        </Card>
        
        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
            <CardDescription>
              How your travel summary email will look
            </CardDescription>
          </CardHeader>
          <CardContent>
            {previewHtml ? (
              <div 
                className="border rounded-md h-[600px] overflow-auto"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <div className="border rounded-md h-[600px] flex items-center justify-center">
                <div className="text-center p-6">
                  <Mail className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No Preview Available</h3>
                  <p className="text-sm text-gray-500">
                    Fill in the form and click "Generate Preview" to see how your email will look
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-end">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open('about:blank', '_blank')?.document.write(previewHtml || '')}
              disabled={!previewHtml}
            >
              Open in New Tab
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}