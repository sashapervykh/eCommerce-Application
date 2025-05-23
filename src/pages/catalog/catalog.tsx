import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { Spin } from '@gravity-ui/uikit';
import styles from './styles.module.css';
import { useProducts } from '../../components/hooks/useProducts';

function CatalogContent() {
  const { productsInfo, getProducts, isLoading, error } = useProducts();

  getProducts();

  if (isLoading) {
    return <Spin></Spin>;
  }

  if (error) {
    return <div>{'Something goes wrong. Refresh the page to try again'}</div>;
  }

  return (
    <div>
      {productsInfo?.map((product) => (
        <div key={product.id} className={styles.wrapper}>
          <div className={styles['image-wrapper']}>
            {product.images?.map((image, index) => {
              return (
                <div key={index}>
                  <img className={styles.image} src={image.url} alt={image.label} />
                </div>
              );
            })}
          </div>
          <div>Name: {product.name}</div>
          <div>Description: {product.description}</div>
          <div>Price: ${product.price} </div>
        </div>
      ))}
    </div>
  );
}

export function CatalogPage() {
  return (
    <PageWrapper title="Catalog">
      <h1>Our products</h1>
      <CatalogContent />
    </PageWrapper>
  );
}
