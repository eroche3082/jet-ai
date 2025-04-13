import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  Filter, 
  Globe, 
  Heart, 
  MessageSquare, 
  Search, 
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';

// Blog post type definition
type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  imageUrl: string;
  readTime: string;
  likes: number;
  comments: number;
};

// Sample blog posts data
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Hidden Gems of Portugal: Beyond the Tourist Trails',
    excerpt: 'Discover the enchanting villages, secluded beaches, and authentic cultural experiences that most travelers miss when visiting Portugal.',
    author: 'Sophia Reynolds',
    date: 'April 10, 2025',
    category: 'Destinations',
    tags: ['Europe', 'Off the beaten path', 'Cultural'],
    imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    readTime: '7 min read',
    likes: 128,
    comments: 32
  },
  {
    id: '2',
    title: 'A Culinary Journey Through Thailand\'s Street Food',
    excerpt: 'From aromatic curries to delicate mango with sticky rice, a journey through Thailand\'s vibrant street food culture reveals the heart of this Southeast Asian gem.',
    author: 'Marcus Chen',
    date: 'April 5, 2025',
    category: 'Food',
    tags: ['Asia', 'Culinary', 'Street Food'],
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    readTime: '5 min read',
    likes: 210,
    comments: 45
  },
  {
    id: '3',
    title: 'The Art of Solo Travel: Embracing Solitude',
    excerpt: 'Insightful reflections on planning, personal safety, and creating meaningful connections while traveling alone in today\'s interconnected world.',
    author: 'Eliza Wong',
    date: 'March 29, 2025',
    category: 'Travel Philosophy',
    tags: ['Solo Travel', 'Safety', 'Personal Growth'],
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    readTime: '9 min read',
    likes: 156,
    comments: 28
  },
  {
    id: '4',
    title: 'Sustainable Travel: Reducing Your Carbon Footprint',
    excerpt: 'Practical tips and strategies for environmentally conscious travelers who want to see the world while preserving it for future generations.',
    author: 'Noah Richards',
    date: 'March 22, 2025',
    category: 'Sustainable Travel',
    tags: ['Eco-friendly', 'Responsible Tourism', 'Environment'],
    imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    readTime: '6 min read',
    likes: 182,
    comments: 41
  },
  {
    id: '5',
    title: 'Photography Tips for Travel: Capturing Memorable Moments',
    excerpt: 'Professional advice on equipment, composition, lighting, and storytelling to help you document your journeys with stunning photographs.',
    author: 'Isabella Martinez',
    date: 'March 15, 2025',
    category: 'Photography',
    tags: ['Photography', 'Creative', 'Tips'],
    imageUrl: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    readTime: '8 min read',
    likes: 231,
    comments: 53
  },
  {
    id: '6',
    title: 'Navigating Japan\'s Train System: A Comprehensive Guide',
    excerpt: 'Everything you need to know about efficiently using Japan\'s complex but incredibly punctual train network, from bullet trains to local routes.',
    author: 'Hiroshi Tanaka',
    date: 'March 8, 2025',
    category: 'Travel Tips',
    tags: ['Asia', 'Transportation', 'Japan'],
    imageUrl: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    readTime: '10 min read',
    likes: 194,
    comments: 47
  },
  {
    id: '7',
    title: 'A Week in Morocco: Desert Adventures and Ancient Medinas',
    excerpt: 'Follow this detailed itinerary through Marrakech, Fes, and the Sahara Desert for an unforgettable introduction to Morocco\'s diverse landscapes and cultures.',
    author: 'Ahmed Hassan',
    date: 'March 1, 2025',
    category: 'Itineraries',
    tags: ['Africa', 'Desert', 'Cultural'],
    imageUrl: 'https://images.unsplash.com/photo-1531501410720-c8d437636169?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    readTime: '12 min read',
    likes: 167,
    comments: 38
  },
  {
    id: '8',
    title: 'Budget Travel in Europe: Experiencing Luxury for Less',
    excerpt: 'Clever strategies for enjoying European capitals, fine dining, and cultural attractions without depleting your savings account.',
    author: 'Emma Whitfield',
    date: 'February 22, 2025',
    category: 'Budget Travel',
    tags: ['Europe', 'Budget', 'Tips'],
    imageUrl: 'https://images.unsplash.com/photo-1473951574080-01fe45ec8643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2704&q=80',
    readTime: '7 min read',
    likes: 203,
    comments: 61
  },
];

// Categories list
const categories = [
  'All Categories',
  'Destinations',
  'Food',
  'Travel Philosophy',
  'Sustainable Travel',
  'Photography',
  'Travel Tips',
  'Itineraries',
  'Budget Travel'
];

// Popular tags
const popularTags = [
  'Europe',
  'Asia',
  'Cultural',
  'Off the beaten path',
  'Budget',
  'Luxury',
  'Food',
  'Adventure',
  'Photography',
  'Sustainable',
  'Solo Travel'
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter posts based on active category and search term
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'All Categories' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && (searchTerm === '' || matchesSearch);
  });
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center h-[400px]"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-[#050b17]/70"></div>
        <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-white/5 text-white text-sm font-serif mb-6">
              <BookOpen className="h-3.5 w-3.5 mr-1.5 text-[#4a89dc]" /> 
              JET AI TRAVEL JOURNAL
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-6 leading-tight">
              Stories That Inspire <span className="text-[#4a89dc]">Wanderlust</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-xl leading-relaxed font-serif">
              Curated narratives, expert insights, and captivating photography from our global community of passionate travelers.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <Input
                type="text"
                placeholder="Search for topics, destinations, or stories..."
                className="bg-white/10 backdrop-blur-sm text-white pl-10 pr-4 py-3 border-white/20 focus:border-[#4a89dc] focus:ring-[#4a89dc]/20 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            </div>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Categories Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-sm font-serif rounded-full transition-colors ${
                    activeCategory === category
                      ? 'bg-[#4a89dc] text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded">
                  <Link href={`/blog/${post.id}`}>
                    <div className="relative h-60 overflow-hidden">
                      <img 
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-4 left-0 bg-[#050b17]/80 text-white text-xs font-serif uppercase px-3 py-1">
                        {post.category}
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm mb-3 font-serif">
                      <Calendar className="h-4 w-4 mr-2 text-[#4a89dc]" />
                      {post.date}
                      <span className="mx-2">•</span>
                      {post.readTime}
                    </div>
                    
                    <Link href={`/blog/${post.id}`}>
                      <h2 className="text-xl font-display mb-3 text-[#050b17] hover:text-[#4a89dc] transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    
                    <p className="text-gray-600 mb-4 font-serif">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-[#4a89dc]/5 text-[#4a89dc] border-[#4a89dc]/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="text-sm font-serif text-gray-700">{post.author}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-gray-500 text-sm">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 text-[#4a89dc]" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1 text-[#4a89dc]" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {/* Load More Button */}
            <div className="mt-10 text-center">
              <Button variant="outline" className="px-8 py-2 border border-[#4a89dc]/30 text-[#4a89dc] hover:bg-[#4a89dc] hover:text-white transition-colors">
                Load More Articles
              </Button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* About the Blog */}
            <div className="bg-[#050b17] text-white p-6 rounded-lg mb-8">
              <h3 className="text-xl font-display mb-4">About Our Travel Journal</h3>
              <p className="font-serif mb-4">
                JET AI Travel Journal features insightful articles, practical guides, and inspiring stories to fuel your wanderlust and enhance your travel experiences.
              </p>
              <p className="font-serif">
                Our content is crafted by experienced travelers and enhanced by AI to provide the most relevant and accurate information.
              </p>
            </div>
            
            {/* Featured Post */}
            <div className="mb-8">
              <h3 className="text-lg font-display mb-4 border-b border-gray-200 pb-2">Editor's Pick</h3>
              <Link href="/blog/4">
                <div className="group">
                  <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                      alt="Sustainable Travel"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050b17]/70 via-[#050b17]/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-[#4a89dc] text-white border-none">Featured</Badge>
                    </div>
                  </div>
                  <h4 className="text-lg font-display mb-2 group-hover:text-[#4a89dc] transition-colors">
                    Sustainable Travel: Reducing Your Carbon Footprint
                  </h4>
                  <p className="text-gray-600 text-sm font-serif mb-2">
                    Practical tips and strategies for environmentally conscious travelers.
                  </p>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    March 22, 2025
                    <span className="mx-1">•</span>
                    <span>6 min read</span>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Popular Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-display mb-4 border-b border-gray-200 pb-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Link key={tag} href={`/blog?tag=${tag}`}>
                    <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Subscribe */}
            <div className="bg-[#4a89dc]/10 p-6 rounded-lg">
              <h3 className="text-lg font-display mb-4">Subscribe to Our Newsletter</h3>
              <p className="text-gray-600 text-sm font-serif mb-4">
                Get our latest travel stories, tips, and exclusive offers delivered to your inbox.
              </p>
              <div className="space-y-3">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full border-gray-300"
                />
                <Button className="w-full bg-[#4a89dc] hover:bg-[#3a79cc] text-white">
                  Subscribe
                </Button>
                <p className="text-gray-500 text-xs font-serif">
                  By subscribing, you agree to our privacy policy and consent to receive updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Assistant Button (Fixed position) - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-50 group">
        <div className="absolute inset-0 rounded-full bg-[#4a89dc] animate-ping opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
        <button 
          onClick={() => {
            // This will eventually open the chat dialog component
            console.log('Opening AI chat dialog');
            // Future implementation: setShowChatDialog(true);
            window.location.href = '/chat';
          }}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-[#4a89dc] hover:bg-[#050b17] text-white shadow-lg border border-white/10 transition-all duration-300"
        >
          <div className="absolute inset-0 rounded-full bg-[#4a89dc] animate-pulse opacity-30"></div>
          <MessageSquare className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
}