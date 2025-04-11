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
      <div className="block destination-card group rounded-xl overflow-hidden shadow-lg relative cursor-pointer hover:shadow-xl transition-shadow duration-300">
        <img 
          src={imageUrl} 
          alt={`${name}, ${country}`} 
          className="w-full h-64 object-cover transition duration-500 group-hover:scale-110" 
        />
        <div className="destination-overlay absolute inset-0 bg-dark/40 transition-opacity duration-300 group-hover:bg-dark/30"></div>
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="destination-details transform transition duration-300">
            <h3 className="font-display text-white text-xl font-bold text-shadow">{name}, {country}</h3>
            <div className="flex items-center mt-1 text-yellow-400">
              {ratingStars()}
              <span className="text-white text-sm ml-1">{rating.toFixed(1)}</span>
            </div>
            <p className="text-white/90 text-sm mt-2 opacity-0 group-hover:opacity-100 transition duration-300">
              {description}
            </p>
            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="inline-block bg-primary/80 hover:bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                Explore Details
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
