import { useLocation } from "wouter";
import logoImage from "@assets/MIA logo_1763490424237.png";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-[#E8E8E8] bg-white p-6 sm:p-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div
              className="mb-3 inline-flex items-center rounded-md px-3 py-2"
              style={{ backgroundColor: "#1A1A1A" }}
            >
              <img
                src={logoImage}
                alt="MIA logo"
                className="h-8 w-auto"
                data-testid="img-privacy-logo"
              />
            </div>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "#6B7280",
              }}
            >
              MIA - My Intelligent Agent
            </p>
            <h1
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "30px",
                fontWeight: 700,
                lineHeight: "1.2",
                color: "#202020",
                marginTop: "6px",
              }}
            >
              Privacy Policy
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setLocation("/sign-in")}
            className="rounded-md border border-[#DADADA] bg-white px-4 py-2 transition-colors hover:bg-[#F6F6F6]"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#202020",
            }}
          >
            Back to Sign In
          </button>
        </div>

        <div
          className="space-y-6"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            lineHeight: "1.7",
            color: "#202020",
          }}
        >
          <p><strong>Effective Date:</strong> 01.03.2026</p>
          <p><strong>Last Updated:</strong> 25.02.2026</p>

          <section>
            <h2 className="mb-2 text-lg font-semibold">1. Introduction</h2>
            <p>
              MIA - My Intelligent Agent ("MIA", "we", "our", or "us") is operated by MIA Media, based in Spain.
              MIA is an AI-powered content assistant designed for salon, barber, and beauty business owners to generate
              marketing and social media content.
            </p>
            <p className="mt-2">
              We are committed to protecting your privacy and complying with applicable data protection laws, including the
              General Data Protection Regulation (GDPR). By using MIA, you agree to the collection and use of information in
              accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">2. Data Controller</h2>
            <p>The Data Controller responsible for your personal data is:</p>
            <p className="mt-2">MIA Media<br />Spain<br />Email: support@miaagent.com</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">3. Information We Collect</h2>
            <p>We may collect and process the following data:</p>
            <p className="mt-2 font-semibold">A. Account Information</p>
            <ul className="list-disc pl-6">
              <li>Full name</li>
              <li>Email address</li>
              <li>Business name</li>
              <li>Login credentials</li>
              <li>Subscription status</li>
            </ul>
            <p className="mt-3 font-semibold">B. Usage and Content Data</p>
            <ul className="list-disc pl-6">
              <li>Prompts entered into the AI system</li>
              <li>Generated content</li>
              <li>Interaction history</li>
              <li>Platform usage analytics</li>
              <li>Device and browser information</li>
              <li>IP address</li>
            </ul>
            <p className="mt-3 font-semibold">C. Payment Information</p>
            <p>
              Payments are processed securely through third-party payment providers. We do not store full payment card details.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">4. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-6">
              <li>Provide AI-generated marketing content</li>
              <li>Maintain and improve the platform</li>
              <li>Manage subscriptions and billing</li>
              <li>Provide customer support</li>
              <li>Ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">5. AI Processing and Third Parties</h2>
            <p>
              To deliver AI functionality, user prompts and content may be processed by trusted third-party service providers,
              including:
            </p>
            <ul className="list-disc pl-6">
              <li>OpenAI (AI processing services)</li>
              <li>Hosting providers</li>
              <li>Analytics providers</li>
              <li>Payment processors</li>
              <li>Meta Platforms (if login integration is used)</li>
            </ul>
            <p className="mt-2">These providers process data only as necessary to deliver services on our behalf.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">6. Data Storage and Retention</h2>
            <ul className="list-disc pl-6">
              <li>User conversations and generated content are stored for up to 3 months, after which they are automatically deleted.</li>
              <li>Account data is retained while your account remains active.</li>
              <li>Subscription and financial records may be retained longer to comply with legal and tax obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">7. Legal Basis for Processing</h2>
            <p>Under GDPR, we process data based on:</p>
            <ul className="list-disc pl-6">
              <li>Contractual necessity (to provide the service you signed up for)</li>
              <li>Legitimate interests (to improve and secure the platform)</li>
              <li>Legal compliance (financial and regulatory requirements)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">8. Your Rights Under GDPR</h2>
            <p>If you are located in the UK or EU, you have the right to:</p>
            <ul className="list-disc pl-6">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Restrict processing</li>
              <li>Object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact: support@miaagent.com</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">9. Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your data against unauthorised access,
              alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">10. International Transfers</h2>
            <p>
              Where data is processed outside the European Economic Area, appropriate safeguards are implemented in accordance
              with GDPR.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised
              "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold">12. Contact</h2>
            <p>MIA Media<br />Spain<br />Email: support@miaagent.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
