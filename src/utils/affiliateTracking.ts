export const trackAffiliateClick = async (
  affiliateId: string, 
  referrer: string,
  linkId?: string
) => {
  try {
    await fetch('/api/affiliate/track/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        affiliateId,
        referrer,
        linkId,
      }),
    });
  } catch (error) {
    console.error('Failed to track affiliate click:', error);
  }
};

export const trackAffiliateVisit = async (
  affiliateId: string,
  referrer: string,
  duration: number,
  pageViews: number
) => {
  try {
    await fetch('/api/affiliate/track/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        affiliateId,
        referrer,
        duration,
        pageViews,
      }),
    });
  } catch (error) {
    console.error('Failed to track affiliate visit:', error);
  }
}; 