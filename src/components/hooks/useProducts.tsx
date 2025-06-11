import { createContext, useContext, useState, useCallback } from 'react';
import { customerAPI } from '../../api/customer-api';
import { ProductInfo } from '../../pages/catalog/components/catalog-content/product/types';
import { returnProductsData } from '../../utilities/return-product-data';
import { INITIAL_CRITERIA } from '../../constants/constants';
import { getBasketItems, BasketItem } from '../../utilities/return-basket-items';
import { Image } from '@commercetools/platform-sdk';
import { formatPrice } from '../../utilities/format-price';

interface CriteriaData {
  sort: string | undefined;
  search: string | undefined;
  categoryKey?: string;
  subcategoryKey?: string;
  filters: {
    price: [number, number];
    area: [number, number];
    floors: Record<string, boolean>;
    developers: Record<string, boolean>;
  };
}

interface ProductsContextType {
  productsInfo: ProductInfo[] | null;
  productDetails: ProductInfo | null;
  isLoading: boolean;
  isResultsLoading: boolean;
  getProductsByCriteria: (criteria: CriteriaData) => void;
  getProductDetails: (value: string) => void;
  error: boolean;
  notFound: boolean;
  isFiltersOpen: boolean;
  setIsFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  criteriaData: CriteriaData;
  isProductInCart: (productId: string) => boolean;
  getBasketItems: () => Promise<BasketItem[]>;
  cartItems: BasketItem[];
  fetchCartItems: () => Promise<void>;
  isCartLoading: boolean;
  getProductByID: (product: BasketItem) => Promise<CartItemType | undefined>;
}

interface ApiError {
  statusCode: number;
  message: string;
}

export interface CartItemType {
  id: string;
  name: string;
  price: string;
  totalPrice: string;
  fullPrice?: string;
  images?: Image[];
  quantity: number;
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

  const floorsFilters: string[] = [];
  const developersFilters: string[] = [];

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

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [productsInfo, setProductsInfo] = useState<ProductInfo[] | null>(null);
  const [productDetails, setProductDetails] = useState<ProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartLoading, setIsCartLoading] = useState<boolean>(false);
  const [isResultsLoading, setIsResultsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [criteriaData, setCriteriaData] = useState<CriteriaData>(INITIAL_CRITERIA());
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [lastFilters, setLastFilters] = useState<string[]>([]);
  const [lastSort, setLastSort] = useState<string | undefined>(undefined);
  const [lastSearch, setLastSearch] = useState<string | undefined>(undefined);
  const [cartItems, setCartItems] = useState<BasketItem[]>([]);

  const fetchCartItems = useCallback(async () => {
    setIsCartLoading(true);
    try {
      const items = await getBasketItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      setIsCartLoading(false);
    }
  }, []);

  const getProductsByCriteria = useCallback(
    async (criteria: CriteriaData = INITIAL_CRITERIA()) => {
      try {
        setIsLoading(true);
        setIsResultsLoading(true);
        setError(false);
        setNotFound(false);

        const { sort, search, categoryKey, subcategoryKey, filters } = criteria;

        let categoryFilter: string | undefined;
        if (subcategoryKey) {
          try {
            const subcategoryResponse = await customerAPI
              .apiRoot()
              .categories()
              .withKey({ key: subcategoryKey })
              .get()
              .execute();
            categoryFilter = `categories.id:"${subcategoryResponse.body.id}"`;
          } catch (error) {
            console.error(error);
            const apiError = error as ApiError;
            if (apiError.statusCode === 404) {
              setNotFound(true);
            }
            setProductsInfo([]);
            setIsLoading(false);
            setIsResultsLoading(false);
            return;
          }
        } else if (categoryKey) {
          try {
            const categoryResponse = await customerAPI
              .apiRoot()
              .categories()
              .withKey({ key: categoryKey })
              .get()
              .execute();
            categoryFilter = `categories.id:subtree("${categoryResponse.body.id}")`;
          } catch (error) {
            console.error(error);
            const apiError = error as ApiError;
            if (apiError.statusCode === 404) {
              setNotFound(true);
            }
            setProductsInfo([]);
            setIsLoading(false);
            setIsResultsLoading(false);
            return;
          }
        }

        const allFilters = createFiltersQuery(filters);
        if (categoryFilter) {
          allFilters.push(categoryFilter);
        }

        if (!isInitialLoad) {
          const filtersChanged = JSON.stringify(allFilters) !== JSON.stringify(lastFilters);
          const sortChanged = sort !== lastSort;
          const searchChanged = search !== lastSearch;
          const categoryKeysChanged = categoryKey !== (criteriaData.subcategoryKey ?? criteriaData.categoryKey);

          if (!filtersChanged && !sortChanged && !searchChanged && !categoryKeysChanged) {
            setIsLoading(false);
            setIsResultsLoading(false);
            return;
          }
        }

        setCriteriaData(criteria);
        setLastFilters(allFilters);
        setLastSort(sort);
        setLastSearch(search);
        setIsInitialLoad(false);

        const response = await customerAPI
          .apiRoot()
          .productProjections()
          .search()
          .get({
            queryArgs: {
              'text.en-US': search,
              fuzzy: true,
              sort,
              filter: allFilters,
            },
          })
          .execute();

        const productsInfo = returnProductsData(response.body.results);
        setProductsInfo(productsInfo);
      } catch (error) {
        console.error(error);
        setError(true);
      } finally {
        setIsLoading(false);
        setIsResultsLoading(false);
      }
    },
    [isInitialLoad, criteriaData, lastFilters, lastSort, lastSearch],
  );

  const getProductDetails = useCallback(async (key: string) => {
    try {
      setIsLoading(true);
      setProductDetails(null);
      setError(false);
      setNotFound(false);
      const response = await customerAPI.apiRoot().products().withKey({ key }).get().execute();
      if (!response.body.masterData.published) {
        setNotFound(true);
        return;
      }
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
      const apiError = error as ApiError;
      if (apiError.statusCode === 404) {
        setNotFound(true);
      } else {
        setError(true);
      }
      setIsLoading(false);
    }
  }, []);

  const getProductByID = async (product: BasketItem) => {
    try {
      const response = await customerAPI.apiRoot().products().withId({ ID: product.productId }).get().execute();

      const productInfo = response.body;
      const discountedPrice = productInfo.masterData.current.masterVariant.prices?.[0]?.discounted?.value.centAmount;
      const price = productInfo.masterData.current.masterVariant.prices?.[0].value.centAmount;
      let currentPrice: number | undefined;
      let fullPrice: number | undefined;

      if (discountedPrice) {
        currentPrice = discountedPrice;
        fullPrice = price;
      } else {
        currentPrice = price;
      }

      return {
        id: productInfo.id,
        name: productInfo.masterData.current.name['en-US'],
        price: formatPrice(currentPrice),
        totalPrice: formatPrice(currentPrice ? currentPrice * product.quantity : currentPrice),
        fullPrice: formatPrice(fullPrice),
        images: productInfo.masterData.current.masterVariant.images,
        quantity: product.quantity,
      };
    } catch (error) {
      console.log(error);
    }
  };

  const isProductInCart = (productId: string) => {
    return cartItems.some((item) => item.productId === productId);
  };

  const ProductsContextValue = {
    productsInfo,
    productDetails,
    isLoading,
    isResultsLoading,
    getProductsByCriteria,
    getProductDetails,
    error,
    notFound,
    isFiltersOpen,
    setIsFiltersOpen,
    criteriaData,
    isProductInCart,
    getBasketItems,
    cartItems,
    fetchCartItems,
    isCartLoading: isCartLoading,
    getProductByID,
  };

  return <ProductsContext.Provider value={ProductsContextValue}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => useContext(ProductsContext);
