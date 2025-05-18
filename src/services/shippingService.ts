export interface ShippingAddress {
  id: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  // TODO: Replace with Clerk user ID
  user_id: string;
  amount: number;
  payment_method: string;
  status: string;
  shipping_address_id: string;
  items: OrderItem[];
  created_at: string;
}

// Save shipping address for the current user
export const saveShippingAddress = async (addressData: Omit<ShippingAddress, 'id'>): Promise<ShippingAddress> => {
  // TODO: Get user ID from Clerk's useUser() hook
  // const { user } = useUser();
  // const userId = user?.id;
  
  const address: ShippingAddress = {
    id: `addr_${Date.now()}`,
    ...addressData
  };
  
  // In a real app, this would be an API call with the user's ID
  // For now, we'll store it in localStorage with a placeholder user ID
  const userId = 'temp_user_id'; // This will be replaced with Clerk user ID
  localStorage.setItem(`shipping_address_${userId}`, JSON.stringify(address));
  return address;
};

// Get shipping address for the current user
export const getShippingAddress = async (): Promise<ShippingAddress | null> => {
  // TODO: Get user ID from Clerk's useUser() hook
  // const { user } = useUser();
  // const userId = user?.id;
  
  const userId = 'temp_user_id'; // This will be replaced with Clerk user ID
  const address = localStorage.getItem(`shipping_address_${userId}`);
  return address ? JSON.parse(address) : null;
};

// Create a new order
export const createOrder = async (
  items: OrderItem[],
  shippingAddressId: string
): Promise<{ id: string }> => {
  // TODO: Get user ID from Clerk's useUser() hook
  // const { user } = useUser();
  // const userId = user?.id;
  
  const userId = 'temp_user_id'; // This will be replaced with Clerk user ID
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const orderData: Order = {
    id: `ord_${Date.now()}`,
    user_id: userId, // This will be replaced with Clerk user ID
    amount: totalAmount,
    payment_method: 'pay_on_delivery',
    status: 'pending',
    shipping_address_id: shippingAddressId,
    items,
    created_at: new Date().toISOString()
  };
  
  // In a real app, this would be an API call
  localStorage.setItem(`order_${orderData.id}`, JSON.stringify(orderData));
  
  return { id: orderData.id };
};
