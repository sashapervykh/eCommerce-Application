import { Spin, Text } from '@gravity-ui/uikit';
import { useProducts } from '../../../../components/hooks/useProducts';
import { ProductsList } from './product/products';
import { useEffect } from 'react';

export function CatalogContent() {
  const { productsInfo, getProductsByCriteria, isLoading, error } = useProducts();

  useEffect(() => {
    getProductsByCriteria();
  }, []);

  if (isLoading) {
    return <Spin></Spin>;
  }

  if (error || !productsInfo) {
    return <Text variant="body-2">{'Something goes wrong. Refresh the page to try again'}</Text>;
  }

  return <ProductsList productsInfo={productsInfo} />;
}
