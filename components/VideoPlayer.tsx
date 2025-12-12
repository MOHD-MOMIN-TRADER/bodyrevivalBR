import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useShop } from '../store/ShopContext';

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const { setVideoPlaying } = useShop();

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  useEffect(() => {
    setVideoPlaying(playing);
  }, [playing, setVideoPlaying]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10 group">
      <video
        ref={videoRef}
        className="w-full aspect-video object-cover bg-stone-900"
        poster= '/poster.jpg'
        loop
        playsInline
        onClick={togglePlay}
        // Using a sample reliable video URL
        src="video1.mp4" 
      />
      
      {/* Overlay Controls */}
      <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        <button 
          onClick={togglePlay}
          className="w-14 h-14 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition border border-white/50 text-white"
        >
          {playing ? <Pause className="w-6 h-6 md:w-8 md:h-8 fill-current" /> : <Play className="w-6 h-6 md:w-8 md:h-8 fill-current ml-1" />}
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex gap-4">
         <button onClick={toggleMute} className="p-2 md:p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition">
            {muted ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />}
         </button>
      </div>

      {/* Sticky Action (Appears when playing) */}
      <div className={`absolute bottom-4 left-4 md:bottom-6 md:left-6 transition-transform duration-500 ${playing ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-white/90 backdrop-blur-md p-2 pr-4 md:p-3 md:pr-6 rounded-full flex items-center gap-2 md:gap-4 shadow-lg">
          <img src="https://picsum.photos/id/1080/100/100" alt="Product" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs font-bold text-stone-800">Natural Peanut</span>
            <span className="text-[9px] md:text-[10px] text-stone-500">₹262</span>
          </div>
          <button className="bg-orange-600 text-white text-[10px] md:text-xs px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold hover:bg-orange-700 whitespace-nowrap">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;