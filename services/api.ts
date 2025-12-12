import { Order, User, CartItem } from '../types';
import { createOrderInFirestore as saveOrderToDb } from './orderFirestore';

// Email Service (Simulated)
export const sendOrderConfirmationEmail = async (email: string, order: Order) => {
  console.groupCollapsed(`%c 📨 [BACKEND] Sending Email to ${email}`, 'color: #22c55e; font-weight: bold; font-size: 14px;');
  console.log(`%cSubject: Order Confirmation #${order.id} - Body Revival BR`, 'font-weight: bold;');
  console.log('--------------------------------------------------');
  console.log(`Hi ${order.customerName},`);
  console.log(`\nThank you for choosing Body Revival BR! We are getting your fuel ready.`);
  console.log(`\nORDER SUMMARY:`);
  console.log(`Order ID: ${order.id}`);
  console.log(`Date: ${order.date}`);
  console.log(`Status: ${order.status}`);
  console.log('--------------------------------------------------');
  console.table(order.items.map(item => ({
    Item: item.name,
    Variant: item.variantWeight,
    Qty: item.quantity,
    Price: `₹${item.price}`
  })));
  console.log('--------------------------------------------------');
  console.log(`TOTAL AMOUNT: ₹${order.total}`);
  console.log('--------------------------------------------------');
  console.log('You will receive another email when your order ships.');
  console.log('Stay Strong,\nTeam Body Revival');
  console.groupEnd();
  
  // Simulate network delay
  return new Promise(resolve => setTimeout(resolve, 800));
};

export const processPayment = async (amount: number, method: string) => {
  console.log(`%c 💳 [BACKEND] Processing Payment: ₹${amount} via ${method.toUpperCase()}`, 'color: #3b82f6; font-weight: bold;');
  return new Promise(resolve => setTimeout(resolve, 1500));
};

export const createOrder = async (
  user: User, 
  items: CartItem[], 
  customerDetails: { firstName: string; lastName: string; email: string; phone: string; address: string; city: string; pincode: string },
  paymentMethod: string,
  totalAmount: number
): Promise<Order> => {
  
  // 1. Simulate API Latency (Connection to Server)
  console.log(`%c 🔄 [BACKEND] Connection Established. Receiving Order Request...`, 'color: #f59e0b;');
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 2. Process Payment via Gateway (Razorpay/Stripe Simulation)
  await processPayment(totalAmount, paymentMethod);

  // 3. Persist Data (Firestore) via the new service
  console.log(`%c 💾 [BACKEND] Persisting Order to Firestore...`, 'color: #a855f7; font-weight: bold;');
  
  const payload = {
      user: {
        uid: user.id,
        ...customerDetails
      },
      items,
      subtotal: totalAmount, // Simplify for now
      shipping: 0,
      total: totalAmount,
      paymentMethod,
      coupon: null
  };

  const result = await saveOrderToDb(payload);
  
  if (!result.ok) {
      // Log the exact error to help debugging
      console.error("Firestore Save Failed:", result.error);
      throw new Error("Failed to save order. Check console for permission details.");
  }
  
  const newOrder: Order = {
    id: result.orderId!,
    customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
    total: totalAmount,
    status: 'Processing',
    date: new Date().toISOString().split('T')[0],
    items: [...items]
  };
  
  console.log(`%c ✅ [BACKEND] Order Successfully Created: ${newOrder.id}`, 'color: #22c55e; font-weight: bold;');

  // 4. Send Transactional Email
  const notificationEmail = customerDetails.email || user.email;
  await sendOrderConfirmationEmail(notificationEmail, newOrder);

  return newOrder;
};