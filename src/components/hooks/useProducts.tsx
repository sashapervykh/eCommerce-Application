import { createContext, useContext, useState } from 'react';
import { customerAPI } from '../../api/customer-api';
import { ProductInfo } from '../../pages/catalog/components/catalog-content/product/types';

interface ProductsContextType {
  productsInfo: ProductInfo[] | null;
  isLoading: boolean;
  getProducts: () => void;
  error: boolean;
}

const ProductsContext = createContext<ProductsContextType>({} as ProductsContextType);

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [productsInfo, setProductsInfo] = useState<ProductInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const getProducts = async () => {
    try {
      const response = await customerAPI.apiRoot().products().get().execute();
      const productsInfo = response.body.results.map((productInfo) => {
        return {
          id: productInfo.id,
          name: productInfo.masterData.current.name['en-US'],
          description: productInfo.masterData.current.description?.['en-US'] ?? 'Not provided',
          price: productInfo.masterData.current.masterVariant.prices
            ? (productInfo.masterData.current.masterVariant.prices[0].value.centAmount / 100).toLocaleString('en-US')
            : 'Not defined',
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

  const ProductsContextValue = {
    productsInfo,
    isLoading,
    getProducts,
    error,
  };

  return <ProductsContext.Provider value={ProductsContextValue}> {children}</ProductsContext.Provider>;
};

export const useProducts = () => useContext(ProductsContext);
