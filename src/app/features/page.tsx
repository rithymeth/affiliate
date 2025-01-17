import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  LinkIcon, 
  ShieldCheckIcon,
  BoltIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Real-time Analytics',
    description: 'Get instant insights with our powerful analytics dashboard. Track clicks, conversions, and earnings in real-time.',
    icon: ChartBarIcon,
  },
  {
    name: 'Instant Payouts',
    description: 'Receive your earnings quickly and securely. Multiple payout options available including PayPal and bank transfers.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Smart Link Management',
    description: 'Create, manage, and optimize your affiliate links with ease. Advanced tracking and targeting capabilities included.',
    icon: LinkIcon,
  },
  {
    name: 'Enterprise Security',
    description: 'Your data is protected with industry-leading security measures. Regular backups and encryption ensure safety.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'High Performance',
    description: 'Lightning-fast redirect speeds and 99.9% uptime guarantee for maximum earnings potential.',
    icon: BoltIcon,
  },
  {
    name: '24/7 Support',
    description: 'Our dedicated support team is available around the clock to help you succeed.',
    icon: ClockIcon,
  },
]

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Everything You Need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful Features for Modern Affiliate Marketing
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform is built with the latest technology to help you maximize your affiliate marketing success.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
} 