'use client';

import Link from 'next/link'
import { useState } from 'react'
import { Button, Card, Badge } from '@/components/ui'
import { PLATFORM_FEATURES, POPULAR_SKILLS } from '@/constants/home'

export default function Home() {
  const [showCookieBanner, setShowCookieBanner] = useState(true)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="primary" className="mb-6 px-4 py-2 text-sm">
              AI Specialists Only | Fixed Rate | Pre-vetted Talent | Fast Process
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI Talent
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {' '}Solutions
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Connecting companies with vetted AI specialists
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth/login?role=freelancer">
                <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3">
                  Join as AI Engineer
                </Button>
              </Link>
              <Link href="/auth/login?role=client">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-lg px-6 py-3">
                  Hire AI Talent
                </Button>
              </Link>
            </div>

            {/* Popular Skills */}
            <div className="mb-12">
              <p className="text-sm font-medium text-gray-700 mb-4">Popular Skills on Our Platform</p>
              <div className="flex flex-wrap justify-center gap-2">
                {POPULAR_SKILLS.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Us
            </h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {PLATFORM_FEATURES.map((feature, index: number) => (
              <Card key={index} className="p-8 bg-white rounded-xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex flex-col h-full">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                  <div className="w-16 h-0.5 bg-indigo-600 mb-6"></div>
                  <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get started on your AI/ML journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* For Companies */}
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Hire AI Talent</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Post Your Requirements</h4>
                    <p className="text-gray-600 text-sm">Share your project details and AI specialist requirements on our platform</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Review Matched Candidates</h4>
                    <p className="text-gray-600 text-sm">Browse profiles of pre-vetted AI specialists matched to your needs</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Hire Directly</h4>
                    <p className="text-gray-600 text-sm">Connect and hire through our platform with transparent pricing</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* For AI Engineers */}
            <Card>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For AI Specialists</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Share Your Profile</h4>
                    <p className="text-gray-600 text-sm">Submit your AI/ML experience and expertise</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Technical Screening</h4>
                    <p className="text-gray-600 text-sm">Quick verification of your AI expertise</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Get Matched</h4>
                    <p className="text-gray-600 text-sm">Connect with companies seeking AI talent</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Success Stories Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Successful Placements
            </h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recent AI talent placements and client feedback
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="p-8 bg-white rounded-xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-[#4361ee] rounded-full flex items-center justify-center text-white text-xl font-bold">
                    T
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Dr. Thomas Chen</h4>
                    <p className="text-gray-600">CTO, AI Solutions Inc</p>
                  </div>
                </div>
                <blockquote className="text-gray-600 leading-relaxed mb-6 flex-grow">
                  &ldquo;Found an exceptional ML engineer within days. The pre-vetting process saved us weeks of interviews.&rdquo;
                </blockquote>
                <div className="flex items-center text-[#4361ee]">
                  <span className="font-semibold">Hired: </span>
                  <span className="ml-2">Senior ML Engineer</span>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white rounded-xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-[#4361ee] rounded-full flex items-center justify-center text-white text-xl font-bold">
                    S
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Sarah Williams</h4>
                    <p className="text-gray-600">Head of AI, TechCorp</p>
                  </div>
                </div>
                <blockquote className="text-gray-600 leading-relaxed mb-6 flex-grow">
                  &ldquo;The fixed-rate model and streamlined process made hiring top AI talent surprisingly efficient.&rdquo;
                </blockquote>
                <div className="flex items-center text-[#4361ee]">
                  <span className="font-semibold">Hired: </span>
                  <span className="ml-2">AI Research Team Lead</span>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white rounded-xl hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-[#4361ee] rounded-full flex items-center justify-center text-white text-xl font-bold">
                    M
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">Michael Zhang</h4>
                    <p className="text-gray-600">VP Engineering, DataScale</p>
                  </div>
                </div>
                <blockquote className="text-gray-600 leading-relaxed mb-6 flex-grow">
                  &ldquo;Their focus on AI specialists means every candidate was relevant. Telegram integration made communication seamless.&rdquo;
                </blockquote>
                <div className="flex items-center text-[#4361ee]">
                  <span className="font-semibold">Hired: </span>
                  <span className="ml-2">Computer Vision Expert</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-bold mb-4">AI Talent Solutions</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting companies with elite AI specialists.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Hire AI Talent</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Submit Profile</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/data" className="hover:text-white transition-colors">Data Protection</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 AI Talent Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
              <p className="text-sm text-gray-600">
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 ml-1 underline">
                  Learn more
                </Link>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCookieBanner(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => setShowCookieBanner(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#4361ee] hover:bg-[#3a49c0] rounded-lg transition-colors"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}