import { Button } from '@gravity-ui/uikit';
import { CircleMinus, CirclePlus } from '@gravity-ui/icons';
import { CartItemType, useProducts } from '../../../../../components/hooks/useProducts';
import styles from './styles.module.css';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useCart } from '../../../../../components/hooks/useCart';

export function AmountController({ product }: { product: CartItemType }) {
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | undefined>(undefined);
  const { handleSubmit, getValues, setValue, control } = useForm({
    defaultValues: { amount: product.quantity },
  });
  const [operation, setOperation] = useState<'plus' | 'minus' | undefined>(undefined);
  const { addToCart, removeFromCart } = useCart();
  const { fetchCartItems } = useProducts();
  const [previousAmount, setPreviousAmount] = useState<number>(product.quantity);

  const handelAmountChange = () => {
    let value = getValues('amount');
    if (operation === 'plus') {
      setValue('amount', value + 1);
    } else if (operation === 'minus') {
      value = value === 0 ? 0 : value - 1;
      setValue('amount', value);
    }
    setOperation(undefined);
  };

  const onSubmit = async () => {
    const currentAmount = getValues('amount');
    if (currentAmount === 0) {
      await removeFromCart(product.id);
      await fetchCartItems();
      return;
    }
    const difference = currentAmount - previousAmount;
    if (difference > 0) {
      await addToCart(product.id, difference);
      setPreviousAmount(currentAmount);
    } else if (difference < 0) {
      await removeFromCart(product.id, Math.abs(difference));
      setPreviousAmount(currentAmount);
    }
  };

  const debouncedOnSubmit = () => {
    handelAmountChange();
    if (debounceTimeout) clearTimeout(debounceTimeout);
    setDebounceTimeout(setTimeout(onSubmit, 500));
  };

  return (
    <form
      className={styles['amount-form']}
      onSubmit={(event) => {
        void handleSubmit(debouncedOnSubmit)(event);
      }}
    >
      <Button
        type="submit"
        className={styles['amount-button']}
        view="flat"
        onClick={() => {
          setOperation('minus');
        }}
      >
        <CircleMinus className={styles.icon} />
      </Button>
      <label className={styles['amount-label']}>
        <Controller
          control={control}
          name="amount"
          render={({ field }) => (
            <input
              className={styles['amount-input']}
              value={field.value}
              onChange={(event) => {
                if (event.target.value === '') {
                  field.onChange(0);
                  return;
                }
                if (!/^\d+$/.test(event.target.value)) return;
                const value = parseInt(event.target.value);
                if (Number.isNaN(value)) return;
                field.onChange(value);
              }}
              onBlur={(event) => {
                setOperation(undefined);
                void handleSubmit(debouncedOnSubmit)(event);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  setOperation(undefined);
                  void handleSubmit(debouncedOnSubmit)(event);
                }
              }}
            ></input>
          )}
        />
      </label>
      <Button
        type="submit"
        className={`${styles['amount-button']} ${styles['button-plus']}`}
        view="flat"
        onClick={() => {
          setOperation('plus');
        }}
      >
        <CirclePlus className={styles.icon} />
      </Button>
    </form>
  );
}
