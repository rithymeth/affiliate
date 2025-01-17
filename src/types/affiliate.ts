export interface AffiliateLink {
  id: string
  name: string
  url: string
  trackingId: string
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