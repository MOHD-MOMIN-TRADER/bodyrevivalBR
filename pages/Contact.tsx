
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2, CheckCircle2, User, FileText } from 'lucide-react';
import { saveContactMessage } from '../services/contactFirestore';
import { useShop } from '../store/ShopContext';

const Contact = () => {
  const { user } = useShop();
  
  // Initialize form with user data if available
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const myEmail = "nasrinkhatoon42092@gmail.com";
  const myPhone = "9801450348";
  const whatsappLink = `https://wa.me/91${myPhone}?text=Hi Body Revival BR, I have a query regarding your products.`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const result = await saveContactMessage(formData);

        if (result.success) {
          setSuccess(true);
          // Reset form but keep name/email if logged in for convenience
          setFormData({ 
              name: user?.name || '', 
              email: user?.email || '', 
              phone: '', 
              subject: 'General Inquiry', 
              message: '' 
          });
        } else {
          alert("Failed to send message. Please check your internet connection or try again later.");
        }
    } catch (error) {
        console.error("Form Submission Error:", error);
        alert("An unexpected error occurred.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white pt-12 pb-20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in slide-in-from-bottom duration-500">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">Get In Touch</h1>
          <p className="text-stone-400 max-w-2xl mx-auto">
            Have questions about our products or your order? We are here to help you achieve your fitness goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Info Side */}
          <div className="space-y-8 animate-in slide-in-from-left duration-500 delay-100">
            
            {/* WhatsApp Card */}
            <div className="bg-stone-900/50 border border-stone-800 p-8 rounded-3xl hover:border-green-500/50 transition duration-300 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/20 transition"></div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-stone-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                   <MessageCircle className="w-6 h-6 text-green-500" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">WhatsApp Us</h3>
                 <p className="text-stone-400 mb-6">Instant support for quick queries. Chat directly with our team.</p>
                 <a 
                   href={whatsappLink} 
                   target="_blank" 
                   rel="noreferrer"
                   className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                 >
                   Chat Now <Send className="w-4 h-4" />
                 </a>
                 <p className="mt-4 text-sm text-stone-500 font-mono">+91 {myPhone}</p>
               </div>
            </div>

            {/* Email Card */}
            <div className="bg-stone-900/50 border border-stone-800 p-8 rounded-3xl hover:border-orange-500/50 transition duration-300 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition"></div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-stone-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                   <Mail className="w-6 h-6 text-orange-500" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">Email Support</h3>
                 <p className="text-stone-400 mb-6">For detailed inquiries, bulk orders, or feedback.</p>
                 <a 
                   href={`mailto:${myEmail}`}
                   className="text-lg font-bold text-white hover:text-orange-500 transition break-all"
                 >
                   {myEmail}
                 </a>
               </div>
            </div>

            {/* Address Placeholder */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-900/30 border border-stone-800/50">
               <MapPin className="w-6 h-6 text-stone-500 mt-1" />
               <div>
                 <h4 className="font-bold text-white">Headquarters</h4>
                 <p className="text-sm text-stone-400">Body Revival BR, Bangalore, India - 560045</p>
               </div>
            </div>

          </div>

          {/* Contact Form Side */}
          <div className="bg-stone-900 p-8 rounded-3xl border border-stone-800 shadow-2xl animate-in slide-in-from-right duration-500 delay-100 relative">
             {success ? (
               <div className="absolute inset-0 z-20 bg-stone-900 rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in">
                 <CheckCircle2 className="w-20 h-20 text-green-500 mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                 <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
                 <p className="text-stone-400 mb-8">Thank you for contacting us. We will get back to you at <span className="text-white">{formData.email}</span> shortly.</p>
                 <button 
                   onClick={() => setSuccess(false)}
                   className="bg-stone-800 text-white px-6 py-3 rounded-xl hover:bg-stone-700 transition"
                 >
                   Send Another Message
                 </button>
               </div>
             ) : null}

             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
               Send a Message <FileText className="w-5 h-5 text-orange-500" />
             </h2>
             
             <form onSubmit={handleSubmit} className="space-y-5">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-stone-500 uppercase">Your Name</label>
                   <div className="relative">
                     <User className="absolute left-4 top-3.5 w-5 h-5 text-stone-500" />
                     <input 
                       type="text" 
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       required
                       className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 outline-none transition"
                       placeholder="John Doe"
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-stone-500 uppercase">Phone Number</label>
                   <div className="relative">
                     <Phone className="absolute left-4 top-3.5 w-5 h-5 text-stone-500" />
                     <input 
                       type="tel" 
                       name="phone"
                       value={formData.phone}
                       onChange={handleChange}
                       className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 outline-none transition"
                       placeholder="+91..."
                     />
                   </div>
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-bold text-stone-500 uppercase">Email Address</label>
                 <div className="relative">
                   <Mail className="absolute left-4 top-3.5 w-5 h-5 text-stone-500" />
                   <input 
                     type="email" 
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                     className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-orange-500 outline-none transition"
                     placeholder="you@example.com"
                   />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-bold text-stone-500 uppercase">Subject</label>
                 <select 
                   name="subject"
                   value={formData.subject}
                   onChange={handleChange}
                   className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 px-4 text-white focus:border-orange-500 outline-none transition appearance-none"
                 >
                   <option>General Inquiry</option>
                   <option>Order Status</option>
                   <option>Product Support</option>
                   <option>Bulk Order</option>
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-bold text-stone-500 uppercase">Message</label>
                 <textarea 
                   name="message"
                   value={formData.message}
                   onChange={handleChange}
                   required
                   rows={5}
                   className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 px-4 text-white focus:border-orange-500 outline-none transition resize-none"
                   placeholder="How can we help you?"
                 ></textarea>
               </div>

               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:bg-orange-500 transition flex items-center justify-center gap-2 disabled:opacity-70"
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Message <Send className="w-5 h-5" /></>}
               </button>
             </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
