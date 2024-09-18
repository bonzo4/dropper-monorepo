export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      _user_quests: {
        Row: {
          created_at: string
          quest_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          quest_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          quest_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public__user_quests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      _user_roles: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["roles"]
          user_id: string
        }
        Insert: {
          created_at?: string
          role: Database["public"]["Enums"]["roles"]
          user_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["roles"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      access_codes: {
        Row: {
          code: string
          created_at: string
          id: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      airdrop_about_sections: {
        Row: {
          airdrop_id: number
          created_at: string
          description: string
          id: number
          order: number
        }
        Insert: {
          airdrop_id: number
          created_at?: string
          description: string
          id?: number
          order: number
        }
        Update: {
          airdrop_id?: number
          created_at?: string
          description?: string
          id?: number
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "about_section_drop_id_fkey"
            columns: ["airdrop_id"]
            isOneToOne: false
            referencedRelation: "airdrops"
            referencedColumns: ["id"]
          },
        ]
      }
      airdrop_banners: {
        Row: {
          created_at: string
          description: string | null
          drop_url: string | null
          drop_url_text: string | null
          enabled: boolean
          id: number
          image_url: string
          order: number
          out_url: string | null
          out_url_text: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          drop_url?: string | null
          drop_url_text?: string | null
          enabled?: boolean
          id?: number
          image_url: string
          order: number
          out_url?: string | null
          out_url_text?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          drop_url?: string | null
          drop_url_text?: string | null
          enabled?: boolean
          id?: number
          image_url?: string
          order?: number
          out_url?: string | null
          out_url_text?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banners_drop_url_fkey"
            columns: ["drop_url"]
            isOneToOne: false
            referencedRelation: "airdrops"
            referencedColumns: ["slug"]
          },
        ]
      }
      airdrop_comments: {
        Row: {
          airdrop_id: number
          comment: string | null
          created_at: string
          down_votes: number
          id: number
          up_votes: number
          user_id: string | null
        }
        Insert: {
          airdrop_id: number
          comment?: string | null
          created_at?: string
          down_votes?: number
          id?: number
          up_votes?: number
          user_id?: string | null
        }
        Update: {
          airdrop_id?: number
          comment?: string | null
          created_at?: string
          down_votes?: number
          id?: number
          up_votes?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drop_comments_drop_id_fkey"
            columns: ["airdrop_id"]
            isOneToOne: false
            referencedRelation: "airdrops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drop_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      airdrop_community_posts: {
        Row: {
          created_at: string
          id: number
          order: number
          section_id: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          order: number
          section_id: number
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          order?: number
          section_id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "airdrop_community_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      airdrop_community_sections: {
        Row: {
          airdrop_id: number
          created_at: string
          id: number
          order: number
        }
        Insert: {
          airdrop_id: number
          created_at?: string
          id?: number
          order: number
        }
        Update: {
          airdrop_id?: number
          created_at?: string
          id?: number
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "community_sections_drop_id_fkey"
            columns: ["airdrop_id"]
            isOneToOne: false
            referencedRelation: "airdrops"
            referencedColumns: ["id"]
          },
        ]
      }
      airdrop_quest_items: {
        Row: {
          created_at: string
          id: number
          name: string
          order: number
          quest_id: number
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          order: number
          quest_id: number
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          order?: number
          quest_id?: number
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quest_items_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "airdrop_quests"
            referencedColumns: ["id"]
          },
        ]
      }
      airdrop_quest_sections: {
        Row: {
          airdrop_id: number
          created_at: string
          id: number
          order: number
        }
        Insert: {
          airdrop_id: number
          created_at?: string
          id?: number
          order: number
        }
        Update: {
          airdrop_id?: number
          created_at?: string
          id?: number
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "quest_sections_drop_id_fkey"
            columns: ["airdrop_id"]
            isOneToOne: false
            referencedRelation: "airdrops"
            referencedColumns: ["id"]
          },
        ]
      }
      airdrop_quests: {
        Row: {
          created_at: string
          exp_reward: number
          id: number
          order: number
          section_id: number
          title: string
        }
        Insert: {
          created_at?: string
          exp_reward?: number
          id?: number
          order: number
          section_id: number
          title: string
        }
        Update: {
          created_at?: string
          exp_reward?: number
          id?: number
          order?: number
          section_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quests_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "airdrop_quest_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      airdrop_team_members: {
        Row: {
          created_at: string
          id: number
          image_url: string
          linkedin_url: string | null
          name: string
          order: number
          role: string
          section_id: number
          telegram_url: string | null
          twitter_url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          image_url: string
          linkedin_url?: string | null
          name: string
          order: number
          role: string
          section_id: number
          telegram_url?: string | null
          twitter_url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string
          linkedin_url?: string | null
          name?: string
          order?: number
          role?: string
          section_id?: number
          telegram_url?: string | null
          twitter_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drop_team_members_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "airdrop_about_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      airdrops: {
        Row: {
          banner_url: string
          blockchain: string
          category: string
          created_at: string
          description: string
          difficulty: string
          discord_url: string | null
          docs_url: string | null
          est_airdrop_size: number
          icon_url: string
          id: number
          is_featured: boolean
          is_published: boolean
          likelihood: number
          questers: number
          sentiment: number
          site_url: string | null
          slug: string
          symbol: string
          telegram_url: string | null
          title: string
          twitter_url: string | null
        }
        Insert: {
          banner_url: string
          blockchain: string
          category?: string
          created_at?: string
          description?: string
          difficulty: string
          discord_url?: string | null
          docs_url?: string | null
          est_airdrop_size: number
          icon_url: string
          id?: number
          is_featured?: boolean
          is_published?: boolean
          likelihood: number
          questers?: number
          sentiment?: number
          site_url?: string | null
          slug: string
          symbol: string
          telegram_url?: string | null
          title: string
          twitter_url?: string | null
        }
        Update: {
          banner_url?: string
          blockchain?: string
          category?: string
          created_at?: string
          description?: string
          difficulty?: string
          discord_url?: string | null
          docs_url?: string | null
          est_airdrop_size?: number
          icon_url?: string
          id?: number
          is_featured?: boolean
          is_published?: boolean
          likelihood?: number
          questers?: number
          sentiment?: number
          site_url?: string | null
          slug?: string
          symbol?: string
          telegram_url?: string | null
          title?: string
          twitter_url?: string | null
        }
        Relationships: []
      }
      back_gear: {
        Row: {
          acceleration: boolean | null
          acrobatics: number | null
          aerodynamics: number | null
          capacity: number | null
          created_at: string
          id: number
          image: string
          is_exclusive: boolean
          name: string
          rarity: Database["public"]["Enums"]["rarities"]
          speed: number | null
        }
        Insert: {
          acceleration?: boolean | null
          acrobatics?: number | null
          aerodynamics?: number | null
          capacity?: number | null
          created_at?: string
          id?: number
          image: string
          is_exclusive: boolean
          name: string
          rarity: Database["public"]["Enums"]["rarities"]
          speed?: number | null
        }
        Update: {
          acceleration?: boolean | null
          acrobatics?: number | null
          aerodynamics?: number | null
          capacity?: number | null
          created_at?: string
          id?: number
          image?: string
          is_exclusive?: boolean
          name?: string
          rarity?: Database["public"]["Enums"]["rarities"]
          speed?: number | null
        }
        Relationships: []
      }
      chest_gear: {
        Row: {
          acceleration: boolean | null
          acrobatics: number | null
          aerodynamics: number | null
          capacity: number | null
          created_at: string
          id: number
          image: string
          is_exclusive: boolean
          name: string
          rarity: Database["public"]["Enums"]["rarities"]
          speed: number | null
        }
        Insert: {
          acceleration?: boolean | null
          acrobatics?: number | null
          aerodynamics?: number | null
          capacity?: number | null
          created_at?: string
          id?: number
          image: string
          is_exclusive: boolean
          name: string
          rarity: Database["public"]["Enums"]["rarities"]
          speed?: number | null
        }
        Update: {
          acceleration?: boolean | null
          acrobatics?: number | null
          aerodynamics?: number | null
          capacity?: number | null
          created_at?: string
          id?: number
          image?: string
          is_exclusive?: boolean
          name?: string
          rarity?: Database["public"]["Enums"]["rarities"]
          speed?: number | null
        }
        Relationships: []
      }
      direct_referrals: {
        Row: {
          created_at: string
          referrer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          referrer_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          referrer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_referrals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      discord_accounts: {
        Row: {
          created_at: string
          discord_id: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          discord_id: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          discord_id?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "discord_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      drop_rate_configs: {
        Row: {
          acceleration_rate: number
          accrobatics_rate: number
          aerodynamics_rate: number
          capacity_rate: number
          created_at: string
          general_rate: number
          id: number
          is_active: boolean
          speed_rate: number
        }
        Insert: {
          acceleration_rate: number
          accrobatics_rate: number
          aerodynamics_rate: number
          capacity_rate: number
          created_at?: string
          general_rate: number
          id?: number
          is_active?: boolean
          speed_rate: number
        }
        Update: {
          acceleration_rate?: number
          accrobatics_rate?: number
          aerodynamics_rate?: number
          capacity_rate?: number
          created_at?: string
          general_rate?: number
          id?: number
          is_active?: boolean
          speed_rate?: number
        }
        Relationships: []
      }
      dropman_gear: {
        Row: {
          back_id: number | null
          chest_id: number | null
          created_at: string
          feet_id: number | null
          head_id: number | null
          legs_id: number | null
          user_id: string
        }
        Insert: {
          back_id?: number | null
          chest_id?: number | null
          created_at?: string
          feet_id?: number | null
          head_id?: number | null
          legs_id?: number | null
          user_id: string
        }
        Update: {
          back_id?: number | null
          chest_id?: number | null
          created_at?: string
          feet_id?: number | null
          head_id?: number | null
          legs_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dropman_gear_back_id_fkey"
            columns: ["back_id"]
            isOneToOne: false
            referencedRelation: "back_gear"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dropman_gear_chest_id_fkey"
            columns: ["chest_id"]
            isOneToOne: false
            referencedRelation: "chest_gear"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dropman_gear_feet_id_fkey"
            columns: ["feet_id"]
            isOneToOne: false
            referencedRelation: "feet_gear"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dropman_gear_head_id_fkey"
            columns: ["head_id"]
            isOneToOne: false
            referencedRelation: "head_gear"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dropman_gear_legs_id_fkey"
            columns: ["legs_id"]
            isOneToOne: false
            referencedRelation: "leg_gear"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dropman_gear_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dropman_stats: {
        Row: {
          acceleration: number
          acrobatics: number
          aerodynamics: number
          capacity: number
          created_at: string
          exp_points: number
          speed: number
          user_id: string
        }
        Insert: {
          acceleration?: number
          acrobatics?: number
          aerodynamics?: number
          capacity?: number
          created_at?: string
          exp_points?: number
          speed?: number
          user_id: string
        }
        Update: {
          acceleration?: number
          acrobatics?: number
          aerodynamics?: number
          capacity?: number
          created_at?: string
          exp_points?: number
          speed?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dropman_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dropmans: {
        Row: {
          claim_points: number
          created_at: string
          drop_points: number
          exp_points: number
          has_claimed: boolean
          icon: string
          referral_id: string
          user_id: string
          username: string
        }
        Insert: {
          claim_points?: number
          created_at?: string
          drop_points?: number
          exp_points?: number
          has_claimed?: boolean
          icon?: string
          referral_id?: string
          user_id: string
          username: string
        }
        Update: {
          claim_points?: number
          created_at?: string
          drop_points?: number
          exp_points?: number
          has_claimed?: boolean
          icon?: string
          referral_id?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_dropmans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feet_gear: {
        Row: {
          acceleration: boolean | null
          acrobatics: number | null
          aerodynamics: number | null
          capacity: number | null
          created_at: string
          id: number
          image: string
          is_exclusive: boolean
          name: string
          rarity: Database["public"]["Enums"]["rarities"]
          speed: number | null
        }
        Insert: {
          acceleration?: boolean | null
          acrobatics?: number | null
          aerodynamics?: number | null
          capacity?: number | null
          created_at?: string
          id?: number
          image: string
          is_exclusive: boolean
          name: string
          rarity: Database["public"]["Enums"]["rarities"]
          speed?: number | null
        }
        Update: {
          acceleration?: boolean | null
          acrobatics?: number | null
          aerodynamics?: number | null
          capacity?: number | null
          created_at?: string
          id?: number
          image?: string
          is_exclusive?: boolean
          name?: string
          rarity?: Database["public"]["Enums"]["rarities"]
          speed?: number | null
        }
        Relationships: []
      }
      giveaway_banners: {
        Row: {
          created_at: string
          enabled: boolean
          giveaway_id: number | null
          id: number
          image_url: string
          order: number
          out_url: string | null
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          giveaway_id?: number | null
          id?: number
          image_url: string
          order: number
          out_url?: string | null
        }
        Update: {
          created_at?: string
          enabled?: boolean
          giveaway_id?: number | null
          id?: number
          image_url?: string
          order?: number
          out_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "giveaway_banners_giveaway_id_fkey"
            columns: ["giveaway_id"]
            isOneToOne: false
            referencedRelation: "giveaways"
            referencedColumns: ["id"]
          },
        ]
      }
      giveaway_entries: {
        Row: {
          created_at: string
          giveaway_id: number
          user_id: string
          wallet_key: string
        }
        Insert: {
          created_at?: string
          giveaway_id: number
          user_id: string
          wallet_key: string
        }
        Update: {
          created_at?: string
          giveaway_id?: number
          user_id?: string
          wallet_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "giveaway_entries_giveaway_id_fkey"
            columns: ["giveaway_id"]
            isOneToOne: false
            referencedRelation: "giveaways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "giveaway_entries_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      giveaway_requirements: {
        Row: {
          created_at: string
          degenpumpfun_url: string | null
          dexscreener_url: string | null
          discord_url: string | null
          giveaway_id: number
          moonshot_url: string | null
          pumpdotfun_url: string | null
          telegram_url: string | null
          tweet_url: string | null
          twitter_url: string | null
        }
        Insert: {
          created_at?: string
          degenpumpfun_url?: string | null
          dexscreener_url?: string | null
          discord_url?: string | null
          giveaway_id: number
          moonshot_url?: string | null
          pumpdotfun_url?: string | null
          telegram_url?: string | null
          tweet_url?: string | null
          twitter_url?: string | null
        }
        Update: {
          created_at?: string
          degenpumpfun_url?: string | null
          dexscreener_url?: string | null
          discord_url?: string | null
          giveaway_id?: number
          moonshot_url?: string | null
          pumpdotfun_url?: string | null
          telegram_url?: string | null
          tweet_url?: string | null
          twitter_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "giveaway_requirements_giveaway_id_fkey"
            columns: ["giveaway_id"]
            isOneToOne: true
            referencedRelation: "giveaways"
            referencedColumns: ["id"]
          },
        ]
      }
      giveaway_winners: {
        Row: {
          created_at: string
          giveaway_id: number
          has_claimed: boolean
          reward_amount: number
          user_id: string
          wallet_key: string
        }
        Insert: {
          created_at?: string
          giveaway_id: number
          has_claimed?: boolean
          reward_amount: number
          user_id: string
          wallet_key: string
        }
        Update: {
          created_at?: string
          giveaway_id?: number
          has_claimed?: boolean
          reward_amount?: number
          user_id?: string
          wallet_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "giveaway_winners_giveaway_id_fkey"
            columns: ["giveaway_id"]
            isOneToOne: false
            referencedRelation: "giveaways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "giveaway_winners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      giveaways: {
        Row: {
          badges: Database["public"]["Enums"]["giveaway_badges"][]
          created_at: string
          creator_key: string
          description: string
          end_time: string
          entries: number
          icon_url: string
          id: number
          reward_amount: number
          rug_score: number | null
          set_winners_tx: string | null
          start_time: string
          ticker: string
          title: string
          token_address: string | null
          tx_string: string | null
          usd_value: number
          user_id: string | null
          winner_amount: number
        }
        Insert: {
          badges?: Database["public"]["Enums"]["giveaway_badges"][]
          created_at?: string
          creator_key?: string
          description: string
          end_time: string
          entries?: number
          icon_url: string
          id?: number
          reward_amount: number
          rug_score?: number | null
          set_winners_tx?: string | null
          start_time: string
          ticker: string
          title: string
          token_address?: string | null
          tx_string?: string | null
          usd_value: number
          user_id?: string | null
          winner_amount: number
        }
        Update: {
          badges?: Database["public"]["Enums"]["giveaway_badges"][]
          created_at?: string
          creator_key?: string
          description?: string
          end_time?: string
          entries?: number
          icon_url?: string
          id?: number
          reward_amount?: number
          rug_score?: number | null
          set_winners_tx?: string | null
          start_time?: string
          ticker?: string
          title?: string
          token_address?: string | null
          tx_string?: string | null
          usd_value?: number
          user_id?: string | null
          winner_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "giveaways_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      head_gear: {
        Row: {
          acceleration: boolean | null
          acrobatics: number | null
          aerodynamics: number | null
          capacity: number | null
          created_at: string
          id: number
          image: string
          is_exclusive: boolean
          name: string
          rarity: Database["public"]["Enums"]["rarities"]
          speed: number | null
        }
        Insert: {
          acceleration?: boolean | null
          acrobatics?: number | null
          aerodynamics?: number | null
          capacity?: number | null
          created_at?: string
          id?: number
          image: string
          is_exclusive: boolean
          name: string
          rarity: Database["public"]["Enums"]["rarities"]
          speed?: number | null
        }
        Update: {
          acceleration?: boolean | null
          acrobatics?: number | null
          aerodynamics?: number | null
          capacity?: number | null
          created_at?: string
          id?: number
          image?: string
          is_exclusive?: boolean
          name?: string
          rarity?: Database["public"]["Enums"]["rarities"]
          speed?: number | null
        }
        Relationships: []
      }
      items: {
        Row: {
          capacity: number
          created_at: string
          dexterity: number
          id: number
          image: string
          is_exclusive: boolean
          name: string
          oppurtunity: number
          perception: number
          rarity: Database["public"]["Enums"]["rarities"]
          rizz: number
        }
        Insert: {
          capacity: number
          created_at?: string
          dexterity: number
          id?: number
          image: string
          is_exclusive: boolean
          name: string
          oppurtunity: number
          perception: number
          rarity: Database["public"]["Enums"]["rarities"]
          rizz: number
        }
        Update: {
          capacity?: number
          created_at?: string
          dexterity?: number
          id?: number
          image?: string
          is_exclusive?: boolean
          name?: string
          oppurtunity?: number
          perception?: number
          rarity?: Database["public"]["Enums"]["rarities"]
          rizz?: number
        }
        Relationships: []
      }
      leg_gear: {
        Row: {
          acceleration: boolean | null
          acrobatics: number | null
          aerodynamics: number | null
          capacity: number | null
          created_at: string
          id: number
          image: string
          is_exclusive: boolean
          name: string
          rarity: Database["public"]["Enums"]["rarities"]
          speed: number | null
        }
        Insert: {
          acceleration?: boolean | null
          acrobatics?: number | null
          aerodynamics?: number | null
          capacity?: number | null
          created_at?: string
          id?: number
          image: string
          is_exclusive: boolean
          name: string
          rarity: Database["public"]["Enums"]["rarities"]
          speed?: number | null
        }
        Update: {
          acceleration?: boolean | null
          acrobatics?: number | null
          aerodynamics?: number | null
          capacity?: number | null
          created_at?: string
          id?: number
          image?: string
          is_exclusive?: boolean
          name?: string
          rarity?: Database["public"]["Enums"]["rarities"]
          speed?: number | null
        }
        Relationships: []
      }
      listing_banners: {
        Row: {
          created_at: string
          enabled: boolean
          id: number
          image_url: string
          listing_id: number | null
          order: number
          out_url: string | null
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: number
          image_url: string
          listing_id?: number | null
          order: number
          out_url?: string | null
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: number
          image_url?: string
          listing_id?: number | null
          order?: number
          out_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_banners_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_bumps: {
        Row: {
          created_at: string
          id: number
          listing_id: number
          payer_key: string
          tx_string: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          listing_id: number
          payer_key: string
          tx_string: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          listing_id?: number
          payer_key?: string
          tx_string?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_bumps_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_bumps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_comments: {
        Row: {
          content: string
          created_at: string
          id: number
          listing_id: number
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          listing_id: number
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          listing_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_comments_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          ath: number
          atv: number
          chain: Database["public"]["Enums"]["chains"]
          created_at: string
          creator_key: string
          description: string
          dexscreener_url: string | null
          holder_count: number
          icon_url: string
          id: number
          is_cto: boolean
          last_bump: string
          name: string
          telegram_url: string | null
          ticker: string
          token_address: string
          total_supply: number
          twitter_url: string | null
          tx_string: string
          user_id: string | null
        }
        Insert: {
          ath: number
          atv: number
          chain: Database["public"]["Enums"]["chains"]
          created_at?: string
          creator_key: string
          description: string
          dexscreener_url?: string | null
          holder_count: number
          icon_url: string
          id?: number
          is_cto: boolean
          last_bump?: string
          name: string
          telegram_url?: string | null
          ticker: string
          token_address: string
          total_supply: number
          twitter_url?: string | null
          tx_string: string
          user_id?: string | null
        }
        Update: {
          ath?: number
          atv?: number
          chain?: Database["public"]["Enums"]["chains"]
          created_at?: string
          creator_key?: string
          description?: string
          dexscreener_url?: string | null
          holder_count?: number
          icon_url?: string
          id?: number
          is_cto?: boolean
          last_bump?: string
          name?: string
          telegram_url?: string | null
          ticker?: string
          token_address?: string
          total_supply?: number
          twitter_url?: string | null
          tx_string?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      secondary_referrals: {
        Row: {
          created_at: string
          referrer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          referrer_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          referrer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "secondary_referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "secondary_referrals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      solana_wallets: {
        Row: {
          address: string
          created_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solana_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tertiary_referrals: {
        Row: {
          created_at: string
          referrer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          referrer_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          referrer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tertiary_referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tertiary_referrals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity: string
          created_at: string
          id: number
          points: number
          user_id: string
        }
        Insert: {
          activity: string
          created_at?: string
          id?: number
          points: number
          user_id: string
        }
        Update: {
          activity?: string
          created_at?: string
          id?: number
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      user_codes: {
        Row: {
          access_code: string
          created_at: string
          user_id: string
        }
        Insert: {
          access_code: string
          created_at?: string
          user_id: string
        }
        Update: {
          access_code?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_codes_access_code_fkey"
            columns: ["access_code"]
            isOneToOne: false
            referencedRelation: "access_codes"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "user_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_giveaway_stats: {
        Row: {
          created_at: string
          giveaways_created: number
          giveaways_entered: number
          giveaways_won: number
          user_id: string
        }
        Insert: {
          created_at?: string
          giveaways_created?: number
          giveaways_entered?: number
          giveaways_won?: number
          user_id: string
        }
        Update: {
          created_at?: string
          giveaways_created?: number
          giveaways_entered?: number
          giveaways_won?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "giveaway_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_listing_stats: {
        Row: {
          created_at: string
          listing_bumps: number
          listing_comments: number
          listings_created: number
          user_id: string
        }
        Insert: {
          created_at?: string
          listing_bumps?: number
          listing_comments?: number
          listings_created?: number
          user_id: string
        }
        Update: {
          created_at?: string
          listing_bumps?: number
          listing_comments?: number
          listings_created?: number
          user_id?: string
        }
        Relationships: []
      }
      user_points: {
        Row: {
          activity_points: number
          created_at: string
          referral_points: number
          user_id: string
        }
        Insert: {
          activity_points?: number
          created_at?: string
          referral_points?: number
          user_id: string
        }
        Update: {
          activity_points?: number
          created_at?: string
          referral_points?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      dropmans_view: {
        Row: {
          icon: string | null
          referral_id: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          icon?: string | null
          referral_id?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          icon?: string | null
          referral_id?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_dropmans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: {
        Args: {
          auth_id: string
        }
        Returns: boolean
      }
      is_owner: {
        Args: {
          auth_id: string
          user_id: number
        }
        Returns: boolean
      }
      is_writer: {
        Args: {
          uid: string
        }
        Returns: boolean
      }
      update_giveaway_sol_usd_value: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      chains:
        | "SOL"
        | "TRON"
        | "TON"
        | "ETH"
        | "MATIC"
        | "BASE"
        | "COSMOS"
        | "BNB"
        | "ADA"
      giveaway_badges:
        | "GOLD"
        | "FIST"
        | "CTO"
        | "MOON"
        | "TRENDING"
        | "PUMP_FUN"
        | "BNB"
        | "ETH"
        | "MATIC"
        | "SOL"
        | "BASE"
        | "DEGEN_PUMP"
      rarities: "COMMON" | "UNCOMMON" | "RARE" | "MYTHIC" | "LEGENDARY"
      roles: "ADMIN" | "WRITER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

