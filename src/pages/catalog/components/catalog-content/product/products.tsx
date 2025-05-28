import { ProductCard } from './product';
import { ProductInfo } from './types';
import styles from './styles.module.css';

export function ProductsList({ productsInfo }: { productsInfo: ProductInfo[] }) {
  return (
    <div className={styles['product-list']}>
      {productsInfo
        .filter((product) => product.published)
        .map((product) => (
          <ProductCard key={product.name} productInfo={product} />
        ))}
    </div>
  );
}
