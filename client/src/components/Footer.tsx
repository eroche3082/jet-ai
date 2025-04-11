import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-dark text-white/80 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-primary text-3xl mr-2"><i className="fas fa-paper-plane"></i></span>
              <span className="font-display font-bold text-2xl text-white">Jet<span className="text-primary">AI</span></span>
            </div>
            
            <p className="mb-6">AI-powered travel planning for unforgettable journeys tailored to your preferences.</p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-primary transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-primary transition">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link href="/destinations" className="hover:text-primary transition">Destinations</Link></li>
              <li><Link href="/itineraries" className="hover:text-primary transition">Experiences</Link></li>
              <li><Link href="/checkout" className="hover:text-primary transition">Accommodations</Link></li>
              <li><Link href="/about" className="hover:text-primary transition">About Us</Link></li>
              <li><Link href="/about" className="hover:text-primary transition">Contact</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary transition">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition">Safety Information</a></li>
              <li><a href="#" className="hover:text-primary transition">Cancellation Options</a></li>
              <li><a href="#" className="hover:text-primary transition">Travel Insurance</a></li>
              <li><a href="#" className="hover:text-primary transition">FAQ</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt text-primary mt-1 mr-3"></i>
                <span>123 Travel Street, Global City, Earth</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt text-primary mr-3"></i>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope text-primary mr-3"></i>
                <span>hello@jetai.travel</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} JetAI. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm hover:text-primary transition">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-primary transition">Terms of Service</a>
              <a href="#" className="text-sm hover:text-primary transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
