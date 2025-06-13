import { Button, Modal, Text } from '@gravity-ui/uikit';
import { useCart } from '../../../components/hooks/useCart';
import { useState } from 'react';
import styles from './styles.module.css';

export function ClearButton() {
  const { productsInCartAmount, clearCart, cartPageData } = useCart();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (!cartPageData) return;

  return (
    <>
      {!productsInCartAmount || (
        <Button
          view="action"
          className={styles['clear-button']}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Clear cart
        </Button>
      )}
      {
        <Modal open={isModalOpen}>
          <div className={styles['modal-wrapper']}>
            <Text variant="subheader-3">Are you sure you want to empty your cart?</Text>
            <div className={styles['buttons-wrapper']}>
              <Button
                view="action"
                onClick={async () => {
                  setIsModalOpen(false);
                  await clearCart(cartPageData.id, cartPageData.version);
                }}
              >
                Clear
              </Button>
              <Button
                view="action"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      }
    </>
  );
}
