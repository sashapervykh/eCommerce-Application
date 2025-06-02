import { Button } from '@gravity-ui/uikit';
import { SearchComponent } from '../search-component/search-component';
import { SortComponent } from '../sort-selector/sort-component';
import { Spin, Text } from '@gravity-ui/uikit';
import { useProducts } from '../../../../components/hooks/useProducts';
import { ProductsList } from './product/products';
import { useEffect, useRef, useState } from 'react';
import styles from './style.module.css';
import { FiltersControls } from './filters-content/filters-controls';
import { INITIAL_CRITERIA } from '../../../../constants/constants';
import { returnCategoryData, CategoryData } from '../../../../utilities/return-category-data';

export function CatalogContent({ categoryKey, subcategoryKey }: { categoryKey?: string; subcategoryKey?: string }) {
  const { productsInfo, getProductsByCriteria, isLoading, error, isFiltersOpen } = useProducts();
  const lastCriteriaReference = useRef<string | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [_isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);

  const { setIsFiltersOpen } = useProducts();

  useEffect(() => {
    async function loadCategoryData() {
      setIsCategoryLoading(true);
      const key = subcategoryKey ?? categoryKey;
      const data = await returnCategoryData(key);
      setCategoryData(data);
      setIsCategoryLoading(false);
    }

    void loadCategoryData();
  }, [categoryKey, subcategoryKey]);

  useEffect(() => {
    setIsFiltersOpen(false);
  }, [categoryKey, subcategoryKey, setIsFiltersOpen]);

  useEffect(() => {
    const criteria = {
      ...INITIAL_CRITERIA(),
      categoryKey,
      subcategoryKey,
    };
    const criteriaKey = JSON.stringify(criteria);

    if (lastCriteriaReference.current === criteriaKey) {
      // Ensure that criterias changed
      return;
    }

    getProductsByCriteria(criteria);
    lastCriteriaReference.current = criteriaKey;
  }, [categoryKey, subcategoryKey, getProductsByCriteria]);

  if (isLoading) {
    return <Spin />;
  }

  if (error) {
    return <Text variant="body-2">{'Something went wrong. Please try again later.'}</Text>;
  }

  if (productsInfo === null) {
    return <Spin />;
  }

  return (
    <div className={styles.catalog}>
      <div className={styles['catalog-header']}>
        {categoryData && (
          <>
            <h1>{categoryData.name}</h1>
            <Text variant="body-2" className={styles['category-description']}>
              {categoryData.description}
            </Text>
          </>
        )}
      </div>
      <div className={styles['list-controls']}>
        <Button
          size="xl"
          className={styles['filters-button']}
          view="outlined"
          onClick={() => {
            setIsFiltersOpen((previous: boolean) => !previous);
          }}
        >
          Filter
        </Button>
        <SortComponent />
        <SearchComponent />
      </div>
      <div className={styles['catalog-content']}>
        {isFiltersOpen && <FiltersControls categoryKey={categoryKey} subcategoryKey={subcategoryKey} />}
        {productsInfo.length === 0 ? (
          <Text variant="body-2">{'No products found'}</Text>
        ) : (
          <ProductsList productsInfo={productsInfo} />
        )}
      </div>
    </div>
  );
}
