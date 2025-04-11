interface AccommodationCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  pricePerNight: number;
  rating: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export default function AccommodationCard({ 
  id, 
  name, 
  description, 
  imageUrl, 
  pricePerNight, 
  rating, 
  isFavorite = false,
  onToggleFavorite
}: AccommodationCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg group">
      <div className="relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-48 object-cover transition duration-500 group-hover:scale-110" 
        />
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 bg-white rounded-full p-2 z-10"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-pink-400`}></i>
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-bold text-dark">{name}</h3>
          <div className="flex items-center text-yellow-400">
            <i className="fas fa-star text-xs"></i>
            <span className="text-dark text-sm ml-1">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-dark/70 text-sm mb-3">{description}</p>
        
        <div className="flex items-center justify-between">
          <p className="font-accent font-medium">
            <span className="text-primary text-lg">${pricePerNight}</span>
            <span className="text-dark/70 text-sm">/night</span>
          </p>
          <a href="#" className="text-primary hover:text-primary/80 text-sm font-medium">View Details</a>
        </div>
      </div>
    </div>
  );
}
