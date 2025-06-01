import { createContext, useContext, useState, useCallback } from 'react';
import { customerAPI } from '../../api/customer-api';
import { ProductInfo } from '../../pages/catalog/components/catalog-content/product/types';
import { returnProductsData } from '../../utilities/return-product-data';
import { INITIAL_CRITERIA } from '../../constants/constants';

interface CriteriaData {
  sort: string | undefined;
  search: string | undefined;
  filters: {
    price: number[];
    area: number[];
    floors: Record<string, boolean>;
    developers: Record<string, boolean>;
  };
}

interface ProductsContextType {
  productsInfo: ProductInfo[] | null;
  productDetails: ProductInfo | null;
  isLoading: boolean;
  getProductsByCriteria: (criteria: CriteriaData) => void;
  getProductDetails: (value: string) => void;
  error: boolean;
  isFiltersOpen: boolean;
  setIsFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  criteriaData: CriteriaData;
}

function createFiltersQuery(filters: {
  price: number[];
  area: number[];
  floors: Record<string, boolean>;
  developers: Record<string, boolean>;
}) {
  const allFilters = [
    `variants.attributes.Area:range (${filters.area[0].toString()} to ${filters.area[1].toString()})`,
    `variants.price.centAmount:range (${(filters.price[0] * 100).toString()} to ${(filters.price[1] * 100).toString()})`,
  ];
  const floorsFilters = [];
  const developersFilters = [];

  if (Object.values(filters.floors).some((element) => element)) {
    for (const key in filters.floors) {
      if (filters.floors[key]) {
        floorsFilters.push(`"${key}"`);
      }
    }
  }

  if (Object.values(filters.developers).some((element) => element)) {
    for (const key in filters.developers) {
      if (filters.developers[key]) {
        developersFilters.push(`"${key}"`);
      }
    }
  }

  if (developersFilters.length > 0) {
    allFilters.push(`variants.attributes.Developer.key: ${developersFilters.join(',')}`);
  }
  if (floorsFilters.length > 0) {
    allFilters.push(`variants.attributes.Floors.key: ${floorsFilters.join(',')}`);
  }

  return allFilters;
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
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [criteriaData, setCriteriaData] = useState<CriteriaData>(INITIAL_CRITERIA());

  const getProductsByCriteria = async (criteria: CriteriaData) => {
    try {
      setCriteriaData(criteria);
      const response = await customerAPI
        .apiRoot()
        .productProjections()
        .search()
        .get({
          queryArgs: {
            'text.en-US': criteria.search,
            fuzzy: true,
            sort: criteria.sort,
            filter: createFiltersQuery(criteria.filters),
          },
        })
        .execute();

      const productsInfo = returnProductsData(response.body.results);

      setProductsInfo(productsInfo);

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
      if (error instanceof Error) {
        console.error(error);
      } else {
        setError(true);
      }
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
    isFiltersOpen,
    setIsFiltersOpen,
    criteriaData,
  };

  return <ProductsContext.Provider value={ProductsContextValue}> {children}</ProductsContext.Provider>;
};

export const useProducts = () => useContext(ProductsContext);
