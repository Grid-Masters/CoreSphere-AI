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
      approved_quotes: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          author: string | null
          category: string
          created_at: string
          id: string
          is_active: boolean
          quote: string
          source_module: string
          submitted_by: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          author?: string | null
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          quote: string
          source_module?: string
          submitted_by?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          author?: string | null
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          quote?: string
          source_module?: string
          submitted_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          action: string | null
          browser: string | null
          created_at: string
          device: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          network_classification: string | null
          outcome: string
          role: string | null
          session_id: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          browser?: string | null
          created_at?: string
          device?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          network_classification?: string | null
          outcome: string
          role?: string | null
          session_id?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          browser?: string | null
          created_at?: string
          device?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          network_classification?: string | null
          outcome?: string
          role?: string | null
          session_id?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      capabilities: {
        Row: {
          code: string
          created_at: string
          description: string | null
          domain: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          domain: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          domain?: string
          id?: string
          is_active?: boolean
          name?: string
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
      delegations: {
        Row: {
          accepted_at: string | null
          capability_id: string | null
          created_at: string
          delegate_user_id: string
          delegated_position_id: string | null
          delegator_user_id: string
          effective_from: string
          effective_to: string
          id: string
          reason: string | null
          scope_id: string | null
          scope_type: Database["public"]["Enums"]["capability_scope_type"]
          status: string
        }
        Insert: {
          accepted_at?: string | null
          capability_id?: string | null
          created_at?: string
          delegate_user_id: string
          delegated_position_id?: string | null
          delegator_user_id: string
          effective_from?: string
          effective_to: string
          id?: string
          reason?: string | null
          scope_id?: string | null
          scope_type?: Database["public"]["Enums"]["capability_scope_type"]
          status?: string
        }
        Update: {
          accepted_at?: string | null
          capability_id?: string | null
          created_at?: string
          delegate_user_id?: string
          delegated_position_id?: string | null
          delegator_user_id?: string
          effective_from?: string
          effective_to?: string
          id?: string
          reason?: string | null
          scope_id?: string | null
          scope_type?: Database["public"]["Enums"]["capability_scope_type"]
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "delegations_capability_id_fkey"
            columns: ["capability_id"]
            isOneToOne: false
            referencedRelation: "capabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delegations_delegated_position_id_fkey"
            columns: ["delegated_position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
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
      hard_tokens: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          issued_at: string
          serial_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          issued_at?: string
          serial_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          issued_at?: string
          serial_number?: string
          updated_at?: string
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
      organisation_units: {
        Row: {
          code: string
          country_code: string | null
          created_at: string
          display_name: string
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean
          metadata: Json
          name: string
          parent_unit_id: string | null
          unit_type: Database["public"]["Enums"]["org_unit_type"]
          updated_at: string
        }
        Insert: {
          code: string
          country_code?: string | null
          created_at?: string
          display_name: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          name: string
          parent_unit_id?: string | null
          unit_type: Database["public"]["Enums"]["org_unit_type"]
          updated_at?: string
        }
        Update: {
          code?: string
          country_code?: string | null
          created_at?: string
          display_name?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          metadata?: Json
          name?: string
          parent_unit_id?: string | null
          unit_type?: Database["public"]["Enums"]["org_unit_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisation_units_parent_unit_id_fkey"
            columns: ["parent_unit_id"]
            isOneToOne: false
            referencedRelation: "organisation_units"
            referencedColumns: ["id"]
          },
        ]
      }
      position_assignments: {
        Row: {
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          is_primary: boolean
          organisation_unit_id: string
          position_id: string
          reports_to_assignment_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_primary?: boolean
          organisation_unit_id: string
          position_id: string
          reports_to_assignment_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_primary?: boolean
          organisation_unit_id?: string
          position_id?: string
          reports_to_assignment_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "position_assignments_organisation_unit_id_fkey"
            columns: ["organisation_unit_id"]
            isOneToOne: false
            referencedRelation: "organisation_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "position_assignments_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "position_assignments_reports_to_assignment_id_fkey"
            columns: ["reports_to_assignment_id"]
            isOneToOne: false
            referencedRelation: "position_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      position_capabilities: {
        Row: {
          capability_id: string
          created_at: string
          default_scope_type: Database["public"]["Enums"]["capability_scope_type"]
          id: string
          position_id: string
        }
        Insert: {
          capability_id: string
          created_at?: string
          default_scope_type?: Database["public"]["Enums"]["capability_scope_type"]
          id?: string
          position_id: string
        }
        Update: {
          capability_id?: string
          created_at?: string
          default_scope_type?: Database["public"]["Enums"]["capability_scope_type"]
          id?: string
          position_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "position_capabilities_capability_id_fkey"
            columns: ["capability_id"]
            isOneToOne: false
            referencedRelation: "capabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "position_capabilities_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          position_family: string
          title: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          position_family: string
          title: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          position_family?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          corporate_email: string | null
          country_code: string
          created_at: string
          department: string | null
          display_name: string | null
          employee_number: string | null
          employment_status: string
          end_date: string | null
          full_name: string | null
          id: string
          is_demo: boolean
          preferred_name: string | null
          primary_org_unit_id: string | null
          profile_status: string
          role_label: string | null
          start_date: string
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          corporate_email?: string | null
          country_code?: string
          created_at?: string
          department?: string | null
          display_name?: string | null
          employee_number?: string | null
          employment_status?: string
          end_date?: string | null
          full_name?: string | null
          id?: string
          is_demo?: boolean
          preferred_name?: string | null
          primary_org_unit_id?: string | null
          profile_status?: string
          role_label?: string | null
          start_date?: string
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          corporate_email?: string | null
          country_code?: string
          created_at?: string
          department?: string | null
          display_name?: string | null
          employee_number?: string | null
          employment_status?: string
          end_date?: string | null
          full_name?: string | null
          id?: string
          is_demo?: boolean
          preferred_name?: string | null
          primary_org_unit_id?: string | null
          profile_status?: string
          role_label?: string | null
          start_date?: string
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_primary_org_unit_fkey"
            columns: ["primary_org_unit_id"]
            isOneToOne: false
            referencedRelation: "organisation_units"
            referencedColumns: ["id"]
          },
        ]
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
      sub_departments: {
        Row: {
          created_at: string
          department_id: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_departments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
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
      team_members: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          id: string
          is_active: boolean
          removed_at: string | null
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          removed_at?: string | null
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          removed_at?: string | null
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          department_id: string
          id: string
          is_active: boolean
          name: string
          sub_department_id: string | null
          team_lead_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id: string
          id?: string
          is_active?: boolean
          name: string
          sub_department_id?: string | null
          team_lead_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string
          id?: string
          is_active?: boolean
          name?: string
          sub_department_id?: string | null
          team_lead_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_sub_department_id_fkey"
            columns: ["sub_department_id"]
            isOneToOne: false
            referencedRelation: "sub_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      trusted_networks: {
        Row: {
          cidr: string
          created_at: string
          id: string
          is_active: boolean
          label: string
          updated_at: string
        }
        Insert: {
          cidr: string
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          updated_at?: string
        }
        Update: {
          cidr?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_capability_grants: {
        Row: {
          capability_id: string
          created_at: string
          effective_from: string
          effective_to: string | null
          granted_by_user_id: string | null
          id: string
          reason: string | null
          scope_id: string | null
          scope_type: Database["public"]["Enums"]["capability_scope_type"]
          status: string
          user_id: string
        }
        Insert: {
          capability_id: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          granted_by_user_id?: string | null
          id?: string
          reason?: string | null
          scope_id?: string | null
          scope_type?: Database["public"]["Enums"]["capability_scope_type"]
          status?: string
          user_id: string
        }
        Update: {
          capability_id?: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          granted_by_user_id?: string | null
          id?: string
          reason?: string | null
          scope_id?: string | null
          scope_type?: Database["public"]["Enums"]["capability_scope_type"]
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_capability_grants_capability_id_fkey"
            columns: ["capability_id"]
            isOneToOne: false
            referencedRelation: "capabilities"
            referencedColumns: ["id"]
          },
        ]
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
      user_sessions: {
        Row: {
          browser: string | null
          created_at: string
          device: string | null
          ended_at: string | null
          id: string
          ip_address: string | null
          last_activity_at: string
          login_at: string
          mfa_verified: boolean
          network_classification: string
          updated_at: string
          user_id: string
        }
        Insert: {
          browser?: string | null
          created_at?: string
          device?: string | null
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          last_activity_at?: string
          login_at?: string
          mfa_verified?: boolean
          network_classification?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          browser?: string | null
          created_at?: string
          device?: string | null
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          last_activity_at?: string
          login_at?: string
          mfa_verified?: boolean
          network_classification?: string
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
      has_capability: {
        Args: { _code: string; _user_id: string }
        Returns: boolean
      }
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
      capability_scope_type:
        | "SELF"
        | "TEAM"
        | "DEPARTMENT"
        | "ENTERPRISE"
        | "ASSIGNED_STAFF"
        | "PLATFORM"
      org_unit_type:
        | "GROUP"
        | "EXECUTIVE_PORTFOLIO"
        | "DEPARTMENT"
        | "LINE_OF_BUSINESS"
        | "UNIT"
        | "TEAM"
        | "DESK"
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
      capability_scope_type: [
        "SELF",
        "TEAM",
        "DEPARTMENT",
        "ENTERPRISE",
        "ASSIGNED_STAFF",
        "PLATFORM",
      ],
      org_unit_type: [
        "GROUP",
        "EXECUTIVE_PORTFOLIO",
        "DEPARTMENT",
        "LINE_OF_BUSINESS",
        "UNIT",
        "TEAM",
        "DESK",
      ],
    },
  },
} as const
