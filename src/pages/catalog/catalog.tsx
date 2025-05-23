import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { Button } from '@gravity-ui/uikit';
import styles from './styles.module.css';
import { useProducts } from '../../components/hooks/useProducts';

function CatalogContent() {
  const { productsInfo, getProducts } = useProducts();

  getProducts();

  return (
    <div>
      <h1>Catalog Content</h1>
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
      <div>
        <Button view="outlined">Moon</Button>
      </div>
      <CatalogContent />
    </PageWrapper>
  );
}
