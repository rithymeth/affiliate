import Image from 'next/image'
import { 
  UserGroupIcon, 
  GlobeAltIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline'

const stats = [
  { label: 'Active affiliates', value: '10,000+' },
  { label: 'Countries served', value: '150+' },
  { label: 'Total payouts', value: '$5M+' },
]

const values = [
  {
    name: 'Trust & Transparency',
    description: 'We believe in complete transparency with our affiliates. Every click, conversion, and commission is tracked and reported in real-time.',
    icon: UserGroupIcon,
  },
  {
    name: 'Global Reach',
    description: 'Our platform serves affiliates from over 150 countries, supporting multiple languages and payment methods.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Fair Compensation',
    description: 'We offer competitive commission rates and ensure timely payouts to all our affiliates.',
    icon: CurrencyDollarIcon,
  },
]

export default function About() {
  return (
    <div className="bg-white">
      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate -z-10">
          <div className="overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
              <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    We're changing how affiliate marketing works
                  </h1>
                  <p className="relative mt-6 text-lg leading-8 text-gray-600 sm:max-w-md lg:max-w-none">
                    Our mission is to make affiliate marketing accessible, transparent, and profitable for everyone. 
                    We provide the tools and support you need to succeed in the digital age.
                  </p>
                </div>
                <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                  <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                    <div className="relative">
                      <Image
                        src="/images/about-1.jpg"
                        alt="Team member"
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                  <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                    <div className="relative">
                      <Image
                        src="/images/about-2.jpg"
                        alt="Team member"
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div className="relative">
                      <Image
                        src="/images/about-3.jpg"
                        alt="Team member"
                        width={176}
                        height={264}
                        className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're building a platform that puts affiliates first. Our values guide everything we do.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.name}>
                <dt className="font-semibold text-gray-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <value.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {value.name}
                </dt>
                <dd className="mt-1 text-gray-600">{value.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our impact
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We've helped thousands of affiliates grow their business and achieve their goals.
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-y-3 border-l border-primary-600 pl-6">
                <dt className="text-sm leading-6 text-gray-600">{stat.label}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </main>
    </div>
  )
} 