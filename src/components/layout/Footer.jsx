import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import Container from '../ui/Container';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-brown-900 text-cream-50">
      {/* Main Footer */}
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="text-2xl font-display font-bold">
                <span className="text-terracotta-400">Shina</span>
                <span className="text-cream-50"> Boutique</span>
              </div>
              
              <p className="text-cream-200 text-sm leading-relaxed">
                Discover timeless elegance and traditional charm in every piece. 
                Crafting beauty for modern Indian living.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-brown-800 hover:bg-terracotta-600 rounded-lg transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-brown-800 hover:bg-terracotta-600 rounded-lg transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-brown-800 hover:bg-terracotta-600 rounded-lg transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link 
                    to="/shop" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/shop?subcategory=WOMEN" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    Women's Collection
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/shop?subcategory=MEN" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    Men's Collection
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/shop?category=HOMEDECOR" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    Home Decor
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Customer Service */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">Customer Service</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link 
                    to="/orders" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/shipping" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/returns" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    Returns & Exchange
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/faq" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-terracotta-400 flex-shrink-0 mt-0.5" />
                  <p className="text-cream-200 text-sm">
                    123 Boutique Street,<br />
                    Chennai, Tamil Nadu 600001
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-terracotta-400 flex-shrink-0" />
                  <a 
                    href="tel:+919876543210" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    +91 98765 43210
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-terracotta-400 flex-shrink-0" />
                  <a 
                    href="mailto:hello@shinaboutique.com" 
                    className="text-cream-200 hover:text-terracotta-400 transition-colors text-sm"
                  >
                    hello@shinaboutique.com
                  </a>
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="mt-6">
                <p className="text-sm text-cream-200 mb-3">Subscribe to our newsletter</p>
                <form className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-brown-800 border border-brown-700 rounded-lg text-cream-50 placeholder:text-brown-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500 text-sm"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-terracotta-600 hover:bg-terracotta-700 rounded-lg transition-colors active:scale-95 text-sm font-medium"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Bottom Bar */}
      <div className="border-t border-brown-800">
        <Container>
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-cream-300">
              © {currentYear} Shina Boutique. All rights reserved.
            </p>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-cream-300 text-xs">We accept:</span>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-white rounded text-xs font-semibold text-brown-900">
                  VISA
                </div>
                <div className="px-2 py-1 bg-white rounded text-xs font-semibold text-brown-900">
                  MC
                </div>
                <div className="px-2 py-1 bg-white rounded text-xs font-semibold text-brown-900">
                  UPI
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;