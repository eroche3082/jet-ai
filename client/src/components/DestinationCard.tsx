import { Link } from 'wouter';

interface DestinationCardProps {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  rating: number;
}

export default function DestinationCard({ id, name, country, description, imageUrl, rating }: DestinationCardProps) {
  const ratingStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star text-xs"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-xs"></i>);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-xs"></i>);
    }
    
    return stars;
  };
  
  // Create a URL-friendly version of the destination name
  const destinationSlug = `${name.toLowerCase().replace(/\s+/g, '-')}-${country.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <Link href={`/destinations/${id}/${destinationSlug}`}>
      <div className="block destination-card group rounded-2xl overflow-hidden shadow-md relative cursor-pointer hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 bg-white">
        {/* Image container with perspective effect */}
        <div className="relative overflow-hidden h-72">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#ff6b35]/20 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
          <img 
            src={imageUrl} 
            alt={`${name}, ${country}`} 
            className="w-full h-72 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
          />
          <div className="destination-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 z-20"></div>
          
          {/* Floating travel icon badge */}
          <div className="absolute top-3 left-3 transform -rotate-3 z-30">
            <div className="bg-white/95 border border-yellow-200 shadow-lg rounded-lg px-2 py-1 rotate-3 group-hover:rotate-0 transition-all duration-300">
              <div className="flex items-center gap-1 text-sm font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#ff6b35]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 16a.5.5 0 01-.5-.5v-6a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-2zm6 0a.5.5 0 01-.5-.5v-10a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v10a.5.5 0 01-.5.5h-2z"/>
                  <path d="M.5 2a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v14a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5V2zm11.5 0a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v14a.5.5 0 01-.5.5h-3a.5.5 0 01-.5-.5V2z"/>
                </svg>
                <span className="text-gray-800">ADVENTURE</span>
              </div>
            </div>
          </div>
          
          {/* Rating badge */}
          <div className="absolute top-4 right-4 z-30 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <span className="inline-flex items-center bg-yellow-500 text-white font-bold px-3 py-1 rounded-full text-sm shadow-md">
              {rating.toFixed(1)} <span className="ml-1">★</span>
            </span>
          </div>
        </div>
        
        {/* Content section */}
        <div className="absolute inset-x-0 bottom-0 p-6 z-30">
          <div className="destination-details transform transition duration-300">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block bg-[#ff6b35]/90 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-2 shadow-md transform group-hover:-rotate-1 transition-all">
                  {country}
                </span>
                <h3 className="font-display text-white text-2xl font-extrabold leading-tight group-hover:text-yellow-50 transition-colors duration-300">{name}</h3>
              </div>
            </div>
            <p className="text-white/90 text-sm mt-2 transform transition-all duration-500 max-h-0 group-hover:max-h-24 overflow-hidden opacity-0 group-hover:opacity-100">
              {description}
            </p>
            <div className="mt-3 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <span className="inline-flex items-center gap-2 bg-white text-[#ff6b35] font-bold px-4 py-2 rounded-full text-sm hover:bg-[#ff6b35] hover:text-white transition-colors shadow-md">
                <span>Explore Adventures</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
