import { Customer } from '@commercetools/platform-sdk';
import { useState } from 'react';
import { AddressEditForm } from './AddressEditForm';
import { AddressView } from './AddressView';

export function AddressesContent({ userInfo }: { userInfo: Customer }) {
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  return (
    <div>
      {userInfo.addresses.map((address) => (
        <div key={address.id ?? ''}>
          {editingAddress === address.id ? (
            <AddressEditForm onCancel={() => setEditingAddress(null)} />
          ) : (
            <AddressView onEdit={() => address.id && setEditingAddress(address.id)} />
          )}
        </div>
      ))}
    </div>
  );
}
