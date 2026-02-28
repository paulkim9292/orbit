export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          image: string;
          event_date: string;
          upload_date: string;
          district: string;
          people: number;
          views: number;
          rewards: number | null;
          featured: boolean;
          category: string | null;
          subcategory: string | null;
          gender: string | null;
          age_from: number | null;
          age_to: number | null;
          time_from: string | null;
          time_to: string | null;
          location: string | null;
          max_people: number | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          image?: string;
          event_date: string;
          upload_date?: string;
          district: string;
          people?: number;
          views?: number;
          rewards?: number | null;
          featured?: boolean;
          category?: string | null;
          subcategory?: string | null;
          gender?: string | null;
          age_from?: number | null;
          age_to?: number | null;
          time_from?: string | null;
          time_to?: string | null;
          location?: string | null;
          max_people?: number | null;
          description?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          image?: string;
          event_date?: string;
          upload_date?: string;
          district?: string;
          people?: number;
          views?: number;
          rewards?: number | null;
          featured?: boolean;
          category?: string | null;
          subcategory?: string | null;
          gender?: string | null;
          age_from?: number | null;
          age_to?: number | null;
          time_from?: string | null;
          time_to?: string | null;
          location?: string | null;
          max_people?: number | null;
          description?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
