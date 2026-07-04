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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      acknowledgments: {
        Row: {
          acknowledged_at: string | null
          confirmation_text: string | null
          id: string
          target_id: string
          target_kind: string
          target_version: string | null
          user_id: string
          viewed_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          confirmation_text?: string | null
          id?: string
          target_id: string
          target_kind: string
          target_version?: string | null
          user_id: string
          viewed_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          confirmation_text?: string | null
          id?: string
          target_id?: string
          target_kind?: string
          target_version?: string | null
          user_id?: string
          viewed_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          badge_key: string | null
          cert_type: string
          id: string
          issued_at: string
          score: number | null
          title: string
          user_id: string
        }
        Insert: {
          badge_key?: string | null
          cert_type: string
          id?: string
          issued_at?: string
          score?: number | null
          title: string
          user_id: string
        }
        Update: {
          badge_key?: string | null
          cert_type?: string
          id?: string
          issued_at?: string
          score?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      failed_searches: {
        Row: {
          department: string | null
          id: string
          occurred_at: string
          query: string
          user_id: string | null
        }
        Insert: {
          department?: string | null
          id?: string
          occurred_at?: string
          query: string
          user_id?: string | null
        }
        Update: {
          department?: string | null
          id?: string
          occurred_at?: string
          query?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          context_id: string
          context_type: string
          created_at: string
          id: string
          note: string | null
          rating: string
          user_id: string
        }
        Insert: {
          context_id: string
          context_type: string
          created_at?: string
          id?: string
          note?: string | null
          rating: string
          user_id: string
        }
        Update: {
          context_id?: string
          context_type?: string
          created_at?: string
          id?: string
          note?: string | null
          rating?: string
          user_id?: string
        }
        Relationships: []
      }
      incident_banners: {
        Row: {
          active_from: string
          active_to: string | null
          affected_systems: string | null
          created_at: string
          created_by: string | null
          id: string
          message: string
          severity: string
          title: string
        }
        Insert: {
          active_from?: string
          active_to?: string | null
          affected_systems?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          message: string
          severity: string
          title: string
        }
        Update: {
          active_from?: string
          active_to?: string | null
          affected_systems?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          message?: string
          severity?: string
          title?: string
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          completed_at: string
          id: string
          milestone_key: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          milestone_key: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          milestone_key?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          display_name: string | null
          id: string
          role_label: string | null
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          id?: string
          role_label?: string | null
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          id?: string
          role_label?: string | null
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recognition_archives: {
        Row: {
          category: string
          citation: string | null
          created_at: string
          created_by: string | null
          department: string | null
          id: string
          month: string
          points: number
          winner_email: string
          winner_name: string
        }
        Insert: {
          category: string
          citation?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          id?: string
          month: string
          points?: number
          winner_email: string
          winner_name: string
        }
        Update: {
          category?: string
          citation?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          id?: string
          month?: string
          points?: number
          winner_email?: string
          winner_name?: string
        }
        Relationships: []
      }
      recognition_photos: {
        Row: {
          caption: string | null
          category: string
          created_at: string
          id: string
          photo_path: string
          subject_email: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          category: string
          created_at?: string
          id?: string
          photo_path: string
          subject_email: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          category?: string
          created_at?: string
          id?: string
          photo_path?: string
          subject_email?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      risk_snapshots: {
        Row: {
          computed_at: string
          factors: Json | null
          id: string
          level: string
          score: number
          user_id: string
        }
        Insert: {
          computed_at?: string
          factors?: Json | null
          id?: string
          level: string
          score: number
          user_id: string
        }
        Update: {
          computed_at?: string
          factors?: Json | null
          id?: string
          level?: string
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      sop_versions: {
        Row: {
          approved_by: string | null
          archived: boolean
          change_summary: string | null
          id: string
          published_at: string
          sop_id: string
          updated_by: string
          version: string
        }
        Insert: {
          approved_by?: string | null
          archived?: boolean
          change_summary?: string | null
          id?: string
          published_at?: string
          sop_id: string
          updated_by: string
          version: string
        }
        Update: {
          approved_by?: string | null
          archived?: boolean
          change_summary?: string | null
          id?: string
          published_at?: string
          sop_id?: string
          updated_by?: string
          version?: string
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          ai_category: string | null
          ai_summary: string | null
          body: string
          category: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_category?: string | null
          ai_summary?: string | null
          body: string
          category?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_category?: string | null
          ai_summary?: string | null
          body?: string
          category?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "staff" | "qa" | "ld" | "team_lead" | "group_head" | "sysadmin"
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
      app_role: ["staff", "qa", "ld", "team_lead", "group_head", "sysadmin"],
    },
  },
} as const
