export interface AffiliateClick {
  id: string;
  affiliateId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  converted: boolean;
}

export interface AffiliateVisit {
  id: string;
  affiliateId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  duration: number;
  pageViews: number;
}

export interface AffiliateStats {
  totalClicks: number;
  totalVisits: number;
  conversionRate: number;
  dailyStats: {
    date: string;
    clicks: number;
    visits: number;
  }[];
} 