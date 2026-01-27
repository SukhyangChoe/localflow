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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      board_images: {
        Row: {
          board_id: number
          created_at: string
          image_id: number
          image_order: number
          image_url: string
        }
        Insert: {
          board_id: number
          created_at?: string
          image_id?: never
          image_order?: number
          image_url: string
        }
        Update: {
          board_id?: number
          created_at?: string
          image_id?: never
          image_order?: number
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_images_board_id_boards_board_id_fk"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["board_id"]
          },
        ]
      }
      board_itineraries: {
        Row: {
          board_id: number
          created_at: string
          itinerary_id: number
        }
        Insert: {
          board_id: number
          created_at?: string
          itinerary_id: number
        }
        Update: {
          board_id?: number
          created_at?: string
          itinerary_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "board_itineraries_board_id_boards_board_id_fk"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["board_id"]
          },
          {
            foreignKeyName: "board_itineraries_itinerary_id_itineraries_itinerary_id_fk"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["itinerary_id"]
          },
        ]
      }
      board_likes: {
        Row: {
          board_id: number
          profile_id: string
        }
        Insert: {
          board_id: number
          profile_id: string
        }
        Update: {
          board_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_likes_board_id_boards_board_id_fk"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["board_id"]
          },
          {
            foreignKeyName: "board_likes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      boards: {
        Row: {
          bcategory: Database["public"]["Enums"]["business_category"]
          board_id: number
          business_info: Json | null
          city: string
          coordinates: Json | null
          created_at: string
          description: string
          is_featured: boolean | null
          is_verified: boolean | null
          location: string
          profile_id: string
          published_at: string | null
          recommended_seasons: string[] | null
          region: string
          related_board_ids: number[] | null
          seasons: string[] | null
          slug: string[] | null
          stats: Json
          status: Database["public"]["Enums"]["status"]
          sub_themes: string[] | null
          tags: string[] | null
          theme: string | null
          thumbnail_image: string
          title: string
          updated_at: string
        }
        Insert: {
          bcategory: Database["public"]["Enums"]["business_category"]
          board_id?: never
          business_info?: Json | null
          city: string
          coordinates?: Json | null
          created_at?: string
          description: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          location: string
          profile_id: string
          published_at?: string | null
          recommended_seasons?: string[] | null
          region: string
          related_board_ids?: number[] | null
          seasons?: string[] | null
          slug?: string[] | null
          stats?: Json
          status?: Database["public"]["Enums"]["status"]
          sub_themes?: string[] | null
          tags?: string[] | null
          theme?: string | null
          thumbnail_image: string
          title: string
          updated_at?: string
        }
        Update: {
          bcategory?: Database["public"]["Enums"]["business_category"]
          board_id?: never
          business_info?: Json | null
          city?: string
          coordinates?: Json | null
          created_at?: string
          description?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          location?: string
          profile_id?: string
          published_at?: string | null
          recommended_seasons?: string[] | null
          region?: string
          related_board_ids?: number[] | null
          seasons?: string[] | null
          slug?: string[] | null
          stats?: Json
          status?: Database["public"]["Enums"]["status"]
          sub_themes?: string[] | null
          tags?: string[] | null
          theme?: string | null
          thumbnail_image?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "boards_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      itineraries: {
        Row: {
          city: string
          created_at: string
          description: string | null
          end_date: string
          is_featured: boolean | null
          itinerary_id: number
          profile_id: string
          region: string
          slug: string | null
          start_date: string
          stats: Json | null
          status: Database["public"]["Enums"]["status"]
          title: string
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          description?: string | null
          end_date: string
          is_featured?: boolean | null
          itinerary_id?: never
          profile_id: string
          region: string
          slug?: string | null
          start_date: string
          stats?: Json | null
          status?: Database["public"]["Enums"]["status"]
          title: string
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          description?: string | null
          end_date?: string
          is_featured?: boolean | null
          itinerary_id?: never
          profile_id?: string
          region?: string
          slug?: string | null
          start_date?: string
          stats?: Json | null
          status?: Database["public"]["Enums"]["status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "itineraries_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          country: string | null
          created_at: string
          email: string | null
          email_verified: boolean | null
          interests: string[] | null
          is_active: boolean | null
          is_verified: boolean | null
          join_path: Database["public"]["Enums"]["join_path"]
          language: string | null
          last_login_at: string | null
          notification_settings: Json | null
          phone: string | null
          phone_verified: boolean | null
          preferred_currency: string | null
          privacy_settings: Json | null
          profile_id: string
          role: Database["public"]["Enums"]["role"]
          stats: Json | null
          timezone: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          interests?: string[] | null
          is_active?: boolean | null
          is_verified?: boolean | null
          join_path?: Database["public"]["Enums"]["join_path"]
          language?: string | null
          last_login_at?: string | null
          notification_settings?: Json | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_currency?: string | null
          privacy_settings?: Json | null
          profile_id: string
          role?: Database["public"]["Enums"]["role"]
          stats?: Json | null
          timezone?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          email_verified?: boolean | null
          interests?: string[] | null
          is_active?: boolean | null
          is_verified?: boolean | null
          join_path?: Database["public"]["Enums"]["join_path"]
          language?: string | null
          last_login_at?: string | null
          notification_settings?: Json | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_currency?: string | null
          privacy_settings?: Json | null
          profile_id?: string
          role?: Database["public"]["Enums"]["role"]
          stats?: Json | null
          timezone?: string | null
          updated_at?: string
          username?: string | null
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
      business_category:
        | "restaurant"
        | "cafe"
        | "performance"
        | "exhibition"
        | "shopping"
        | "accommodation"
        | "attraction"
        | "entertainment"
        | "sports"
        | "spa"
        | "other"
      join_path: "email" | "google" | "kakao" | "naver"
      role: "traveler" | "creator"
      status: "draft" | "published" | "archived" | "hidden"
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
    Enums: {
      business_category: [
        "restaurant",
        "cafe",
        "performance",
        "exhibition",
        "shopping",
        "accommodation",
        "attraction",
        "entertainment",
        "sports",
        "spa",
        "other",
      ],
      join_path: ["email", "google", "kakao", "naver"],
      role: ["traveler", "creator"],
      status: ["draft", "published", "archived", "hidden"],
    },
  },
} as const
