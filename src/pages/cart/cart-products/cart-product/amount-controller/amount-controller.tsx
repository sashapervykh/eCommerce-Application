import { Button } from '@gravity-ui/uikit';
import { CircleMinus, CirclePlus } from '@gravity-ui/icons';
import { CartItemType } from '../../../../../components/hooks/useProducts';
import styles from './styles.module.css';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useCart } from '../../../../../components/hooks/useCart';

export function AmountController({ product }: { product: CartItemType }) {
  // let [debouceTimeout, setDebouceTimeout] = useState<NodeJS.Timeout | undefined>(undefined);
  const { handleSubmit, getValues, setValue, control } = useForm({
    defaultValues: { amount: product.quantity },
  });
  const [operation, setOperation] = useState<'plus' | 'minus' | undefined>(undefined);
  const { addToCart, removeFromCart } = useCart();
  // const { fetchCartItems } = useProducts();
  const [previousAmount, setPreviousAmount] = useState<number>(product.quantity);

  // const handleIncrement = async () => {
  //   let value = getValues('amount');
  //   value += 1;
  //   setValue('amount', value);
  //   await addToCart(product.id, 1);
  // };

  // const handleDecrement = async () => {
  //   const value = getValues('amount');
  //   if (value === 1) {
  //     setValue('amount', 0);
  //     await removeFromCart(product.id);
  //     await fetchCartItems();
  //   } else {
  //     await removeFromCart(product.id, 1);
  //     setValue('amount', value - 1);
  //   }
  // };

  // const handleDirectInput = async () => {
  //   const value = getValues('amount');
  //   if (value === 0) {
  //     setValue('amount', 0);
  //     await removeFromCart(product.id);
  //     await fetchCartItems();
  //   } else {
  //     await removeFromCart(product.id, 1);
  //     setValue('amount', value - 1);
  //   }
  // };

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

  // const onSubmit = async () => {
  //   if (operation === 'plus') {
  //     await handleIncrement();
  //     console.log('increment');
  //   } else if (operation === 'minus') {
  //     await handleDecrement();
  //     console.log('increment');
  //   }
  //   setOperation(undefined);
  // };

  const onSubmit = async () => {
    handelAmountChange();
    const currentAmount = getValues('amount');
    console.log(currentAmount);
    const difference = currentAmount - previousAmount;
    console.log(difference);
    if (difference > 0) {
      await addToCart(product.id, difference);
      setPreviousAmount(currentAmount);
    } else if (difference < 0) {
      await removeFromCart(product.id, Math.abs(difference));
      setPreviousAmount(currentAmount);
    }
  };

  return (
    <form
      className={styles['amount-form']}
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
    >
      <Button
        type="submit"
        className={styles['amount-button']}
        view="flat"
        onClick={() => {
          setOperation('minus');
          console.log('minus');
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
                void handleSubmit(onSubmit)(event);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  setOperation(undefined);
                  void handleSubmit(onSubmit)(event);
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
