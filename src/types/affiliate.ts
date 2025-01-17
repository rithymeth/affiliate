export interface CreateAffiliateLink {
  name: string
  url: string
}

export interface AffiliateLink {
  id: string
  name: string
  url: string
  trackingId: string
  uniqueCode: string
  active: boolean
  clicks: number
  createdAt: Date
}

export interface AffiliateEarning {
  id: string
  amount: number
  status: string
  source: string
  createdAt: Date
}

export interface AffiliateClick {
  id: string
  linkName: string
  timestamp: Date
  ipAddress: string
  converted: boolean
}

export interface MonthlyStats {
  month: string
  earnings: number
  clicks: number
  conversions: number
}

export interface Notification {
  id: string
  message: string
  type: string
  createdAt: string
}

export interface DailyStats {
  date: string
  clicks: number
  earnings: number
  conversions: number
}

export interface AffiliateStats {
  totalClicks: number
  totalEarnings: number
  conversions: number
  activeLinks: number
  dailyStats: DailyStats[]
}

export interface AffiliateVisit {
  id: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  referrer: string
  duration: number
  pageViews: number
}

export interface TrackingResponse {
  success: boolean
  clickId: string
}

export interface CreateAffiliateRequest {
  name: string
  email: string
  password: string
  website?: string
  commission?: number
}

export interface Affiliate {
  id: string
  name: string
  email: string
  website?: string
  commission: number
  status: string
  paymentMethod: string
  emailNotifications: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AffiliateWithStats extends Omit<Affiliate, 'password'> {
  _count: {
    links: number
    clicks: number
    earnings: number
  }
} 