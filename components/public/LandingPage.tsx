import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ShoppingBag, Store, MapPin, Truck, Shield, Zap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Modern infographic-style landing page */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl mb-4">ValueFind Pro</h1>
          <p className="text-xl mb-8">Complete Multi-Tenant E-Commerce Platform</p>
          <div className="flex gap-4 justify-center">
            <Link to="/register"><Button size="lg">Get Started</Button></Link>
            <Link to="/login"><Button size="lg" variant="outline">Sign In</Button></Link>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl mb-2">Secure & Trusted</h3>
              <p>Bank-grade security with complete KYC verification</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <Zap className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl mb-2">Lightning Fast</h3>
              <p>Optimized performance for seamless experience</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <MapPin className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-xl mb-2">Pincode-Based</h3>
              <p>Smart territory-wise operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">Join As</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShoppingBag, title: 'Customer', desc: 'Shop & Save', color: 'blue' },
              { icon: Store, title: 'Store Owner', desc: 'Sell & Grow', color: 'purple' },
              { icon: MapPin, title: 'Network Operator', desc: 'Manage & Earn', color: 'green' },
              { icon: Truck, title: 'Delivery Partner', desc: 'Deliver & Earn', color: 'orange' },
            ].map((type, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <type.icon className={`h-12 w-12 text-${type.color}-600 mb-4`} />
                <h3 className="text-xl mb-2">{type.title}</h3>
                <p className="text-gray-600 mb-4">{type.desc}</p>
                <Link to="/register"><Button variant="outline" size="sm">Join Now</Button></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
