// src/pages/PaymentFailed.jsx
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('orderId');
  const error = searchParams.get('error') || 'Payment was declined';

  const commonIssues = [
    {
      title: 'Insufficient Funds',
      description: 'Your card may not have enough balance',
      solution: 'Try a different payment method'
    },
    {
      title: 'Card Declined',
      description: 'Your bank declined the transaction',
      solution: 'Contact your bank or try another card'
    },
    {
      title: 'Incorrect Details',
      description: 'Card number, CVV, or expiry date may be wrong',
      solution: 'Double-check your card information'
    },
    {
      title: 'Network Issue',
      description: 'Connection was interrupted',
      solution: 'Check your internet and try again'
    }
  ];

  return (
    <Section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-cream-50 to-brown-50">
      <Container size="sm">
        <div className="max-w-2xl mx-auto">
          {/* Error Card */}
          <div className="bg-white rounded-2xl shadow-strong border-2 border-red-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                Payment Failed
              </h1>
              <p className="text-red-50 text-lg">
                We couldn't process your payment
              </p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Error Message */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-red-800">
                  <strong>Error:</strong> {error}
                </p>
              </div>

              {/* What You Can Do */}
              <div>
                <h3 className="font-display font-bold text-brown-900 text-lg mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-brown-600" />
                  What you can do:
                </h3>
                
                <div className="space-y-3">
                  {commonIssues.map((issue, index) => (
                    <div
                      key={index}
                      className="bg-cream-50 rounded-lg p-4 border border-brown-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-brown-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-brown-700">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-brown-900 mb-1">
                            {issue.title}
                          </h4>
                          <p className="text-sm text-brown-600 mb-1">
                            {issue.description}
                          </p>
                          <p className="text-xs text-terracotta-600 font-medium">
                            → {issue.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  leftIcon={<RefreshCw className="w-5 h-5" />}
                  onClick={() => orderId ? navigate(`/checkout?orderId=${orderId}`) : navigate('/cart')}
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  leftIcon={<ArrowLeft className="w-5 h-5" />}
                  onClick={() => navigate('/cart')}
                >
                  Back to Cart
                </Button>
              </div>

              {/* Support */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
                <p className="text-sm text-blue-900 mb-2">
                  <strong>Still having trouble?</strong>
                </p>
                <p className="text-sm text-blue-800">
                  Our support team is here to help.{' '}
                  <button
                    onClick={() => navigate('/contact')}
                    className="text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    Contact Support
                  </button>
                </p>
              </div>

              {/* Payment Methods Info */}
              <div className="text-center pt-4 border-t border-brown-200">
                <p className="text-xs text-brown-600 mb-2">We accept</p>
                <div className="flex items-center justify-center gap-3">
                  <div className="px-3 py-1 bg-white border border-brown-200 rounded text-xs font-semibold">
                    VISA
                  </div>
                  <div className="px-3 py-1 bg-white border border-brown-200 rounded text-xs font-semibold">
                    Mastercard
                  </div>
                  <div className="px-3 py-1 bg-white border border-brown-200 rounded text-xs font-semibold">
                    RuPay
                  </div>
                  <div className="px-3 py-1 bg-white border border-brown-200 rounded text-xs font-semibold">
                    UPI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default PaymentFailed;