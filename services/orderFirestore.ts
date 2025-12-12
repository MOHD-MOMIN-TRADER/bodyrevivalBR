// src/services/orderFirestore.ts
import { db, auth, serverTimestamp } from './firebase';
import {
  collection,
  addDoc,
  DocumentReference
} from "firebase/firestore";

/**
 * Expected order payload shape:
 * {
 *   user: { uid, firstName, lastName, phone, email, address, city, pincode },
 *   items: [{ id, name, price, quantity, variant? }],
 *   subtotal: number,
 *   shipping?: number,
 *   coupon?: string|null,
 *   total: number,
 *   paymentMethod: string, // "UPI/QR" or "COD"
 *   note?: string
 * }
 */

/**
 * saveOrder
 * Saves the order to `orders` collection in Firestore.
 * Auto-generates document ID and stores user info, items, totals, payment method, and timestamp.
 */
export async function saveOrder(orderData: any): Promise<{ ok: boolean; orderId?: string; docId?: string; error?: any }> {
  // 1. Basic Validation
  if (!orderData || !orderData.user || !orderData.items || !Array.isArray(orderData.items)) {
    console.error("Invalid payload:", orderData);
    return { ok: false, error: "Invalid payload. Must include user and items array." };
  }

  // 2. Auth Check (Crucial for Permission Rules)
  const currentUser = auth.currentUser;
  if (!currentUser) {
      console.warn("⚠️ No authenticated Firebase user found. Firestore write might fail if rules require auth.");
  }

  // 3. Generate a readable Order ID
  const customOrderId = "BR" + Date.now().toString(); 

  // 4. Prepare Data for Firestore
  // We spread ...orderData.user to ensure 'uid' and other fields are included.
  const docData = {
    id: customOrderId,
    user: {
      uid: currentUser?.uid || orderData.user.uid || 'guest',
      firstName: orderData.user.firstName,
      lastName: orderData.user.lastName,
      email: orderData.user.email,
      phone: orderData.user.phone,
      address: orderData.user.address,
      city: orderData.user.city,
      pincode: orderData.user.pincode
    },
    items: orderData.items, 
    subtotal: orderData.subtotal ?? 0,
    shipping: orderData.shipping ?? 0,
    coupon: orderData.coupon ?? null,
    total: orderData.total ?? 0,
    paymentMethod: orderData.paymentMethod ?? "UNKNOWN",
    note: orderData.note ?? "",
    status: "pending",
    createdAt: serverTimestamp() 
  };

  try {
    // 5. Write to Firestore 'orders' collection
    const ordersCollection = collection(db, "orders");
    const ref: DocumentReference = await addDoc(ordersCollection, docData);
    
    console.log("✅ Order saved to Firestore with ID: ", ref.id);
    
    return { 
      ok: true, 
      orderId: customOrderId, 
      docId: ref.id           
    };
  } catch (error: any) {
    console.error("❌ FIREBASE SAVE ERROR:", error);
    
    // Explicit Instruction for Permission Errors
    if (error.code === 'permission-denied') {
        console.group("⚠️ PERMISSION DENIED SOLUTION");
        console.error("1. Go to Firebase Console > Firestore Database > Rules");
        console.error("2. Change 'allow write: if false;' to 'allow write: if request.auth != null;'");
        console.error("3. Publish the rules.");
        console.groupEnd();
    }
    
    return { ok: false, error };
  }
}

/**
 * Compatibility alias
 */
export const createOrderInFirestore = saveOrder;

/**
 * placeOrder helper
 */
export async function placeOrder(payload: any) {
  return await saveOrder(payload);
}