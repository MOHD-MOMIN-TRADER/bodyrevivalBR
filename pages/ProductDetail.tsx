import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Truck, Shield, RotateCw } from 'lucide-react';
import { PRODUCTS } from '../services/mockData';
import { useShop } from '../store/ShopContext';
import { Variant } from '../types';

const ProductDetail = () => {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0]; // Fallback to first if not found
  const { addToCart } = useShop();

  const [selectedVariant, setSelectedVariant] = useState<Variant>(product.variants[1] || product.variants[0]); 
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);

  // Determine which images to show in gallery
  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image, "https://picsum.photos/id/102/600/600", "https://picsum.photos/id/106/600/600"];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-stone-900 rounded-[2.5rem] overflow-hidden group border border-stone-800">
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover"/>
            <div className="absolute top-6 right-6">
        <button className="bg-stone-900/80 backdrop-blur p-3 rounded-full hover:bg-black transition text-stone-300 border border-stone-700/50">
           <RotateCw className="w-6 h-6" />
           </button>
          </div>
            {/* Discount Badge Logic */}
            <div className="absolute top-6 left-6 bg-red-600 text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg shadow-red-900/40">
               High Protein
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {galleryImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition ${activeImage === img ? 'border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'border-stone-800 opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-white font-bold ml-1">{product.rating}</span>
              </div>
              <span className="text-stone-500 text-sm">({product.reviewsCount} reviews)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 neon-text">{product.name}</h1>
            <p className="text-lg text-stone-400 leading-relaxed">{product.description}</p>
          </div>

          <div className="p-6 bg-stone-900 rounded-2xl border border-stone-800 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-sm text-stone-500 font-medium mb-1 block">Selected Size</span>
                <div className="flex gap-3">
                  {product.variants.map(v => (
                    <button
                      key={v.weight}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${selectedVariant.weight === v.weight ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'bg-stone-950 text-stone-400 border border-stone-800 hover:border-stone-600'}`}
                    >
                      {v.weight}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-white">₹{selectedVariant.price}</span>
                <span className="text-sm text-stone-500 block">Inclusive of all taxes</span>
              </div>
            </div>

            <div className="h-px bg-stone-800" />

            <div className="flex gap-4">
               <div className="flex items-center gap-4 bg-stone-950 px-4 py-3 rounded-xl border border-stone-800">
                 <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-xl font-bold text-stone-500 hover:text-white transition">-</button>
                 <span className="text-lg font-bold w-6 text-center text-white">{qty}</span>
                 <button onClick={() => setQty(qty + 1)} className="text-xl font-bold text-stone-500 hover:text-white transition">+</button>
               </div>
               <button 
                onClick={() => addToCart(product, selectedVariant, qty)}
                className="flex-1 bg-orange-600 text-white font-bold rounded-xl text-lg hover:bg-orange-700 transition shadow-[0_0_20px_rgba(234,88,12,0.4)]"
               >
                 Add to Cart - ₹{selectedVariant.price * qty}
               </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-stone-500">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-stone-600" />
              <span>Free delivery on orders over ₹499</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-stone-600" />
              <span>Secure transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;