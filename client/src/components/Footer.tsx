import React from 'react';
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full">
      {/* Newsletter Section */}
      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h4 className="text-white text-xl font-medium mb-4">Subscribe to Our Newsletter</h4>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 rounded-r-none sm:rounded-r-none"
              />
              <Button className="bg-white text-blue-600 hover:bg-blue-50 rounded-l-none sm:rounded-l-none">
                Subscribe
              </Button>
            </div>
            <p className="text-blue-100 text-sm mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="bg-white py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-1">
              <Link href="/">
                <div className="flex items-center">
                  <img 
                    src={theme.logo || "/assets/logo.svg"} 
                    alt={`${theme.name} Logo`} 
                    className="h-10 w-auto"
                  />
                  <span className="ml-2 text-2xl font-bold text-blue-600">
                    {theme.subdomain === 'app' ? 'AI' : ''}
                  </span>
                </div>
              </Link>
              <p className="mt-4 text-gray-600">
                Your AI-powered travel assistant for personalized trip planning, recommendations, and a seamless travel experience.
              </p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
                </li>
                <li>
                  <Link href="/destinations" className="text-gray-600 hover:text-blue-600">Destinations</Link>
                </li>
                <li>
                  <Link href="/itineraries" className="text-gray-600 hover:text-blue-600">Itineraries</Link>
                </li>
                <li>
                  <Link href="/membership" className="text-gray-600 hover:text-blue-600">Membership</Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link>
                </li>
              </ul>
            </div>
            
            {/* Partner Program */}
            <div>
              <h5 className="text-lg font-semibold mb-4">Partner Program</h5>
              <ul className="space-y-2">
                <li>
                  <Link href="/partner/signup" className="text-gray-600 hover:text-blue-600">Become a Partner</Link>
                </li>
                <li>
                  <Link href="/partner/dashboard" className="text-gray-600 hover:text-blue-600">Partner Dashboard</Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">Affiliate Program</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">White Label Solutions</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600">API Documentation</a>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact Us</h5>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-600">123 Travel Street, San Francisco, CA 94103</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-2" />
                  <a href="tel:+1234567890" className="text-gray-600 hover:text-blue-600">+1 (234) 567-890</a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-2" />
                  <a href="mailto:info@jetai.app" className="text-gray-600 hover:text-blue-600">info@jetai.app</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-gray-50 py-4 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm">
              © {currentYear} {theme.name}. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-4 text-sm">
              <a href="#" className="text-gray-500 hover:text-blue-600">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-blue-600">Cookie Policy</a>
              <a href="#" className="text-gray-500 hover:text-blue-600">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}