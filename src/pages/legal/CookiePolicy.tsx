import LegalPage from "@/components/legal/LegalPage";
import SEO from "@/components/SEO";

export default function CookiePolicy() {
  return (
    <div>
      <SEO 
        title="Cookie Policy - Sobrecitos Budget Manager"
        description="Understand how Sobrecitos uses cookies to enhance your budget management experience while maintaining your privacy and data security."
        keywords="cookie policy, website cookies, privacy settings, data preferences, browser cookies, cookie usage, privacy protection"
      />
      <LegalPage
        title="Cookie Policy"
        content={
          <>
            <p className="lead">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device when you
              visit a website. They are widely used to make websites work more
              efficiently and provide basic functionality.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>
              Sobrecitos uses only essential cookies that are necessary for the
              application to function properly. We use cookies for:
            </p>
            <ul>
              <li>Remembering your theme preferences (light/dark mode)</li>
              <li>Maintaining your session state</li>
              <li>Storing your AI settings (if enabled)</li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>
            <h3>Essential Cookies</h3>
            <ul>
              <li>ui-theme: Stores your theme preference</li>
              <li>budget_ai_settings: Stores your AI feature preferences</li>
            </ul>

            <h2>4. No Tracking Cookies</h2>
            <p>
              We do not use any tracking, advertising, or analytics cookies. We do
              not collect any data about your browsing behavior.
            </p>

            <h2>5. Local Storage</h2>
            <p>
              In addition to cookies, we use browser local storage to store your
              budget data. This data includes:
            </p>
            <ul>
              <li>Your budget categories and amounts</li>
              <li>Your expenses and income records</li>
              <li>Your savings goals</li>
            </ul>

            <h2>6. Managing Cookies</h2>
            <p>
              You can control and/or delete cookies as you wish. You can delete
              all cookies that are already on your device and you can set most
              browsers to prevent them from being placed.
            </p>

            <h2>7. Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us
              at:
              <br />
              Email: privacy@sobrecitos.net
            </p>
          </>
        }
      />
    </div>
  );
}
