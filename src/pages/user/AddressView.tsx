import { Button, TextInput } from '@gravity-ui/uikit';
import { Address } from '@commercetools/platform-sdk';
import { useState } from 'react';
import styles from './style.module.css';

export function AddressView({
  address,
  onSave,
  onCancel,
  isEditing = false,
}: {
  address: Address;
  onSave?: (updatedAddress: Address) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}) {
  const [editData, setEditData] = useState<Partial<Address>>({ ...address });

  const handleChange = (field: keyof Address, value: string) => {
    setEditData((previous) => ({ ...previous, [field]: value }));
  };

  if (isEditing) {
    return (
      <div>
        <div className={styles['form-row']}>
          <TextInput
            label="Street"
            value={editData.streetName ?? ''}
            onChange={(event) => handleChange('streetName', event.target.value)}
            size="l"
          />
          <TextInput
            label="City"
            value={editData.city ?? ''}
            onChange={(event) => handleChange('city', event.target.value)}
            size="l"
          />
          <TextInput
            label="Country"
            value={editData.country ?? ''}
            onChange={(event) => handleChange('country', event.target.value)}
            size="l"
          />
          <TextInput
            label="Postal Code"
            value={editData.postalCode ?? ''}
            onChange={(event) => handleChange('postalCode', event.target.value)}
            size="l"
          />
        </div>
        <div className={styles['button-group']}>
          <Button view="normal" onClick={onCancel} className={styles['margin-right']}>
            Cancel
          </Button>
          <Button view="action" onClick={() => onSave?.(editData as Address)}>
            Save Changes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['address-info']}>
      <p>
        <strong>Street:</strong> {address.streetName}
      </p>
      <p>
        <strong>City:</strong> {address.city}
      </p>
      <p>
        <strong>Country:</strong> {address.country}
      </p>
      <p>
        <strong>Postal Code:</strong> {address.postalCode}
      </p>
    </div>
  );
}
