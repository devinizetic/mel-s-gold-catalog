
import React, { useState, useEffect } from "react";
import { getCategories } from "@/lib/supabaseClient";
import CategoryCard from "@/components/CategoryCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Category } from "@/types";
import Navbar from "@/components/Navbar";

const Index: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(194,158,113,0.1),transparent_50%)]"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-gray-900 mb-8 tracking-wide">
              Las Joyas de Mel
            </h1>
            <div className="w-24 h-px bg-gold mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto mb-12">
              Descubre nuestra selección exclusiva de joyas elegantes, cuidadosamente elegidas para cada ocasión especial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/products" 
                className="inline-flex items-center px-8 py-4 bg-gold text-white font-medium rounded-none hover:bg-gold-dark transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                Explorar Colección
              </a>
              <a 
                href="/products" 
                className="inline-flex items-center px-8 py-4 border border-gold text-gold font-medium rounded-none hover:bg-gold hover:text-white transition-all duration-300"
              >
                Ver Categorías
              </a>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-gold rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-3 h-3 bg-gold-light rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-1 h-1 bg-gold rounded-full opacity-50 animate-pulse delay-500"></div>
      </section>
      
      {/* Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <SkeletonLoader type="card" count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}

          {!isLoading && categories.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No hay categorías disponibles
              </h3>
              <p className="text-gray-500">
                Pronto tendremos nuevas categorías para ti.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} Las Joyas de Mel. Todos los derechos
              reservados.
            </p>
            <div className="flex space-x-6">
              <a
                href="/products"
                className="text-gray-500 hover:text-gold transition-colors"
              >
                Productos
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      <WhatsAppButton />
    </div>
  );
};

export default Index;
