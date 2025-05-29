import { Spin } from '@gravity-ui/uikit';
import { useProducts } from '../../../../components/hooks/useProducts';
import { ProductsList } from './product/products';
import { useEffect } from 'react';

export function CatalogContent() {
  const { productsInfo, getProducts, isLoading, error } = useProducts();

  useEffect(() => {
    getProducts();
  }, []);

  if (isLoading) {
    return <Spin></Spin>;
  }

  if (error || !productsInfo) {
    return <div>{'Something goes wrong. Refresh the page to try again'}</div>;
  }

  return <ProductsList productsInfo={productsInfo} />;
}
