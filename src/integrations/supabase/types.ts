export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description_fr: string
          description_ar: string
          price: number
          discount_price: number | null
          category: string
          category_id: string
          images: string[]
          featured: boolean
          created_at: string
          updated_at: string
          sizes: string[]
          position: number
        }
        Insert: {
          id?: string
          name: string
          description_fr: string
          description_ar: string
          price: number
          discount_price?: number | null
          category?: string
          category_id: string
          images: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
          sizes: string[]
          position?: number
        }
        Update: {
          id?: string
          name?: string
          description_fr?: string
          description_ar?: string
          price?: number
          discount_price?: number | null
          category?: string
          category_id?: string
          images?: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
          sizes?: string[]
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_category"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["name"]
          }
        ]
      }
      orders: {
        Row: {
          amount: number
          confirmation_status: string
          created_at: string
          currency: string
          id: string
          payment_intent_id: string | null
          payment_method: string | null
          shipping_address_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          confirmation_status?: string
          created_at?: string
          currency?: string
          id?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          shipping_address_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          confirmation_status?: string
          created_at?: string
          currency?: string
          id?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          shipping_address_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "shipping_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      shipping_addresses: {
        Row: {
          address: string
          created_at: string
          full_name: string
          id: string
          national_id: string
          phone_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          full_name: string
          id?: string
          national_id: string
          phone_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          full_name?: string
          id?: string
          national_id?: string
          phone_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name_fr: string
          name_ar: string
          sizes: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_fr: string
          name_ar: string
          sizes: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_fr?: string
          name_ar?: string
          sizes?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_categories_table: {
        Args: Record<string, never>
        Returns: void
      }
      alter_products_table: {
        Args: {
          action: string
          columns: Json
        }
        Returns: void
      }
      update_product_positions: {
        Args: {
          product_ids: string[]
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
