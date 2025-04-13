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
      <div className="block destination-card group rounded-2xl overflow-hidden shadow-lg relative cursor-pointer hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2">
        <img 
          src={imageUrl} 
          alt={`${name}, ${country}`} 
          className="w-full h-72 object-cover transition duration-500 group-hover:scale-110" 
        />
        <div className="destination-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center bg-yellow-500 text-white font-bold px-3 py-1 rounded-full text-sm">
            {rating.toFixed(1)} <span className="ml-1">★</span>
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="destination-details transform transition duration-300">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block bg-[#ff6b35]/90 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-2">
                  {country}
                </span>
                <h3 className="font-display text-white text-2xl font-extrabold leading-tight">{name}</h3>
              </div>
            </div>
            <p className="text-white/90 text-sm mt-2 transform transition duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
              {description}
            </p>
            <div className="mt-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
              <span className="inline-flex items-center gap-1 bg-white text-[#ff6b35] font-bold px-4 py-2 rounded-full text-sm hover:bg-[#ff6b35] hover:text-white transition-colors">
                <span>Explore Details</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
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
