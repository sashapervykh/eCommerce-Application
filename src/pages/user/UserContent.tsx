import { Customer } from '@commercetools/platform-sdk';
import { Card, Button, Checkbox } from '@gravity-ui/uikit';
import { useState } from 'react';
import styles from './style.module.css';
import { ProfileView } from './ProfileView';
import { ProfileEditForm } from './ProfileEditForm';
import { PasswordChangeForm } from './PasswordChangeForm';
import { AddressEditForm } from './AddressEditForm';

export function UserContent({ userInfo }: { userInfo: Customer }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingAddresses, setIsEditingAddresses] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [editData, setEditData] = useState({
    shipping: {
      streetName: '',
      city: '',
      country: '',
      postalCode: '',
    },
    billing: {
      streetName: '',
      city: '',
      country: '',
      postalCode: '',
    },
  });

  const shippingAddress = userInfo.addresses.find((addr) => addr.id === userInfo.shippingAddressIds?.[0]);
  const billingAddress = userInfo.addresses.find((addr) => addr.id === userInfo.billingAddressIds?.[0]);

  const handleAddressChange = (type: 'shipping' | 'billing', field: string, value: string) => {
    setEditData((previous) => {
      const newData = {
        ...previous,
        [type]: {
          ...previous[type],
          [field]: value,
        },
      };

      if (sameAddress && type === 'shipping') {
        return {
          ...newData,
          billing: {
            ...newData.billing,
            [field]: value,
          },
        };
      }

      return newData;
    });
  };

  const handleSaveAddresses = () => {
    // Здесь должна быть логика сохранения адресов
    console.log('Saving addresses:', editData);
    setIsEditingAddresses(false);
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
        <div className={styles['section-header']}>
          <h2>Addresses</h2>
          {!isEditingAddresses && (
            <Button
              view="normal"
              size="m"
              onClick={() => {
                setIsEditingAddresses(true);
                setEditData({
                  shipping: {
                    streetName: shippingAddress?.streetName ?? '',
                    city: shippingAddress?.city ?? '',
                    country: shippingAddress?.country ?? '',
                    postalCode: shippingAddress?.postalCode ?? '',
                  },
                  billing: {
                    streetName: billingAddress?.streetName ?? '',
                    city: billingAddress?.city ?? '',
                    country: billingAddress?.country ?? '',
                    postalCode: billingAddress?.postalCode ?? '',
                  },
                });
              }}
            >
              Edit
            </Button>
          )}
        </div>

        {isEditingAddresses ? (
          <div>
            <div className={styles['address-section']}>
              <h3>Shipping Address</h3>
              <AddressEditForm
                address={editData.shipping}
                onChange={(field, value) => handleAddressChange('shipping', field, value)}
              />
            </div>

            <Checkbox checked={sameAddress} onChange={() => setSameAddress(!sameAddress)} className={styles.checkbox}>
              Use same address for billing
            </Checkbox>

            <div className={styles['address-section']}>
              <h3>Billing Address</h3>
              <AddressEditForm
                address={editData.billing}
                onChange={(field, value) => handleAddressChange('billing', field, value)}
                disabled={sameAddress}
              />
            </div>

            <div className={styles['button-group']}>
              <Button view="normal" onClick={() => setIsEditingAddresses(false)} className={styles['margin-right']}>
                Cancel
              </Button>
              <Button view="action" onClick={handleSaveAddresses}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles['address-sections']}>
            <div className={styles['address-section']}>
              <h3>Shipping Address</h3>
              {shippingAddress ? (
                <div className={styles['address-info']}>
                  <p>
                    <strong>Street:</strong> {shippingAddress.streetName}
                  </p>
                  <p>
                    <strong>City:</strong> {shippingAddress.city}
                  </p>
                  <p>
                    <strong>Country:</strong> {shippingAddress.country}
                  </p>
                  <p>
                    <strong>Postal Code:</strong> {shippingAddress.postalCode}
                  </p>
                </div>
              ) : (
                <p>No shipping address specified</p>
              )}
            </div>

            <div className={styles['address-section']}>
              <h3>Billing Address</h3>
              {billingAddress ? (
                <div className={styles['address-info']}>
                  <p>
                    <strong>Street:</strong> {billingAddress.streetName}
                  </p>
                  <p>
                    <strong>City:</strong> {billingAddress.city}
                  </p>
                  <p>
                    <strong>Country:</strong> {billingAddress.country}
                  </p>
                  <p>
                    <strong>Postal Code:</strong> {billingAddress.postalCode}
                  </p>
                </div>
              ) : (
                <p>No billing address specified</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
