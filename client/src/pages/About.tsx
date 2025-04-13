import { Link } from 'wouter';
import Newsletter from '@/components/Newsletter';
import TestimonialCard from '@/components/TestimonialCard';

export default function About() {
  // Team members data
  const teamMembers = [
    {
      id: '1',
      name: 'David Chen',
      role: 'Founder & CEO',
      bio: 'Travel enthusiast with 15+ years in the travel industry. David founded JetAI with a mission to make travel planning smarter and more personalized.',
      imageUrl: 'https://randomuser.me/api/portraits/men/34.jpg'
    },
    {
      id: '2',
      name: 'Mia Rodriguez',
      role: 'Chief AI Officer',
      bio: 'With a PhD in machine learning, Mia leads our AI development team, focusing on creating intelligent systems that understand unique travel preferences.',
      imageUrl: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    {
      id: '3',
      name: 'James Wilson',
      role: 'Head of Partnerships',
      bio: 'James builds relationships with hotels, tour operators, and experience providers worldwide to offer our users exceptional travel options.',
      imageUrl: 'https://randomuser.me/api/portraits/men/54.jpg'
    },
    {
      id: '4',
      name: 'Sophia Kim',
      role: 'UX Director',
      bio: 'Sophia ensures that every interaction with JetAI feels intuitive and delightful, creating seamless experiences for travelers.',
      imageUrl: 'https://randomuser.me/api/portraits/women/45.jpg'
    }
  ];

  // Testimonials
  const testimonials = [
    {
      id: '1',
      name: 'Sarah J.',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      testimonial: 'JetAI recommended a perfect itinerary for our family trip to Japan. The AI suggested activities that kept both our teenagers and us parents happy, which is no small feat! The restaurant recommendations were spot on.',
      rating: 5.0
    },
    {
      id: '2',
      name: 'Miguel R.',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      testimonial: 'As a solo traveler, I was worried about planning my Europe backpacking trip. JetAI not only created a budget-friendly route but also connected me with group experiences where I met amazing people. Absolutely life-changing!',
      rating: 4.5
    },
    {
      id: '3',
      name: 'Emma T.',
      avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
      testimonial: 'My husband wanted adventure, I wanted relaxation. Somehow, JetAI managed to create a Bali itinerary that perfectly balanced both! The personalized recommendations based on our conversation with the AI were incredibly accurate.',
      rating: 5.0
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 bg-[#050b17] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/img/jet_hero.jpg" 
            alt="Luxury Private Jet" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050b17] via-[#050b17]/90 to-[#050b17]/80"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-[#4a89dc] bg-white/5 text-white text-sm font-serif mb-3">
              INTELLIGENT TRAVEL PLANNING
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Journey Beyond <span className="text-[#4a89dc]">Boundaries</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 font-serif">
              JET AI harmonizes sophisticated artificial intelligence with 
              refined travel expertise to curate your ideal journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/destinations" 
                className="inline-flex items-center bg-[#4a89dc] hover:bg-[#3a79cc] text-white font-serif font-medium px-6 py-3 rounded-md transition shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                Explore Destinations
              </Link>
              <Link 
                href="/chat" 
                className="inline-flex items-center bg-transparent border border-white/30 hover:border-white/50 text-white font-serif font-medium px-6 py-3 rounded-md transition"
              >
                Start Planning
              </Link>
            </div>
            
            <div className="mt-16 grid grid-cols-2 gap-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#4a89dc]">
                    <path d="M12 2v20M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-serif">AI-Powered Precision</h3>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-[#4a89dc]">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4M12 8h.01"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-serif">Bespoke Experiences</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="JetAI Team Collaboration" 
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full bg-primary/10 rounded-lg"></div>
            </div>
            
            <div>
              <div className="inline-flex items-center px-4 py-1 border-l-2 border-marni-accent bg-marni-dark/5 text-marni-dark text-sm font-serif mb-4">
                OUR STORY
              </div>
              <h2 className="font-display text-3xl font-bold text-marni-dark mb-6">From Concept to Reality</h2>
              <p className="text-marni-dark/70 mb-4 font-serif">
                JET AI was born from a simple frustration: despite the wealth of travel information available 
                online, planning the perfect trip remained overwhelming and time-consuming.
              </p>
              <p className="text-marni-dark/70 mb-4 font-serif">
                In 2022, our founder David Chen assembled a team of AI experts, travel industry veterans, and 
                passionate globetrotters to create a smarter way to plan travel experiences. We built an AI 
                platform that learns from millions of travel patterns and preferences to offer truly personalized 
                recommendations.
              </p>
              <p className="text-marni-dark/70 mb-4 font-serif">
                Today, JET AI helps thousands of travelers discover destinations that match their unique interests, 
                create custom itineraries that optimize their time, and book exceptional experiences they might 
                never have found on their own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-gradient-to-br from-marni-dark/5 to-marni-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-marni-accent bg-marni-dark/5 text-marni-dark text-sm font-serif mb-4">
              OUR MISSION
            </div>
            <h2 className="font-display text-3xl font-bold text-marni-dark mb-6">Elevating Travel Experiences</h2>
            <p className="text-xl text-marni-dark/70 mb-8 font-serif">
              We believe travel should be transformative, not transactional. Our mission is to make exceptional 
              travel experiences accessible to everyone through intelligent technology that understands your preferences
              better than you do yourself.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-marni-dark/5">
                <div className="w-14 h-14 rounded-full bg-marni-accent/10 flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-marni-accent">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="font-display text-lg font-semibold text-marni-dark mb-3">Personalization</h3>
                <p className="text-marni-dark/70 font-serif">
                  We create travel plans tailored to your preferences, not generic tourist routes.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-marni-dark/5">
                <div className="w-14 h-14 rounded-full bg-marni-accent/10 flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-marni-accent">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h3 className="font-display text-lg font-semibold text-marni-dark mb-3">Sustainability</h3>
                <p className="text-marni-dark/70 font-serif">
                  We promote responsible tourism that respects local communities and the environment.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-marni-dark/5">
                <div className="w-14 h-14 rounded-full bg-marni-accent/10 flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-marni-accent">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <polyline points="17 11 19 13 23 9"></polyline>
                  </svg>
                </div>
                <h3 className="font-display text-lg font-semibold text-marni-dark mb-3">Accessibility</h3>
                <p className="text-marni-dark/70 font-serif">
                  We make travel planning efficient and stress-free for everyone, regardless of expertise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-marni-accent bg-marni-dark/5 text-marni-dark text-sm font-serif mb-4">
              OUR TEAM
            </div>
            <h2 className="font-display text-3xl font-bold text-marni-dark mb-4">Meet Our Experts</h2>
            <p className="text-lg text-marni-dark/70 max-w-2xl mx-auto font-serif">
              The passionate people behind JET AI who are dedicated to transforming how you experience travel.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-marni-dark/5">
                <img 
                  src={member.imageUrl} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-display font-bold text-marni-dark text-xl mb-1">{member.name}</h3>
                  <p className="text-marni-accent font-serif font-medium mb-3">{member.role}</p>
                  <p className="text-marni-dark/70 text-sm font-serif">{member.bio}</p>
                  <div className="flex mt-4 space-x-3">
                    <a href="#" className="text-marni-dark/50 hover:text-marni-accent transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                      </svg>
                    </a>
                    <a href="#" className="text-marni-dark/50 hover:text-marni-accent transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-marni-dark/5 to-marni-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-marni-accent bg-marni-dark/5 text-marni-dark text-sm font-serif mb-4">
              TESTIMONIALS
            </div>
            <h2 className="font-display text-3xl font-bold text-marni-dark mb-4">What Our Clients Say</h2>
            <p className="text-lg text-marni-dark/70 max-w-2xl mx-auto font-serif">
              Hear from travelers who have experienced the JET AI difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard 
                key={testimonial.id}
                id={testimonial.id}
                name={testimonial.name}
                avatarUrl={testimonial.avatarUrl}
                testimonial={testimonial.testimonial}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="inline-flex items-center px-4 py-1 border-l-2 border-marni-accent bg-marni-dark/5 text-marni-dark text-sm font-serif mb-4">
                CONTACT US
              </div>
              <h2 className="font-display text-3xl font-bold text-marni-dark mb-6">Get in Touch</h2>
              <p className="text-marni-dark/70 mb-8 font-serif">
                Have questions about JET AI or need assistance with your travel plans? Our team is here to help!
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-marni-accent/10 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-marni-accent">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-marni-dark mb-1">Location</h3>
                    <p className="text-marni-dark/70 font-serif">123 Travel Street, Global City, Earth</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-marni-accent/10 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-marni-accent">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-marni-dark mb-1">Email</h3>
                    <p className="text-marni-dark/70 font-serif">hello@jetai.travel</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-marni-accent/10 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-marni-accent">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-marni-dark mb-1">Phone</h3>
                    <p className="text-marni-dark/70 font-serif">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-marni-accent/10 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-marni-accent">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-marni-dark mb-1">Business Hours</h3>
                    <p className="text-marni-dark/70 font-serif">Monday - Friday: 9am - 6pm EST</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-marni-dark/10">
              <h3 className="font-display text-xl font-bold text-marni-dark mb-6">Send Us a Message</h3>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-marni-dark/70 mb-1 font-serif">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 rounded border border-marni-dark/20 focus:outline-none focus:border-marni-accent focus:ring-1 focus:ring-marni-accent/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-marni-dark/70 mb-1 font-serif">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 rounded border border-marni-dark/20 focus:outline-none focus:border-marni-accent focus:ring-1 focus:ring-marni-accent/20"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-marni-dark/70 mb-1 font-serif">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-2 rounded border border-marni-dark/20 focus:outline-none focus:border-marni-accent focus:ring-1 focus:ring-marni-accent/20"
                    placeholder="Subject"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-marni-dark/70 mb-1 font-serif">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full px-4 py-2 rounded border border-marni-dark/20 focus:outline-none focus:border-marni-accent focus:ring-1 focus:ring-marni-accent/20"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-marni-dark hover:bg-marni-accent text-white font-serif font-medium py-3 rounded shadow-sm hover:shadow transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}
