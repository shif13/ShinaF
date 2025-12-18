import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Truck, Shield } from 'lucide-react';
import Container from '../components/ui/Container';
import Section from '../components/ui/Section';
import Button from '../components/common/Button';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <Section size="lg" className="bg-gradient-to-br from-cream-100 via-cream-50 to-terracotta-50">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="mb-6 animate-slide-in-up">
              Welcome to <span className="gradient-text">Shina Boutique</span>
            </h1>
            <p className="text-xl md:text-2xl text-brown-600 mb-8 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              Discover timeless elegance in every piece
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/shop">
                <Button variant="primary" size="lg" leftIcon={<ShoppingBag className="w-5 h-5" />}>
                  Shop Now
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-terracotta-100 flex items-center justify-center">
                <Truck className="w-6 h-6 text-terracotta-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
              <p className="text-brown-600 text-sm">On orders over ₹1000</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-terracotta-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-terracotta-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
              <p className="text-brown-600 text-sm">100% secure transactions</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-terracotta-100 flex items-center justify-center">
                <Heart className="w-6 h-6 text-terracotta-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Products</h3>
              <p className="text-brown-600 text-sm">Handpicked with care</p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-terracotta-100 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-terracotta-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
              <p className="text-brown-600 text-sm">30-day return policy</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section bg="cream" className="text-center">
        <Container size="sm">
          <h2 className="mb-4">Start Your Shopping Journey</h2>
          <p className="text-lg text-brown-600 mb-8">
            Browse our curated collection of beautiful products
          </p>
          <Link to="/shop">
            <Button variant="primary" size="lg">
              Explore Collections
            </Button>
          </Link>
        </Container>
      </Section>
    </>
  );
};

export default Home;