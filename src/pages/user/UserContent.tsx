import { Customer } from '@commercetools/platform-sdk';
import { Card, Button, useToaster } from '@gravity-ui/uikit';
import { useState } from 'react';
import styles from './style.module.css';
import { ProfileView } from './ProfileView';
import { ProfileEditForm } from './ProfileEditForm';
import { PasswordChangeForm } from './PasswordChangeForm';
import { AddressList } from './AddressList';
import { api } from '../../api/api';
import { useAuth } from '../../components/hooks/useAuth';
import type { Address } from '@commercetools/platform-sdk';
import { customerAPI } from '../../api/customer-api';

export function UserContent({ userInfo }: { userInfo: Customer }) {
  const { refreshUser } = useAuth();
  const toaster = useToaster();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleAddressAdded = async (address: Partial<Address>): Promise<void> => {
    try {
      const customerData = await customerAPI.apiRoot().me().get().execute();
      const currentVersion = customerData.body.version;

      await api.addAddress(userInfo.id, currentVersion, {
        key: `address-${Date.now().toString()}`,
        streetName: address.streetName ?? '',
        city: address.city ?? '',
        country: address.country ?? 'US',
        postalCode: address.postalCode ?? '',
      });
      await refreshUser();
      toaster.add({
        name: 'address-added',
        title: 'Success',
        content: 'Address added successfully',
        theme: 'success',
      });
    } catch (error) {
      toaster.add({
        name: 'address-error',
        title: 'Error',
        content: 'Failed to add address',
        theme: 'danger',
      });
      throw error;
    }
  };

  const handleAddressUpdated = async (addressId: string, address: Partial<Address>): Promise<void> => {
    try {
      const customerData = await customerAPI.apiRoot().me().get().execute();
      const currentVersion = customerData.body.version;

      await api.updateAddress(userInfo.id, currentVersion, addressId, {
        streetName: address.streetName,
        city: address.city,
        country: address.country ?? 'US',
        postalCode: address.postalCode,
      });
      await refreshUser();
      toaster.add({
        name: 'address-updated',
        title: 'Success',
        content: 'Address updated successfully',
        theme: 'success',
      });
    } catch (error) {
      toaster.add({
        name: 'address-error',
        title: 'Error',
        content: 'Failed to update address',
        theme: 'danger',
      });
      throw error;
    }
  };

  const handleAddressRemoved = async (addressId: string): Promise<void> => {
    try {
      await api.removeAddress(userInfo.id, userInfo.version, addressId);
      await refreshUser();
      toaster.add({
        name: 'address-removed',
        title: 'Success',
        content: 'Address removed successfully',
        theme: 'success',
      });
    } catch (error) {
      toaster.add({
        name: 'address-error',
        title: 'Error',
        content: 'Failed to remove address',
        theme: 'danger',
      });
      throw error;
    }
  };

  const handleSetDefaultShipping = async (addressId: string): Promise<void> => {
    try {
      await api.setDefaultShippingAddress(userInfo.id, userInfo.version, addressId);
      await refreshUser();
      toaster.add({
        name: 'default-shipping-set',
        title: 'Success',
        content: 'Default shipping address set',
        theme: 'success',
      });
    } catch (error) {
      toaster.add({
        name: 'address-error',
        title: 'Error',
        content: 'Failed to set default shipping address',
        theme: 'danger',
      });
      throw error;
    }
  };

  const handleSetDefaultBilling = async (addressId: string): Promise<void> => {
    try {
      await api.setDefaultBillingAddress(userInfo.id, userInfo.version, addressId);
      await refreshUser();
      toaster.add({
        name: 'default-billing-set',
        title: 'Success',
        content: 'Default billing address set',
        theme: 'success',
      });
    } catch (error) {
      toaster.add({
        name: 'address-error',
        title: 'Error',
        content: 'Failed to set default billing address',
        theme: 'danger',
      });
      throw error;
    }
  };

  return (
    <Card className={styles['profile-card']}>
      <div className={styles['profile-header']}>
        <h1>Space client {userInfo.firstName ?? 'User'}</h1>
      </div>

      {isEditingProfile ? (
        <ProfileEditForm userInfo={userInfo} onCancel={() => setIsEditingProfile(false)} />
      ) : (
        <div className={styles['profile-section']}>
          <div className={styles['section-header']}>
            <h2>Personal Information</h2>
            <Button view="normal" size="m" onClick={() => setIsEditingProfile(true)}>
              Edit
            </Button>
          </div>
          <ProfileView userInfo={userInfo} />
        </div>
      )}

      {isChangingPassword ? (
        <PasswordChangeForm userInfo={userInfo} onCancel={() => setIsChangingPassword(false)} />
      ) : (
        <div className={styles['profile-section']}>
          <div className={styles['section-header']}>
            <h2>Password</h2>
            <Button view="normal" size="m" onClick={() => setIsChangingPassword(true)}>
              Change
            </Button>
          </div>
          <p>••••••••••••••</p>
        </div>
      )}

      <div className={styles['profile-section']}>
        <AddressList
          customer={userInfo}
          onAddressAdded={handleAddressAdded}
          onAddressUpdated={handleAddressUpdated}
          onAddressRemoved={handleAddressRemoved}
          onSetDefaultShipping={handleSetDefaultShipping}
          onSetDefaultBilling={handleSetDefaultBilling}
        />
      </div>
    </Card>
  );
}
