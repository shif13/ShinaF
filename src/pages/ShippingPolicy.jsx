// ============================================
// FILE: src/pages/ShippingPolicy.jsx
// ============================================
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';

const ShippingPolicy = () => {
  return (
    <>
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <h1 className="text-4xl font-display font-bold text-brown-900">
            Shipping Policy
          </h1>
          <p className="text-brown-600 mt-2">Fast and reliable delivery</p>
        </Container>
      </Section>

      <Section>
        <Container size="sm">
          <div className="prose prose-brown max-w-none space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Shipping Methods & Timeframes
              </h2>
              <div className="bg-cream-50 rounded-lg p-6 border border-brown-200 mb-4">
                <div className="grid gap-4">
                  <div>
                    <h3 className="font-semibold text-brown-900 mb-1">
                      Standard Shipping (FREE over ₹1,000)
                    </h3>
                    <p className="text-sm text-brown-700">3-5 business days</p>
                    <p className="text-sm text-brown-600">₹50 for orders under ₹1,000</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brown-900 mb-1">
                      Express Shipping
                    </h3>
                    <p className="text-sm text-brown-700">1-2 business days</p>
                    <p className="text-sm text-brown-600">₹150</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Order Processing
              </h2>
              <p className="text-brown-700 leading-relaxed">
                Orders are typically processed within 1-2 business days. You will receive a tracking number once your order ships.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Shipping Restrictions
              </h2>
              <p className="text-brown-700 leading-relaxed">
                Currently, we ship to all locations within India. International shipping is not available at this time.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Tracking Your Order
              </h2>
              <p className="text-brown-700 leading-relaxed">
                Once your order ships, you'll receive an email with tracking information. You can also track your order by logging into your account and visiting the Orders page.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default ShippingPolicy;