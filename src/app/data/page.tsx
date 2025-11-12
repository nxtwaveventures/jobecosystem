import Link from 'next/link'

// Simple Button component for server-side rendering
function Button({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <button className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${className}`}>
      {children}
    </button>
  )
}

export default function DataProtection() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Data Protection Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              AI Talent Solutions is committed to protecting the personal data of all users. This Data Protection Policy outlines our practices in accordance with applicable data protection laws, including GDPR (General Data Protection Regulation) and other relevant privacy regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data Controller Information</h2>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700"><strong>Data Controller:</strong> AI Talent Solutions</p>
              <p className="text-gray-700 mt-2"><strong>Contact:</strong> anamika@nxtwaves.in</p>
              <p className="text-gray-700 mt-2"><strong>DPO (Data Protection Officer):</strong> Anamika Singh</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Legal Basis for Processing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We process personal data based on the following legal grounds:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Consent:</strong> You have given explicit consent for specific processing activities</li>
              <li><strong>Contract Performance:</strong> Processing is necessary to provide our recruitment services</li>
              <li><strong>Legitimate Interests:</strong> For platform improvement, fraud prevention, and business operations</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Categories</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Personal Identification Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Physical address</li>
                  <li>Date of birth</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Professional Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Work experience and employment history</li>
                  <li>Educational qualifications</li>
                  <li>Skills and certifications</li>
                  <li>Resume/CV content</li>
                  <li>Portfolio and work samples</li>
                  <li>Professional references</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.3 Technical Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Cookies and usage data</li>
                  <li>Platform interaction logs</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.4 Sensitive Data</h3>
                <p className="text-gray-700">
                  We do not intentionally collect sensitive personal data (racial origin, religious beliefs, health data, etc.) unless specifically required for legal compliance (e.g., diversity monitoring with explicit consent).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Protection Principles</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We process personal data in accordance with the following principles:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Lawfulness, Fairness, Transparency:</strong> Processing is legal, fair, and transparent to users</li>
              <li><strong>Purpose Limitation:</strong> Data collected for specified, explicit, and legitimate purposes</li>
              <li><strong>Data Minimization:</strong> Only collect data that is adequate, relevant, and necessary</li>
              <li><strong>Accuracy:</strong> Keep personal data accurate and up to date</li>
              <li><strong>Storage Limitation:</strong> Retain data only as long as necessary</li>
              <li><strong>Integrity and Confidentiality:</strong> Process data securely with appropriate safeguards</li>
              <li><strong>Accountability:</strong> Demonstrate compliance with data protection principles</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Subject Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Under data protection laws, you have the following rights:
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-semibold text-gray-900">Right to Access</h4>
                <p className="text-gray-700 text-sm">Request copies of your personal data</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-semibold text-gray-900">Right to Rectification</h4>
                <p className="text-gray-700 text-sm">Correct inaccurate or incomplete data</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-semibold text-gray-900">Right to Erasure ("Right to be Forgotten")</h4>
                <p className="text-gray-700 text-sm">Request deletion of your data under certain conditions</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-semibold text-gray-900">Right to Restrict Processing</h4>
                <p className="text-gray-700 text-sm">Limit how we use your data</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-semibold text-gray-900">Right to Data Portability</h4>
                <p className="text-gray-700 text-sm">Receive your data in a structured, machine-readable format</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-semibold text-gray-900">Right to Object</h4>
                <p className="text-gray-700 text-sm">Object to processing based on legitimate interests or direct marketing</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-semibold text-gray-900">Right to Withdraw Consent</h4>
                <p className="text-gray-700 text-sm">Withdraw consent for processing at any time</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-semibold text-gray-900">Right to Lodge a Complaint</h4>
                <p className="text-gray-700 text-sm">File a complaint with your local data protection authority</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise any of these rights, please contact us at anamika@nxtwaves.in. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Security Measures</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement comprehensive security measures to protect your data:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded">
                <h4 className="font-semibold text-gray-900 mb-2">Technical Measures</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• End-to-end encryption</li>
                  <li>• Secure SSL/TLS connections</li>
                  <li>• Regular security audits</li>
                  <li>• Firewall protection</li>
                  <li>• Intrusion detection systems</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded">
                <h4 className="font-semibold text-gray-900 mb-2">Organizational Measures</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Access controls and authentication</li>
                  <li>• Staff training on data protection</li>
                  <li>• Data breach response procedures</li>
                  <li>• Vendor security assessments</li>
                  <li>• Regular policy reviews</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Breach Protocol</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In the event of a data breach that poses a risk to your rights and freedoms:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We will notify the relevant supervisory authority within 72 hours</li>
              <li>Affected individuals will be notified without undue delay</li>
              <li>We will describe the nature of the breach and potential consequences</li>
              <li>We will communicate the measures taken to address the breach</li>
              <li>We will provide guidance on protective steps you can take</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              When transferring data outside the EEA/UK, we ensure adequate protection through:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Adequacy decisions for countries with equivalent data protection</li>
              <li>Binding Corporate Rules where applicable</li>
              <li>Explicit consent for specific transfers when required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Data Retention</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Data Type</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  <tr>
                    <td className="px-4 py-2 border-b">Active user profiles</td>
                    <td className="px-4 py-2 border-b">Duration of account + 30 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Application records</td>
                    <td className="px-4 py-2 border-b">2 years after last activity</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Communication logs</td>
                    <td className="px-4 py-2 border-b">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Financial records</td>
                    <td className="px-4 py-2 border-b">7 years (legal requirement)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b">Marketing consent</td>
                    <td className="px-4 py-2 border-b">Until consent withdrawn</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Third-Party Processors</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We work with trusted third-party service providers who process data on our behalf:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Cloud hosting providers (data storage and infrastructure)</li>
              <li>Email service providers (communications)</li>
              <li>Analytics platforms (usage statistics)</li>
              <li>Payment processors (financial transactions)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              All processors are bound by data processing agreements and required to maintain GDPR-compliant practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar technologies. See our detailed cookie policy:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li><strong>Analytical Cookies:</strong> Help us understand usage patterns (with consent)</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences</li>
              <li><strong>Marketing Cookies:</strong> Deliver relevant content (with consent)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can manage cookie preferences through your browser settings or our cookie consent tool.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Children's Data</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not knowingly collect or process personal data from individuals under 18. If we become aware of such data collection, we will delete it immediately and notify relevant parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We review and update this Data Protection Policy annually or when significant changes occur. Material changes will be communicated via email and prominent platform notices. Continued use after updates constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact and Complaints</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Data Protection Officer</h4>
                <p className="text-gray-700"><strong>Email:</strong> anamika@nxtwaves.in</p>
                <p className="text-gray-700 mt-2"><strong>Response Time:</strong> Within 30 days</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Supervisory Authority</h4>
                <p className="text-gray-700">
                  If you are unsatisfied with our response, you have the right to lodge a complaint with your local data protection authority:
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>EU/EEA:</strong> Your national Data Protection Authority<br />
                  <strong>UK:</strong> Information Commissioner's Office (ICO)<br />
                  <strong>Other:</strong> Relevant local privacy regulator
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
