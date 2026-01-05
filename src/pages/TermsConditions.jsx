// ============================================
// FILE: src/pages/TermsConditions.jsx
// ============================================
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';

const TermsConditions = () => {
  return (
    <>
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <h1 className="text-4xl font-display font-bold text-brown-900">
            Terms & Conditions
          </h1>
          <p className="text-brown-600 mt-2">Last updated: January 2024</p>
        </Container>
      </Section>

      <Section>
        <Container size="sm">
          <div className="prose prose-brown max-w-none space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-brown-700 leading-relaxed">
                By accessing and using Shina Boutique, you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                2. Use of Service
              </h2>
              <p className="text-brown-700 leading-relaxed mb-3">
                You agree to use our services only for lawful purposes and in accordance with these terms. You must not:
              </p>
              <ul className="list-disc pl-6 text-brown-700 space-y-2">
                <li>Use our service in any way that violates any applicable law</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt our services</li>
                <li>Use our service for fraudulent purposes</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                3. Account Registration
              </h2>
              <p className="text-brown-700 leading-relaxed">
                To make purchases, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                4. Products and Pricing
              </h2>
              <p className="text-brown-700 leading-relaxed">
                All product descriptions, images, and prices are subject to change without notice. We reserve the right to limit quantities and refuse service to anyone.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                5. Payment Terms
              </h2>
              <p className="text-brown-700 leading-relaxed">
                All payments are processed securely through our payment gateway. We accept major credit cards, debit cards, and UPI payments.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-brown-700 leading-relaxed">
                Shina Boutique shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                7. Contact Information
              </h2>
              <p className="text-brown-700 leading-relaxed">
                For any questions about these Terms & Conditions, please contact us at legal@shinaboutique.com
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default TermsConditions;