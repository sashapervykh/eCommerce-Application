import { Spin, Text } from '@gravity-ui/uikit';
import { useProducts } from '../../../../components/hooks/useProducts';
import { ProductsList } from './product/products';
import { useEffect } from 'react';
import styles from './style.module.css';
import { FiltersControls } from './filters-content/filters-conrols';

export function CatalogContent() {
  const { productsInfo, getProductsByCriteria, isLoading, error, clearCriteria, isFiltersOpen } = useProducts();

  useEffect(() => {
    clearCriteria();
    getProductsByCriteria();
  }, []);

  if (isLoading) {
    return <Spin></Spin>;
  }

  if (error || !productsInfo) {
    return <Text variant="body-2">{'Something goes wrong. Refresh the page to try again'}</Text>;
  }

  return (
    <div className={styles['catalog-content']}>
      {isFiltersOpen && <FiltersControls />}
      <ProductsList productsInfo={productsInfo} />
    </div>
  );
}
