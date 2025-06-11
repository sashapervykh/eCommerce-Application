import { Button } from '@gravity-ui/uikit';
import { CircleMinus, CirclePlus } from '@gravity-ui/icons';
import { CartItemType } from '../../../../../components/hooks/useProducts';
import styles from './styles.module.css';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';

export function AmountController({ product }: { product: CartItemType }) {
  const { handleSubmit, getValues, setValue, control } = useForm({
    defaultValues: { amount: product.quantity },
  });
  const [operation, setOperation] = useState<'plus' | 'minus' | undefined>(undefined);

  const handleIncrement = () => {
    let value = getValues('amount');
    value += 1;
    setValue('amount', value);
  };

  const handleDecrement = () => {
    let value = getValues('amount');
    value = value === 0 ? 0 : value - 1;
    setValue('amount', value);
    console.log(111);
  };

  const onSubmit = () => {
    if (operation === 'plus') {
      handleIncrement();
      console.log('increment');
    } else if (operation === 'minus') {
      handleDecrement();
      console.log('increment');
    }
    setOperation(undefined);
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
                  field.onChange('0');
                  return;
                }
                if (!/^\d+$/.test(event.target.value)) return;
                const value = parseInt(event.target.value);
                if (Number.isNaN(value)) return;
                field.onChange(value.toString());
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
        className={styles['amount-button']}
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
