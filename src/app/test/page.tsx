'use client'

import { useEffect, useState } from 'react'
import { trackAffiliateClick, trackAffiliateVisit } from '@/utils/affiliateTracking'

export default function TestPage() {
  const [affiliateId, setAffiliateId] = useState<string>('');

  useEffect(() => {
    // Fetch the test affiliate ID
    const fetchTestAffiliate = async () => {
      try {
        const response = await fetch('/api/affiliates');
        const data = await response.json();
        if (data.length > 0) {
          setAffiliateId(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch affiliate:', error);
      }
    };

    fetchTestAffiliate();
  }, []);

  useEffect(() => {
    if (!affiliateId) return;

    const startTime = Date.now();
    let pageViews = 1;

    const handleBeforeUnload = () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      trackAffiliateVisit(affiliateId, document.referrer, duration, pageViews);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [affiliateId]);

  const handleClick = () => {
    if (affiliateId) {
      trackAffiliateClick(affiliateId, document.referrer);
    }
  };

  if (!affiliateId) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Test Affiliate Tracking</h1>
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Affiliate Click
      </button>
    </div>
  );
} 