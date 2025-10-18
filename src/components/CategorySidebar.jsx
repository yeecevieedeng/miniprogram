// @ts-ignore;
import React from 'react';

export function CategorySidebar({
  categories,
  selectedCategory,
  onSelectCategory
}) {
  return <div className="w-24 bg-white border-r overflow-y-auto">
      {categories.map(category => <button key={category.id} className={`w-full p-3 text-center transition-colors ${selectedCategory === category.id ? 'bg-green-50 text-green-600 border-r-2 border-green-600' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => onSelectCategory(category.id)}>
          <div className="text-2xl mb-1">{category.icon}</div>
          <div className="text-xs">{category.name}</div>
        </button>)}
    </div>;
}