// ============================================
// FILE: src/pages/About.jsx
// ============================================
import { Heart, Target, Users, Award, Sparkles, TrendingUp, Shield, Leaf } from 'lucide-react';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <Section size="lg" bg="gradient" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50 via-cream-50 to-brown-50 opacity-50"></div>
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brown-900 mb-6">
              Welcome to{' '}
              <span className="gradient-text">Shina Boutique</span>
            </h1>
            <p className="text-xl text-brown-700 mb-8 leading-relaxed">
              Where tradition meets contemporary elegance. We curate timeless pieces that celebrate 
              individuality, craftsmanship, and sustainable fashion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" onClick={() => navigate('/shop')}>
                Explore Collection
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
                Get in Touch
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Our Story */}
      <Section>
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brown-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-brown-700 leading-relaxed">
                <p>
                  Founded in 2020, Shina Boutique emerged from a passion for creating a shopping experience 
                  that goes beyond mere transactions. We believe that fashion is an expression of identity, 
                  culture, and personal values.
                </p>
                <p>
                  What started as a small collection of handpicked ethnic wear has evolved into a curated 
                  marketplace offering everything from traditional sarees to contemporary fusion wear, 
                  accessories, and home decor that tells a story.
                </p>
                <p>
                  Our journey has been guided by three core principles: quality craftsmanship, sustainable 
                  practices, and exceptional customer service. Every product we offer is carefully selected 
                  to ensure it meets our high standards and resonates with our community's values.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=800&fit=crop"
                  alt="Shina Boutique Store"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section bg="cream">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brown-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-brown-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard
              icon={Heart}
              title="Passion"
              description="We love what we do and it shows in every product we curate and every customer we serve."
              color="red"
            />
            <ValueCard
              icon={Shield}
              title="Quality"
              description="Uncompromising standards in product selection, from materials to craftsmanship."
              color="blue"
            />
            <ValueCard
              icon={Leaf}
              title="Sustainability"
              description="Committed to eco-friendly practices and supporting artisans who share our values."
              color="green"
            />
            <ValueCard
              icon={Users}
              title="Community"
              description="Building relationships with customers, artisans, and partners built on trust and respect."
              color="purple"
            />
          </div>
        </Container>
      </Section>

      {/* Mission & Vision */}
      <Section>
        <Container>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border-2 border-brown-200 p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-terracotta-100 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-terracotta-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Our Mission
              </h3>
              <p className="text-brown-700 leading-relaxed">
                To make quality, sustainable, and culturally rich fashion accessible to everyone. 
                We strive to bridge the gap between traditional craftsmanship and modern aesthetics, 
                creating a platform where heritage meets innovation.
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-brown-200 p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-brown-900 mb-4">
                Our Vision
              </h3>
              <p className="text-brown-700 leading-relaxed">
                To become the most trusted destination for curated ethnic and fusion fashion, 
                recognized for our commitment to quality, sustainability, and celebrating diverse 
                cultures through timeless designs that empower individuals to express their unique style.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Why Choose Us */}
      <Section bg="white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brown-900 mb-4">
              Why Choose Shina Boutique?
            </h2>
            <p className="text-lg text-brown-600 max-w-2xl mx-auto">
              We go the extra mile to ensure your shopping experience is exceptional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Award}
              title="Curated Selection"
              description="Every product is handpicked by our team of fashion experts to ensure the highest quality and style."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Best Value"
              description="Competitive pricing without compromising on quality. Great fashion shouldn't break the bank."
            />
            <FeatureCard
              icon={Heart}
              title="Customer First"
              description="Your satisfaction is our priority. Responsive support, easy returns, and hassle-free shopping."
            />
          </div>
        </Container>
      </Section>

      {/* Stats */}
      <Section bg="cream">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBox number="5000+" label="Happy Customers" />
            <StatBox number="10,000+" label="Products Sold" />
            <StatBox number="50+" label="Artisan Partners" />
            <StatBox number="4.8/5" label="Average Rating" />
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section bg="gradient" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-100 via-cream-100 to-brown-100 opacity-50"></div>
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brown-900 mb-4">
              Join Our Story
            </h2>
            <p className="text-lg text-brown-700 mb-8">
              Become part of the Shina Boutique family and discover fashion that speaks to your soul
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" onClick={() => navigate('/shop')}>
                Start Shopping
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
                Contact Us
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
};

// Value Card Component
const ValueCard = ({ icon: Icon, title, description, color }) => {
  const colorClasses = {
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl border border-brown-200 p-6 hover:shadow-lg transition-shadow">
      <div className={`w-14 h-14 rounded-full ${colorClasses[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-display font-bold text-brown-900 mb-3">
        {title}
      </h3>
      <p className="text-brown-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-cream-50 rounded-xl border border-brown-200 p-6 hover:shadow-md transition-shadow text-center">
      <div className="w-16 h-16 rounded-full bg-terracotta-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-terracotta-600" />
      </div>
      <h3 className="text-xl font-display font-bold text-brown-900 mb-3">
        {title}
      </h3>
      <p className="text-brown-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

// Stat Box Component
const StatBox = ({ number, label }) => {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-display font-bold text-terracotta-600 mb-2">
        {number}
      </div>
      <div className="text-sm md:text-base text-brown-700">
        {label}
      </div>
    </div>
  );
};

export default About;