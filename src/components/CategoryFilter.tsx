
import React from 'react';
import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex space-x-3 min-w-max">
        <button
          onClick={() => onSelectCategory(null)}
          className={`inline-flex items-center justify-center px-6 py-3 font-medium tracking-wide transition-all duration-300 min-w-[120px] ${
            selectedCategory === null
              ? 'bg-gold text-white hover:bg-gold-dark'
              : 'border-2 border-gold text-gold hover:bg-gold hover:text-white'
          }`}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`inline-flex items-center justify-center px-6 py-3 font-medium tracking-wide transition-all duration-300 min-w-[120px] ${
              selectedCategory === category.id
                ? 'bg-gold text-white hover:bg-gold-dark'
                : 'border-2 border-gold text-gold hover:bg-gold hover:text-white'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
