export interface User {
  id: string
  name: string
  email: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export * from './affiliate' 