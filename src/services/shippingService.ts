
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export interface ShippingAddress {
  id?: string;
  user_id?: string;
  full_name: string;
  national_id: string;
  address: string;
  phone_number: string;
}

// Save shipping address for the current user
export const saveShippingAddress = async (address: Omit<ShippingAddress, 'user_id' | 'id'>) => {
  // Get the current authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to save shipping address');
  }
  
  // Add the user_id to the address data
  const addressWithUserId = {
    ...address,
    user_id: user.id
  };
  
  const { data, error } = await supabase
    .from('shipping_addresses')
    .insert(addressWithUserId)
    .select()
    .single();
  
  if (error) {
    console.error('Error saving shipping address:', error);
    throw error;
  }
  
  return data;
};

// Get all shipping addresses for the current user
export const getShippingAddresses = async () => {
  // Get the current authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to get shipping addresses');
  }
  
  const { data, error } = await supabase
    .from('shipping_addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching shipping addresses:', error);
    throw error;
  }
  
  return data || [];
};

// Create a new order with shipping information
export const createOrder = async (
  items: { product_id: string; quantity: number; price: number }[],
  shippingAddressId: string
) => {
  // Get the current authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create an order');
  }
  
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const orderData = {
    user_id: user.id,
    amount: totalAmount,
    payment_method: 'pay_on_delivery',
    shipping_address_id: shippingAddressId,
    confirmation_status: 'pending',
  };
  
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }
  
  return data;
};
