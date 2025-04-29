
import { supabase } from "@/integrations/supabase/client";

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
  const { data, error } = await supabase
    .from('shipping_addresses')
    .insert([address])
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
  const { data, error } = await supabase
    .from('shipping_addresses')
    .select('*')
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
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        amount: totalAmount,
        payment_method: 'pay_on_delivery',
        shipping_address_id: shippingAddressId,
        confirmation_status: 'pending',
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }
  
  return data;
};
