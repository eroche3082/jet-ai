interface ExperienceCardProps {
  id: string;
  title: string;
  location: string;
  country: string;
  duration: string;
  description: string;
  imageUrl: string;
  price: number;
  category: 'Cultural' | 'Adventure' | 'Luxury' | 'Nature';
  rating: number;
  reviewCount: number;
}

export default function ExperienceCard({ 
  title, 
  location, 
  country, 
  duration, 
  description, 
  imageUrl, 
  price, 
  category, 
  rating, 
  reviewCount 
}: ExperienceCardProps) {
  // Determine category background color
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Cultural':
        return 'bg-primary/90';
      case 'Adventure':
        return 'bg-accent/90';
      case 'Luxury':
        return 'bg-secondary/90';
      case 'Nature':
        return 'bg-accent/90';
      default:
        return 'bg-primary/90';
    }
  };
  
  // Generate rating stars
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
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="relative aspect-video">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <span className={`${getCategoryColor(category)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
            {category}
          </span>
          <h3 className="font-display text-white text-xl font-bold mt-2">{title}</h3>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center text-sm text-dark/70 mb-3">
          <i className="fas fa-map-marker-alt text-primary mr-2"></i>
          <span>{location}, {country}</span>
          <span className="mx-2">•</span>
          <i className="fas fa-clock text-primary mr-2"></i>
          <span>{duration}</span>
        </div>
        
        <p className="text-dark/70 text-sm mb-4">{description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-accent font-semibold text-dark">
              From <span className="text-primary">${price}</span> <span className="text-xs">/person</span>
            </p>
            <div className="flex items-center mt-1">
              <div className="flex text-yellow-400">
                {ratingStars()}
              </div>
              <span className="text-dark/70 text-xs ml-1">({reviewCount} reviews)</span>
            </div>
          </div>
          
          <a href="#" className="flex items-center justify-center w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-full text-primary transition">
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
