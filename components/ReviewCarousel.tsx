import React, { useState } from 'react';
import { Star, Play, X } from 'lucide-react';
import { useShop } from '../store/ShopContext';
import { REVIEWS } from '../services/mockData';
import { Review } from '../types';

// Adjusted sizes: Smaller on mobile (130px), Premium on Desktop (220px)
const VideoReviewCard: React.FC<{ review: Review; onClick: (review: Review) => void }> = ({ review, onClick }) => (
  <div 
    onClick={() => onClick(review)}
    className="relative min-w-[130px] md:min-w-[220px] aspect-[9/16] md:aspect-video rounded-xl overflow-hidden cursor-pointer group mx-2 border border-stone-800 hover:border-orange-500 transition-all shadow-md hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] bg-stone-900"
  >
    {/* Thumbnail */}
    <img 
      src={review.thumbnail || 'https://via.placeholder.com/240x135'} 
      alt={`Review by ${review.author}`} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
    />
    
    {/* Play Icon - Centered */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-600/80 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(249,115,22,0.5)]">
        <Play className="w-3 h-3 md:w-4 md:h-4 text-white fill-white ml-0.5" />
      </div>
    </div>

    {/* Content - Minimal Overlay */}
    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
      <div className="flex flex-col gap-0.5">
           <span className="text-[10px] md:text-xs font-bold text-white shadow-black drop-shadow-md truncate">{review.author}</span>
           <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-2 h-2 md:w-2.5 md:h-2.5 ${i < review.rating ? 'fill-current' : 'text-stone-600'}`} />
            ))}
          </div>
      </div>
    </div>
  </div>
);

const VideoModal: React.FC<{ review: Review | null; onClose: () => void }> = ({ review, onClose }) => {
  if (!review) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="relative w-full max-w-3xl">
         <button 
           onClick={onClose} 
           className="absolute -top-12 right-0 md:-right-12 text-white p-2 hover:bg-white/20 rounded-full transition"
         >
           <X className="w-8 h-8" />
         </button>
         
         <div className="bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.3)] border border-stone-800 aspect-video">
            <video 
              src={review.videoUrl} 
              className="w-full h-full object-contain bg-black"
              autoPlay 
              controls
              playsInline
              onPlayCapture={(e) => e.stopPropagation()}
              onPauseCapture={(e) => e.stopPropagation()}
            />
         </div>
         
         <div className="mt-4 flex items-center gap-4 text-white">
            <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full border border-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
            <div>
               <h3 className="font-bold text-base">{review.author}</h3>
               <div className="flex text-yellow-400 text-xs items-center gap-1">
                 <span>{review.rating}.0</span>
                 <Star className="w-3 h-3 fill-current" />
               </div>
            </div>
            <p className="ml-auto text-xs text-stone-500 italic">Verified Buyer</p>
         </div>
         <div className="mt-2 text-stone-300 text-sm leading-relaxed">
            "{review.text}"
         </div>
      </div>
    </div>
  );
};

const ReviewCarousel = () => {
  const { isVideoPlaying } = useShop();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Duplicate reviews to create seamless loop
  const extendedReviews = [...REVIEWS, ...REVIEWS, ...REVIEWS, ...REVIEWS];

  return (
    <>
      <div 
        className="py-12 relative group overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 3D Depth Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Base Dark */}
            <div className="absolute inset-0 bg-[#050404]"></div>
            
            {/* Perspective Grid */}
            <div className="absolute inset-0 opacity-20" 
                 style={{
                     backgroundImage: `linear-gradient(rgba(249, 115, 22, 0.4) 1px, transparent 1px), 
                                     linear-gradient(90deg, rgba(249, 115, 22, 0.4) 1px, transparent 1px)`,
                     backgroundSize: '40px 40px',
                     transform: 'perspective(500px) rotateX(60deg) translateY(-50px) scale(2.5)',
                     transformOrigin: 'top center',
                     maskImage: 'linear-gradient(to bottom, transparent, black 30%, transparent)'
                 }}
            ></div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-purple-600/20 rounded-full blur-[50px] animate-pulse -translate-y-1/2"></div>
            <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-orange-600/20 rounded-full blur-[50px] animate-pulse delay-1000 -translate-y-1/2"></div>
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-stone-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-stone-950 to-transparent z-10 pointer-events-none" />
        
        <div className="relative z-10 flex justify-center">
            <div 
              className={`animate-marquee-reverse flex items-center ${isVideoPlaying || isHovered ? 'paused' : ''}`}
            >
              {extendedReviews.map((review, index) => (
                <VideoReviewCard 
                  key={`${review.id}-${index}`} 
                  review={review} 
                  onClick={setSelectedReview}
                />
              ))}
            </div>
        </div>
      </div>

      <VideoModal 
        review={selectedReview} 
        onClose={() => setSelectedReview(null)} 
      />
    </>
  );
};

export default ReviewCarousel;