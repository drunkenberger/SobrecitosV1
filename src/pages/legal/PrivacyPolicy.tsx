import LegalPage from "@/components/legal/LegalPage";

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      content={
        <>
          <p className="lead">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2>1. Introduction</h2>
          <p>
            Sobrecitos ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how your information is
            collected, used, and disclosed when you use our budget management
            application.
          </p>

          <h2>2. Information We Don't Collect</h2>
          <p>
            Sobrecitos is designed with privacy in mind. We do not collect,
            store, or process any of your financial data on our servers. All
            your budget information, expenses, and financial data are stored
            locally on your device.
          </p>

          <h2>3. Local Storage</h2>
          <p>
            All your data is stored in your browser's local storage. This means:
          </p>
          <ul>
            <li>Your financial data never leaves your device</li>
            <li>We cannot access your financial information</li>
            <li>
              Your data persists between sessions but can be cleared by clearing
              your browser data
            </li>
          </ul>

          <h2>4. AI Features</h2>
          <p>If you choose to enable AI features:</p>
          <ul>
            <li>
              Data is processed through your chosen AI provider (e.g., OpenAI,
              Google)
            </li>
            <li>
              You must review and agree to the AI provider's privacy policy
            </li>
            <li>AI features are optional and can be disabled at any time</li>
          </ul>

          <h2>5. Data Export and Backup</h2>
          <p>
            You can export your data at any time using our export feature. The
            exported file contains all your budget data and can be used for
            backup or transfer to another device.
          </p>

          <h2>6. Cookies</h2>
          <p>
            We use only essential cookies necessary for the application to
            function, such as theme preferences. No tracking or analytics
            cookies are used.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
            <br />
            Email: privacy@sobrecitos.net
          </p>
        </>
      }
    />
  );
}
