
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Coupon, Product, Variant, User, Order, Address } from '../types';
import { COUPONS, ORDERS as INITIAL_ORDERS } from '../services/mockData';
import { createOrder } from '../services/api';
import { auth, db } from '../services/firebase';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';

interface ShopContextType {
  cart: CartItem[];
  addToCart: (product: Product, variant: Variant, qty: number) => void;
  removeFromCart: (productId: string, variantWeight: string) => void;
  updateQuantity: (productId: string, variantWeight: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  finalTotal: number;
  isVideoPlaying: boolean;
  setVideoPlaying: (playing: boolean) => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, photoFile?: File) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  orders: Order[];
  placeOrder: (customerDetails: any, paymentMethod: string) => Promise<string>;
  saveUserAddress: (address: Address | Omit<Address, 'id'>) => Promise<void>;
  removeUserAddress: (addressId: string) => Promise<void>;
  updateUserProfile: (name: string) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isVideoPlaying, setVideoPlaying] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Initialize orders from LocalStorage to persist data across reloads
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const savedOrders = localStorage.getItem('br_orders');
      return savedOrders ? JSON.parse(savedOrders) : INITIAL_ORDERS;
    } catch (e) {
      console.error("Failed to load orders from storage", e);
      return INITIAL_ORDERS;
    }
  });

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Base User Object from Auth
        let appUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          role: 'user',
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
          savedAddresses: [] 
        };

        // Sync with Firestore
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            // Merge Firestore data (specifically savedAddresses) into user object
            appUser = {
              ...appUser,
              ...data,
              id: firebaseUser.uid // Ensure ID remains consistent
            };
          } else {
            // Document doesn't exist? Create it now.
            await setDoc(userRef, {
              name: appUser.name,
              email: appUser.email,
              avatar: appUser.avatar,
              role: 'user',
              savedAddresses: []
            });
          }
        } catch (error) {
          console.error("Error fetching user profile from DB:", error);
        }

        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Persist orders whenever they change
  useEffect(() => {
    localStorage.setItem('br_orders', JSON.stringify(orders));
  }, [orders]);

  // Cart Calculation
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const discountAmount = appliedCoupon 
    ? (appliedCoupon.discountType === 'PERCENTAGE' 
        ? (cartTotal * appliedCoupon.value) / 100 
        : appliedCoupon.value)
    : 0;

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const addToCart = (product: Product, variant: Variant, qty: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id && item.variantWeight === variant.weight);
      if (existing) {
        return prev.map(item => 
          (item.productId === product.id && item.variantWeight === variant.weight)
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        variantWeight: variant.weight,
        quantity: qty,
        name: product.name,
        price: variant.price,
        image: product.image
      }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId: string, variantWeight: string) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.variantWeight === variantWeight)));
  };

  const updateQuantity = (productId: string, variantWeight: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId && item.variantWeight === variantWeight) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const coupon = COUPONS.find(c => c.code === code);
    if (!coupon) return { success: false, message: 'Invalid coupon code' };
    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return { success: false, message: `Minimum order value ₹${coupon.minOrderValue} required` };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string, name: string, photoFile?: File) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Create a photo URL (In real app, upload to Storage. Here we use a Dicebear or ObjectURL for session)
    let photoURL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
    if (photoFile) {
        console.log("File selected but Firebase Storage not enabled. Using generated avatar.");
    }

    await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL
    });
    
    // Explicitly create user doc in Firestore to ensure it exists immediately
    try {
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name,
        email: email,
        avatar: photoURL,
        role: 'user',
        savedAddresses: []
      });
    } catch (e) {
      console.error("Error creating user profile in DB:", e);
    }
    
    // Force refresh user state locally to show name immediately if Auth listener is slow
    const currentUser = auth.currentUser;
    if (currentUser) {
        setUser({
            id: currentUser.uid,
            name: name,
            email: currentUser.email || '',
            role: 'user',
            avatar: photoURL,
            savedAddresses: []
        });
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCart([]);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const saveUserAddress = async (address: Address | Omit<Address, 'id'>) => {
    if (!user) return;
    
    const currentAddresses = user.savedAddresses || [];
    let updatedAddresses: Address[] = [];

    if ('id' in address && address.id) {
        // UPDATE existing address
        updatedAddresses = currentAddresses.map(addr => 
            addr.id === address.id ? (address as Address) : addr
        );
    } else {
        // CREATE new address
        const newAddress: Address = {
            ...address,
            id: `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        };
        updatedAddresses = [...currentAddresses, newAddress];
    }

    // 2. Update Local State
    setUser(prev => {
        if (!prev) return null;
        return {
            ...prev,
            savedAddresses: updatedAddresses
        };
    });

    // 3. Update Firestore
    try {
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, {
            savedAddresses: updatedAddresses
        }, { merge: true });
    } catch (e) {
        console.error("Failed to save address to DB", e);
    }
  };

  const removeUserAddress = async (addressId: string) => {
    if (!user) return;
    
    // 1. Calculate new state immediately
    const currentAddresses = user.savedAddresses || [];
    const updatedAddresses = currentAddresses.filter(addr => addr.id !== addressId);

    // 2. Update Local State
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        savedAddresses: updatedAddresses
      };
    });

    // 3. Update Firestore with the calculated list
    try {
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, {
            savedAddresses: updatedAddresses
        }, { merge: true });
    } catch (e) {
        console.error("Failed to remove address from DB", e);
    }
  };
  
  const updateUserProfile = async (name: string) => {
    if (!auth.currentUser || !user) return;

    // 1. Update Firebase Auth Profile
    await updateProfile(auth.currentUser, {
        displayName: name
    });

    // 2. Update Firestore User Doc
    try {
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, { name }, { merge: true });
    } catch (e) {
        console.error("Error updating profile in DB:", e);
        throw e;
    }

    // 3. Update Local State
    setUser(prev => prev ? ({
      ...prev,
      name: name
    }) : null);
  };

  const placeOrder = async (customerDetails: any, paymentMethod: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      // Delegate to Backend API Service
      const newOrder = await createOrder(
        user,
        cart,
        customerDetails,
        paymentMethod,
        finalTotal
      );

      // Update Local State with the persisted order from backend
      setOrders(prev => [newOrder, ...prev]);

      // Clear Cart on success
      clearCart();

      return newOrder.id;
    } catch (error) {
      console.error("Failed to place order:", error);
      throw error;
    }
  };

  return (
    <ShopContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, appliedCoupon, applyCoupon, removeCoupon, discountAmount, finalTotal,
      isVideoPlaying, setVideoPlaying, isCartOpen, setCartOpen,
      user, login, signup, logout, resetPassword,
      orders, placeOrder, saveUserAddress, removeUserAddress, updateUserProfile
    }}>
      {!loadingAuth && children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
};
