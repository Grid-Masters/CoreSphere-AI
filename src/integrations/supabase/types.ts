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
      audience_rules: {
        Row: {
          country_code: string | null
          created_at: string
          created_by: string
          effective_from: string | null
          effective_to: string | null
          id: string
          include_descendants: boolean
          knowledge_placement_id: string
          org_unit_id: string | null
          position_id: string | null
          rule_type: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          created_by: string
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          include_descendants?: boolean
          knowledge_placement_id: string
          org_unit_id?: string | null
          position_id?: string | null
          rule_type?: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          created_by?: string
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          include_descendants?: boolean
          knowledge_placement_id?: string
          org_unit_id?: string | null
          position_id?: string | null
          rule_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "audience_rules_knowledge_placement_id_fkey"
            columns: ["knowledge_placement_id"]
            isOneToOne: false
            referencedRelation: "knowledge_placements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audience_rules_org_unit_id_fkey"
            columns: ["org_unit_id"]
            isOneToOne: false
            referencedRelation: "organisation_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audience_rules_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
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
      clarification_requests: {
        Row: {
          conflict_case_id: string
          created_at: string
          due_date: string | null
          id: string
          question: string
          requested_by: string
          status: string
          target_org_unit_id: string | null
          target_user_id: string | null
          updated_at: string
        }
        Insert: {
          conflict_case_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          question: string
          requested_by: string
          status?: string
          target_org_unit_id?: string | null
          target_user_id?: string | null
          updated_at?: string
        }
        Update: {
          conflict_case_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          question?: string
          requested_by?: string
          status?: string
          target_org_unit_id?: string | null
          target_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clarification_requests_conflict_case_id_fkey"
            columns: ["conflict_case_id"]
            isOneToOne: false
            referencedRelation: "knowledge_conflict_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clarification_requests_target_org_unit_id_fkey"
            columns: ["target_org_unit_id"]
            isOneToOne: false
            referencedRelation: "organisation_units"
            referencedColumns: ["id"]
          },
        ]
      }
      clarification_responses: {
        Row: {
          clarification_request_id: string
          created_at: string
          id: string
          responder_user_id: string
          response_text: string
        }
        Insert: {
          clarification_request_id: string
          created_at?: string
          id?: string
          responder_user_id: string
          response_text: string
        }
        Update: {
          clarification_request_id?: string
          created_at?: string
          id?: string
          responder_user_id?: string
          response_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "clarification_responses_clarification_request_id_fkey"
            columns: ["clarification_request_id"]
            isOneToOne: false
            referencedRelation: "clarification_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      conflict_decisions: {
        Row: {
          conflict_case_id: string
          created_at: string
          decided_by: string
          decision_type: string
          id: string
          rationale: string
        }
        Insert: {
          conflict_case_id: string
          created_at?: string
          decided_by: string
          decision_type: string
          id?: string
          rationale: string
        }
        Update: {
          conflict_case_id?: string
          created_at?: string
          decided_by?: string
          decision_type?: string
          id?: string
          rationale?: string
        }
        Relationships: [
          {
            foreignKeyName: "conflict_decisions_conflict_case_id_fkey"
            columns: ["conflict_case_id"]
            isOneToOne: false
            referencedRelation: "knowledge_conflict_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      conflict_evidence: {
        Row: {
          conflict_case_id: string
          created_at: string
          created_by: string
          evidence_note: string
          id: string
          source_version_id: string | null
        }
        Insert: {
          conflict_case_id: string
          created_at?: string
          created_by: string
          evidence_note: string
          id?: string
          source_version_id?: string | null
        }
        Update: {
          conflict_case_id?: string
          created_at?: string
          created_by?: string
          evidence_note?: string
          id?: string
          source_version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conflict_evidence_conflict_case_id_fkey"
            columns: ["conflict_case_id"]
            isOneToOne: false
            referencedRelation: "knowledge_conflict_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conflict_evidence_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "source_document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      conflict_items: {
        Row: {
          conflict_case_id: string
          created_at: string
          created_by: string
          id: string
          knowledge_version_id: string
          position_note: string | null
        }
        Insert: {
          conflict_case_id: string
          created_at?: string
          created_by: string
          id?: string
          knowledge_version_id: string
          position_note?: string | null
        }
        Update: {
          conflict_case_id?: string
          created_at?: string
          created_by?: string
          id?: string
          knowledge_version_id?: string
          position_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conflict_items_conflict_case_id_fkey"
            columns: ["conflict_case_id"]
            isOneToOne: false
            referencedRelation: "knowledge_conflict_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conflict_items_knowledge_version_id_fkey"
            columns: ["knowledge_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_record_versions"
            referencedColumns: ["id"]
          },
        ]
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
      form_profiles: {
        Row: {
          created_at: string
          customer_facing: boolean
          form_code: string | null
          id: string
          knowledge_record_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_facing?: boolean
          form_code?: string | null
          id?: string
          knowledge_record_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_facing?: boolean
          form_code?: string | null
          id?: string
          knowledge_record_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_profiles_knowledge_record_id_fkey"
            columns: ["knowledge_record_id"]
            isOneToOne: true
            referencedRelation: "knowledge_records"
            referencedColumns: ["id"]
          },
        ]
      }
      form_versions: {
        Row: {
          created_at: string
          display_file_name: string | null
          download_allowed: boolean
          id: string
          knowledge_version_id: string
          source_version_id: string | null
        }
        Insert: {
          created_at?: string
          display_file_name?: string | null
          download_allowed?: boolean
          id?: string
          knowledge_version_id: string
          source_version_id?: string | null
        }
        Update: {
          created_at?: string
          display_file_name?: string | null
          download_allowed?: boolean
          id?: string
          knowledge_version_id?: string
          source_version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_versions_knowledge_version_id_fkey"
            columns: ["knowledge_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_record_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_versions_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "source_document_versions"
            referencedColumns: ["id"]
          },
        ]
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
      knowledge_conflict_cases: {
        Row: {
          case_key: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          description: string | null
          id: string
          registered_by: string
          reviewed_at: string | null
          reviewed_by: string | null
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          case_key: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          description?: string | null
          id?: string
          registered_by: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          case_key?: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          description?: string | null
          id?: string
          registered_by?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_placements: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string
          display_order: number | null
          id: string
          knowledge_version_id: string
          module_section_id: string | null
          placement_status: string
          platform_module_id: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by: string
          display_order?: number | null
          id?: string
          knowledge_version_id: string
          module_section_id?: string | null
          placement_status?: string
          platform_module_id: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string
          display_order?: number | null
          id?: string
          knowledge_version_id?: string
          module_section_id?: string | null
          placement_status?: string
          platform_module_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_placements_knowledge_version_id_fkey"
            columns: ["knowledge_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_record_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_placements_module_section_id_fkey"
            columns: ["module_section_id"]
            isOneToOne: false
            referencedRelation: "module_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_placements_platform_module_id_fkey"
            columns: ["platform_module_id"]
            isOneToOne: false
            referencedRelation: "platform_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_record_versions: {
        Row: {
          ai_eligible: boolean
          approved_at: string | null
          approved_by: string | null
          assessment_eligible: boolean
          content_hash: string | null
          content_text: string | null
          created_at: string
          created_by: string
          effective_from: string | null
          effective_to: string | null
          id: string
          knowledge_record_id: string
          published_at: string | null
          published_by: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          scenario_eligible: boolean
          structured_data: Json
          summary: string | null
          title: string
          updated_at: string
          version_number: number
          workflow_status: string
        }
        Insert: {
          ai_eligible?: boolean
          approved_at?: string | null
          approved_by?: string | null
          assessment_eligible?: boolean
          content_hash?: string | null
          content_text?: string | null
          created_at?: string
          created_by: string
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          knowledge_record_id: string
          published_at?: string | null
          published_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scenario_eligible?: boolean
          structured_data?: Json
          summary?: string | null
          title: string
          updated_at?: string
          version_number: number
          workflow_status?: string
        }
        Update: {
          ai_eligible?: boolean
          approved_at?: string | null
          approved_by?: string | null
          assessment_eligible?: boolean
          content_hash?: string | null
          content_text?: string | null
          created_at?: string
          created_by?: string
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          knowledge_record_id?: string
          published_at?: string | null
          published_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          scenario_eligible?: boolean
          structured_data?: Json
          summary?: string | null
          title?: string
          updated_at?: string
          version_number?: number
          workflow_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_record_versions_knowledge_record_id_fkey"
            columns: ["knowledge_record_id"]
            isOneToOne: false
            referencedRelation: "knowledge_records"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_records: {
        Row: {
          canonical_key: string
          created_at: string
          created_by: string
          id: string
          is_synthetic: boolean
          knowledge_type: string
          owner_org_unit_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          canonical_key: string
          created_at?: string
          created_by: string
          id?: string
          is_synthetic?: boolean
          knowledge_type: string
          owner_org_unit_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          canonical_key?: string
          created_at?: string
          created_by?: string
          id?: string
          is_synthetic?: boolean
          knowledge_type?: string
          owner_org_unit_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_records_owner_org_unit_id_fkey"
            columns: ["owner_org_unit_id"]
            isOneToOne: false
            referencedRelation: "organisation_units"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_source_links: {
        Row: {
          created_at: string
          created_by: string
          evidence_note: string | null
          id: string
          knowledge_version_id: string
          relationship_type: string
          source_section_id: string | null
          source_version_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          evidence_note?: string | null
          id?: string
          knowledge_version_id: string
          relationship_type: string
          source_section_id?: string | null
          source_version_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          evidence_note?: string | null
          id?: string
          knowledge_version_id?: string
          relationship_type?: string
          source_section_id?: string | null
          source_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_source_links_knowledge_version_id_fkey"
            columns: ["knowledge_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_record_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_source_links_source_section_id_fkey"
            columns: ["source_section_id"]
            isOneToOne: false
            referencedRelation: "source_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_source_links_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "source_document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_version_reviews: {
        Row: {
          created_at: string
          decision: string
          id: string
          knowledge_version_id: string
          notes: string | null
          review_stage: string
          reviewer_id: string
        }
        Insert: {
          created_at?: string
          decision: string
          id?: string
          knowledge_version_id: string
          notes?: string | null
          review_stage: string
          reviewer_id: string
        }
        Update: {
          created_at?: string
          decision?: string
          id?: string
          knowledge_version_id?: string
          notes?: string | null
          review_stage?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_version_reviews_knowledge_version_id_fkey"
            columns: ["knowledge_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_record_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      module_sections: {
        Row: {
          active: boolean
          code: string
          created_at: string
          id: string
          name: string
          platform_module_id: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          id?: string
          name: string
          platform_module_id: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          id?: string
          name?: string
          platform_module_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "module_sections_platform_module_id_fkey"
            columns: ["platform_module_id"]
            isOneToOne: false
            referencedRelation: "platform_modules"
            referencedColumns: ["id"]
          },
        ]
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
      platform_modules: {
        Row: {
          active: boolean
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
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
      position_reporting_rules: {
        Row: {
          child_position_id: string
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean
          manager_position_id: string | null
          metadata: Json
          reporting_family: string
          reporting_tier: number
          updated_at: string
        }
        Insert: {
          child_position_id: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          manager_position_id?: string | null
          metadata?: Json
          reporting_family: string
          reporting_tier: number
          updated_at?: string
        }
        Update: {
          child_position_id?: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          manager_position_id?: string | null
          metadata?: Json
          reporting_family?: string
          reporting_tier?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "position_reporting_rules_child_position_id_fkey"
            columns: ["child_position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "position_reporting_rules_manager_position_id_fkey"
            columns: ["manager_position_id"]
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
      procedure_profiles: {
        Row: {
          created_at: string
          id: string
          knowledge_record_id: string
          owner_org_unit_id: string | null
          primary_system: string | null
          procedure_code: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          knowledge_record_id: string
          owner_org_unit_id?: string | null
          primary_system?: string | null
          procedure_code?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          knowledge_record_id?: string
          owner_org_unit_id?: string | null
          primary_system?: string | null
          procedure_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procedure_profiles_knowledge_record_id_fkey"
            columns: ["knowledge_record_id"]
            isOneToOne: true
            referencedRelation: "knowledge_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedure_profiles_owner_org_unit_id_fkey"
            columns: ["owner_org_unit_id"]
            isOneToOne: false
            referencedRelation: "organisation_units"
            referencedColumns: ["id"]
          },
        ]
      }
      procedure_steps: {
        Row: {
          created_at: string
          expected_outcome: string | null
          id: string
          instruction_text: string
          knowledge_version_id: string
          step_number: number
          title: string | null
          warning_text: string | null
        }
        Insert: {
          created_at?: string
          expected_outcome?: string | null
          id?: string
          instruction_text: string
          knowledge_version_id: string
          step_number: number
          title?: string | null
          warning_text?: string | null
        }
        Update: {
          created_at?: string
          expected_outcome?: string | null
          id?: string
          instruction_text?: string
          knowledge_version_id?: string
          step_number?: number
          title?: string | null
          warning_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "procedure_steps_knowledge_version_id_fkey"
            columns: ["knowledge_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_record_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attribute_versions: {
        Row: {
          attribute_key: string
          attribute_label: string
          created_at: string
          currency: string | null
          id: string
          knowledge_version_id: string
          unit: string | null
          value_text: string | null
        }
        Insert: {
          attribute_key: string
          attribute_label: string
          created_at?: string
          currency?: string | null
          id?: string
          knowledge_version_id: string
          unit?: string | null
          value_text?: string | null
        }
        Update: {
          attribute_key?: string
          attribute_label?: string
          created_at?: string
          currency?: string | null
          id?: string
          knowledge_version_id?: string
          unit?: string | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_versions_knowledge_version_id_fkey"
            columns: ["knowledge_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_record_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      product_availability_periods: {
        Row: {
          available_from: string | null
          available_to: string | null
          channel: string | null
          country_code: string | null
          created_at: string
          id: string
          is_available: boolean
          knowledge_version_id: string
          notes: string | null
        }
        Insert: {
          available_from?: string | null
          available_to?: string | null
          channel?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          is_available?: boolean
          knowledge_version_id: string
          notes?: string | null
        }
        Update: {
          available_from?: string | null
          available_to?: string | null
          channel?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          is_available?: boolean
          knowledge_version_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_availability_periods_knowledge_version_id_fkey"
            columns: ["knowledge_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_record_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      product_profiles: {
        Row: {
          created_at: string
          id: string
          knowledge_record_id: string
          owner_org_unit_id: string | null
          product_category: string | null
          product_code: string | null
          product_family: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          knowledge_record_id: string
          owner_org_unit_id?: string | null
          product_category?: string | null
          product_code?: string | null
          product_family?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          knowledge_record_id?: string
          owner_org_unit_id?: string | null
          product_category?: string | null
          product_code?: string | null
          product_family?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_profiles_knowledge_record_id_fkey"
            columns: ["knowledge_record_id"]
            isOneToOne: true
            referencedRelation: "knowledge_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_profiles_owner_org_unit_id_fkey"
            columns: ["owner_org_unit_id"]
            isOneToOne: false
            referencedRelation: "organisation_units"
            referencedColumns: ["id"]
          },
        ]
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
      publication_assets: {
        Row: {
          asset_kind: string
          byte_size: number | null
          created_at: string
          created_by: string
          id: string
          mime_type: string | null
          original_file_name: string
          publication_id: string
          storage_bucket: string
          storage_object_key: string
        }
        Insert: {
          asset_kind?: string
          byte_size?: number | null
          created_at?: string
          created_by: string
          id?: string
          mime_type?: string | null
          original_file_name: string
          publication_id: string
          storage_bucket: string
          storage_object_key: string
        }
        Update: {
          asset_kind?: string
          byte_size?: number | null
          created_at?: string
          created_by?: string
          id?: string
          mime_type?: string | null
          original_file_name?: string
          publication_id?: string
          storage_bucket?: string
          storage_object_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "publication_assets_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      publication_audience_rules: {
        Row: {
          country_code: string | null
          created_at: string
          created_by: string
          id: string
          include_descendants: boolean
          org_unit_id: string | null
          position_id: string | null
          publication_id: string
          rule_type: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          created_by: string
          id?: string
          include_descendants?: boolean
          org_unit_id?: string | null
          position_id?: string | null
          publication_id: string
          rule_type: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          created_by?: string
          id?: string
          include_descendants?: boolean
          org_unit_id?: string | null
          position_id?: string | null
          publication_id?: string
          rule_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "publication_audience_rules_org_unit_id_fkey"
            columns: ["org_unit_id"]
            isOneToOne: false
            referencedRelation: "organisation_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_audience_rules_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publication_audience_rules_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      publication_receipts: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          id: string
          publication_id: string
          updated_at: string
          user_id: string
          viewed_at: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          id?: string
          publication_id: string
          updated_at?: string
          user_id: string
          viewed_at?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          id?: string
          publication_id?: string
          updated_at?: string
          user_id?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publication_receipts_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          body: string | null
          category: string | null
          created_at: string
          created_by: string
          effective_from: string | null
          effective_to: string | null
          id: string
          metadata: Json
          owner_org_unit_id: string | null
          priority: string
          publication_type: string
          published_at: string | null
          published_by: string | null
          requires_acknowledgement: boolean
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          body?: string | null
          category?: string | null
          created_at?: string
          created_by: string
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          metadata?: Json
          owner_org_unit_id?: string | null
          priority?: string
          publication_type: string
          published_at?: string | null
          published_by?: string | null
          requires_acknowledgement?: boolean
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          body?: string | null
          category?: string | null
          created_at?: string
          created_by?: string
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          metadata?: Json
          owner_org_unit_id?: string | null
          priority?: string
          publication_type?: string
          published_at?: string | null
          published_by?: string | null
          requires_acknowledgement?: boolean
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "publications_owner_org_unit_id_fkey"
            columns: ["owner_org_unit_id"]
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
      service_standards: {
        Row: {
          category: string
          created_at: string
          id: string
          knowledge_version_id: string
          measurement_note: string | null
          standard_text: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          knowledge_version_id: string
          measurement_note?: string | null
          standard_text: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          knowledge_version_id?: string
          measurement_note?: string | null
          standard_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_standards_knowledge_version_id_fkey"
            columns: ["knowledge_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_record_versions"
            referencedColumns: ["id"]
          },
        ]
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
      source_document_versions: {
        Row: {
          byte_size: number | null
          checksum_verification_method: string
          id: string
          metadata: Json
          mime_type: string | null
          original_file_name: string
          sha256: string | null
          source_date: string | null
          source_document_id: string
          storage_bucket: string
          storage_object_key: string
          uploaded_at: string
          uploaded_by: string
          version_label: string | null
          version_number: number
        }
        Insert: {
          byte_size?: number | null
          checksum_verification_method?: string
          id?: string
          metadata?: Json
          mime_type?: string | null
          original_file_name: string
          sha256?: string | null
          source_date?: string | null
          source_document_id: string
          storage_bucket?: string
          storage_object_key: string
          uploaded_at?: string
          uploaded_by: string
          version_label?: string | null
          version_number: number
        }
        Update: {
          byte_size?: number | null
          checksum_verification_method?: string
          id?: string
          metadata?: Json
          mime_type?: string | null
          original_file_name?: string
          sha256?: string | null
          source_date?: string | null
          source_document_id?: string
          storage_bucket?: string
          storage_object_key?: string
          uploaded_at?: string
          uploaded_by?: string
          version_label?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "source_document_versions_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "source_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      source_documents: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          confidentiality: string
          created_at: string
          description: string | null
          id: string
          is_synthetic: boolean
          parsing_status: string
          received_at: string
          registered_by: string
          requires_redaction: boolean
          source_date: string | null
          source_key: string
          source_owner_name: string | null
          source_owner_org_unit_id: string | null
          source_type: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          confidentiality?: string
          created_at?: string
          description?: string | null
          id?: string
          is_synthetic?: boolean
          parsing_status?: string
          received_at?: string
          registered_by: string
          requires_redaction?: boolean
          source_date?: string | null
          source_key: string
          source_owner_name?: string | null
          source_owner_org_unit_id?: string | null
          source_type: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          confidentiality?: string
          created_at?: string
          description?: string | null
          id?: string
          is_synthetic?: boolean
          parsing_status?: string
          received_at?: string
          registered_by?: string
          requires_redaction?: boolean
          source_date?: string | null
          source_key?: string
          source_owner_name?: string | null
          source_owner_org_unit_id?: string | null
          source_type?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_documents_source_owner_org_unit_id_fkey"
            columns: ["source_owner_org_unit_id"]
            isOneToOne: false
            referencedRelation: "organisation_units"
            referencedColumns: ["id"]
          },
        ]
      }
      source_duplicate_groups: {
        Row: {
          created_at: string
          created_by: string | null
          duplicate_type: string
          id: string
          notes: string | null
          preferred_source_version_id: string | null
          reason: string | null
          resolved_at: string | null
          resolved_by: string | null
          signature: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          duplicate_type: string
          id?: string
          notes?: string | null
          preferred_source_version_id?: string | null
          reason?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          signature?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          duplicate_type?: string
          id?: string
          notes?: string | null
          preferred_source_version_id?: string | null
          reason?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          signature?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_duplicate_groups_preferred_source_version_id_fkey"
            columns: ["preferred_source_version_id"]
            isOneToOne: false
            referencedRelation: "source_document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      source_duplicate_members: {
        Row: {
          created_at: string
          evidence_note: string | null
          group_id: string
          id: string
          similarity_score: number | null
          source_version_id: string
        }
        Insert: {
          created_at?: string
          evidence_note?: string | null
          group_id: string
          id?: string
          similarity_score?: number | null
          source_version_id: string
        }
        Update: {
          created_at?: string
          evidence_note?: string | null
          group_id?: string
          id?: string
          similarity_score?: number | null
          source_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_duplicate_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "source_duplicate_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_duplicate_members_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "source_document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      source_redactions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          id: string
          is_required: boolean
          page_number: number | null
          proposed_at: string
          proposed_by: string
          reason: string
          redaction_type: string
          replacement_text: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          source_section_id: string | null
          source_version_id: string
          status: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          id?: string
          is_required?: boolean
          page_number?: number | null
          proposed_at?: string
          proposed_by: string
          reason: string
          redaction_type: string
          replacement_text?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_section_id?: string | null
          source_version_id: string
          status?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          id?: string
          is_required?: boolean
          page_number?: number | null
          proposed_at?: string
          proposed_by?: string
          reason?: string
          redaction_type?: string
          replacement_text?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_section_id?: string | null
          source_version_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_redactions_source_section_id_fkey"
            columns: ["source_section_id"]
            isOneToOne: false
            referencedRelation: "source_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_redactions_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "source_document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      source_registration_reviews: {
        Row: {
          created_at: string
          decision: string
          id: string
          notes: string | null
          review_stage: string
          reviewer_id: string
          source_document_id: string
        }
        Insert: {
          created_at?: string
          decision: string
          id?: string
          notes?: string | null
          review_stage: string
          reviewer_id: string
          source_document_id: string
        }
        Update: {
          created_at?: string
          decision?: string
          id?: string
          notes?: string | null
          review_stage?: string
          reviewer_id?: string
          source_document_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_registration_reviews_source_document_id_fkey"
            columns: ["source_document_id"]
            isOneToOne: false
            referencedRelation: "source_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      source_sections: {
        Row: {
          contains_sensitive_data: boolean
          content_text: string | null
          created_at: string
          heading: string | null
          id: string
          page_number: number | null
          section_hash: string | null
          section_order: number
          source_version_id: string
        }
        Insert: {
          contains_sensitive_data?: boolean
          content_text?: string | null
          created_at?: string
          heading?: string | null
          id?: string
          page_number?: number | null
          section_hash?: string | null
          section_order: number
          source_version_id: string
        }
        Update: {
          contains_sensitive_data?: boolean
          content_text?: string | null
          created_at?: string
          heading?: string | null
          id?: string
          page_number?: number | null
          section_hash?: string | null
          section_order?: number
          source_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_sections_source_version_id_fkey"
            columns: ["source_version_id"]
            isOneToOne: false
            referencedRelation: "source_document_versions"
            referencedColumns: ["id"]
          },
        ]
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
      suggestion_reviews: {
        Row: {
          created_at: string
          decision: string
          id: string
          notes: string | null
          reviewer_id: string
          suggestion_id: string
        }
        Insert: {
          created_at?: string
          decision: string
          id?: string
          notes?: string | null
          reviewer_id: string
          suggestion_id: string
        }
        Update: {
          created_at?: string
          decision?: string
          id?: string
          notes?: string | null
          reviewer_id?: string
          suggestion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_reviews_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
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
      supersession_links: {
        Row: {
          conflict_case_id: string | null
          created_at: string
          created_by: string
          effective_from: string
          id: string
          note: string | null
          replacement_version_id: string
          superseded_version_id: string
        }
        Insert: {
          conflict_case_id?: string | null
          created_at?: string
          created_by: string
          effective_from?: string
          id?: string
          note?: string | null
          replacement_version_id: string
          superseded_version_id: string
        }
        Update: {
          conflict_case_id?: string | null
          created_at?: string
          created_by?: string
          effective_from?: string
          id?: string
          note?: string | null
          replacement_version_id?: string
          superseded_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supersession_links_conflict_case_id_fkey"
            columns: ["conflict_case_id"]
            isOneToOne: false
            referencedRelation: "knowledge_conflict_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supersession_links_replacement_version_id_fkey"
            columns: ["replacement_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_record_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supersession_links_superseded_version_id_fkey"
            columns: ["superseded_version_id"]
            isOneToOne: false
            referencedRelation: "knowledge_record_versions"
            referencedColumns: ["id"]
          },
        ]
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
          is_demo: boolean
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
          is_demo?: boolean
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
          is_demo?: boolean
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
      can_manage_publication: {
        Args: { _pub: string; _user: string }
        Returns: boolean
      }
      can_view_knowledge_version: {
        Args: { _user: string; _version: string }
        Returns: boolean
      }
      can_view_profile: { Args: { _target_user: string }; Returns: boolean }
      can_view_publication: {
        Args: { _pub: string; _user: string }
        Returns: boolean
      }
      capability_in_scope: {
        Args: { _code: string; _org_unit: string; _user: string }
        Returns: boolean
      }
      has_any_knowledge_capability: {
        Args: { _codes: string[]; _user_id: string }
        Returns: boolean
      }
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
      helper_actor_allowed: { Args: { _user: string }; Returns: boolean }
      knowledge_placement_audience_matches: {
        Args: { _placement: string; _user: string }
        Returns: boolean
      }
      knowledge_version_serviceable: {
        Args: { _version: string }
        Returns: boolean
      }
      org_unit_and_descendants: {
        Args: { _root: string }
        Returns: {
          unit_id: string
        }[]
      }
      publication_audience_matches: {
        Args: { _pub: string; _user: string }
        Returns: boolean
      }
      publication_is_current: { Args: { _pub: string }; Returns: boolean }
      user_country: { Args: { _user: string }; Returns: string }
      user_is_enterprise: { Args: { _user: string }; Returns: boolean }
      user_position_code: { Args: { _user: string }; Returns: string }
      user_primary_org_unit: { Args: { _user: string }; Returns: string }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
