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
      articles: {
        Row: {
          id: string
          created_at: string
          url: string
          title: string
          content: string
          excerpt: string | null
          reading_time: number
          user_id: string
          folder_id: string | null
          read_progress: number
        }
        Insert: {
          id?: string
          created_at?: string
          url: string
          title: string
          content: string
          excerpt?: string | null
          reading_time: number
          user_id: string
          folder_id?: string | null
          read_progress?: number
        }
        Update: {
          id?: string
          created_at?: string
          url?: string
          title?: string
          content?: string
          excerpt?: string | null
          reading_time?: number
          user_id?: string
          folder_id?: string | null
          read_progress?: number
        }
      }
      folders: {
        Row: {
          id: string
          created_at: string
          name: string
          user_id: string
          parent_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          user_id: string
          parent_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          user_id?: string
          parent_id?: string | null
        }
      }
      highlights: {
        Row: {
          id: string
          created_at: string
          article_id: string
          user_id: string
          content: string
          color: string
          note: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          article_id: string
          user_id: string
          content: string
          color: string
          note?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          article_id?: string
          user_id?: string
          content?: string
          color?: string
          note?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          created_at: string
          name: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          user_id?: string
        }
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
      }
    }
  }
}