'use client'

import Link from 'next/link'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  LinkIcon, 
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Real-time Analytics',
    description: 'Track your performance with detailed analytics and insights in real-time.',
    icon: ChartBarIcon,
  },
  {
    name: 'Instant Payouts',
    description: 'Get paid quickly and securely with our automated payout system.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Smart Link Management',
    description: 'Create and manage your affiliate links with our intuitive dashboard.',
    icon: LinkIcon,
  },
  {
    name: 'Secure Platform',
    description: 'Your data and earnings are protected with enterprise-grade security.',
    icon: ShieldCheckIcon,
  },
]

const testimonials = [
  {
    content: "This platform has transformed how I manage my affiliate business. The real-time analytics are game-changing.",
    author: "Sarah Johnson",
    role: "Digital Marketer"
  },
  {
    content: "The ease of use and quick payouts make this my go-to platform for affiliate marketing.",
    author: "Michael Chen",
    role: "Content Creator"
  },
  {
    content: "I've tried many platforms, but this one stands out with its excellent features and support.",
    author: "Emma Davis",
    role: "Affiliate Marketer"
  }
]

const stats = [
  { label: 'Active Affiliates', value: '10,000+' },
  { label: 'Total Paid', value: '$5M+' },
  { label: 'Average Earnings', value: '$1,500' },
  { label: 'Success Rate', value: '94%' },
]

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-primary-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Maximize Your Earnings with Smart Affiliate Marketing
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join thousands of successful affiliates who are earning more with our advanced tracking platform, real-time analytics, and instant payouts.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get Started
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Everything You Need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful Tools for Successful Affiliates
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform provides everything you need to succeed in affiliate marketing, from advanced tracking to instant payouts.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
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

      {/* Stats Section */}
      <div className="bg-primary-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by Marketers Worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Join thousands of successful affiliates who have chosen our platform
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col bg-white p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.label}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by Leading Marketers
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col justify-between bg-white p-6 shadow-lg ring-1 ring-gray-900/5 rounded-lg">
              <blockquote className="text-gray-900">
                <p className="text-lg leading-relaxed">"{testimonial.content}"</p>
              </blockquote>
              <div className="mt-6 border-t border-gray-900/5 pt-6">
                <div className="text-base font-semibold text-gray-900">{testimonial.author}</div>
                <div className="mt-1 text-sm text-gray-600">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to boost your earnings?
            <br />
            Join our platform today.
          </h2>
          <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
            <Link
              href="/dashboard"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get Started
            </Link>
            <Link href="/contact" className="text-sm font-semibold leading-6 text-white">
              Contact Sales <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 