export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      dishes: {
        Row: {
          available: boolean | null
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_gluten_free: boolean | null
          is_promotion: boolean | null
          is_vegan: boolean | null
          is_vegetarian: boolean | null
          name: string
          price: number
          promotion_price: number | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          available?: boolean | null
          category: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_gluten_free?: boolean | null
          is_promotion?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          name: string
          price: number
          promotion_price?: number | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          available?: boolean | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_gluten_free?: boolean | null
          is_promotion?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean | null
          name?: string
          price?: number
          promotion_price?: number | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          customizations: Json | null
          dish_id: string
          id: string
          order_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          customizations?: Json | null
          dish_id: string
          id?: string
          order_id: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          customizations?: Json | null
          dish_id?: string
          id?: string
          order_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          status: string
          stripe_session_id: string | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string
          stripe_session_id?: string | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string
          stripe_session_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          created_at: string
          id: string
          is_internal: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_internal?: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_internal?: boolean | null
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          category: string
          created_at: string
          customer_email: string
          customer_name: string
          description: string
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          customer_email: string
          customer_name: string
          description: string
          id?: string
          priority: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
