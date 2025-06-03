import { customerAPI } from '../api/customer-api';

export interface CategoryData {
  name: string;
  description: string;
}

export async function returnCategoryData(key?: string): Promise<CategoryData> {
  if (!key) {
    return {
      name: 'Best houses in the Universe!',
      description: 'Browse all houses in our catalog.',
    };
  }

  const response = await customerAPI.apiRoot().categories().withKey({ key }).get().execute();
  const category = response.body;
  return {
    name: category.name['en-US'] || category.name.en || 'Houses',
    description: category.description?.['en-US'] ?? category.description?.en ?? '',
  };
}
