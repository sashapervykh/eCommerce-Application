import { useState, useEffect } from 'react';
import { Category } from '@commercetools/platform-sdk';
import { api } from '../../api/api';

export interface CategoryInfo {
  id: string;
  key: string;
  name: string;
  subcategories?: CategoryInfo[];
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const data = await api.getCategories();
        const categoryMap = new Map<string, CategoryInfo>();
        const rootCategories: CategoryInfo[] = [];

        data.forEach((category: Category) => {
          categoryMap.set(category.id, {
            id: category.id,
            key: category.key ?? category.id,
            name: category.name['en-US'] || Object.values(category.name)[0],
            subcategories: [],
          });
        });

        data.forEach((category: Category) => {
          const currentCategory = categoryMap.get(category.id);
          if (!currentCategory) return;
          if (category.parent) {
            const parent = categoryMap.get(category.parent.id);
            if (parent) {
              parent.subcategories ??= [];
              parent.subcategories.push(currentCategory);
            }
          } else {
            rootCategories.push(currentCategory);
          }
        });

        setCategories(rootCategories);
      } catch (_) {
        setError('Failed to get categories from API');
      } finally {
        setIsLoading(false);
      }
    }

    void fetchCategories();
  }, []);

  return { categories, isLoading, error };
}
