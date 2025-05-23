import { ProductInfo } from './types';
import styles from './styles.module.css';
import { Card, Text } from '@gravity-ui/uikit';

export function ProductCard({ productInfo }: { productInfo: ProductInfo }) {
  return (
    <Card type="selection" view="raised" key={productInfo.id} className={styles.wrapper}>
      <div className={styles['image-wrapper']}>
        {productInfo.images?.map((image, index) => {
          return (
            <div key={index}>
              <img className={styles.image} src={image.url} alt={image.label} />
            </div>
          );
        })}
      </div>

      <div className={styles['text-wrapper']}>
        <Text variant="body-2" className={styles.text}>
          <b>Name:</b> {productInfo.name}
        </Text>
        <Text variant="body-2" className={styles.text}>
          <b>Price:</b> ${productInfo.price}{' '}
        </Text>
        <Text variant="body-2" className={(styles.text, styles.description)} ellipsis={true} ellipsisLines={5}>
          <b>Description:</b> {productInfo.description}
        </Text>
      </div>
    </Card>
  );
}
