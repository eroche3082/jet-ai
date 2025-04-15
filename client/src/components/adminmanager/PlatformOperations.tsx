import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Layout, 
  Menu, 
  Type, 
  Image as ImageIcon, 
  PaintBucket, 
  Save, 
  Undo, 
  Plus, 
  Edit, 
  Trash2,
  Globe
} from 'lucide-react';

const PlatformOperations: React.FC = () => {
  const [activeContentTab, setActiveContentTab] = useState('sections');
  
  // Mock data for platform sections
  const platformSections = [
    { id: 'hero', name: 'Hero Section', status: 'active', lastEdited: '2025-04-15 09:30 AM' },
    { id: 'features', name: 'AI Features Grid', status: 'active', lastEdited: '2025-04-14 02:15 PM' },
    { id: 'testimonials', name: 'Testimonials Slider', status: 'active', lastEdited: '2025-04-13 11:20 AM' },
    { id: 'pricing', name: 'Pricing Tables', status: 'active', lastEdited: '2025-04-12 04:45 PM' },
    { id: 'blog', name: 'Latest Blog Posts', status: 'inactive', lastEdited: '2025-04-10 10:10 AM' }
  ];
  
  // Mock data for navigation menus
  const navigationMenus = [
    { id: 'main', name: 'Main Navigation', itemCount: 7, status: 'active', lastEdited: '2025-04-14 03:40 PM' },
    { id: 'footer', name: 'Footer Menu', itemCount: 5, status: 'active', lastEdited: '2025-04-13 12:30 PM' },
    { id: 'mobile', name: 'Mobile Navigation', itemCount: 6, status: 'active', lastEdited: '2025-04-12 09:15 AM' }
  ];
  
  // Mock data for content blocks
  const contentBlocks = [
    { 
      id: 'welcome', 
      type: 'text', 
      title: 'Welcome Message',
      content: 'Welcome to JET AI - Your intelligent travel companion powered by advanced AI technology.',
      status: 'active', 
      lastEdited: '2025-04-15 08:20 AM'
    },
    { 
      id: 'features-intro', 
      type: 'text-image', 
      title: 'AI Features Introduction',
      content: 'Discover how our AI technology can transform your travel experience with personalized recommendations and real-time assistance.',
      status: 'active', 
      lastEdited: '2025-04-14 01:30 PM'
    },
    { 
      id: 'about-us', 
      type: 'text-video', 
      title: 'About JET AI',
      content: 'JET AI combines cutting-edge artificial intelligence with travel expertise to create the ultimate travel companion.',
      status: 'active', 
      lastEdited: '2025-04-12 11:45 AM'
    },
    { 
      id: 'call-to-action', 
      type: 'cta', 
      title: 'Join JET AI Today',
      content: 'Sign up now to experience the future of travel planning and get personalized recommendations for your next trip.',
      status: 'active', 
      lastEdited: '2025-04-10 03:25 PM'
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Platform Operations</h2>
        <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
          <Save className="h-4 w-4 mr-2" /> Save All Changes
        </Button>
      </div>
      
      <Tabs defaultValue={activeContentTab} onValueChange={setActiveContentTab} className="space-y-4">
        <TabsList className="bg-[#0a1328]">
          <TabsTrigger value="sections" className="flex items-center gap-2">
            <Layout className="h-4 w-4" /> Sections
          </TabsTrigger>
          <TabsTrigger value="menus" className="flex items-center gap-2">
            <Menu className="h-4 w-4" /> Navigation Menus
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Type className="h-4 w-4" /> Content Blocks
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <PaintBucket className="h-4 w-4" /> Appearance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sections" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Manage Sections</CardTitle>
                  <CardDescription className="text-gray-400">
                    Edit, reorder, and toggle visibility of platform sections
                  </CardDescription>
                </div>
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                  <Plus className="h-4 w-4 mr-2" /> Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#4a89dc]/20">
                      <th className="text-left py-3 text-[#4a89dc]">Section Name</th>
                      <th className="text-left py-3 text-[#4a89dc]">Status</th>
                      <th className="text-left py-3 text-[#4a89dc]">Last Edited</th>
                      <th className="text-right py-3 text-[#4a89dc]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformSections.map((section) => (
                      <tr key={section.id} className="border-b border-[#4a89dc]/20 hover:bg-[#0f1e36]">
                        <td className="py-3">{section.name}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            section.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {section.status}
                          </span>
                        </td>
                        <td className="py-3">{section.lastEdited}</td>
                        <td className="py-3 text-right">
                          <Button variant="outline" size="sm" className="mr-2">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="mr-2">
                            {section.status === 'active' ? (
                              <span className="text-red-400">Hide</span>
                            ) : (
                              <span className="text-green-500">Show</span>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Section Editor</CardTitle>
              <CardDescription className="text-gray-400">
                Edit selected section content and properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sectionTitle">Section Title</Label>
                    <Input id="sectionTitle" className="bg-[#050b17] border-[#4a89dc]/20" placeholder="Hero Section" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sectionId">Section ID</Label>
                    <Input id="sectionId" className="bg-[#050b17] border-[#4a89dc]/20" placeholder="hero" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sectionContentType">Content Type</Label>
                  <Select defaultValue="text-image">
                    <SelectTrigger id="sectionContentType" className="bg-[#050b17] border-[#4a89dc]/20">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Only</SelectItem>
                      <SelectItem value="text-image">Text with Image</SelectItem>
                      <SelectItem value="image-gallery">Image Gallery</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="custom">Custom Component</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sectionContent">Content</Label>
                  <textarea
                    id="sectionContent"
                    className="w-full min-h-32 p-2 rounded-md bg-[#050b17] border border-[#4a89dc]/20 focus:border-[#4a89dc] focus:outline-none"
                    placeholder="Enter section content here..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sectionBackground">Background Color</Label>
                    <div className="flex gap-2">
                      <Input id="sectionBackground" type="color" className="w-12 h-10 p-1 bg-[#050b17] border-[#4a89dc]/20" defaultValue="#050b17" />
                      <Input className="flex-1 bg-[#050b17] border-[#4a89dc]/20" defaultValue="#050b17" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sectionOrder">Display Order</Label>
                    <Input id="sectionOrder" type="number" className="bg-[#050b17] border-[#4a89dc]/20" defaultValue="1" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-4 gap-2">
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
              <Button variant="outline">
                <Undo className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="menus" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Navigation Menus</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure site navigation structure
                  </CardDescription>
                </div>
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                  <Plus className="h-4 w-4 mr-2" /> New Menu
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#4a89dc]/20">
                      <th className="text-left py-3 text-[#4a89dc]">Menu Name</th>
                      <th className="text-left py-3 text-[#4a89dc]">Items</th>
                      <th className="text-left py-3 text-[#4a89dc]">Status</th>
                      <th className="text-left py-3 text-[#4a89dc]">Last Edited</th>
                      <th className="text-right py-3 text-[#4a89dc]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {navigationMenus.map((menu) => (
                      <tr key={menu.id} className="border-b border-[#4a89dc]/20 hover:bg-[#0f1e36]">
                        <td className="py-3">{menu.name}</td>
                        <td className="py-3">{menu.itemCount}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            menu.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {menu.status}
                          </span>
                        </td>
                        <td className="py-3">{menu.lastEdited}</td>
                        <td className="py-3 text-right">
                          <Button variant="outline" size="sm" className="mr-2">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Menu Editor</CardTitle>
              <CardDescription className="text-gray-400">
                Edit menu structure and items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="menuName">Menu Name</Label>
                    <Input id="menuName" className="bg-[#050b17] border-[#4a89dc]/20" defaultValue="Main Navigation" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="menuLocation">Display Location</Label>
                    <Select defaultValue="header">
                      <SelectTrigger id="menuLocation" className="bg-[#050b17] border-[#4a89dc]/20">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">Header</SelectItem>
                        <SelectItem value="footer">Footer</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                        <SelectItem value="mobile">Mobile Menu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-4 bg-[#050b17] rounded-md border border-[#4a89dc]/20">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Menu className="h-4 w-4 mr-2" /> Menu Items
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="p-3 bg-[#0a1328] rounded-md flex justify-between items-center">
                      <div>
                        <div className="font-medium">Home</div>
                        <div className="text-xs text-gray-400">URL: /</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-[#0a1328] rounded-md flex justify-between items-center">
                      <div>
                        <div className="font-medium">Destinations</div>
                        <div className="text-xs text-gray-400">URL: /destinations</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-[#0a1328] rounded-md flex justify-between items-center">
                      <div>
                        <div className="font-medium">AI Features</div>
                        <div className="text-xs text-gray-400">URL: /ai-features</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="mt-3 bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                    <Plus className="h-4 w-4 mr-2" /> Add Menu Item
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-4 gap-2">
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                <Save className="h-4 w-4 mr-2" /> Save Menu
              </Button>
              <Button variant="outline">
                <Undo className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Content Blocks</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage reusable content blocks throughout the platform
                  </CardDescription>
                </div>
                <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                  <Plus className="h-4 w-4 mr-2" /> New Content Block
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#4a89dc]/20">
                      <th className="text-left py-3 text-[#4a89dc]">Title</th>
                      <th className="text-left py-3 text-[#4a89dc]">Type</th>
                      <th className="text-left py-3 text-[#4a89dc]">Status</th>
                      <th className="text-left py-3 text-[#4a89dc]">Last Edited</th>
                      <th className="text-right py-3 text-[#4a89dc]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentBlocks.map((block) => (
                      <tr key={block.id} className="border-b border-[#4a89dc]/20 hover:bg-[#0f1e36]">
                        <td className="py-3">{block.title}</td>
                        <td className="py-3 capitalize">{block.type}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            block.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {block.status}
                          </span>
                        </td>
                        <td className="py-3">{block.lastEdited}</td>
                        <td className="py-3 text-right">
                          <Button variant="outline" size="sm" className="mr-2">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Content Block Editor</CardTitle>
              <CardDescription className="text-gray-400">
                Edit content block text and properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blockTitle">Block Title</Label>
                    <Input id="blockTitle" className="bg-[#050b17] border-[#4a89dc]/20" defaultValue="Welcome Message" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="blockType">Content Type</Label>
                    <Select defaultValue="text">
                      <SelectTrigger id="blockType" className="bg-[#050b17] border-[#4a89dc]/20">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="text-image">Text with Image</SelectItem>
                        <SelectItem value="text-video">Text with Video</SelectItem>
                        <SelectItem value="cta">Call to Action</SelectItem>
                        <SelectItem value="custom">Custom HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="blockContent">Content</Label>
                  <textarea
                    id="blockContent"
                    className="w-full min-h-32 p-2 rounded-md bg-[#050b17] border border-[#4a89dc]/20 focus:border-[#4a89dc] focus:outline-none"
                    defaultValue="Welcome to JET AI - Your intelligent travel companion powered by advanced AI technology."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="blockPlacement">Placement</Label>
                  <div className="p-3 bg-[#050b17] rounded-md space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="placement-home" className="rounded bg-[#0a1328]" checked />
                      <Label htmlFor="placement-home" className="font-normal cursor-pointer">Home Page</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="placement-features" className="rounded bg-[#0a1328]" />
                      <Label htmlFor="placement-features" className="font-normal cursor-pointer">Features Page</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="placement-dashboard" className="rounded bg-[#0a1328]" />
                      <Label htmlFor="placement-dashboard" className="font-normal cursor-pointer">User Dashboard</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-4 gap-2">
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                <Save className="h-4 w-4 mr-2" /> Save Block
              </Button>
              <Button variant="outline">
                <Undo className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card className="bg-[#0a1328] border-[#4a89dc]/20">
            <CardHeader>
              <CardTitle>Theme Customization</CardTitle>
              <CardDescription className="text-gray-400">
                Customize platform appearance and branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Colors</h3>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input id="primaryColor" type="color" className="w-12 h-10 p-1 bg-[#050b17] border-[#4a89dc]/20" defaultValue="#4a89dc" />
                          <Input className="flex-1 bg-[#050b17] border-[#4a89dc]/20" defaultValue="#4a89dc" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <div className="flex gap-2">
                          <Input id="backgroundColor" type="color" className="w-12 h-10 p-1 bg-[#050b17] border-[#4a89dc]/20" defaultValue="#050b17" />
                          <Input className="flex-1 bg-[#050b17] border-[#4a89dc]/20" defaultValue="#050b17" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <Label htmlFor="textColor">Text Color</Label>
                        <div className="flex gap-2">
                          <Input id="textColor" type="color" className="w-12 h-10 p-1 bg-[#050b17] border-[#4a89dc]/20" defaultValue="#ffffff" />
                          <Input className="flex-1 bg-[#050b17] border-[#4a89dc]/20" defaultValue="#ffffff" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex gap-2">
                          <Input id="accentColor" type="color" className="w-12 h-10 p-1 bg-[#050b17] border-[#4a89dc]/20" defaultValue="#00bcd4" />
                          <Input className="flex-1 bg-[#050b17] border-[#4a89dc]/20" defaultValue="#00bcd4" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Typography</h3>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <Label htmlFor="headingFont">Heading Font</Label>
                        <Select defaultValue="inter">
                          <SelectTrigger id="headingFont" className="bg-[#050b17] border-[#4a89dc]/20">
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="poppins">Poppins</SelectItem>
                            <SelectItem value="opensans">Open Sans</SelectItem>
                            <SelectItem value="montserrat">Montserrat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <Label htmlFor="bodyFont">Body Font</Label>
                        <Select defaultValue="inter">
                          <SelectTrigger id="bodyFont" className="bg-[#050b17] border-[#4a89dc]/20">
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="poppins">Poppins</SelectItem>
                            <SelectItem value="opensans">Open Sans</SelectItem>
                            <SelectItem value="montserrat">Montserrat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 items-center">
                        <Label htmlFor="baseSize">Base Font Size</Label>
                        <Select defaultValue="16">
                          <SelectTrigger id="baseSize" className="bg-[#050b17] border-[#4a89dc]/20">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="14">14px</SelectItem>
                            <SelectItem value="16">16px</SelectItem>
                            <SelectItem value="18">18px</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Logo & Branding</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>Primary Logo</Label>
                      <div className="p-6 border border-dashed border-[#4a89dc]/50 rounded-md flex flex-col items-center justify-center bg-[#050b17] cursor-pointer">
                        <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-400">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG or SVG (max. 2MB)</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Favicon</Label>
                      <div className="p-6 border border-dashed border-[#4a89dc]/50 rounded-md flex flex-col items-center justify-center bg-[#050b17] cursor-pointer">
                        <Globe className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-400">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-500 mt-1">ICO, PNG (max. 1MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-[#4a89dc]/20 pt-4 gap-2">
              <Button className="bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                <Save className="h-4 w-4 mr-2" /> Save Appearance
              </Button>
              <Button variant="outline">
                <Undo className="h-4 w-4 mr-2" /> Reset to Defaults
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlatformOperations;