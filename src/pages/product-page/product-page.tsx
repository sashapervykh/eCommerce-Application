import { useParams } from 'react-router-dom';
import { useProducts } from '../../components/hooks/useProducts';
import { Card, Text, Spin, Button } from '@gravity-ui/uikit';
import { useEffect } from 'react';
import { NotFoundPage } from '../404/not-found';
import styles from './styles.module.css';

export function ProductPage() {
  const { productId } = useParams();
  const { productDetails, getProductDetails, isLoading, error } = useProducts();

  interface AttributeValueObject {
    key: string;
    label: string;
  }

  type AttributeValue = AttributeValueObject | AttributeValueObject[] | string | number;

  useEffect(() => {
    if (productId) {
      getProductDetails(productId);
    }
  }, [productId, getProductDetails]);

  const getLabel = (item: AttributeValue | AttributeValueObject): string => {
    if (typeof item === 'object') {
      if ('label' in item) {
        return item.label;
      }
      return JSON.stringify(item);
    }
    return String(item);
  };

  const formatAttributeValue = (value: AttributeValue): string => {
    if (Array.isArray(value)) {
      return value.map(getLabel).join(', ');
    }
    return getLabel(value);
  };

  if (isLoading) {
    return (
      <div className={styles['loading-container']}>
        <Spin></Spin>
      </div>
    );
  }

  if (error || !productDetails) {
    return <NotFoundPage />;
  }

  return (
    <div className={styles['product-page']}>
      <Card view="raised" className={styles['product-card']}>
        <h1 className={styles['product-name']}>{productDetails.name}</h1>
        <div className={styles['content-wrapper']}>
          <div className={styles['images-wrapper']}>
            {productDetails.images?.length ? (
              productDetails.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.label ?? `${productDetails.name} image`}
                  className={styles['product-image']}
                />
              ))
            ) : (
              <Text variant="body-2" className={styles['no-image']}>
                No images available
              </Text>
            )}
          </div>
          <div className={styles['text-wrapper']}>
            <Text variant="subheader-1" className={styles.price}>
              Price: ${productDetails.price}{' '}
              {productDetails.fullPrice && <span className={styles['full-price']}>${productDetails.fullPrice}</span>}
            </Text>
            <Text variant="body-2" className={styles.description}>
              <b>Description:</b> {productDetails.description}
            </Text>
            {productDetails.attributes && productDetails.attributes.length > 0 && (
              <Text variant="body-2" className={styles.attributes}>
                <h2>Property Features</h2>
                <ul>
                  {productDetails.attributes.map((attribute, index) => (
                    <li key={index}>
                      {attribute.name}: {formatAttributeValue(attribute.value)}
                    </li>
                  ))}
                </ul>
              </Text>
            )}
          </div>
        </div>
        <Button view="action" size="l" href="/catalog" className={styles['back-button']}>
          Back to Catalog
        </Button>
      </Card>
    </div>
  );
}
