// ============================================
// FILE: src/components/checkout/StripePayment.jsx
// ============================================
import { useState } from 'react';
import { 
  PaymentElement, 
  useStripe, 
  useElements,
  CardElement 
} from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const StripePayment = ({ amount, orderId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?orderId=${orderId}`,
        },
        redirect: 'if_required'
      });

      if (stripeError) {
        setError(stripeError.message);
        toast.error(stripeError.message);
        if (onError) onError(stripeError);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        toast.success('Payment successful!');
        if (onSuccess) onSuccess(paymentIntent);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Payment failed');
      if (onError) onError(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div>
        <label className="block text-sm font-medium text-brown-700 mb-3">
          Payment Details
        </label>
        <div className="p-4 border-2 border-brown-200 rounded-lg bg-white">
          <PaymentElement 
            options={{
              layout: 'tabs',
              paymentMethodOrder: ['card', 'upi'],
            }}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Payment Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Display */}
      {succeeded && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900">Payment Successful!</p>
            <p className="text-sm text-green-700 mt-1">Your order has been confirmed.</p>
          </div>
        </div>
      )}

      {/* Amount Display */}
      <div className="flex items-center justify-between p-4 bg-cream-50 rounded-lg border border-brown-200">
        <span className="text-brown-700 font-medium">Total Amount</span>
        <span className="text-2xl font-bold text-terracotta-600">
          ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-xs text-brown-600 bg-blue-50 p-3 rounded-lg">
        <Lock className="w-4 h-4 text-blue-600" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!stripe || processing || succeeded}
        isLoading={processing}
        leftIcon={<CreditCard className="w-5 h-5" />}
      >
        {processing ? 'Processing...' : succeeded ? 'Payment Complete' : `Pay ₹${amount.toLocaleString('en-IN')}`}
      </Button>

      {/* Payment Methods Info */}
      <div className="text-center">
        <p className="text-xs text-brown-500 mb-2">We accept</p>
        <div className="flex items-center justify-center gap-3">
          <div className="px-3 py-1 bg-white border border-brown-200 rounded text-xs font-semibold text-brown-900">
            VISA
          </div>
          <div className="px-3 py-1 bg-white border border-brown-200 rounded text-xs font-semibold text-brown-900">
            Mastercard
          </div>
          <div className="px-3 py-1 bg-white border border-brown-200 rounded text-xs font-semibold text-brown-900">
            RuPay
          </div>
          <div className="px-3 py-1 bg-white border border-brown-200 rounded text-xs font-semibold text-brown-900">
            UPI
          </div>
        </div>
      </div>
    </form>
  );
};

// Alternative: Simple Card Element (if you want a simpler implementation)
export const SimpleCardPayment = ({ amount, orderId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Poppins", sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message);
        toast.error(stripeError.message);
        if (onError) onError(stripeError);
      } else {
        // Call your backend to complete the payment
        if (onSuccess) onSuccess(paymentMethod);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred');
      if (onError) onError(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-brown-700 mb-3">
          Card Details
        </label>
        <div className="p-4 border-2 border-brown-200 rounded-lg bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!stripe || processing}
        isLoading={processing}
        leftIcon={<CreditCard className="w-5 h-5" />}
      >
        {processing ? 'Processing...' : `Pay ₹${amount.toLocaleString('en-IN')}`}
      </Button>
    </form>
  );
};

export default StripePayment;