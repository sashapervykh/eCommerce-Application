import { TextInput } from '@gravity-ui/uikit';
import { Address } from '@commercetools/platform-sdk';
import styles from './style.module.css';

export function AddressEditForm({
  address,
  onChange,
  disabled = false,
}: {
  address: Address;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className={styles['form-row']}>
      <TextInput
        label="Street"
        value={address.streetName}
        onChange={(event) => onChange('streetName', event.target.value)}
        size="l"
        disabled={disabled}
      />
      <TextInput
        label="City"
        value={address.city}
        onChange={(event) => onChange('city', event.target.value)}
        size="l"
        disabled={disabled}
      />
      <TextInput
        label="Country"
        value={address.country}
        onChange={(event) => onChange('country', event.target.value)}
        size="l"
        disabled={disabled}
      />
      <TextInput
        label="Postal Code"
        value={address.postalCode}
        onChange={(event) => onChange('postalCode', event.target.value)}
        size="l"
        disabled={disabled}
      />
    </div>
  );
}
