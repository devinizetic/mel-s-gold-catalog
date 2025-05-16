
import React from 'react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';

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
      <div className="flex space-x-2 min-w-max">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          className={selectedCategory === null ? "bg-gold hover:bg-gold-dark" : ""}
          onClick={() => onSelectCategory(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={selectedCategory === category.id ? "bg-gold hover:bg-gold-dark" : ""}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
