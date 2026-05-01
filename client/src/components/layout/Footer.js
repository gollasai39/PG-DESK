import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-600 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-700 opacity-10 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-3 rounded-2xl shadow-lg">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">PG Desk</span>
                <p className="text-sm text-gray-400">Find Your Perfect Stay</p>
              </div>
            </div>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed max-w-2xl">
              India's Number one PG and Hostel Software. Find the perfect PG accommodation 
              with our comprehensive platform designed for students and professionals.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => window.open('https://facebook.com/pgdesk', '_blank')}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button 
                onClick={() => window.open('https://twitter.com/pgdesk', '_blank')}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                aria-label="Visit our Twitter page"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button 
                onClick={() => window.open('https://instagram.com/pgdesk', '_blank')}
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                aria-label="Visit our Instagram page"
              >
                <Instagram className="h-5 w-5" />
              </button>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                  <span className="w-1 h-1 bg-primary-400 rounded-full"></span>
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                  <span className="w-1 h-1 bg-primary-400 rounded-full"></span>
                  <span>Services</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                  <span className="w-1 h-1 bg-primary-400 rounded-full"></span>
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                  <span className="w-1 h-1 bg-primary-400 rounded-full"></span>
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center group-hover:bg-primary-600/30 transition-colors duration-200">
                  <Mail className="h-5 w-5 text-primary-400" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-200">info@pgdesk.com</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center group-hover:bg-primary-600/30 transition-colors duration-200">
                  <Phone className="h-5 w-5 text-primary-400" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-200">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center group-hover:bg-primary-600/30 transition-colors duration-200">
                  <MapPin className="h-5 w-5 text-primary-400" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-200">
                  Bangalore, Hyderabad, Chennai, Mumbai
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              © 2024 PG Desk. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/refund" className="text-gray-400 hover:text-white transition-colors duration-200">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
