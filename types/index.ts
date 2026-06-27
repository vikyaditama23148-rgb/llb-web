export interface User {
  id: string
  username: string
  secret_code: string
  full_name: string | null
  bio: string | null
  status: string | null
  alias: string | null
  quote: string | null
  avatar_url: string | null
  created_at: string
}

export interface UserUpdatePayload {
  full_name?: string
  bio?: string
  status?: string
  alias?: string
  quote?: string
  avatar_url?: string
}
