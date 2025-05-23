import { createContext, useContext, useState } from 'react';
import { customerAPI } from '../../api/customer-api';
import { Image } from '@commercetools/platform-sdk';

interface ProductInfo {
  id: string;
  name: string;
  description: string;
  price: string;
  images?: Image[];
}

interface ProductsContextType {
  productsInfo: ProductInfo[] | null;
  getProducts: () => void;
}

const ProductsContext = createContext<ProductsContextType>({} as ProductsContextType);

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [productsInfo, setProductsInfo] = useState<ProductInfo[] | null>(null);

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
    } catch (error) {
      console.error(error);
    }
  };

  const ProductsContextValue = {
    productsInfo,
    getProducts,
  };

  return <ProductsContext.Provider value={ProductsContextValue}> {children}</ProductsContext.Provider>;
};

export const useProducts = () => useContext(ProductsContext);
