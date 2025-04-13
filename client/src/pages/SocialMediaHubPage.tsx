import { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Share2, Award, AlignLeft, Calendar, MessageSquare } from 'lucide-react';
import SocialPostGenerator from '@/components/SocialPostGenerator';

export default function SocialMediaHubPage() {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#050b17] text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">JET AI - Social Media Hub</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="opacity-75">Welcome,</span>{' '}
              <span className="font-medium">{user?.username || 'Traveler'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center">
                <Share2 className="h-6 w-6 mr-3 text-[#4a89dc]" />
                Social Media Hub
              </CardTitle>
              <CardDescription>
                Create, schedule, and manage your travel-related social media content
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-gray-600 mb-4">
                Use the power of JET AI to create engaging social media posts about your travels. Upload photos, select your preferred tone and platform, and our AI will generate optimized content ready to share.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#4a89dc]/10 rounded-lg p-4 flex items-center">
                  <div className="rounded-full bg-[#4a89dc]/20 p-2 mr-4">
                    <Share2 className="h-5 w-5 text-[#4a89dc]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Create Content</h3>
                    <p className="text-sm text-gray-600">Generate AI-powered captions and hashtags</p>
                  </div>
                </div>
                
                <div className="bg-[#4a89dc]/10 rounded-lg p-4 flex items-center">
                  <div className="rounded-full bg-[#4a89dc]/20 p-2 mr-4">
                    <Calendar className="h-5 w-5 text-[#4a89dc]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Schedule Posts</h3>
                    <p className="text-sm text-gray-600">Plan your social media calendar ahead of time</p>
                  </div>
                </div>
                
                <div className="bg-[#4a89dc]/10 rounded-lg p-4 flex items-center">
                  <div className="rounded-full bg-[#4a89dc]/20 p-2 mr-4">
                    <Award className="h-5 w-5 text-[#4a89dc]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Earn Points</h3>
                    <p className="text-sm text-gray-600">Get JET AI points for every post you create</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="create-post" className="mt-6">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="create-post" className="py-3">
                <AlignLeft className="h-4 w-4 mr-2" />
                Create Post
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="py-3">
                <Calendar className="h-4 w-4 mr-2" />
                Scheduled
              </TabsTrigger>
              <TabsTrigger value="published" className="py-3">
                <Share2 className="h-4 w-4 mr-2" />
                Published
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="create-post">
              <SocialPostGenerator />
            </TabsContent>
            
            <TabsContent value="scheduled">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Scheduled Posts</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  You don't have any scheduled posts yet. Create a post and set a future date to schedule it.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="published">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Share2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Published Posts</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Your published posts will appear here. Create and publish a post to get started.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}