import { Address } from '@commercetools/platform-sdk';
import { Button, TextInput, Select, useToaster } from '@gravity-ui/uikit';
import { useState } from 'react';
import styles from './style.module.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { isValidPostalCode } from '../../utilities/validation-config/validation-functions/is-valid-postal-code';

const addressSchema = z
  .object({
    streetName: z.string().min(1, 'Street is required'),
    city: z
      .string()
      .min(1, 'City is required')
      .regex(/^[A-Za-zА-я]+$/, 'City must contain only letters'),
    country: z.enum(['US', 'CA']),
    postalCode: z.string().min(1, 'Postal code is required'),
  })
  .superRefine((data, context) => {
    isValidPostalCode({ country: data.country, postalCode: data.postalCode }, context, 'postalCode');
  });

interface AddressFormValues {
  streetName: string;
  city: string;
  country: 'US' | 'CA';
  postalCode: string;
}

interface AddressFormProps {
  address?: Partial<Address> & { country?: string };
  onSave: (address: AddressFormValues) => Promise<void>;
  onCancel: () => void;
}

export function AddressForm({ address, onSave, onCancel }: AddressFormProps) {
  const toaster = useToaster();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<AddressFormValues>({
    mode: 'onChange',
    resolver: zodResolver(addressSchema),
    defaultValues: {
      streetName: address?.streetName ?? '',
      city: address?.city ?? '',
      country: address?.country === 'US' || address?.country === 'CA' ? address.country : 'US',
      postalCode: address?.postalCode ?? '',
    },
  });

  const onSubmit = async (data: z.infer<typeof addressSchema>) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
    } catch (error) {
      console.log(error);
      toaster.add({
        name: 'address-error',
        title: 'Error',
        content: 'Failed to save address',
        theme: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles['address-form-container']}>
      <Controller
        name="streetName"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="Street"
            size="l"
            errorMessage={errors.streetName?.message}
            validationState={errors.streetName ? 'invalid' : undefined}
            onBlur={async () => {
              await trigger('streetName');
            }}
          />
        )}
      />
      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="City"
            size="l"
            errorMessage={errors.city?.message}
            validationState={errors.city ? 'invalid' : undefined}
            onBlur={async () => {
              await trigger('city');
            }}
          />
        )}
      />
      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <Select
            label="Country"
            value={[field.value]}
            onUpdate={(value) => {
              field.onChange(value[0]);
              void trigger(['postalCode', 'country']);
            }}
            size="l"
            errorMessage={errors.country?.message}
            validationState={errors.country ? 'invalid' : undefined}
          >
            <Select.Option value="US">United States</Select.Option>
            <Select.Option value="CA">Canada</Select.Option>
          </Select>
        )}
      />
      <Controller
        name="postalCode"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            label="Postal Code"
            size="l"
            errorMessage={errors.postalCode?.message}
            validationState={errors.postalCode ? 'invalid' : undefined}
            onBlur={async () => {
              await trigger('postalCode');
            }}
          />
        )}
      />
      <div className={styles['form-actions']}>
        <Button view="normal" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          view="action"
          onClick={async () => {
            try {
              await handleSubmit(onSubmit)();
            } catch (error) {
              console.error('Form submission error:', error);
            }
          }}
          loading={isSubmitting}
          disabled={isSubmitting || !isValid}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
