import { CheckIcon } from '@heroicons/react/24/outline'

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '/register',
    priceMonthly: '$0',
    description: 'Perfect for getting started with affiliate marketing.',
    features: [
      'Up to 100 tracked links',
      'Basic analytics',
      'Email support',
      'Standard payouts',
      '5% commission rate',
    ],
    featured: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    href: '/register',
    priceMonthly: '$49',
    description: 'Ideal for growing affiliate marketers.',
    features: [
      'Unlimited tracked links',
      'Advanced analytics',
      'Priority support',
      'Instant payouts',
      '10% commission rate',
      'Custom domains',
      'API access',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/contact',
    priceMonthly: 'Custom',
    description: 'Dedicated support and infrastructure for large affiliates.',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom integration support',
      'Custom commission rates',
      'SLA agreement',
      'White-label solution',
    ],
    featured: false,
  },
]

export default function Pricing() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for&nbsp;you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Start for free and scale as you grow. All plans include core tracking features.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                tier.featured ? 'bg-gray-900 text-white ring-gray-900' : 'bg-white'
              }`}
            >
              <h3 className={`text-lg font-semibold leading-8 ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                {tier.name}
              </h3>
              <p className={`mt-4 text-sm leading-6 ${tier.featured ? 'text-gray-300' : 'text-gray-600'}`}>
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight">{tier.priceMonthly}</span>
                {tier.priceMonthly !== 'Custom' && (
                  <span className={`text-sm font-semibold leading-6 ${tier.featured ? 'text-gray-300' : 'text-gray-600'}`}>
                    /month
                  </span>
                )}
              </p>
              <a
                href={tier.href}
                className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 shadow-sm ${
                  tier.featured
                    ? 'bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline-primary-600'
                    : 'bg-primary-600 text-white hover:bg-primary-500'
                }`}
              >
                Get started
              </a>
              <ul className={`mt-8 space-y-3 text-sm leading-6 ${tier.featured ? 'text-gray-300' : 'text-gray-600'}`}>
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className={`h-6 w-5 flex-none ${tier.featured ? 'text-white' : 'text-primary-600'}`}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 