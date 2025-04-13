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
      <section className="relative py-20 bg-marni-dark/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-1 border-l-2 border-marni-accent bg-marni-dark/5 text-marni-dark text-sm font-serif mb-3">
              <span className="text-marni-accent">ABOUT</span> JET AI
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-marni-dark mb-6">
              Redefining Travel Planning with AI
            </h1>
            <p className="text-lg text-marni-dark/70 mb-8 font-serif">
              JET AI combines cutting-edge artificial intelligence with deep travel expertise to create
              personalized experiences that match your unique preferences, budget, and travel style.
            </p>
            <Link 
              href="/destinations" 
              className="inline-block bg-marni-accent hover:bg-marni-accent/90 text-white font-serif font-medium px-8 py-3 rounded transition shadow-md"
            >
              Start Exploring
            </Link>
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
              <div key={member.id} className="bg-light rounded-xl overflow-hidden shadow-sm">
                <img 
                  src={member.imageUrl} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-display font-bold text-dark text-xl mb-1">{member.name}</h3>
                  <p className="text-primary font-accent font-medium mb-3">{member.role}</p>
                  <p className="text-dark/70 text-sm">{member.bio}</p>
                  <div className="flex mt-4 space-x-3">
                    <a href="#" className="text-dark/50 hover:text-primary transition">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" className="text-dark/50 hover:text-primary transition">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-dark mb-4">What Our Users Say</h2>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto">
              Hear from travelers who have experienced the JetAI difference.
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
              <h2 className="font-display text-3xl font-bold text-dark mb-6">Get in Touch</h2>
              <p className="text-dark/70 mb-8">
                Have questions about JetAI or need assistance with your travel plans? Our team is here to help!
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <i className="fas fa-map-marker-alt text-primary"></i>
                  </div>
                  <div>
                    <h3 className="font-accent font-semibold text-dark mb-1">Location</h3>
                    <p className="text-dark/70">123 Travel Street, Global City, Earth</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <i className="fas fa-envelope text-primary"></i>
                  </div>
                  <div>
                    <h3 className="font-accent font-semibold text-dark mb-1">Email</h3>
                    <p className="text-dark/70">hello@jetai.travel</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <i className="fas fa-phone-alt text-primary"></i>
                  </div>
                  <div>
                    <h3 className="font-accent font-semibold text-dark mb-1">Phone</h3>
                    <p className="text-dark/70">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <i className="fas fa-clock text-primary"></i>
                  </div>
                  <div>
                    <h3 className="font-accent font-semibold text-dark mb-1">Business Hours</h3>
                    <p className="text-dark/70">Monday - Friday: 9am - 6pm EST</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-light p-8 rounded-xl shadow-sm">
              <h3 className="font-display text-xl font-bold text-dark mb-6">Send Us a Message</h3>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-dark/70 mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-dark/70 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-dark/70 mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                    placeholder="Subject"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-dark/70 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-accent font-semibold px-6 py-3 rounded-full transition"
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
