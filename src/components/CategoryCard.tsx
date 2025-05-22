
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/types';
import { Image as ImageIcon } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      to={`/products?category=${category.id}`} 
      className="block group relative rounded-lg overflow-hidden aspect-square shadow-md transition-transform hover:shadow-lg hover:-translate-y-1"
    >
      {category.image_url ? (
        <img 
          src={category.image_url} 
          alt={category.name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <ImageIcon size={48} className="text-gray-400" />
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end p-4">
        <h3 className="text-xl md:text-2xl font-serif font-medium text-white">
          {category.name}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
