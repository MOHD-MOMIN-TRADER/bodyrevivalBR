import React, { useState, useEffect } from 'react';
import { useShop } from '../store/ShopContext';
import { Check, CreditCard, Wallet, AlertCircle, Shield, Loader2, Lock, QrCode, MapPin, PlusCircle, Trash2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Address } from '../types';

const Checkout = () => {
  const { cart, cartTotal, appliedCoupon, applyCoupon, removeCoupon, discountAmount, finalTotal, user, placeOrder, saveUserAddress, removeUserAddress } = useShop();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldSaveAddress, setShouldSaveAddress] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });

  // Validation Errors State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Auth Guard & Auto-fill
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location } });
    } else {
        // Pre-fill email from registered user if not set
        if (!formData.email) {
            setFormData(prev => ({ ...prev, email: user.email }));
        }
    }
  }, [user, navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddressSelect = (addr: Address) => {
      setFormData({
          firstName: addr.firstName,
          lastName: addr.lastName,
          email: addr.email,
          address: addr.address,
          city: addr.city,
          pincode: addr.pincode,
          phone: addr.phone
      });
      setErrors({});
      // Uncheck save if selecting an existing one
      setShouldSaveAddress(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    
    // Email Validation
    if (!formData.email.trim()) {
        newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Enter a valid email address";
    }

    // 6-digit Pincode Validation
    if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter valid 6-digit pincode";
    }

    // 10-digit Phone Validation
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(couponInput.toUpperCase());
    setCouponMsg(result.message);
  };

  const handlePlaceOrder = async () => {
    // 1. Validate Form Data
    if (!validateForm()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    setIsProcessing(true);
    try {
        // 2. (Optional) Save Address to Profile
        if (shouldSaveAddress) {
            await saveUserAddress({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                phone: formData.phone
            });
        }

        // 3. Call placeOrder (which calls saveOrder in services/orderFirestore.ts)
        const orderId = await placeOrder(formData, paymentMethod);
        
        // 4. Navigate to Confirmation
        navigate('/order-confirmation', { 
            state: { 
                orderId, 
                email: formData.email, 
                paymentMethod,
                total: finalTotal 
            } 
        });
    } catch (error: any) {
        console.error("Order placement failed:", error);
        
        // Show user-friendly error for permissions
        let msg = "Failed to place order. Please try again.";
        if (error.message?.includes("insufficient permissions") || error.code === 'permission-denied') {
            msg = "Database Permission Error: Please ensure Firestore Rules are set to 'public' or you are logged in correctly.";
        }
        
        alert(msg);
    } finally {
        setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Your cart is empty</h2>
        <Link to="/products" className="text-orange-500 hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
         <Lock className="w-6 h-6 text-green-500" />
         <h1 className="text-3xl font-bold text-white neon-text">Secure Checkout</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Saved Addresses */}
          {user.savedAddresses.length > 0 && (
            <div className="bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-800">
                <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    Saved Addresses
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {user.savedAddresses.map((addr) => (
                        <div 
                            key={addr.id}
                            onClick={() => handleAddressSelect(addr)}
                            className="p-4 rounded-xl border border-stone-800 hover:border-orange-500 bg-stone-950 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(249,115,22,0.1)] group relative"
                        >
                            <h3 className="font-bold text-white group-hover:text-orange-500 transition-colors pr-6">{addr.firstName} {addr.lastName}</h3>
                            <p className="text-sm text-stone-400 mt-1 line-clamp-2">{addr.address}</p>
                            <p className="text-sm text-stone-500">{addr.city}, {addr.pincode}</p>
                            <p className="text-xs text-stone-600 mt-2">{addr.phone}</p>
                            
                            {/* Remove Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(window.confirm('Remove this address?')) {
                                        removeUserAddress(addr.id);
                                    }
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-stone-800/80 hover:bg-red-900/50 rounded-lg text-stone-400 hover:text-red-500 transition border border-stone-700 hover:border-red-500/50 z-10"
                                title="Remove Address"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Selected Indicator */}
                            {formData.address === addr.address && (
                                <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Selected
                                </div>
                            )}
                        </div>
                    ))}
                    <button 
                        onClick={() => {
                            setFormData({ firstName: '', lastName: '', email: user.email, address: '', city: '', pincode: '', phone: '' });
                            setShouldSaveAddress(true);
                        }}
                        className="p-4 rounded-xl border border-stone-800 border-dashed hover:border-stone-600 bg-stone-900/50 flex flex-col items-center justify-center gap-2 text-stone-500 hover:text-stone-300 transition"
                    >
                        <PlusCircle className="w-6 h-6" />
                        <span className="font-semibold text-sm">Add New Address</span>
                    </button>
                </div>
            </div>
          )}

          {/* Shipping Address Form */}
          <div className="bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-800">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs shadow-[0_0_10px_rgba(249,115,22,0.4)]">1</span>
              Contact & Shipping
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Contact Info Row */}
              <div className="md:col-span-2 space-y-1">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={handleInputChange} 
                    className={`w-full p-3 bg-stone-950 border ${errors.email ? 'border-red-500' : 'border-stone-800'} text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition`} 
                  />
                  {errors.email ? <span className="text-xs text-red-500">{errors.email}</span> : <span className="text-xs text-stone-500">Order confirmation will be sent here.</span>}
              </div>

              <div className="space-y-1">
                  <input 
                    type="text" 
                    name="firstName"
                    placeholder="First Name" 
                    value={formData.firstName}
                    onChange={handleInputChange} 
                    className={`w-full p-3 bg-stone-950 border ${errors.firstName ? 'border-red-500' : 'border-stone-800'} text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition`} 
                  />
                  {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
              </div>

              <div className="space-y-1">
                  <input 
                    type="text" 
                    name="lastName"
                    placeholder="Last Name" 
                    value={formData.lastName}
                    onChange={handleInputChange} 
                    className={`w-full p-3 bg-stone-950 border ${errors.lastName ? 'border-red-500' : 'border-stone-800'} text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition`} 
                  />
                   {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
              </div>

              <div className="md:col-span-2 space-y-1">
                  <input 
                    type="text" 
                    name="address"
                    placeholder="Street Address, Apt, Suite" 
                    value={formData.address}
                    onChange={handleInputChange} 
                    className={`w-full p-3 bg-stone-950 border ${errors.address ? 'border-red-500' : 'border-stone-800'} text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition`} 
                  />
                  {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
              </div>

              <div className="space-y-1">
                  <input 
                    type="text" 
                    name="city"
                    placeholder="City" 
                    value={formData.city}
                    onChange={handleInputChange} 
                    className={`w-full p-3 bg-stone-950 border ${errors.city ? 'border-red-500' : 'border-stone-800'} text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition`} 
                  />
                  {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
              </div>

              <div className="space-y-1">
                  <input 
                    type="text" 
                    name="pincode"
                    placeholder="Pincode (6 digits)" 
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleInputChange} 
                    className={`w-full p-3 bg-stone-950 border ${errors.pincode ? 'border-red-500' : 'border-stone-800'} text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition`} 
                  />
                  {errors.pincode && <span className="text-xs text-red-500">{errors.pincode}</span>}
              </div>

              <div className="md:col-span-2 space-y-1">
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Mobile Number (10 digits)" 
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleInputChange} 
                    className={`w-full p-3 bg-stone-950 border ${errors.phone ? 'border-red-500' : 'border-stone-800'} text-white rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition`} 
                  />
                  {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
              </div>

              {/* Save Address Checkbox */}
              <div className="md:col-span-2">
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${shouldSaveAddress ? 'bg-orange-600 border-orange-600' : 'border-stone-700 bg-stone-950 group-hover:border-stone-500'}`}>
                        {shouldSaveAddress && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <input 
                        type="checkbox" 
                        checked={shouldSaveAddress}
                        onChange={(e) => setShouldSaveAddress(e.target.checked)}
                        className="hidden" 
                    />
                    <span className="text-sm text-stone-400 group-hover:text-stone-300">Save this address for future orders</span>
                 </label>
              </div>

            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-800">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs shadow-[0_0_10px_rgba(249,115,22,0.4)]">2</span>
              Payment Method
            </h2>
            <div className="space-y-3">
              {/* UPI / QR */}
              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-900/10 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-stone-800 hover:border-stone-700'}`}>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="text-orange-600 focus:ring-orange-500" />
                <div className="flex-1">
                  <span className="font-semibold block text-white">UPI / QR Code</span>
                  <span className="text-xs text-stone-500">Pay via GPay, PhonePe, Paytm QR</span>
                </div>
                <div className="flex gap-2">
                   <div className="w-8 h-8 bg-stone-800 rounded flex items-center justify-center text-[10px] font-bold text-stone-500">UPI</div>
                   <QrCode className="w-8 h-8 p-1.5 text-stone-500" />
                </div>
              </label>

              {/* Card - Disabled */}
              <label className="flex items-center gap-4 p-4 rounded-xl border border-stone-800 bg-stone-900/30 opacity-60 cursor-not-allowed relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-stone-800 text-stone-500 text-[9px] px-2 py-0.5 rounded-bl-lg font-bold uppercase tracking-wider">Coming Soon</div>
                <input type="radio" name="payment" value="card" disabled className="text-stone-600" />
                <div className="flex-1">
                  <span className="font-semibold block text-stone-400">Credit / Debit Card</span>
                  <span className="text-xs text-stone-600 group-hover:text-stone-500 transition">Online Payment Gateway</span>
                </div>
                <CreditCard className="w-5 h-5 text-stone-600" />
              </label>

              {/* COD */}
              <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-900/10' : 'border-stone-800 hover:border-stone-700'}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-orange-600 focus:ring-orange-500" />
                <div className="flex-1">
                  <span className="font-semibold block text-white">Cash on Delivery</span>
                  <span className="text-xs text-stone-500">+₹50 handling fee</span>
                </div>
                <Wallet className="w-5 h-5 text-stone-400" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-stone-900 p-6 rounded-2xl shadow-lg border border-stone-800 sticky top-24">
            <h3 className="text-lg font-bold mb-4 text-white">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.variantWeight}`} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-stone-800" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-stone-200 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-stone-500">{item.variantWeight} x {item.quantity}</p>
                    <p className="text-sm font-bold mt-1 text-orange-400">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="mb-6">
              {appliedCoupon ? (
                <div className="bg-green-900/20 text-green-400 border border-green-900/30 p-3 rounded-lg flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">Code: {appliedCoupon.code}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs underline hover:text-green-300">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="relative">
                  <input 
                    type="text" 
                    placeholder="Coupon Code" 
                    className="w-full p-3 pr-20 bg-stone-950 border border-stone-800 text-white rounded-lg text-sm uppercase focus:border-orange-500 outline-none"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button type="submit" className="absolute right-2 top-2 bottom-2 px-3 bg-stone-800 text-white text-xs font-bold rounded hover:bg-stone-700 border border-stone-700">
                    APPLY
                  </button>
                </form>
              )}
              {couponMsg && !appliedCoupon && (
                 <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                   <AlertCircle className="w-3 h-3" /> {couponMsg}
                 </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-3 text-sm text-stone-400 pb-4 border-b border-stone-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-green-400">
                <span>Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4">
              <span className="text-lg font-bold text-white">Total</span>
              <span className="text-2xl font-bold text-white neon-text">₹{finalTotal}</span>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-[0_0_20px_rgba(234,88,12,0.4)] disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : 'Place Order'}
            </button>
            
            <p className="text-xs text-center text-stone-500 mt-4 flex justify-center items-center gap-1">
               <Shield className="w-3 h-3 text-green-500" /> 256-Bit SSL Encrypted & Verified
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;