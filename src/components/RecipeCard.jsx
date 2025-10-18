// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export function RecipeCard({
  recipe
}) {
  return <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      <div className="aspect-square">
        <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
      </div>
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-medium">{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-xs text-gray-600">{recipe.description}</p>
      </CardContent>
    </Card>;
}