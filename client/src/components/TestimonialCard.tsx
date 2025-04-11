interface TestimonialCardProps {
  id: string;
  name: string;
  avatarUrl: string;
  testimonial: string;
  rating: number;
}

export default function TestimonialCard({ name, avatarUrl, testimonial, rating }: TestimonialCardProps) {
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
    <div className="bg-light rounded-xl p-6 shadow-sm relative">
      <div className="absolute -top-5 left-6 text-4xl text-primary opacity-30">"</div>
      <p className="text-dark/70 mb-5 relative z-10">{testimonial}</p>
      
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-semibold text-dark">{name}</h4>
          <div className="flex text-yellow-400 mt-1">
            {ratingStars()}
          </div>
        </div>
      </div>
    </div>
  );
}
