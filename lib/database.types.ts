export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clanarine_clanova: {
        Row: {
          id: string
          clan_id: string
          tip_clanarine_id: string
          cijena: number
          pocetak: string | null
          zavrsetak: string | null
          status: string
        }
        Insert: {
          id?: string
          clan_id: string
          tip_clanarine_id: string
          cijena: number
          pocetak?: string | null
          zavrsetak?: string | null
          status?: string
        }
        Update: {
          id?: string
          clan_id?: string
          tip_clanarine_id?: string
          cijena?: number
          pocetak?: string | null
          zavrsetak?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "clanarine_clanova_clan_id_fkey"
            columns: ["clan_id"]
            referencedRelation: "clanovi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clanarine_clanova_tip_clanarine_id_fkey"
            columns: ["tip_clanarine_id"]
            referencedRelation: "tipovi_clanarina"
            referencedColumns: ["id"]
          }
        ]
      }
      clanovi: {
        Row: {
          id: string
          clan_kod: string
          ime_prezime: string
          telefon: string | null
          email: string | null
          napravljeno: string
          status: string
          role: string
          napomena: string | null
        }
        Insert: {
          id?: string
          clan_kod: string
          ime_prezime: string
          telefon?: string | null
          email?: string | null
          napravljeno?: string
          status?: string
          role?: string
          napomena?: string | null
        }
        Update: {
          id?: string
          clan_kod?: string
          ime_prezime?: string
          telefon?: string | null
          email?: string | null
          napravljeno?: string
          status?: string
          role?: string
          napomena?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tipovi_clanarina: {
        Row: {
          id: string
          naziv: string
          trajanje_dana: number
          cijena_default: number
        }
        Insert: {
          id?: string
          naziv: string
          trajanje_dana: number
          cijena_default: number
        }
        Update: {
          id?: string
          naziv?: string
          trajanje_dana?: number
          cijena_default?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string | null
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
  }
}

// Helper types for easier usage
export type Clan = Database['public']['Tables']['clanovi']['Row']
export type Clanarina = Database['public']['Tables']['clanarine_clanova']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type TipClanarine = Database['public']['Tables']['tipovi_clanarina']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

