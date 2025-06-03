import { ProductCard } from './product';
import { ProductInfo } from './types';
import styles from './styles.module.css';
import { Text } from '@gravity-ui/uikit';
import { useProducts } from '../../../../../components/hooks/useProducts';

export function ProductsList({ productsInfo }: { productsInfo: ProductInfo[] }) {
  const { isFiltersOpen } = useProducts();
  return productsInfo.length === 0 ? (
    <Text
      className={styles.message}
      variant="subheader-3"
    >{`It seems that we don't have similar products. Try another options...`}</Text>
  ) : (
    <div className={`${styles['product-list']} ${isFiltersOpen ? styles['product-list-hidden'] : ''}`}>
      {productsInfo
        .filter((product) => product.published)
        .map((product) => (
          <ProductCard key={product.name} productInfo={product} />
        ))}
    </div>
  );
}
