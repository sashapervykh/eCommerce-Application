import { CategoryInfo } from '../components/hooks/useCategories';
import { NavigateFunction } from 'react-router-dom';

interface MenuItem {
  text: string;
  action: () => void;
  items?: MenuItem[];
}

export function catalogItems(categories: CategoryInfo[], navigate: NavigateFunction): MenuItem[] {
  return categories.map((category: CategoryInfo) => ({
    action: () => navigate(`/catalog/${category.key}`),
    text: category.name,
    items:
      category.subcategories?.map((sub: CategoryInfo) => ({
        action: () => navigate(`/catalog/${category.key}/${sub.key}`),
        text: sub.name,
      })) ?? [],
  }));
}
