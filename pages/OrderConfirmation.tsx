
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, Smartphone, Camera, MessageCircle, QrCode, Wallet, Truck } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, email, paymentMethod, total } = location.state || { orderId: 'UNKNOWN', email: 'you', paymentMethod: 'cod', total: 0 };
  const whatsappNumber = "+91 8787074730";

  // Generate a generic UPI link for the QR Code
  // In a real app, this would be your actual UPI ID (VPA)
  const upiId = "momin6969@ybl";
  const upiLink = `upi://pay?pa=${upiId}&pn=BodyRevivalBR&am=${total}&cu=INR&tn=Order${orderId}`;
  
  // QR Code Image API (using qrserver.com for demo purposes)
     // Your custom QR image
      const qrCodeUrl = "/qr.jpg";   //
 


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in slide-in-from-bottom duration-500">
        
        {/* Success Header */}
        <div>
           <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
             <CheckCircle2 className="w-10 h-10 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] rounded-full" />
           </div>
           <h1 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h1>
           <p className="text-stone-400">Order ID: <span className="text-orange-500 font-mono font-bold">#{orderId}</span></p>
        </div>
        
        {/* Payment Logic */}
        {paymentMethod === 'upi' ? (
          <div className="bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl relative">
             <div className="bg-orange-600/10 p-4 border-b border-orange-600/20">
                <h3 className="text-orange-500 font-bold flex items-center justify-center gap-2">
                   <QrCode className="w-5 h-5" /> Complete Payment via UPI
                </h3>
             </div>

             <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
                {/* QR Section */}
                <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                       <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48 object-contain" />
                    </div>
                    <div className="mt-4 text-center">
                       <p className="text-2xl font-bold text-white mb-1">₹{total}</p>
                       <p className="text-xs text-stone-500">Scan using any UPI App</p>
                    </div>
                </div>

                {/* Instructions */}
                <div className="text-left space-y-6 relative">
                    <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-stone-800"></div>
                    
                    <div className="relative pl-10">
                        <div className="absolute left-0 top-0 w-6 h-6 bg-stone-800 rounded-full flex items-center justify-center text-xs font-bold text-white border border-stone-700">1</div>
                        <h4 className="font-bold text-white text-sm">Scan & Pay</h4>
                        <p className="text-xs text-stone-500 mt-1">Use GPay, PhonePe, Paytm etc. to pay the amount shown.</p>
                    </div>

                    <div className="relative pl-10">
                         <div className="absolute left-0 top-0 w-6 h-6 bg-stone-800 rounded-full flex items-center justify-center text-xs font-bold text-white border border-stone-700">2</div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">Take Screenshot <Camera className="w-3 h-3 text-stone-500" /></h4>
                        <p className="text-xs text-stone-500 mt-1">Capture the successful payment screen with Transaction ID.</p>
                    </div>

                    <div className="relative pl-10">
                         <div className="absolute left-0 top-0 w-6 h-6 bg-stone-800 rounded-full flex items-center justify-center text-xs font-bold text-white border border-stone-700">3</div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">Send to WhatsApp <MessageCircle className="w-3 h-3 text-green-500" /></h4>
                        <p className="text-xs text-stone-500 mt-1">Send the screenshot to verify your order immediately.</p>
                        
                        <a 
                          href={`https://wa.me/919876543210?text=Hi, I have placed order #${orderId} of Rs.${total}. Here is the payment screenshot.`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                        >
                            Open WhatsApp
                            <ArrowRight className="w-3 h-3" />
                        </a>
                        <p className="text-[10px] text-stone-500 mt-2 font-mono">{whatsappNumber}</p>
                    </div>
                </div>
             </div>
          </div>
        ) : paymentMethod === 'cod' ? (
          <div className="bg-stone-900 p-8 rounded-3xl border border-stone-800 shadow-2xl text-center space-y-6">
             <div className="w-20 h-20 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto text-orange-500 border border-orange-500/20">
               <Truck className="w-10 h-10" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white mb-2">Cash on Delivery</h3>
               <p className="text-lg text-stone-300">Your order will be processed.</p>
               <p className="text-stone-400 mt-1">Please pay the amount <span className="text-white font-bold">₹{total}</span> during delivery.</p>
             </div>
             
             <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 inline-block w-full max-w-md">
                <p className="text-xs text-stone-500">We have sent a confirmation email to <span className="text-stone-300">{email}</span></p>
             </div>
          </div>
        ) : (
          <div className="bg-stone-900/50 p-6 rounded-xl border border-stone-800">
            <p className="text-sm text-stone-300">
              We have sent a confirmation email to <br/>
              <span className="text-white font-bold">{email}</span>
            </p>
            <p className="text-xs text-stone-500 mt-4">
               We will verify your order and ship it shortly.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-6 max-w-sm mx-auto">
          <Link to="/products" className="w-full bg-stone-800 text-white py-4 rounded-xl font-bold hover:bg-stone-700 transition flex items-center justify-center gap-2 border border-stone-700">
            Continue Shopping <ShoppingBag className="w-4 h-4" />
          </Link>
          <Link to="/" className="w-full text-stone-500 hover:text-white py-2 text-sm transition">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
