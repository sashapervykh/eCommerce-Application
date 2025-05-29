import { ProductCard } from './product';
import { ProductInfo } from './types';
import styles from './styles.module.css';
import { Text } from '@gravity-ui/uikit';

export function ProductsList({ productsInfo }: { productsInfo: ProductInfo[] }) {
  return productsInfo.length === 0 ? (
    <Text
      className={styles.message}
      variant="subheader-3"
    >{`It seems that we don't have similar products. Try another options...`}</Text>
  ) : (
    <div className={styles['product-list']}>
      {productsInfo.map((product) => (
        <ProductCard key={product.name} productInfo={product} />
      ))}
    </div>
  );
}
