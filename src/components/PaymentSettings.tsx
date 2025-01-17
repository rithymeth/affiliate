'use client'

import { useState } from 'react'
import { CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline'

interface PaymentMethod {
  id: string
  type: 'paypal' | 'bank' | 'stripe'
  details: string
  isDefault: boolean
}

export default function PaymentSettings() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'paypal', details: 'test@example.com', isDefault: true },
    { id: '2', type: 'bank', details: '**** 1234', isDefault: false },
  ])
  const [threshold, setThreshold] = useState(100)
  const [loading, setLoading] = useState(false)

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    )
  }

  const handleRemove = (id: string) => {
    setPaymentMethods(methods =>
      methods.filter(method => method.id !== id)
    )
  }

  return (
    <div className="space-y-8">
      {/* Payment Methods */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg border"
            >
              <div className="flex items-center space-x-4">
                {method.type === 'paypal' ? (
                  <CreditCardIcon className="h-8 w-8 text-blue-500" />
                ) : (
                  <BanknotesIcon className="h-8 w-8 text-green-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
                  </p>
                  <p className="text-sm text-gray-500">{method.details}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Set Default
                  </button>
                )}
                {method.isDefault && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Default
                  </span>
                )}
                <button
                  onClick={() => handleRemove(method.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Add Payment Method
        </button>
      </div>

      {/* Payout Threshold */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payout Threshold</h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Choose when you want to receive automatic payouts
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[50, 100, 250, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setThreshold(amount)}
                className={`
                  px-4 py-3 border rounded-lg text-sm font-medium
                  ${threshold === amount
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
} 