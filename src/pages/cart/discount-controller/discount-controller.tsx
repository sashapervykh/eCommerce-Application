import { Button, TextInput, Text } from '@gravity-ui/uikit';
import styles from './styles.module.css';
import { useCart } from '../../../components/hooks/useCart';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { SquareXmark } from '@gravity-ui/icons';

export function DiscountController() {
  const { cartPageData, addPromoCode, removePromoCode } = useCart();
  const [error, setError] = useState<string | undefined>(undefined);
  const { control, getValues, setValue } = useForm<{ promo: string }>({ defaultValues: { promo: '' } });

  useEffect(() => {
    if (cartPageData?.code) setValue('promo', cartPageData.code);
  }, [cartPageData?.code, setValue]);

  if (!cartPageData) return;

  return (
    <>
      {cartPageData.code ? (
        <div className={styles['promo-applied-wrapper']}>
          <Text variant="body-2" className={styles['promo-applied']}>{`Promo "${cartPageData.code}" applied`}</Text>
          <SquareXmark
            className={styles['promo-applied-icon']}
            stroke="rgb(11, 100, 11)"
            onClick={async () => {
              if (!cartPageData.codeId) {
                setError('Error when removing promo');
                return;
              }
              await removePromoCode(cartPageData.id, cartPageData.version, cartPageData.codeId);
            }}
          />
        </div>
      ) : (
        <form
          className={styles['discount-wrapper']}
          onSubmit={async (event) => {
            event.preventDefault();
            const promo = getValues('promo');
            const result = await addPromoCode(cartPageData.id, cartPageData.version, promo);
            if (typeof result === 'string') {
              setError(result);
            }
          }}
        >
          <Button
            type="submit"
            className={styles['button-applied']}
            view={cartPageData.code ? 'flat-action' : 'action'}
          >
            Apply
          </Button>
          <Controller
            name="promo"
            control={control}
            render={({ field }) => (
              <TextInput
                className={styles['input-applied']}
                error={error}
                errorMessage={error}
                value={field.value}
                onChange={(event) => {
                  field.onChange(event.target.value);
                  setError(undefined);
                }}
                placeholder="Enter the promo code"
              />
            )}
          />
        </form>
      )}
    </>
  );
}
