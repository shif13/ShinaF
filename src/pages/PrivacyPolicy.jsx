// ============================================
// FILE: src/pages/PrivacyPolicy.jsx
// ============================================
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';

const PrivacyPolicy = () => {
  return (
    <>
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <h1 className="text-4xl font-display font-bold text-brown-900">
            Privacy Policy
          </h1>
          <p className="text-brown-600 mt-2">Last updated: January 2024</p>
        </Container>
      </Section>

      <Section>
        <Container size="sm">
          <div className="prose prose-brown max-w-none space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Information We Collect
              </h2>
              <p className="text-brown-700 leading-relaxed mb-3">
                We collect information that you provide directly to us:
              </p>
              <ul className="list-disc pl-6 text-brown-700 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information (processed securely)</li>
                <li>Order history and preferences</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-brown-700 leading-relaxed mb-3">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 text-brown-700 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and updates</li>
                <li>Improve our products and services</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Prevent fraud and enhance security</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Data Security
              </h2>
              <p className="text-brown-700 leading-relaxed">
                We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Your Rights
              </h2>
              <p className="text-brown-700 leading-relaxed">
                You have the right to access, update, or delete your personal information. Contact us at privacy@shinaboutique.com for any requests.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Cookies
              </h2>
              <p className="text-brown-700 leading-relaxed">
                We use cookies to enhance your browsing experience and remember your preferences. You can disable cookies in your browser settings, but some features may not work properly.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Third-Party Services
              </h2>
              <p className="text-brown-700 leading-relaxed">
                We may use third-party services for payment processing and analytics. These services have their own privacy policies governing the use of your information.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default PrivacyPolicy;