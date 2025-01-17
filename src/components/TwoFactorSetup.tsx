'use client'

import { useState } from 'react'
import { CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function TwoFactorSetup() {
  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState('')
  const [secret] = useState('JBSWY3DPEHPK3PXP') // This should come from your API

  const handleVerify = async () => {
    // TODO: Implement verification with backend
    setStep(3)
  }

  return (
    <div className="space-y-6">
      {step === 1 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900">Enable Two-Factor Authentication</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
          <button
            onClick={() => setStep(2)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Get Started
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Setup Authentication</h3>
            <p className="mt-1 text-sm text-gray-500">
              Enter this code in your authenticator app: <br />
              <code className="mt-2 block bg-gray-100 p-3 rounded-md font-mono text-lg">
                {secret}
              </code>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enter Verification Code
            </label>
            <div className="mt-1">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter 6-digit code"
              />
            </div>
          </div>

          <button
            onClick={handleVerify}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Verify and Enable
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">2FA Enabled Successfully</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your account is now protected with two-factor authentication.
          </p>
        </div>
      )}
    </div>
  )
} 