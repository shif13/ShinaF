// ============================================
// FILE: src/pages/Contact.jsx
// ============================================
import { useState } from 'react';
import { 
  Mail, Phone, MapPin, Clock, Send, MessageSquare, 
  Facebook, Instagram, Twitter, Linkedin
} from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await client.post('/contact', formData);
      
      if (response.data.success) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <Section size="sm" bg="gradient" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50 via-cream-50 to-brown-50 opacity-50"></div>
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brown-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-brown-700">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </Container>
      </Section>

      {/* Contact Info Cards */}
      <Section size="sm" bg="white">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ContactInfoCard
              icon={Mail}
              title="Email"
              info="support@shinaboutique.com"
              subInfo="We reply within 24 hours"
              color="blue"
            />
            <ContactInfoCard
              icon={Phone}
              title="Phone"
              info="+91 98765 43210"
              subInfo="Mon-Sat, 9AM-6PM IST"
              color="green"
            />
            <ContactInfoCard
              icon={MapPin}
              title="Address"
              info="123 Fashion Street"
              subInfo="Mumbai, Maharashtra 400001"
              color="red"
            />
            <ContactInfoCard
              icon={Clock}
              title="Working Hours"
              info="Mon - Sat"
              subInfo="9:00 AM - 6:00 PM"
              color="amber"
            />
          </div>
        </Container>
      </Section>

      {/* Contact Form & Info */}
      <Section>
        <Container>
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border-2 border-brown-200 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-display font-bold text-brown-900 mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-brown-600">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      name="name"
                      label="Your Name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      type="email"
                      name="email"
                      label="Your Email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Input
                    type="text"
                    name="subject"
                    label="Subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="block text-sm font-medium text-brown-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows="6"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    leftIcon={<Send className="w-5 h-5" />}
                    isLoading={loading}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Contact */}
              <div className="bg-cream-50 rounded-2xl border border-brown-200 p-6">
                <h3 className="text-xl font-display font-bold text-brown-900 mb-4">
                  Quick Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-brown-900">Email Us</div>
                      <a 
                        href="mailto:support@shinaboutique.com"
                        className="text-sm text-brown-600 hover:text-terracotta-600 transition-colors"
                      >
                        support@shinaboutique.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-brown-900">Call Us</div>
                      <a 
                        href="tel:+919876543210"
                        className="text-sm text-brown-600 hover:text-terracotta-600 transition-colors"
                      >
                        +91 98765 43210
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-brown-900">Live Chat</div>
                      <button className="text-sm text-brown-600 hover:text-terracotta-600 transition-colors">
                        Start a conversation
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl border-2 border-brown-200 p-6">
                <h3 className="text-xl font-display font-bold text-brown-900 mb-4">
                  Follow Us
                </h3>
                <p className="text-sm text-brown-600 mb-4">
                  Stay connected with us on social media for updates, offers, and more!
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center hover:bg-pink-200 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-pink-600" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center hover:bg-sky-200 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5 text-sky-600" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-blue-700" />
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-terracotta-50 rounded-2xl border border-terracotta-200 p-6">
                <h3 className="text-xl font-display font-bold text-brown-900 mb-4">
                  Business Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brown-700">Monday - Friday</span>
                    <span className="font-medium text-brown-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brown-700">Saturday</span>
                    <span className="font-medium text-brown-900">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brown-700">Sunday</span>
                    <span className="font-medium text-brown-900">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Map */}
      <Section bg="white" size="sm">
        <Container>
          <div className="bg-cream-50 rounded-2xl border border-brown-200 overflow-hidden">
            <div className="aspect-video bg-brown-200 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-brown-600" />
                <h3 className="text-xl font-display font-bold text-brown-900 mb-2">
                  Visit Our Store
                </h3>
                <p className="text-brown-700 mb-4">
                  123 Fashion Street, Mumbai, Maharashtra 400001
                </p>
                <Button
                  variant="primary"
                  onClick={() => window.open('https://maps.google.com', '_blank')}
                >
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQs */}
      <Section bg="cream">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brown-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-brown-600">
                Quick answers to common questions
              </p>
            </div>

            <div className="space-y-4">
              <FAQItem
                question="What are your shipping times?"
                answer="We typically process orders within 1-2 business days. Delivery usually takes 3-5 business days for domestic orders and 7-14 days for international orders."
              />
              <FAQItem
                question="What is your return policy?"
                answer="We offer a 30-day return policy for most items. Products must be unused, in original packaging, and with tags attached. Please contact our support team to initiate a return."
              />
              <FAQItem
                question="Do you ship internationally?"
                answer="Yes! We ship to most countries worldwide. Shipping costs and delivery times vary by location. International customers are responsible for any customs duties or taxes."
              />
              <FAQItem
                question="How can I track my order?"
                answer="Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the Orders page."
              />
              <FAQItem
                question="Do you offer gift wrapping?"
                answer="Yes! We offer complimentary gift wrapping for all orders. Simply select the gift wrap option during checkout and include your personalized message."
              />
            </div>

            <div className="mt-12 text-center">
              <p className="text-brown-700 mb-4">
                Still have questions?
              </p>
              <Button variant="primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Contact Us
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

// Contact Info Card Component
const ContactInfoCard = ({ icon: Icon, title, info, subInfo, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <div className="bg-white rounded-xl border border-brown-200 p-6 hover:shadow-lg transition-shadow text-center">
      <div className={`w-14 h-14 rounded-full ${colorClasses[color]} flex items-center justify-center mx-auto mb-4`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display font-bold text-brown-900 mb-2">
        {title}
      </h3>
      <p className="font-medium text-brown-900 mb-1">
        {info}
      </p>
      <p className="text-sm text-brown-600">
        {subInfo}
      </p>
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-brown-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-cream-50 transition-colors"
      >
        <span className="font-semibold text-brown-900">{question}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-brown-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4 text-brown-700 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export default Contact;