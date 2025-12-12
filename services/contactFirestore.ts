import { db, serverTimestamp } from './firebase';
import { collection, addDoc } from "firebase/firestore";

/* 
  FIRESTORE RULES FOR THIS COLLECTION:
  
  match /contactMessages/{document=**} {
    allow create: if true;  // Allow anyone to submit a contact form
    allow read, update, delete: if false; // Only allow admins (via console) to read
  }
*/

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

/**
 * Saves a contact message to the 'contactMessages' Firestore collection.
 */
export const saveContactMessage = async (data: ContactMessage) => {
  try {
    const docRef = await addDoc(collection(db, "contactMessages"), {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      createdAt: serverTimestamp(),
      status: 'new' 
    });
    
    console.log("Contact message saved with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error("Error adding contact message: ", error);
    
    // Check for common permission error
    if (error.code === 'permission-denied') {
        console.warn("Permission Denied: Please check Firestore Security Rules. See comments in services/contactFirestore.ts");
    }

    return { success: false, error };
  }
};
