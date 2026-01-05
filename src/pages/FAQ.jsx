// ============================================
// FILE: src/pages/FAQ.jsx
// ============================================
import { useState } from 'react';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the Orders page."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, RuPay), debit cards, UPI, and net banking through our secure payment gateway."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we only ship within India. International shipping may be available in the future."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available for an additional fee."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be unused, in original packaging, with tags attached."
    },
    {
      question: "How do I cancel my order?",
      answer: "You can cancel your order within 24 hours of placement by visiting your Order History page. After 24 hours, please contact customer support."
    },
    {
      question: "Are the colors accurate on the website?",
      answer: "We try our best to display accurate colors, but slight variations may occur due to monitor settings. If you're not satisfied, you can return the item."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us via email at support@shinaboutique.com, call us at +91 98765 43210, or use the contact form on our Contact page."
    }
  ];

  return (
    <>
      <Section size="sm" bg="white" className="border-b border-brown-100">
        <Container>
          <h1 className="text-4xl font-display font-bold text-brown-900">
            Frequently Asked Questions
          </h1>
          <p className="text-brown-600 mt-2">Find answers to common questions</p>
        </Container>
      </Section>

      <Section>
        <Container size="sm">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-brown-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-cream-50 transition-colors"
                >
                  <span className="font-semibold text-brown-900 pr-4">
                    {faq.question}
                  </span>
                  <span className={`transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}>
                    <svg
                      className="w-5 h-5 text-brown-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 text-brown-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
};

export default FAQ;