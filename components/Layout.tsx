
import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, ArrowRight, User as UserIcon, LogOut, Home, Box, Star, Mail } from 'lucide-react';
import { useShop } from '../store/ShopContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const CartDrawer = () => {
  const { isCartOpen, setCartOpen, cart, cartTotal, removeFromCart, updateQuantity, finalTotal, discountAmount } = useShop();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-stone-900 h-full shadow-2xl shadow-orange-900/50 flex flex-col animate-in slide-in-from-right duration-300 border-l border-stone-800">
        <div className="p-5 border-b border-stone-800 flex justify-between items-center bg-stone-900">
          <h2 className="text-xl font-bold text-white neon-text">Your Cart ({cart.length})</h2>
          <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-stone-800 rounded-full transition text-stone-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-10 text-stone-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Your cart feels light.</p>
              <button 
                onClick={() => {
                  setCartOpen(false);
                  navigate('/products');
                }} 
                className="mt-4 text-orange-500 font-semibold hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.productId}-${item.variantWeight}`} className="flex gap-4 p-3 bg-stone-800/50 border border-stone-700 rounded-xl shadow-sm">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-stone-700" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-white leading-tight">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.productId, item.variantWeight)} className="text-stone-500 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-stone-400 mb-2">{item.variantWeight}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3 bg-stone-900 rounded-full px-2 py-1 border border-stone-700">
                      <button onClick={() => updateQuantity(item.productId, item.variantWeight, -1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-stone-700 text-stone-400">-</button>
                      <span className="text-sm font-medium w-4 text-center text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.variantWeight, 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-stone-700 text-stone-400">+</button>
                    </div>
                    <span className="font-bold text-orange-400">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-800 bg-stone-900 space-y-4">
             <div className="flex justify-between text-sm text-stone-400">
               <span>Subtotal</span>
               <span>₹{cartTotal}</span>
             </div>
             {discountAmount > 0 && (
               <div className="flex justify-between text-sm text-green-400 font-medium">
                 <span>Discount</span>
                 <span>-₹{discountAmount}</span>
               </div>
             )}
             <div className="flex justify-between text-xl font-bold text-white neon-text">
               <span>Total</span>
               <span>₹{finalTotal}</span>
             </div>
             <Link 
               to="/checkout" 
               onClick={() => setCartOpen(false)}
               className="block w-full bg-orange-600 text-white text-center py-4 rounded-xl font-bold hover:bg-orange-500 transition-colors shadow-[0_0_20px_rgba(234,88,12,0.4)]"
             >
               Checkout Now
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user, logout } = useShop();
  const navigate = useNavigate();

  const handleNav = (path: string, hash?: string) => {
    navigate(path);
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
        window.scrollTo(0, 0);
    }
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-72 bg-stone-950 h-full border-r border-stone-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-left duration-200">
        
        {/* Neon Border Line */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/50 to-transparent"></div>

        <div className="p-6 border-b border-stone-800 flex justify-between items-center">
          <span className="text-xl font-bold text-orange-500 neon-text">Menu</span>
          <button onClick={onClose}><X className="text-stone-400 hover:text-white" /></button>
        </div>
        <div className="flex-1 p-6 space-y-6">
          <button onClick={() => handleNav('/')} className="flex w-full items-center gap-4 text-stone-300 hover:text-orange-500 transition font-medium text-lg">
            <Home className="w-5 h-5" /> Home
          </button>
          <button onClick={() => handleNav('/products')} className="flex w-full items-center gap-4 text-stone-300 hover:text-orange-500 transition font-medium text-lg">
            <Box className="w-5 h-5" /> Shop All
          </button>
          <button onClick={() => handleNav('/', 'reviews-section')} className="flex w-full items-center gap-4 text-stone-300 hover:text-orange-500 transition font-medium text-lg">
            <Star className="w-5 h-5" /> Reviews
          </button>
          <button onClick={() => handleNav('/contact')} className="flex w-full items-center gap-4 text-stone-300 hover:text-orange-500 transition font-medium text-lg">
            <Mail className="w-5 h-5" /> Contact
          </button>
        </div>
        <div className="p-6 border-t border-stone-800">
          {user ? (
            <div className="space-y-4">
              <Link 
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-3 text-stone-300 p-3 bg-stone-900 rounded-xl border border-stone-800 hover:border-orange-500/50 transition"
              >
                <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border border-orange-500" />
                <span className="font-semibold">{user.name}</span>
              </Link>
              <button 
                onClick={() => { logout(); onClose(); }} 
                className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 w-full py-3 hover:bg-red-500/10 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={onClose} 
              className="block w-full py-4 bg-orange-600/10 text-center rounded-xl text-orange-500 font-bold hover:bg-orange-600/20 border border-orange-600/30 transition shadow-[0_0_15px_rgba(234,88,12,0.1)]"
            >
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export const Header = () => {
  const { setCartOpen, cart, user, logout } = useShop();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToReviews = () => {
      navigate('/');
      setTimeout(() => {
          document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-stone-950/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3 border-b border-white/5' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-stone-300 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" onClick={handleHomeClick} className="text-3xl md:text-4xl font-bold tracking-tighter flex items-center gap-2">
              <span className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">Body</span>
              <span className="text-white">Revival BR</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-stone-400 font-medium text-sm">
            <Link to="/" onClick={handleHomeClick} className="hover:text-orange-400 transition hover:drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">Home</Link>
            <Link to="/products" className="hover:text-orange-400 transition hover:drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">Shop</Link>
            <button onClick={scrollToReviews} className="hover:text-orange-400 transition hover:drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">Reviews</button>
            <Link to="/contact" className="hover:text-orange-400 transition hover:drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex relative group">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 rounded-full bg-stone-900 border border-stone-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm w-32 focus:w-48 transition-all text-white placeholder-stone-600"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-orange-500" />
            </div>

            {user ? (
               <div className="hidden md:flex items-center gap-3 pl-4 border-l border-stone-800">
                 <Link to="/profile" className="flex items-center gap-2 group">
                    <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border border-stone-700 group-hover:border-orange-500 transition object-cover" />
                    <span className="text-sm text-stone-300 font-medium hidden lg:block group-hover:text-orange-400 transition">{user.name}</span>
                 </Link>
               </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-2 text-stone-400 hover:text-white transition text-sm font-medium">
                 <UserIcon className="w-5 h-5" />
                 Login
              </Link>
            )}

            <button onClick={() => setCartOpen(true)} className="relative p-2 hover:bg-stone-800 rounded-full transition group">
              <ShoppingBag className="w-5 h-5 text-stone-300 group-hover:text-orange-400 transition" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(234,88,12,0.6)]">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CartDrawer />
    </>
  );
};

export const Footer = () => (
  <footer className="bg-black text-stone-400 py-16 mt-20 border-t border-stone-900 relative overflow-hidden">
     {/* Footer Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"></div>

    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
      <div>
        <h3 className="text-white text-lg font-bold mb-4 neon-text">Body Revival BR</h3>
        <p className="text-sm leading-relaxed mb-6 text-stone-500">Premium nutrition for the elite athlete. Clean ingredients, powerful results.</p>
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-stone-900 rounded-full border border-stone-800 hover:border-orange-500 transition cursor-pointer"></div>
          <div className="w-8 h-8 bg-stone-900 rounded-full border border-stone-800 hover:border-orange-500 transition cursor-pointer"></div>
          <div className="w-8 h-8 bg-stone-900 rounded-full border border-stone-800 hover:border-orange-500 transition cursor-pointer"></div>
        </div>
      </div>
      
      <div>
        <h4 className="text-white font-semibold mb-4">Shop</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/products" className="hover:text-orange-500 transition">All Products</Link></li>
          <li><Link to="/" className="hover:text-orange-500 transition">Best Sellers</Link></li>
          <li><Link to="/" className="hover:text-orange-500 transition">Bundles</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-semibold mb-4">Support</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/contact" className="hover:text-orange-500 transition">Contact Us</Link></li>
          <li><a href="#" className="hover:text-orange-500 transition">Shipping Policy</a></li>
          <li><a href="#" className="hover:text-orange-500 transition">Returns</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
        <div className="flex gap-2">
          <input type="email" placeholder="Email address" className="bg-stone-900 border border-stone-800 rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-stone-600" />
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition shadow-[0_0_15px_rgba(234,88,12,0.4)]">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    <div className="container mx-auto px-4 mt-12 pt-8 border-t border-stone-900 text-center text-xs text-stone-600">
      &copy; 2024 Body Revival BR. All rights reserved.
    </div>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-200 relative">
      {/* Global Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-900/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3"></div>
      </div>

      <Header />
      <main className="flex-1 pt-20 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};
