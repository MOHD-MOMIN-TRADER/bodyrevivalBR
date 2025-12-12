import React from 'react';
import { ArrowRight, Truck, ShieldCheck, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReviewCarousel from '../components/ReviewCarousel';
import VideoPlayer from '../components/VideoPlayer';
import { PRODUCTS } from '../services/mockData';
import { Product } from '../types';
const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <Link to={`/product/${product.id}`} className="group block h-full">
    <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 border-t-stone-700 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.25)] hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2 flex flex-col">
      <div className="aspect-square bg-stone-800 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent z-10 opacity-60"></div>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100 relative z-0" 
        />
        {product.tags.includes('Best Seller') && (
          <span className="absolute top-4 left-4 z-20 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-orange-600/40">
            Best Seller
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1 relative z-20">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-white group-hover:text-orange-500 transition-colors drop-shadow-md">{product.name}</h3>
          <span className="font-bold text-orange-400">₹{product.variants[0].price}</span>
        </div>
        <p className="text-sm text-stone-400 mb-4 line-clamp-2">{product.shortDescription}</p>
        <div className="flex gap-2 mt-auto">
          {product.tags.map((tag: string) => (
            <span key={tag} className="text-[10px] bg-stone-800/50 border border-stone-700/50 text-stone-300 px-2 py-1 rounded-md">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  </Link>
);

const Home = () => {
  return (
    <div className="space-y-24 pb-20 bg-transparent text-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        {/* Developer Tag (Slide Animation) */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 slide-left-right">
    <p className="px-4 py-1 bg-white text-orange-500 font-semibold rounded-full shadow-md 
                text-sm md:text-base tracking-wide neon-shadow text-center w-max mx-auto">
    Developed by Mohd Momin
  </p>
</div>





         <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start py-20">
          <div className="space-y-8 animate-in slide-in-from-bottom duration-700 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900/50 backdrop-blur rounded-full shadow-sm border border-stone-800">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              <h4 className="text-xs font-semibold text-stone-300 tracking-wide uppercase">Fresh Batch Roasted Today</h4>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Fuel Your Body <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 neon-text">Naturally.</span>
            </h1>
            
            <p className="text-lg text-stone-400 max-w-md leading-relaxed">
              Premium artisanal peanut butter crafted for athletes and foodies. 
              Zero preservatives, 100% taste.
            </p>

            <div className="flex gap-4">
              <Link to="/products" className="px-8 py-4 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-500 transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center gap-2">
                Shop Peanut Butters <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex gap-8 pt-8 border-t border-stone-800">
              <div>
                <span className="block text-2xl font-bold text-white">15k+</span>
                <span className="text-sm text-stone-500">Happy Customers</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">25k+</span>
                <span className="text-sm text-stone-500">KGs Sold</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">4.9</span>
                <span className="text-sm text-stone-500">Average Rating</span>
              </div>
            </div>
          </div>
            <div className="relative group perspective-1000 z-10">
             {/* 3D-ish card effect mockup */}
            <div className="relative z-10 transform transition-transform duration-500 group-hover:rotate-y-6 group-hover:rotate-x-6">
                <div className="relative rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-stone-800 h-[800px] w-full">
                 <img 
                   src="/main.png"
                   alt="My product momin" 
                   className="w-full h-full object-cover object-top"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               </div>
               {/* Floating elements */}
               <div className="absolute -right-4 top-20 bg-stone-900/90 backdrop-blur p-4 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-stone-800 animate-bounce duration-[3000ms]">
                 <div className="flex items-center gap-3">
                   <div className="bg-orange-900/50 p-2 rounded-full text-orange-500 border border-orange-500/20">
                     <Award className="w-6 h-6" />
                   </div>
                   <div>
                     <div className="text-xs text-stone-500 font-semibold uppercase">Protein</div>
                     <div className="text-lg font-bold text-white">30g / 100g</div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-2 block drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">Our Collection</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Trending Now</h2>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-stone-500 hover:text-white transition">View All <ArrowRight className="w-4 h-4" /></Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Video Commerce */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-orange-900/5 -skew-y-3 transform origin-top-left scale-110"></div>
        <div className="container mx-auto px-4 text-center mb-12 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">See the Texture</h2>
          <p className="text-stone-400">Experience the creamy drift in real-time.</p>
        </div>
        <div className="px-4 relative z-10 flex justify-center">
          <div className="w-full max-w-sm md:max-w-4xl">
             <VideoPlayer />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews-section">
        <div className="container mx-auto px-4 text-center mb-6">
          <h2 className="text-3xl font-bold text-white neon-text">Customer Reviews(*coming coon*)</h2>
          <p className="text-stone-500 mt-2">Hear from our elite BR community.</p>
        </div>
        <ReviewCarousel />
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-stone-900 mt-12">
        <div className="flex items-center gap-4 p-6 bg-stone-900 rounded-2xl border border-stone-800 hover:border-stone-700 transition hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
          <div className="bg-stone-800 p-3 rounded-full shadow-sm text-orange-500"><Truck className="w-6 h-6" /></div>
          <div>
            <h4 className="font-bold text-white">Fast Delivery</h4>
            <p className="text-sm text-stone-500">Within 2-3 business days</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-stone-900 rounded-2xl border border-stone-800 hover:border-stone-700 transition hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
          <div className="bg-stone-800 p-3 rounded-full shadow-sm text-orange-500"><ShieldCheck className="w-6 h-6" /></div>
          <div>
            <h4 className="font-bold text-white">Quality Guarantee</h4>
            <p className="text-sm text-stone-500">100% money back guarantee</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-stone-900 rounded-2xl border border-stone-800 hover:border-stone-700 transition hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
          <div className="bg-stone-800 p-3 rounded-full shadow-sm text-orange-500"><Award className="w-6 h-6" /></div>
          <div>
            <h4 className="font-bold text-white">Lab Tested</h4>
            <p className="text-sm text-stone-500">Certified for purity</p>
             </div> 
        </div>
      </section>
    </div>
  );
};

export default Home;
