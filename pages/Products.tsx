
import React, { useState } from 'react';
import { PRODUCTS } from '../services/mockData';
import { Link } from 'react-router-dom';
import { Filter, Search, ShoppingBag } from 'lucide-react';
import { useShop } from '../store/ShopContext';

const Products = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const { addToCart } = useShop();

  const categories = ['All', 'Best Seller', 'Vegan', 'Sweet', 'Crunchy'];

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = filter === 'All' || p.tags.includes(filter);
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-950 text-white pt-10 pb-20">
      {/* Header Area */}
      <div className="container mx-auto px-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">Shop Collection</h1>
        <p className="text-stone-400 max-w-2xl">
          Discover our range of premium, small-batch peanut butters designed for performance and taste.
        </p>
      </div>

      {/* Filters & Controls */}
      <div className="container mx-auto px-4 mb-12 sticky top-20 z-30">
        <div className="bg-stone-900/80 backdrop-blur-xl p-4 rounded-2xl border border-stone-800 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg shadow-black/20">
           
           {/* Chips */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setFilter(cat)}
                 className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                   filter === cat 
                     ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' 
                     : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                 }`}
               >
                 {cat}
               </button>
             ))}
           </div>

           {/* Search */}
           <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
             <input 
               type="text" 
               placeholder="Search flavors..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-orange-500 outline-none text-white transition-all focus:shadow-[0_0_10px_rgba(249,115,22,0.2)]"
             />
           </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4">
        {filteredProducts.length === 0 ? (
           <div className="text-center py-20">
             <p className="text-stone-500 text-xl">No products found matching your criteria.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="group bg-gradient-to-b from-stone-900 to-stone-950 rounded-3xl border border-stone-800 border-t-stone-700 overflow-hidden hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.3)] hover:-translate-y-2 flex flex-col shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)]">
                <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-stone-800">
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent z-10"></div>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 relative z-0" 
                  />
                  {product.tags.includes('Best Seller') && (
                    <span className="absolute top-4 left-4 z-20 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      Best Seller
                    </span>
                  )}
                </Link>
                
                <div className="p-6 flex flex-col flex-1 relative z-20">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/product/${product.id}`} className="font-bold text-xl text-white group-hover:text-orange-500 transition-colors drop-shadow-sm">
                      {product.name}
                    </Link>
                    <span className="font-bold text-orange-400">₹{product.variants[0].price}</span>
                  </div>
                  
                  <p className="text-sm text-stone-400 mb-6 flex-1">{product.shortDescription}</p>
                  
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => addToCart(product, product.variants[1] || product.variants[0], 1)}
                      className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-stone-200 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add 1Kg
                    </button>
                    <Link 
                      to={`/product/${product.id}`}
                      className="px-4 py-3 border border-stone-700 rounded-xl hover:bg-stone-800 transition text-stone-300 hover:text-white"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
