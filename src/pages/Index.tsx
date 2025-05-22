
import React, { useState, useEffect } from "react";
import { getCategories } from "@/lib/supabaseClient";
import CategoryCard from "@/components/CategoryCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import { Category } from "@/types";

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
      {/* Simple Centered Header */}
      <header className="bg-white py-6 md:py-8 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-center text-gray-900">
            Las Joyas de Mel
          </h1>
        </div>
      </header>

      {/* Categories Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <SkeletonLoader type="card" count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
      <footer className="bg-white border-t border-gray-200 py-8">
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
    </div>
  );
};

export default Index;
