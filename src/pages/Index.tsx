
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import Navbar from '@/components/Navbar';

const Index: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getFeaturedProducts(4);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="container mx-auto px-6 py-16 lg:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-gray-900 max-w-3xl">
            Exquisite jewelry for every occasion
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl">
            Handcrafted pieces that tell your unique story. Our collection combines timeless elegance with contemporary design.
          </p>
          <div className="mt-8">
            <Button asChild className="bg-gold hover:bg-gold-dark text-white px-8 py-6 rounded-md text-lg">
              <Link to="/products">Explore Collection</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif font-medium text-gray-900">Featured Jewelry</h2>
            <Link to="/products" className="text-gold hover:text-gold-dark transition-colors font-medium">
              View All →
            </Link>
          </div>
          
          {isLoading ? (
            <SkeletonLoader type="card" count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* About/Story Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <h2 className="text-3xl font-serif font-medium text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Las Joyas de Mel began with a passion for creating unique pieces that celebrate individuality and beauty. 
                Each item in our collection is thoughtfully designed and meticulously crafted to become treasured keepsakes.
              </p>
              <p className="text-gray-600">
                We source only the finest materials, ensuring that every piece not only looks stunning but stands the test of time.
                Our commitment to quality and attention to detail is evident in every creation.
              </p>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8amV3ZWxyeSUyMHNob3B8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" 
                  alt="Jewelry workshop" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter/Contact */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-medium text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Be the first to know about new collections, special events, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
            <Input placeholder="Your email address" className="sm:flex-1" />
            <Button className="bg-gold hover:bg-gold-dark whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} Las Joyas de Mel. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/products" className="text-gray-500 hover:text-gold transition-colors">
                Products
              </Link>
              <Link to="/login" className="text-gray-500 hover:text-gold transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
