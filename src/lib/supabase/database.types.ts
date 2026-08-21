export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.15';
  };
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          email: string;
        };
        Insert: {
          created_at?: string;
          email: string;
        };
        Update: {
          created_at?: string;
          email?: string;
        };
        Relationships: [];
      };
      post_views: {
        Row: {
          created_at: string;
          fingerprint: string;
          id: number;
          post_id: string;
          viewed_on: string;
        };
        Insert: {
          created_at?: string;
          fingerprint: string;
          id?: number;
          post_id: string;
          viewed_on?: string;
        };
        Update: {
          created_at?: string;
          fingerprint?: string;
          id?: number;
          post_id?: string;
          viewed_on?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'post_views_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
        ];
      };
      posts: {
        Row: {
          content: string;
          cover_image: string | null;
          created_at: string;
          id: string;
          published_at: string | null;
          reading_minutes: number;
          search_vector: unknown;
          slug: string;
          status: Database['public']['Enums']['content_status'];
          summary: string;
          tags: string[];
          title: string;
          updated_at: string;
          view_count: number;
        };
        Insert: {
          content?: string;
          cover_image?: string | null;
          created_at?: string;
          id?: string;
          published_at?: string | null;
          reading_minutes?: number;
          search_vector?: unknown;
          slug: string;
          status?: Database['public']['Enums']['content_status'];
          summary?: string;
          tags?: string[];
          title: string;
          updated_at?: string;
          view_count?: number;
        };
        Update: {
          content?: string;
          cover_image?: string | null;
          created_at?: string;
          id?: string;
          published_at?: string | null;
          reading_minutes?: number;
          search_vector?: unknown;
          slug?: string;
          status?: Database['public']['Enums']['content_status'];
          summary?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
          view_count?: number;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          content: string;
          cover_image: string | null;
          created_at: string;
          featured: boolean;
          id: string;
          live_url: string | null;
          repo_url: string | null;
          slug: string;
          sort_order: number;
          status: Database['public']['Enums']['content_status'];
          summary: string;
          tech: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          content?: string;
          cover_image?: string | null;
          created_at?: string;
          featured?: boolean;
          id?: string;
          live_url?: string | null;
          repo_url?: string | null;
          slug: string;
          sort_order?: number;
          status?: Database['public']['Enums']['content_status'];
          summary?: string;
          tech?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          cover_image?: string | null;
          created_at?: string;
          featured?: boolean;
          id?: string;
          live_url?: string | null;
          repo_url?: string | null;
          slug?: string;
          sort_order?: number;
          status?: Database['public']['Enums']['content_status'];
          summary?: string;
          tech?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reactions: {
        Row: {
          created_at: string;
          fingerprint: string;
          id: number;
          post_id: string;
          type: Database['public']['Enums']['reaction_type'];
        };
        Insert: {
          created_at?: string;
          fingerprint: string;
          id?: number;
          post_id: string;
          type: Database['public']['Enums']['reaction_type'];
        };
        Update: {
          created_at?: string;
          fingerprint?: string;
          id?: number;
          post_id?: string;
          type?: Database['public']['Enums']['reaction_type'];
        };
        Relationships: [
          {
            foreignKeyName: 'reactions_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'posts';
            referencedColumns: ['id'];
          },
        ];
      };
      subscribers: {
        Row: {
          confirm_token: string;
          confirmed_at: string | null;
          created_at: string;
          email: string;
          id: string;
        };
        Insert: {
          confirm_token?: string;
          confirmed_at?: string | null;
          created_at?: string;
          email: string;
          id?: string;
        };
        Update: {
          confirm_token?: string;
          confirmed_at?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_view: {
        Args: { p_fingerprint: string; p_slug: string };
        Returns: number;
      };
      is_admin: { Args: never; Returns: boolean };
      search_posts: {
        Args: { p_limit?: number; p_query: string };
        Returns: {
          published_at: string;
          rank: number;
          slug: string;
          summary: string;
          title: string;
        }[];
      };
      show_limit: { Args: never; Returns: number };
      show_trgm: { Args: { '': string }; Returns: string[] };
      toggle_reaction: {
        Args: {
          p_fingerprint: string;
          p_slug: string;
          p_type: Database['public']['Enums']['reaction_type'];
        };
        Returns: Json;
      };
    };
    Enums: {
      content_status: 'draft' | 'published';
      reaction_type: 'like' | 'insightful';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      content_status: ['draft', 'published'],
      reaction_type: ['like', 'insightful'],
    },
  },
} as const;
