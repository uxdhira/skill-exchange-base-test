import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold mb-16 text-slate-800">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground text-slate-700 font-semibold">
            Find answers to common questions about SkillSpill
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem
            value="item-1"
            className="bg-white rounded-lg border px-6 text-2xl font-bold text-left mb-8 text-slate-900"
          >
            <AccordionTrigger className="text-med font-semibold text-slate-800">
              How does SkillSpill work?
            </AccordionTrigger>
            <AccordionContent>
              SkillSpill connects people who want to exchange skills instead of
              paying with money. You list skills you can teach and skills you
              want to learn. When you find a match, you can arrange to exchange
              your knowledge with another member. For example, you might teach
              photography in exchange for learning Spanish.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="bg-white rounded-lg border px-6 text-2xl font-bold text-left mb-8 text-slate-900"
          >
            <AccordionTrigger>Is SkillSpill really free?</AccordionTrigger>
            <AccordionContent>
              Yes! SkillSpill is completely free to use. We do not charge any
              fees for creating an account, listing skills, or making exchanges.
              Our mission is to make learning accessible to everyone by removing
              financial barriers.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="bg-white rounded-lg border px-6 text-2xl font-bold text-left mb-8 text-slate-900"
          >
            <AccordionTrigger>
              What kinds of skills can I exchange?
            </AccordionTrigger>
            <AccordionContent>
              Almost any skill! Popular categories include technology
              (programming, design), languages, music, art, cooking, fitness,
              photography, and business skills. As long as it is legal and safe,
              you can offer to teach it or request to learn it.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="bg-white rounded-lg border px-6 text-2xl font-bold text-left mb-8 text-slate-900"
          >
            <AccordionTrigger>How do I create an account?</AccordionTrigger>
            <AccordionContent>
              Click the "Register" button in the top right corner and fill out
              the registration form with your name, email, and password. After
              registering, you will receive a verification email. Click the link
              in the email to activate your account and start exchanging skills.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-5"
            className="bg-white rounded-lg border px-6 text-2xl font-bold text-left mb-8 text-slate-900"
          >
            <AccordionTrigger>
              How do I find someone to exchange skills with?
            </AccordionTrigger>
            <AccordionContent>
              You can browse available skills using our search and filter
              features. Filter by category, location, and rating to find the
              right match. Once you find a skill you want to learn, send a
              booking request proposing which of your skills you will teach in
              exchange.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-6"
            className="bg-white rounded-lg border px-6 text-2xl font-bold text-left mb-8 text-slate-900"
          >
            <AccordionTrigger>
              What if someone does not show up for our exchange?
            </AccordionTrigger>
            <AccordionContent>
              We encourage users to maintain good communication. If someone does
              not show up or cancels last minute, you can leave a review
              reflecting your experience. Repeated no-shows or unprofessional
              behavior can be reported to our moderation team for review.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-7"
            className="bg-white rounded-lg border px-6 text-2xl font-bold text-left mb-8 text-slate-900"
          >
            <AccordionTrigger>
              Can I exchange skills online or does it have to be in person?
            </AccordionTrigger>
            <AccordionContent>
              Both options are available! When listing a skill, you can specify
              if you offer it online, offline, or both. Many skills like
              language learning or programming work great over video calls,
              while others like cooking or sports might work better in person.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-8"
            className="bg-white rounded-lg border px-6 text-2xl font-bold text-left mb-8 text-slate-900"
          >
            <AccordionTrigger>
              How does the review system work?
            </AccordionTrigger>
            <AccordionContent>
              After completing a skill exchange, both participants can leave a
              review rating the experience from 1-5 stars and adding written
              feedback. Reviews help build trust in the community and help other
              members find quality skill providers. Reviews are visible on user
              profiles.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-9"
            className="bg-white rounded-lg border px-6 text-2xl font-bold text-left mb-8 text-slate-900"
          >
            <AccordionTrigger>
              How are skills moderated or approved?
            </AccordionTrigger>
            <AccordionContent>
              All skills submitted to the platform are reviewed by our
              moderation team to ensure they meet our community guidelines. We
              check that skills are appropriate, clearly described, and fall
              within acceptable categories. Approved skills appear in search
              results, while rejected skills receive feedback for improvement.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-10"
            className="bg-white rounded-lg border px-6 text-2xl font-bold text-left mb-8 text-slate-900"
          >
            <AccordionTrigger>
              What should I do if I experience inappropriate behavior?
            </AccordionTrigger>
            <AccordionContent>
              Your safety is our priority. You can report any inappropriate
              content, skills, or user behavior using the "Report" button found
              on skill pages and user profiles. Our moderation team reviews all
              reports and takes appropriate action, which may include warnings,
              content removal, or account suspension.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-11"
            className="bg-white rounded-lg border px-6 text-2xl font-bold text-left mb-8 text-slate-900"
          >
            <AccordionTrigger>
              Can I cancel or reschedule a booking?
            </AccordionTrigger>
            <AccordionContent>
              Yes, you can request to reschedule a booking from the booking
              details page. Provide a new date and time along with a reason for
              the change. The other participant will be notified and can accept
              or decline the reschedule request. For cancellations, please
              communicate with the other party as early as possible.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-12"
            className="bg-white rounded-lg border px-6 text-2xl font-bold text-left mb-8 text-slate-900"
          >
            <AccordionTrigger>How do I delete my account?</AccordionTrigger>
            <AccordionContent>
              You can delete your account from the Settings page under the
              "Danger Zone" section. Note that account deletion is permanent and
              will remove all your data including your profile, skills,
              bookings, and reviews. If you just want a break, consider
              deactivating your account instead - you can reactivate it anytime
              by logging back in.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Contact Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-900">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-6 text-slate-700 font-semibold">
            Can not find the answer you are looking for? Contact our support
            team.
          </p>
          <Button size="lg" variant="default" asChild>
            <a href="mailto:support@skillspll.com">Contact Support</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
