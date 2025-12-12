
import React, { useState } from 'react';
import { useShop } from '../store/ShopContext';
import { User, Package, MapPin, Edit2, LogOut, Check, Trash2, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Address } from '../types';

const AddressModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    initialData 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    onSave: (data: Address | Omit<Address, 'id'>) => void;
    initialData?: Address | null;
}) => {
    const [formData, setFormData] = useState({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        pincode: initialData?.pincode || ''
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(initialData ? { ...formData, id: initialData.id } : formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-stone-900 w-full max-w-md rounded-2xl border border-stone-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="p-4 border-b border-stone-800 flex justify-between items-center">
                    <h3 className="text-white font-bold">{initialData ? 'Edit Address' : 'Add New Address'}</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                    </div>
                    <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                    <input name="phone" type="tel" placeholder="Phone" value={formData.phone} onChange={handleChange} required className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                    <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                        <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required className="bg-stone-950 border border-stone-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-500 transition shadow-lg shadow-orange-900/20">
                        Save Address
                    </button>
                </form>
            </div>
        </div>
    );
};

const Profile = () => {
  const { user, orders, logout, removeUserAddress, saveUserAddress, updateUserProfile } = useShop();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  // Address Modal State
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
      if (!name.trim()) return;
      setSaving(true);
      try {
          await updateUserProfile(name);
          setIsEditing(false);
      } catch (e) {
          console.error("Update failed", e);
          alert("Failed to update profile.");
      } finally {
          setSaving(false);
      }
  };

  const openAddAddress = () => {
      setEditingAddress(null);
      setIsAddressModalOpen(true);
  };

  const openEditAddress = (addr: Address) => {
      setEditingAddress(addr);
      setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (data: Address | Omit<Address, 'id'>) => {
      await saveUserAddress(data);
      setIsAddressModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8 neon-text">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: User Info */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-stone-900 rounded-2xl p-6 border border-stone-800 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-orange-600/20 to-stone-900"></div>
                
                <div className="relative flex flex-col items-center text-center">
                    <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-stone-900 shadow-lg mb-4 bg-stone-800" />
                    
                    {isEditing ? (
                        <div className="w-full space-y-2 mb-2">
                             <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-white text-center focus:border-orange-500 outline-none"
                             />
                             <div className="flex gap-2 justify-center">
                                 <button 
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-500 flex items-center gap-1"
                                 >
                                     <Check className="w-3 h-3" /> Save
                                 </button>
                                 <button 
                                    onClick={() => { setIsEditing(false); setName(user.name); }}
                                    className="bg-stone-800 text-stone-300 px-3 py-1 rounded text-xs font-bold hover:bg-stone-700"
                                 >
                                     Cancel
                                 </button>
                             </div>
                        </div>
                    ) : (
                        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            {user.name} 
                            <button onClick={() => setIsEditing(true)} className="text-stone-500 hover:text-orange-500">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </h2>
                    )}
                    
                    <p className="text-stone-500 text-sm mb-6">{user.email}</p>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-stone-950 text-red-400 py-3 rounded-xl border border-stone-800 hover:bg-red-900/10 hover:border-red-900/30 transition flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>

            {/* Saved Addresses */}
            <div className="bg-stone-900 rounded-2xl p-6 border border-stone-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-500" /> Saved Addresses
                    </h3>
                    <button onClick={openAddAddress} className="text-orange-500 hover:text-orange-400 p-1 rounded hover:bg-stone-800 transition">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {(!user.savedAddresses || user.savedAddresses.length === 0) ? (
                    <p className="text-stone-500 text-sm">No saved addresses yet.</p>
                ) : (
                    <div className="space-y-3">
                        {user.savedAddresses.map((addr) => (
                            <div key={addr.id || Math.random()} className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-sm relative group hover:border-orange-500/30 transition">
                                <p className="text-white font-semibold pr-16">{addr.firstName} {addr.lastName}</p>
                                <p className="text-stone-400 line-clamp-1">{addr.address}</p>
                                <p className="text-stone-500">{addr.city}, {addr.pincode}</p>
                                
                                {addr.id && (
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                openEditAddress(addr);
                                            }}
                                            className="text-stone-600 hover:text-orange-500 p-1.5 rounded hover:bg-stone-900 transition z-10 cursor-pointer"
                                            title="Edit Address"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if(window.confirm('Delete this address?')) {
                                                    removeUserAddress(addr.id);
                                                }
                                            }}
                                            className="text-stone-600 hover:text-red-500 p-1.5 rounded hover:bg-stone-900 transition z-10 cursor-pointer"
                                            title="Delete Address"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Right Col: Order History */}
        <div className="lg:col-span-2">
             <div className="bg-stone-900 rounded-2xl p-6 border border-stone-800 min-h-[500px]">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Package className="w-6 h-6 text-orange-500" /> Order History
                </h3>
                
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-stone-800 mx-auto mb-4" />
                        <p className="text-stone-500">You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-stone-950 border border-stone-800 rounded-xl p-5 hover:border-orange-500/30 transition">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-white font-bold text-lg">#{order.id}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                order.status === 'Delivered' ? 'bg-green-900/30 text-green-400 border border-green-900' :
                                                order.status === 'Processing' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900' :
                                                'bg-blue-900/30 text-blue-400 border border-blue-900'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-stone-500 text-xs mt-1">{order.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-white block">₹{order.total}</span>
                                        <span className="text-xs text-stone-500">{order.items.length} items</span>
                                    </div>
                                </div>
                                
                                <div className="border-t border-stone-900 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-stone-900 border border-stone-800 overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-stone-300 text-sm truncate font-medium">{item.name}</p>
                                                <p className="text-stone-600 text-xs">{item.variantWeight} x {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        </div>
      </div>

      <AddressModal 
          isOpen={isAddressModalOpen} 
          onClose={() => setIsAddressModalOpen(false)} 
          onSave={handleSaveAddress}
          initialData={editingAddress}
      />
    </div>
  );
};

export default Profile;
