import { useParams } from 'react-router-dom';
import { useProducts } from '../../components/hooks/useProducts';

export function ProductPage() {
  const { productId } = useParams();
  const { productsInfo } = useProducts();

  const product = productsInfo?.find((product) => product.key === productId);
  return <h1>{product?.name}</h1>;
}
