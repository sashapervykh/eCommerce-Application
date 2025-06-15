import { Button, Text, Spin } from '@gravity-ui/uikit';
import styles from './style.module.css';
import { SearchComponent } from '../search-component/search-component';
import { SortComponent } from '../sort-selector/sort-component';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { ProductsList } from './product/products';
import { FiltersControls } from './filters-content/filters-controls';
import { useProducts } from '../../../../components/hooks/useProducts';
import { returnCategoryData, CategoryData } from '../../../../utilities/return-category-data';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NotFoundPage } from '../../../404/not-found';
import { Pagination } from './pagination';

export function CatalogContent({
  categoryKey: propertyCategoryKey,
  subcategoryKey: propertySubcategoryKey,
}: {
  categoryKey?: string;
  subcategoryKey?: string;
}) {
  const { categoryKey: parameterCategoryKey, subcategoryKey: parameterSubcategoryKey } = useParams<{
    categoryKey?: string;
    subcategoryKey?: string;
  }>();

  const categoryKey = propertyCategoryKey ?? parameterCategoryKey;
  const subcategoryKey = propertySubcategoryKey ?? parameterSubcategoryKey;

  const {
    productsInfo,
    getProductsByCriteria,
    error,
    isFiltersOpen,
    setIsFiltersOpen,
    notFound,
    fetchCartItems,
    isCartLoading,
    isResultsLoading,
    totalProducts,
    currentPage,
    setCurrentPage,
    criteriaData,
  } = useProducts();
  const lastCriteriaReference = useRef<string | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [subcategoryData, setSubcategoryData] = useState<CategoryData | null>(null);
  const [_, setIsCategoryLoading] = useState<boolean>(false);

  const itemsPerPage = 9;

  useEffect(() => {
    async function loadCategoryData() {
      setIsCategoryLoading(true);
      try {
        if (categoryKey) {
          const data = await returnCategoryData(categoryKey);
          setCategoryData(data);
        } else {
          setCategoryData(null);
        }
        if (subcategoryKey) {
          const data = await returnCategoryData(subcategoryKey);
          setSubcategoryData(data);
        } else {
          setSubcategoryData(null);
        }
      } catch (error) {
        console.error('Category load error:', error);
      } finally {
        setIsCategoryLoading(false);
      }
    }
    void loadCategoryData();
  }, [categoryKey, subcategoryKey]);

  useEffect(() => {
    setIsFiltersOpen(false);
  }, [categoryKey, subcategoryKey, setIsFiltersOpen]);

  useEffect(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    const criteria = {
      ...criteriaData,
      categoryKey,
      subcategoryKey,
      limit: itemsPerPage,
      offset,
    };
    const criteriaKey = JSON.stringify({
      ...criteria,
      filters: criteria.filters,
    });

    if (lastCriteriaReference.current === criteriaKey) {
      return;
    }

    getProductsByCriteria(criteria);
    void fetchCartItems();
    lastCriteriaReference.current = criteriaKey;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryKey, subcategoryKey, currentPage, itemsPerPage, criteriaData.filters]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (notFound) {
    return <NotFoundPage />;
  }

  if (error) {
    return <Text variant="body-2">{'Something went wrong. Please try again later.'}</Text>;
  }

  if (productsInfo === null || isCartLoading) {
    return <Spin />;
  }

  const displayData = subcategoryData ?? categoryData;

  return (
    <div className={styles.catalog}>
      <div className={styles['catalog-header']}>
        <Breadcrumbs
          categoryKey={categoryKey}
          subcategoryKey={subcategoryKey}
          categoryData={categoryData}
          subcategoryData={subcategoryData}
        />
        {displayData && (
          <>
            <h1>{displayData.name || 'Catalogue'}</h1>
            {displayData.description && (
              <Text variant="body-2" className={styles['category-description']}>
                {displayData.description}
              </Text>
            )}
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
      <div className={styles['catalog-container']}>
        <div className={styles['catalog-content']}>
          <FiltersControls
            categoryKey={categoryKey}
            subcategoryKey={subcategoryKey}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
          />
          {isResultsLoading && <Spin className={`${styles.spin} ${isFiltersOpen ? styles.hidden : ''}`}></Spin>}
          {!isResultsLoading &&
            (productsInfo.length === 0 ? (
              <Text className={isFiltersOpen ? styles.hidden : ''} variant="body-2">
                {'No products found'}
              </Text>
            ) : (
              <ProductsList productsInfo={productsInfo} />
            ))}
        </div>
        <div className={styles['pagination-wrapper']}>
          <Pagination
            currentPage={currentPage}
            totalItems={totalProducts}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
