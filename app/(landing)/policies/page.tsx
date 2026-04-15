import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Policies() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold mb-16 text-slate-900">
            Our Policies
          </h1>
          <p className="text-xl text-muted-foreground text-slate-700 font-semibold">
            Important information about using SkillSpill
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="grid w-full grid-cols-3 ">
            <TabsTrigger value="terms">Terms of Service</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            <TabsTrigger value="community">Community Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="mt-6">
            <Card>
              <CardContent className="pt-6 prose prose-sm max-w-none">
                <h2 className="text-2xl font-bold text-left mb-8 text-slate-800">
                  Terms of Service
                </h2>
                <p className="text-muted-foreground">
                  Last updated: January 2026
                </p>

                <h3 className="text-lg font-bold">1. Acceptance of Terms</h3>
                <p className="text-slate-700">
                  By accessing and using SkillSpill, you accept and agree to be
                  bound by the terms and provision of this agreement. If you do
                  not agree to these terms, please do not use our service.
                </p>

                <h3 className="text-lg font-bold">2. Use of Service</h3>
                <p className="text-slate-700">
                  SkillSpill provides a platform for users to exchange skills
                  with one another. You agree to use the service only for lawful
                  purposes and in accordance with these Terms of Service.
                </p>

                <h3 className="text-lg font-bold">3. User Accounts</h3>
                <p className="text-slate-700">
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account. You must immediately notify us of any
                  unauthorized use of your account.
                </p>

                <h3 className="text-lg font-bold">4. Skill Exchanges</h3>
                <p className="text-slate-700">
                  SkillSpill facilitates connections between users but is not
                  responsible for the actual skill exchanges. Users are solely
                  responsible for the quality, safety, and legality of their
                  exchanges. We do not guarantee the quality of skills offered
                  or the behavior of other users.
                </p>

                <h3 className="text-lg font-bold">5. Content</h3>
                <p className="text-slate-700">
                  You retain ownership of any content you submit to SkillSpill.
                  However, by submitting content, you grant us a worldwide,
                  non-exclusive, royalty-free license to use, reproduce, and
                  display such content in connection with the service.
                </p>

                <h3 className="text-lg font-bold">6. Prohibited Conduct</h3>
                <p className="text-slate-800 font-bold">You agree not to:</p>
                <ul className="text-slate-700 font-semibold">
                  <li>Use the service for any illegal purpose</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Post false, misleading, or fraudulent content</li>
                  <li>Attempt to gain unauthorized access to the service</li>
                  <li>
                    Use the service to sell products or services for money
                  </li>
                </ul>

                <h3 className="text-lg font-bold">7. Termination</h3>
                <p className="text-slate-700">
                  We reserve the right to suspend or terminate your account at
                  any time for violations of these terms or for any other reason
                  at our discretion.
                </p>

                <h3 className="text-lg font-bold">
                  8. Limitation of Liability
                </h3>
                <p className="text-slate-700">
                  SkillSpill is provided "as is" without warranties of any kind.
                  We are not liable for any damages arising from your use of the
                  service or from any skill exchanges arranged through the
                  platform.
                </p>

                <h3 className="text-lg font-bold">9. Changes to Terms</h3>
                <p className="text-slate-700">
                  We reserve the right to modify these terms at any time. We
                  will notify users of any material changes via email or through
                  the service.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <Card>
              <CardContent className="pt-6 prose prose-sm max-w-none">
                <h2 className="text-2xl font-bold text-left mb-8 text-slate-800">
                  Privacy Policy
                </h2>
                <p className="text-muted-foreground">
                  Last updated: January 2026
                </p>

                <h3 className="text-lg font-bold">1. Information We Collect</h3>
                <p className="text-slate-800 font-bold">
                  We collect the following types of information:
                </p>
                <ul className="text-slate-800 font-semibold">
                  <li>
                    <strong>Account Information:</strong> Name, email address,
                    password (encrypted)
                  </li>
                  <li>
                    <strong>Profile Information:</strong> Bio, location, profile
                    picture, contact details
                  </li>
                  <li>
                    <strong>Skill Information:</strong> Skills you offer and
                    request
                  </li>
                  <li>
                    <strong>Booking Information:</strong> Details of your skill
                    exchanges
                  </li>
                  <li>
                    <strong>Reviews:</strong> Ratings and reviews you give and
                    receive
                  </li>
                  <li>
                    <strong>Usage Data:</strong> How you interact with our
                    service
                  </li>
                </ul>

                <h3 className="text-lg font-bold">
                  2. How We Use Your Information
                </h3>
                <p className="text-slate-800 font-bold">
                  We use your information to:
                </p>
                <ul className="text-slate-700 font-semibold">
                  <li>Provide and improve our services</li>
                  <li>Facilitate skill exchanges between users</li>
                  <li>Send you notifications and updates</li>
                  <li>Ensure platform safety and security</li>
                  <li>Analyze platform usage and trends</li>
                  <li>Communicate with you about your account</li>
                </ul>

                <h3 className="text-lg font-bold">3. Information Sharing</h3>
                <p className="text-slate-800 font-bold">
                  We do not sell your personal information. We may share your
                  information with:
                </p>
                <ul className="text-slate-700 font-semibold">
                  <li>
                    <strong>Other Users:</strong> Your public profile
                    information and skills are visible to other users
                  </li>
                  <li>
                    <strong>Service Providers:</strong> Third-party services
                    that help us operate the platform
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or
                    to protect rights and safety
                  </li>
                </ul>

                <h3 className="text-lg font-bold">4. Data Security</h3>
                <p className="text-slate-700">
                  We implement appropriate technical and organizational measures
                  to protect your personal information. However, no method of
                  transmission over the internet is 100% secure.
                </p>

                <h3 className="text-lg font-bold">5. Your Rights</h3>
                <p className="text-slate-800 font-bold">
                  You have the right to:
                </p>
                <ul className="text-slate-700 font-semibold">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Object to processing of your information</li>
                  <li>Export your data</li>
                </ul>

                <h3 className="text-lg font-bold">6. Cookies</h3>
                <p className="text-slate-700">
                  We use cookies and similar technologies to enhance your
                  experience, analyze usage, and remember your preferences.
                </p>

                <h3 className="text-lg font-bold">7. Children's Privacy</h3>
                <p className="text-slate-700">
                  Our service is not intended for users under 18 years of age.
                  We do not knowingly collect information from children.
                </p>

                <h3 className="text-lg font-bold">
                  8. Changes to Privacy Policy
                </h3>
                <p className="text-slate-700">
                  We may update this privacy policy from time to time. We will
                  notify you of any changes by posting the new policy on this
                  page.
                </p>

                <h3 className="text-lg font-bold">9. Contact Us</h3>
                <p className="text-slate-700">
                  If you have questions about this privacy policy, please
                  contact us at privacy@skillspill.com
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <Card>
              <CardContent className="pt-6 prose prose-sm max-w-none">
                <h2 className="text-2xl font-bold text-left mb-8 text-slate-800">
                  Community Guidelines
                </h2>
                <p className="text-muted-foreground">
                  Last updated: January 2026
                </p>

                <h3 className="text-lg font-bold">1. Be Respectful</h3>
                <p className="text-slate-700">
                  Treat all community members with respect and kindness.
                  Harassment, hate speech, discrimination, and bullying of any
                  kind will not be tolerated.
                </p>

                <h3 className="text-lg font-bold">2. Be Honest</h3>
                <p className="text-slate-700">
                  Accurately represent your skills, experience level, and
                  availability. Do not make false claims about your abilities or
                  qualifications.
                </p>

                <h3 className="text-lg font-bold">3. Be Reliable</h3>
                <p className="text-slate-700">
                  Honor your commitments. If you accept a booking, show up on
                  time and prepared. If you need to cancel or reschedule,
                  communicate as early as possible.
                </p>

                <h3 className="text-lg font-bold">4. Maintain Safety</h3>
                <p className="text-slate-800 font-bold">
                  When meeting in person:
                </p>
                <ul className="text-slate-700 font-semibold">
                  <li>Meet in public places for the first time</li>
                  <li>Tell someone where you are going</li>
                  <li>
                    Trust your instincts - if something feels wrong, cancel
                  </li>
                  <li>Report any safety concerns to our team</li>
                </ul>

                <h3 className="text-lg font-bold">5. Appropriate Content</h3>
                <p className="text-slate-800 font-bold">
                  Only post content that is:
                </p>
                <ul className="text-slate-700 font-semibold">
                  <li>Legal and appropriate for all audiences</li>
                  <li>Relevant to skill sharing and learning</li>
                  <li>Respectful and non-offensive</li>
                  <li>Original or properly attributed</li>
                </ul>

                <h3 className="text-lg font-bold">6. No Commercial Activity</h3>
                <p className="text-slate-800 font-bold">
                  SkillSpill is for skill exchanges, not commercial
                  transactions. Do not:
                </p>
                <ul className="text-slate-700 font-semibold">
                  <li>Request payment for skills</li>
                  <li>Advertise products or services</li>
                  <li>Use the platform for business promotion</li>
                  <li>Spam or send unsolicited messages</li>
                </ul>

                <h3 className="text-lg font-bold">7. Fair Reviews</h3>
                <p className="text-slate-800 font-bold">
                  Reviews should be honest, constructive, and based on your
                  actual experience. Do not:
                </p>
                <ul className="text-slate-700 font-semibold">
                  <li>Leave fake or misleading reviews</li>
                  <li>Review yourself or exchange reviews</li>
                  <li>Include personal attacks or harassment</li>
                  <li>Use reviews for purposes other than feedback</li>
                </ul>

                <h3 className="text-lg font-bold">8. Privacy</h3>
                <p className="text-slate-800 font-bold">
                  Respect others' privacy:
                </p>
                <ul className="text-slate-700 font-semibold">
                  <li>Do not share others' personal information</li>
                  <li>Do not screenshot and share private conversations</li>
                  <li>Ask before taking photos or recordings</li>
                </ul>

                <h3 className="text-lg font-bold">9. Reporting Issues</h3>
                <p className="text-slate-700">
                  If you encounter violations of these guidelines, please report
                  them using the Report button. Our moderation team reviews all
                  reports promptly.
                </p>

                <h3 className="text-lg font-bold">10. Consequences</h3>
                <p className="text-slate-800 font-bold">
                  Violations of these guidelines may result in:
                </p>
                <ul className="text-slate-700 font-semibold">
                  <li>Warning from the moderation team</li>
                  <li>Temporary suspension of account</li>
                  <li>Permanent account termination</li>
                  <li>Legal action in severe cases</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground text-slate-700 font-semibold">
          <p>
            Questions about our policies?
            <a
              href="mailto:legal@skillspill.com"
              className="text-blue-600 hover:underline"
            >
              <br />
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
