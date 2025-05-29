import { Address, Customer } from '@commercetools/platform-sdk';
import { Button, Card, Checkbox, Text } from '@gravity-ui/uikit';
import styles from './style.module.css';
import { useState } from 'react';
import { AddressForm } from './AddressForm';

interface AddressListProps {
  customer: Customer;
  onAddressAdded: (address: Partial<Address>) => Promise<void>;
  onAddressUpdated: (addressId: string, address: Partial<Address>) => Promise<void>;
  onAddressRemoved: (addressId: string) => Promise<void>;
  onSetDefaultShipping: (addressId: string) => Promise<void>;
  onSetDefaultBilling: (addressId: string) => Promise<void>;
}

export function AddressList({
  customer,
  onAddressAdded,
  onAddressUpdated,
  onAddressRemoved,
  onSetDefaultShipping,
  onSetDefaultBilling,
}: AddressListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const handleAddAddress = async (address: Partial<Address>) => {
    await onAddressAdded(address);
    setIsAdding(false);
  };

  const handleUpdateAddress = async (addressId: string, address: Partial<Address>) => {
    await onAddressUpdated(addressId, address);
    setEditingAddressId(null);
  };

  return (
    <Card className={styles['address-card']}>
      <div className={styles['address-header']}>
        <Text variant="header-1">Addresses</Text>
        <Button view="action" onClick={() => setIsAdding(true)}>
          Add Address
        </Button>
      </div>

      {isAdding && (
        <div className={styles['address-form']}>
          <AddressForm onSave={handleAddAddress} onCancel={() => setIsAdding(false)} />
        </div>
      )}

      <div className={styles['address-container']}>
        {customer.addresses.map((address) => (
          <div key={address.id} className={styles['address-item']}>
            {editingAddressId === address.id ? (
              <AddressForm
                address={address}
                onSave={(updated) => {
                  if (!address.id) {
                    console.error('Address id is missing');
                    return Promise.resolve();
                  }
                  return handleUpdateAddress(address.id, updated);
                }}
                onCancel={() => setEditingAddressId(null)}
              />
            ) : (
              <>
                <div className={styles['address-info']}>
                  <Text variant="subheader-2">
                    {address.streetName}, {address.city}, {address.country}, {address.postalCode}
                  </Text>
                  <div className={styles['address-actions']}>
                    <Button view="normal" onClick={() => address.id && setEditingAddressId(address.id)}>
                      Edit
                    </Button>
                    <Button view="outlined-danger" onClick={() => address.id && onAddressRemoved(address.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                <div className={styles['address-defaults']}>
                  <Checkbox
                    checked={customer.defaultShippingAddressId === address.id}
                    onChange={() => address.id && onSetDefaultShipping(address.id)}
                  >
                    Default Shipping
                  </Checkbox>
                  <Checkbox
                    checked={customer.defaultBillingAddressId === address.id}
                    onChange={() => address.id && onSetDefaultBilling(address.id)}
                  >
                    Default Billing
                  </Checkbox>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
