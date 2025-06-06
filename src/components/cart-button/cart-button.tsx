import { Button, Label } from '@gravity-ui/uikit';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { useCart } from '../hooks/useCart';

export function CartButton({ buttonSize, buttonWidth }: { buttonSize: 'm' | 'l'; buttonWidth: 'max' | undefined }) {
  const navigate = useNavigate();
  const { productsInCartAmount, updateProductsInCartAmount } = useCart();
  updateProductsInCartAmount();

  return (
    <Button view="action" onClick={() => navigate('/cart')} size={buttonSize} width={buttonWidth}>
      <div className={styles['button-content']}>
        <div>Cart</div>
        <Label className={styles['products-number']} theme="unknown">
          {productsInCartAmount}
        </Label>
      </div>
    </Button>
  );
}
