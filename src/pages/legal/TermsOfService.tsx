import LegalPage from "@/components/legal/LegalPage";
import SEO from "@/components/SEO";

export default function TermsOfService() {
  return (
    <div>
      <SEO 
        title="Terms of Service - Sobrecitos Budget Manager"
        description="Read Sobrecitos' terms of service and understand how to use our family budget management platform. Clear, fair terms for our users."
        keywords="terms of service, user agreement, budget app terms, service conditions, legal terms, usage terms, user rights"
      />
      <LegalPage
        title="Terms of Service"
        content={
          <>
            <p className="lead">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Sobrecitos, you agree to be bound by these
              Terms of Service and all applicable laws and regulations.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Sobrecitos is a browser-based budget management application that
              allows users to track expenses, manage budgets, and set financial
              goals. All data is stored locally on your device.
            </p>

            <h2>3. User Responsibilities</h2>
            <ul>
              <li>
                You are responsible for maintaining the security of your device
              </li>
              <li>You are responsible for backing up your data regularly</li>
              <li>
                You agree not to modify, reverse engineer, or attempt to gain
                unauthorized access to the service
              </li>
            </ul>

            <h2>4. Data Storage and Privacy</h2>
            <p>
              Your financial data is stored locally on your device. We do not
              collect, store, or have access to your financial information. You
              are responsible for:
            </p>
            <ul>
              <li>Maintaining backups of your data</li>
              <li>Securing your device and browser</li>
              <li>Managing your local storage settings</li>
            </ul>

            <h2>5. AI Features</h2>
            <p>If you choose to use AI features:</p>
            <ul>
              <li>You must provide your own API keys for AI services</li>
              <li>
                You agree to the terms of service of the AI provider you choose
              </li>
              <li>
                We are not responsible for the accuracy of AI-generated advice
              </li>
            </ul>

            <h2>6. Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" without any warranties, express or
              implied. We do not guarantee that the service will be error-free or
              uninterrupted.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              We shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages resulting from your use of or
              inability to use the service.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Your
              continued use of the service after such modifications constitutes
              acceptance of the updated terms.
            </p>

            <h2>9. Contact</h2>
            <p>
              For questions about these Terms, please contact us at:
              <br />
              Email: legal@sobrecitos.net
            </p>
          </>
        }
      />
    </div>
  );
}
