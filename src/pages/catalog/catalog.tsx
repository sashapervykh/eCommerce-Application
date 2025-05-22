import { useEffect, useState } from 'react';
import { customerAPI } from '../../api/customer-api';
import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { Button } from '@gravity-ui/uikit';
import { ProductsInfo } from './types';
import styles from './styles.module.css';

function CatalogContent() {
  const [result, setResult] = useState<ProductsInfo[] | undefined>();

  useEffect(() => {
    async function getProducts() {
      const response = await customerAPI.apiRoot().products().get().execute();
      const products = response.body.results.map((productInfo) => {
        return {
          name: productInfo.masterData.current.name,
          description: productInfo.masterData.current.description,
          price: productInfo.masterData.current.masterVariant.prices
            ? productInfo.masterData.current.masterVariant.prices[0].value.centAmount
            : 'Not defined',
          images: productInfo.masterData.current.masterVariant.images,
        };
      });
      setResult(products);
    }
    if (!result) {
      void getProducts();
      console.log(result);
    }
  }, [result]);

  return (
    <div>
      <h1>Catalog Content</h1>
      {result?.map((product) => (
        <div className={styles.wrapper}>
          <div className={styles['image-wrapper']}>
            <div>
              <img className={styles.image} src={product.images ? product.images[0].url : ''} alt="" />
            </div>
            <div>
              <img className={styles.image} src={product.images ? product.images[1].url : ''} alt="" />
            </div>
            <div>
              <img className={styles.image} src={product.images ? product.images[2].url : ''} alt="" />
            </div>
          </div>
          <div>Name: {product.name['en-US']}</div>
          <div>Description {product.description ? product.description['en-US'] : 'Not provided'}</div>
          <div>Price:{product.price} </div>
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
