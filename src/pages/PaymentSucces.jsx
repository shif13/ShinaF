// ============================================
// FILE: src/pages/PaymentSuccess.jsx
// ============================================
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Download } from 'lucide-react';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';
import { InlineLoader } from '../components/common/Spinner';
import client from '../api/client';
import Confetti from 'react-confetti';
import { useWindowSize } from '../hooks/useWindowSize';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { width, height } = useWindowSize();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      navigate('/orders');
      return;
    }
    
    fetchOrder();
    
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [orderId, navigate]);

  const fetchOrder = async () => {
    try {
      const response = await client.get(`/orders/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Section className="min-h-screen flex items-center justify-center">
        <InlineLoader text="Loading order details..." />
      </Section>
    );
  }

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
      
      <Section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-cream-50 to-terracotta-50">
        <Container size="sm">
          <div className="max-w-2xl mx-auto">
            {/* Success Card */}
            <div className="bg-white rounded-2xl shadow-strong border-2 border-green-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                  Payment Successful! 🎉
                </h1>
                <p className="text-green-50 text-lg">
                  Your order has been confirmed
                </p>
              </div>

              {/* Order Details */}
              <div className="p-8 space-y-6">
                {order && (
                  <>
                    <div className="bg-cream-50 rounded-lg p-6 border border-brown-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-brown-600 mb-1">Order Number</p>
                          <p className="font-bold text-brown-900 font-mono">
                            #{order.orderNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-brown-600 mb-1">Order Total</p>
                          <p className="font-bold text-2xl text-terracotta-600">
                            ₹{order.total.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div>
                          <p className="text-brown-600 mb-1">Payment Status</p>
                          <p className="font-semibold text-green-600">Paid</p>
                        </div>
                        <div>
                          <p className="text-brown-600 mb-1">Items</p>
                          <p className="font-semibold text-brown-900">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* What's Next */}
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <h3 className="font-display font-bold text-blue-900 text-lg mb-3 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        What happens next?
                      </h3>
                      <ol className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <span className="font-bold">1.</span>
                          <span>You'll receive an order confirmation email shortly</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold">2.</span>
                          <span>We'll send you tracking details once your order ships</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold">3.</span>
                          <span>Expected delivery: 3-5 business days</span>
                        </li>
                      </ol>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    leftIcon={<Package className="w-5 h-5" />}
                    onClick={() => navigate(`/orders/${orderId}`)}
                  >
                    View Order Details
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    leftIcon={<ArrowRight className="w-5 h-5" />}
                    onClick={() => navigate('/shop')}
                  >
                    Continue Shopping
                  </Button>
                </div>

                {/* Download Invoice */}
                <div className="text-center">
                  <button
                    onClick={() => window.print()}
                    className="text-sm text-brown-600 hover:text-terracotta-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="mt-8 text-center">
              <p className="text-brown-600 text-sm">
                Need help with your order?{' '}
                <button
                  onClick={() => navigate('/contact')}
                  className="text-terracotta-600 hover:text-terracotta-700 font-medium"
                >
                  Contact Support
                </button>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default PaymentSuccess;