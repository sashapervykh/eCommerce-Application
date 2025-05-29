import { createContext, useContext, useState } from 'react';
import { customerAPI } from '../../api/customer-api';
import { ProductInfo } from '../../pages/catalog/components/catalog-content/product/types';
import { returnProductsData } from '../../utilities/return-product-data';

interface ProductsContextType {
  productsInfo: ProductInfo[] | null;
  isLoading: boolean;
  getProducts: () => void;
  getSortedProducts: (value: string) => void;
  getSpecificProducts: (criteria: { searchedValue?: string }) => void;
  error: boolean;
  searchedValue: string | undefined;
  setSearchedValue: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ProductsContext = createContext<ProductsContextType>({} as ProductsContextType);

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [productsInfo, setProductsInfo] = useState<ProductInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchedValue, setSearchedValue] = useState<string | undefined>(undefined);

  const getProducts = async () => {
    try {
      const response = await customerAPI.apiRoot().products().get().execute();
      const productsInfo = response.body.results.map((productInfo) => {
        const discountedPrice = productInfo.masterData.current.masterVariant.prices?.[0]?.discounted?.value.centAmount;
        const price = productInfo.masterData.current.masterVariant.prices?.[0].value.centAmount;
        let currentPrice: string;
        let fullPrice: string | undefined;

        if (discountedPrice) {
          currentPrice = (discountedPrice / 100).toLocaleString('en-US');
          fullPrice = price ? (price / 100).toLocaleString('en-US') : 'Not provided';
        } else {
          currentPrice = price ? (price / 100).toLocaleString('en-US') : 'Not provided';
        }

        return {
          id: productInfo.id,
          key: productInfo.key ?? productInfo.masterData.current.name['en-US'].split(' ').join(''),
          name: productInfo.masterData.current.name['en-US'],
          description: productInfo.masterData.current.description?.['en-US'] ?? 'Not provided',
          price: currentPrice,
          fullPrice: fullPrice,
          images: productInfo.masterData.current.masterVariant.images,
        };
      });
      setProductsInfo(productsInfo);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const getSortedProducts = async (value: string) => {
    try {
      const response = await customerAPI
        .apiRoot()
        .productProjections()
        .search()
        .get({ queryArgs: { sort: [value] } })
        .execute();
      const productsInfo = returnProductsData(response.body.results);

      setProductsInfo(productsInfo);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const getSpecificProducts = async (criteria?: { searchedValue?: string }) => {
    setSearchedValue(criteria?.searchedValue);
    console.log(criteria?.searchedValue);
    try {
      const response = await customerAPI
        .apiRoot()
        .productProjections()
        .search()
        .get({ queryArgs: { 'text.en-US': criteria?.searchedValue, fuzzy: true } })
        .execute();
      const productsInfo = returnProductsData(response.body.results);

      setProductsInfo(productsInfo);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const ProductsContextValue = {
    productsInfo,
    isLoading,
    getProducts,
    getSortedProducts,
    getSpecificProducts,
    error,
    searchedValue,
    setSearchedValue,
  };

  return <ProductsContext.Provider value={ProductsContextValue}> {children}</ProductsContext.Provider>;
};

export const useProducts = () => useContext(ProductsContext);
