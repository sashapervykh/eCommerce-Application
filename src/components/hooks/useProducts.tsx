import { createContext, useContext, useState, useCallback } from 'react';
import { customerAPI } from '../../api/customer-api';
import { ProductInfo } from '../../pages/catalog/components/catalog-content/product/types';
import { returnProductsData } from '../../utilities/return-product-data';

interface ProductsContextType {
  productsInfo: ProductInfo[] | null;
  productDetails: ProductInfo | null;
  isLoading: boolean;
  getProductsByCriteria: (criteria?: { searchedValue?: string; sortingCriteria?: string }) => void;
  getProductDetails: (value: string) => void;
  error: boolean;
  searchedValue: string | undefined;
  clearCriteria: (criteria?: 'searchedValue' | 'sortingCriteria') => void;
}

const ProductsContext = createContext<ProductsContextType>({} as ProductsContextType);

const formatPrice = (price: number | undefined): string => {
  if (price === undefined) {
    return '0.00';
  }
  return (price / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [productsInfo, setProductsInfo] = useState<ProductInfo[] | null>(null);
  const [productDetails, setProductDetails] = useState<ProductInfo | null>(null);
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
      default:
        {
          setSortingCriteria(undefined);
          setSearchedValue(undefined);
        }
        await getProductsByCriteria();
    }
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

  const getProductDetails = useCallback(async (key: string) => {
    try {
      setIsLoading(true);
      setProductDetails(null);
      setError(false);
      const response = await customerAPI.apiRoot().products().withKey({ key }).get().execute();
      console.log('Product details response:', response.body);
      const productInfo = response.body;
      const discountedPrice = productInfo.masterData.current.masterVariant.prices?.[0]?.discounted?.value.centAmount;
      const price = productInfo.masterData.current.masterVariant.prices?.[0].value.centAmount;
      let currentPrice: string;
      let fullPrice: string | undefined;

      if (discountedPrice) {
        currentPrice = formatPrice(discountedPrice);
        fullPrice = price ? formatPrice(price) : undefined;
      } else {
        currentPrice = formatPrice(price);
      }

      const productDetails: ProductInfo = {
        id: productInfo.id,
        key: productInfo.key ?? productInfo.masterData.current.name['en-US'].split(' ').join(''),
        name: productInfo.masterData.current.name['en-US'],
        description: productInfo.masterData.current.description?.['en-US'] ?? 'Not provided',
        price: currentPrice,
        fullPrice: fullPrice,
        images: productInfo.masterData.current.masterVariant.images,
        attributes: productInfo.masterData.current.masterVariant.attributes ?? [],
        published: productInfo.masterData.published,
      };

      setProductDetails(productDetails);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError(true);
      setIsLoading(false);
    }
  }, []);

  const ProductsContextValue = {
    productsInfo,
    productDetails,
    isLoading,
    getProductsByCriteria,
    getProductDetails,
    error,
    searchedValue,
    clearCriteria,
  };

  return <ProductsContext.Provider value={ProductsContextValue}> {children}</ProductsContext.Provider>;
};

export const useProducts = () => useContext(ProductsContext);
