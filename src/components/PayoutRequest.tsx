'use client'

import { useState } from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';

interface PayoutMethod {
  id: string;
  name: string;
  type: string;
}

export default function PayoutRequest({ affiliateId }: { affiliateId: string }) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const payoutMethods: PayoutMethod[] = [
    { id: 'paypal', name: 'PayPal', type: 'paypal' },
    { id: 'bank', name: 'Bank Transfer', type: 'bank_transfer' },
    { id: 'crypto', name: 'Cryptocurrency', type: 'crypto' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/affiliate/payouts/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateId,
          amount: parseFloat(amount),
          method: selectedMethod,
        }),
      });

      if (response.ok) {
        // Reset form and show success message
        setAmount('');
        setSelectedMethod('');
        alert('Payout request submitted successfully!');
      } else {
        throw new Error('Failed to submit payout request');
      }
    } catch (error) {
      alert('Failed to submit payout request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-6">
        <BanknotesIcon className="h-6 w-6 text-gray-400 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Request Payout</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payout Method
          </label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          >
            <option value="">Select a method</option>
            {payoutMethods.map((method) => (
              <option key={method.id} value={method.type}>
                {method.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Processing...' : 'Request Payout'}
        </button>
      </form>
    </div>
  );
} 