import { createContext, useContext, useState } from 'react';
import { customerAPI } from '../../api/customer-api';
import { ProductInfo } from '../../pages/catalog/components/catalog-content/product/types';
import { returnProductsData } from '../../utilities/return-product-data';

interface ProductsContextType {
  productsInfo: ProductInfo[] | null;
  isLoading: boolean;
  getProductsByCriteria: (criteria?: { searchedValue?: string; sortingCriteria?: string }) => void;
  error: boolean;
  searchedValue: string | undefined;
  clearCriteria: (criteria?: 'searchedValue' | 'sortingCriteria') => void;
}

const ProductsContext = createContext<ProductsContextType>({} as ProductsContextType);

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [productsInfo, setProductsInfo] = useState<ProductInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchedValue, setSearchedValue] = useState<string | undefined>(undefined);
  const [sortingCriteria, setSortingCriteria] = useState<string | undefined>(undefined);

  const clearCriteria = async (criteria?: 'searchedValue' | 'sortingCriteria') => {
    switch (criteria) {
      case 'searchedValue': {
        setSearchedValue(undefined);
        break;
      }
      case 'sortingCriteria': {
        setSortingCriteria(undefined);
        break;
      }
      default: {
        setSortingCriteria(undefined);
        setSearchedValue(undefined);
      }
    }

    await getProductsByCriteria();
  };

  const getProductsByCriteria = async (criteria?: { searchedValue?: string; sortingCriteria?: string }) => {
    try {
      let sort: string | undefined;
      if (criteria?.sortingCriteria === '') {
        sort = undefined;
      } else {
        sort = criteria?.sortingCriteria ?? sortingCriteria;
      }
      const response = await customerAPI
        .apiRoot()
        .productProjections()
        .search()
        .get({
          queryArgs: {
            'text.en-US': criteria?.searchedValue ?? searchedValue,
            fuzzy: true,
            sort: sort,
          },
        })
        .execute();
      const productsInfo = returnProductsData(response.body.results);

      setProductsInfo(productsInfo);
      if (criteria?.searchedValue !== undefined) setSearchedValue(criteria.searchedValue);
      if (criteria?.sortingCriteria) setSortingCriteria(criteria.sortingCriteria);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const ProductsContextValue = {
    productsInfo,
    isLoading,
    getProductsByCriteria,
    error,
    searchedValue,
    clearCriteria,
  };

  return <ProductsContext.Provider value={ProductsContextValue}> {children}</ProductsContext.Provider>;
};

export const useProducts = () => useContext(ProductsContext);
