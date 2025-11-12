import Link from 'next/link'

// Simple Button component for server-side rendering
function Button({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <button className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${className}`}>
      {children}
    </button>
  )
}

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-[#4361ee]">
              AI Talent Solutions
            </Link>
            <Link href="/">
              <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using AI Talent Solutions ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Platform. We reserve the right to modify these Terms at any time, and continued use constitutes acceptance of updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Platform Description</h2>
            <p className="text-gray-700 leading-relaxed">
              AI Talent Solutions is a professional placement platform connecting AI/ML specialists with companies seeking technical talent. We provide tools for job posting, candidate discovery, application management, and recruitment facilitation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.1 Account Creation</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>You must be at least 18 years old to create an account</li>
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>One person or entity may maintain only one account</li>
                  <li>You must not share your account credentials</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.2 Account Types</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>AI Specialist Accounts:</strong> For professionals seeking employment opportunities</li>
                  <li><strong>Company Accounts:</strong> For organizations seeking to hire AI talent</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3.3 Account Termination</h3>
                <p className="text-gray-700">
                  We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or misuse the Platform.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide false, misleading, or inaccurate information</li>
              <li>Impersonate any person or entity</li>
              <li>Post discriminatory, offensive, or illegal content</li>
              <li>Spam, harass, or abuse other users</li>
              <li>Scrape, crawl, or extract data from the Platform</li>
              <li>Reverse engineer or attempt to access source code</li>
              <li>Circumvent security features or access controls</li>
              <li>Use the Platform for any illegal purposes</li>
              <li>Interfere with Platform operations or other users' access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. For AI Specialists</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 Profile Accuracy</h3>
                <p className="text-gray-700">
                  You represent that all information in your profile, including work history, skills, and qualifications, is accurate and truthful. Misrepresentation may result in account termination.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2 Job Applications</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Applications submitted through the Platform are binding expressions of interest</li>
                  <li>You must honor interview commitments and communicate professionally</li>
                  <li>You may withdraw applications at any time before accepting an offer</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.3 Placement Fee</h3>
                <p className="text-gray-700">
                  AI Talent Solutions does not charge fees to job seekers. Companies pay placement fees for successful hires.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. For Companies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">6.1 Job Postings</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Job postings must be accurate and describe real, available positions</li>
                  <li>Jobs must comply with all applicable employment laws</li>
                  <li>Discriminatory job postings are strictly prohibited</li>
                  <li>We reserve the right to remove non-compliant postings</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">6.2 Placement Fees</h3>
                <p className="text-gray-700 mb-2">
                  Companies agree to pay placement fees for successful hires made through the Platform:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Placement fee structure will be provided upon company registration</li>
                  <li>Fees are due within 30 days of candidate start date</li>
                  <li>Refund policy applies for candidates who leave within guarantee period</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">6.3 Candidate Information</h3>
                <p className="text-gray-700">
                  Companies must handle candidate data responsibly, comply with privacy laws, and use information solely for recruitment purposes. Candidate data must not be shared with third parties without consent.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">7.1 Platform Content</h3>
                <p className="text-gray-700">
                  All Platform content, design, logos, and code are owned by AI Talent Solutions and protected by intellectual property laws. You may not copy, modify, or distribute Platform content without authorization.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">7.2 User Content</h3>
                <p className="text-gray-700">
                  You retain ownership of content you submit (profiles, job postings, etc.) but grant us a license to use, display, and distribute this content to provide Platform services.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>The Platform is provided "as is" without warranties of any kind</li>
              <li>We do not guarantee job placement or hiring outcomes</li>
              <li>We do not verify all user-submitted information</li>
              <li>We are not responsible for the conduct of users or employment decisions</li>
              <li>We do not guarantee Platform availability or error-free operation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, AI Talent Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data loss, or business interruption arising from your use of the Platform. Our total liability shall not exceed the fees paid by you (if any) in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless AI Talent Solutions from any claims, damages, or expenses arising from your violation of these Terms, your use of the Platform, or your violation of any rights of another party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Dispute Resolution</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Any disputes arising from these Terms or Platform use shall be resolved through:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Good faith negotiation between parties</li>
                <li>Binding arbitration if negotiation fails</li>
                <li>Governing law: [Jurisdiction]</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Miscellaneous</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Severability:</strong> If any provision is invalid, remaining provisions remain in effect</li>
              <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between parties</li>
              <li><strong>No Waiver:</strong> Failure to enforce any right does not constitute a waiver</li>
              <li><strong>Assignment:</strong> You may not assign these Terms without our consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> anamika@nxtwaves.in</p>
              <p className="text-gray-700 mt-2"><strong>Address:</strong> Whitefield Hoodi, Bangalore</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
