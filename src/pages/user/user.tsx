import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import { useAuth } from '../../components/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Customer } from '@commercetools/platform-sdk';
import { Card, Button, Text, useToaster, PasswordInput } from '@gravity-ui/uikit';
import { useState } from 'react';
import styles from './style.module.css';
import { TextInput, Select, Checkbox } from '@gravity-ui/uikit';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from '../../utilities/validation-config/validation-rules';
import { api } from '../../api/api';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { useEffect } from 'react';

interface ProfileFormData {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  shippingStreet: string;
  shippingCity: string;
  shippingPostalCode: string;
  billingStreet: string;
  billingCity: string;
  billingPostalCode: string;
  sameAddress: boolean;
  setAsDefaultShipping: boolean;
  setAsDefaultBilling: boolean;
  shippingCountry: 'US' | 'CA' | undefined;
  billingCountry: 'US' | 'CA' | undefined;
}

interface UserContentProps {
  userInfo: Customer;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

function UserContent({ userInfo, isEditMode, toggleEditMode }: UserContentProps) {
  const { refreshUser } = useAuth();
  const toaster = useToaster();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(
      registrationSchema._def.schema.pick({
        email: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        shippingStreet: true,
        shippingCity: true,
        shippingCountry: true,
        shippingPostalCode: true,
        billingStreet: true,
        billingCity: true,
        billingCountry: true,
        billingPostalCode: true,
        sameAddress: true,
        setAsDefaultShipping: true,
        setAsDefaultBilling: true,
      }) as z.ZodType<ProfileFormData>,
    ),
    defaultValues: {
      email: userInfo.email,
      firstName: userInfo.firstName ?? '',
      lastName: userInfo.lastName ?? '',
      dateOfBirth: userInfo.dateOfBirth ?? '',
      shippingStreet: userInfo.addresses[0]?.streetName ?? '',
      shippingCity: userInfo.addresses[0]?.city ?? '',
      shippingCountry:
        userInfo.addresses[0]?.country === 'US' || userInfo.addresses[0]?.country === 'CA'
          ? userInfo.addresses[0].country
          : 'US',
      shippingPostalCode: userInfo.addresses[0]?.postalCode ?? '',
      billingStreet: userInfo.addresses[1]?.streetName ?? '',
      billingCity: userInfo.addresses[1]?.city ?? '',
      billingCountry:
        userInfo.addresses[1]?.country === 'US' || userInfo.addresses[1]?.country === 'CA'
          ? userInfo.addresses[1]?.country
          : 'US',
      billingPostalCode: userInfo.addresses[1]?.postalCode ?? '',
      sameAddress: false,
      setAsDefaultShipping: userInfo.defaultShippingAddressId === userInfo.shippingAddressIds?.[0],
      setAsDefaultBilling: userInfo.defaultBillingAddressId === userInfo.billingAddressIds?.[0],
    },
  });

  const sameAddress = watch('sameAddress');
  useEffect(() => {
    reset({
      email: userInfo.email,
      firstName: userInfo.firstName ?? '',
      lastName: userInfo.lastName ?? '',
      dateOfBirth: userInfo.dateOfBirth ?? '',
      shippingStreet: userInfo.addresses[0]?.streetName ?? '',
      shippingCity: userInfo.addresses[0]?.city ?? '',
      shippingCountry:
        userInfo.addresses[0]?.country === 'US' || userInfo.addresses[0]?.country === 'CA'
          ? userInfo.addresses[0].country
          : 'US',
      shippingPostalCode: userInfo.addresses[0]?.postalCode ?? '',
      billingStreet: userInfo.addresses[1]?.streetName ?? '',
      billingCity: userInfo.addresses[1]?.city ?? '',
      billingCountry:
        userInfo.addresses[1]?.country === 'US' || userInfo.addresses[1]?.country === 'CA'
          ? userInfo.addresses[1]?.country
          : 'US',
      billingPostalCode: userInfo.addresses[1]?.postalCode ?? '',
      sameAddress: false,
      setAsDefaultShipping: userInfo.defaultShippingAddressId === userInfo.shippingAddressIds?.[0],
      setAsDefaultBilling: userInfo.defaultBillingAddressId === userInfo.billingAddressIds?.[0],
    });
  }, [userInfo, reset, isEditMode]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const shippingAddress = {
        action: 'changeAddress' as const,
        addressId: userInfo.shippingAddressIds?.[0],
        address: {
          key: 'shipping',
          streetName: data.shippingStreet,
          city: data.shippingCity,
          country: data.shippingCountry ?? 'US',
          postalCode: data.shippingPostalCode,
        },
      };

      const billingAddress = {
        action: 'changeAddress' as const,
        addressId: userInfo.billingAddressIds?.[0],
        address: {
          key: 'billing',
          streetName: data.billingStreet,
          city: data.billingCity,
          country: data.billingCountry ?? 'US',
          postalCode: data.billingPostalCode,
        },
      };

      const updateData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        addresses: data.sameAddress
          ? [
              {
                action: 'changeAddress' as const,
                addressId: userInfo.shippingAddressIds?.[0],
                address: {
                  key: 'shipping',
                  streetName: data.shippingStreet,
                  city: data.shippingCity,
                  country: data.shippingCountry ?? 'US',
                  postalCode: data.shippingPostalCode,
                },
              },
              {
                action: 'changeAddress' as const,
                addressId: userInfo.billingAddressIds?.[0],
                address: {
                  key: 'billing',
                  streetName: data.shippingStreet,
                  city: data.shippingCity,
                  country: data.shippingCountry ?? 'US',
                  postalCode: data.shippingPostalCode,
                },
              },
            ]
          : [shippingAddress, billingAddress],
        defaultShippingAddress: data.setAsDefaultShipping ? 0 : undefined,
        defaultBillingAddress: data.setAsDefaultBilling ? (data.sameAddress ? 0 : 1) : undefined,
      };

      await api.updateCustomer(userInfo.id, userInfo.version, updateData);
      await refreshUser();

      toaster.add({
        name: 'profile-update-success',
        title: 'Profile Updated',
        content: 'Your profile has been successfully updated',
        theme: 'success',
        autoHiding: 5000,
      });

      toggleEditMode();
      reset(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      toaster.add({
        name: 'profile-update-error',
        title: 'Update Failed',
        content: 'Failed to update profile. Please try again.',
        theme: 'danger',
        autoHiding: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditMode) {
    return (
      <Card className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <h1>User Profile</h1>
          <Button view="action" onClick={toggleEditMode}>
            Edit Profile
          </Button>
        </div>

        <div className={styles.profileSection}>
          <h2>Personal Information</h2>
          <p>
            <strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}
          </p>
          <p>
            <strong>Email:</strong> {userInfo.email}
          </p>
          {userInfo.dateOfBirth && (
            <p>
              <strong>Date of Birth:</strong> {new Date(userInfo.dateOfBirth).toLocaleDateString()}
            </p>
          )}
        </div>

        {userInfo.addresses.length > 0 && (
          <div className={styles.profileSection}>
            <h2>Addresses</h2>
            {userInfo.addresses.map((address, index) => (
              <div key={index} className={styles.addressCard}>
                <p>
                  <strong>Type:</strong> {address.key}
                </p>
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
                {userInfo.defaultShippingAddressId === userInfo.addresses[index].id && (
                  <Text color="positive">Default Shipping Address</Text>
                )}
                {userInfo.defaultBillingAddressId === userInfo.addresses[index].id && (
                  <Text color="positive">Default Billing Address</Text>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    );
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toaster.add({
        name: 'password-mismatch',
        title: 'Error',
        content: 'New passwords do not match',
        theme: 'danger',
      });
      return;
    }

    try {
      await api.changePassword({
        id: userInfo.id,
        version: userInfo.version,
        currentPassword,
        newPassword,
      });
      await refreshUser();
      toaster.add({
        name: 'password-success',
        title: 'Success',
        content: 'Password updated successfully',
        theme: 'success',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      }
      toaster.add({
        name: 'password-error',
        title: 'Error',
        content: 'Failed to change password',
        theme: 'danger',
      });
    }
  };

  return (
    <Card className={styles.profileCard}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.profileHeader}>
          <h1>Edit Profile</h1>
          <div>
            <Button view="normal" onClick={toggleEditMode} className={styles.marginRight} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" view="action" loading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className={styles.profileSection}>
          <h2>Personal Information</h2>
          <div className={styles.formRow}>
            <TextInput
              {...register('email')}
              label="Email"
              size="l"
              errorMessage={errors.email?.message}
              validationState={errors.email ? 'invalid' : undefined}
            />
            <TextInput
              {...register('firstName')}
              label="First Name"
              size="l"
              errorMessage={errors.firstName?.message}
              validationState={errors.firstName ? 'invalid' : undefined}
            />
            <TextInput
              {...register('lastName')}
              label="Last Name"
              size="l"
              errorMessage={errors.lastName?.message}
              validationState={errors.lastName ? 'invalid' : undefined}
            />
          </div>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                type="text"
                label="Date of Birth (YYYY-MM-DD)"
                size="l"
                errorMessage={errors.dateOfBirth?.message}
                validationState={errors.dateOfBirth ? 'invalid' : undefined}
              />
            )}
          />
        </div>

        <div className={styles.profileSection}>
          <h2>Shipping Address</h2>
          <Checkbox {...register('setAsDefaultShipping')} size="l" content="Set as default shipping address" />
          <TextInput
            {...register('shippingStreet')}
            label="Street"
            size="l"
            errorMessage={errors.shippingStreet?.message}
            validationState={errors.shippingStreet ? 'invalid' : undefined}
          />
          <TextInput
            {...register('shippingCity')}
            label="City"
            size="l"
            errorMessage={errors.shippingCity?.message}
            validationState={errors.shippingCity ? 'invalid' : undefined}
          />
          <Controller
            name="shippingCountry"
            control={control}
            render={({ field }) => (
              <Select
                onUpdate={(value) => field.onChange(value[0])}
                value={field.value ? [field.value] : []}
                label="Country"
                size="l"
                options={[
                  { value: 'US', content: 'United States' },
                  { value: 'CA', content: 'Canada' },
                ]}
                errorMessage={errors.shippingCountry?.message}
                validationState={errors.shippingCountry ? 'invalid' : undefined}
              />
            )}
          />
          <TextInput
            {...register('shippingPostalCode')}
            label="Postal Code"
            size="l"
            errorMessage={errors.shippingPostalCode?.message}
            validationState={errors.shippingPostalCode ? 'invalid' : undefined}
          />
        </div>

        <div className={styles.profileSection}>
          <h2>Billing Address</h2>
          <Checkbox
            {...register('sameAddress')}
            size="l"
            content="Same as shipping address"
            onChange={(event) => {
              if (event.target.checked) {
                setValue('billingStreet', watch('shippingStreet'));
                setValue('billingCity', watch('shippingCity'));
                setValue('billingCountry', watch('shippingCountry'));
                setValue('billingPostalCode', watch('shippingPostalCode'));
              }
            }}
          />
          <Checkbox
            {...register('setAsDefaultBilling')}
            size="l"
            content="Set as default billing address"
            disabled={sameAddress}
          />
          <TextInput
            {...register('billingStreet')}
            label="Street"
            size="l"
            disabled={sameAddress}
            errorMessage={errors.billingStreet?.message}
            validationState={errors.billingStreet ? 'invalid' : undefined}
          />
          <TextInput
            {...register('billingCity')}
            label="City"
            size="l"
            disabled={sameAddress}
            errorMessage={errors.billingCity?.message}
            validationState={errors.billingCity ? 'invalid' : undefined}
          />
          <Controller
            name="billingCountry"
            control={control}
            render={({ field }) => (
              <Select
                onUpdate={(value) => field.onChange(value[0])}
                value={field.value ? [field.value] : []}
                label="Country"
                size="l"
                disabled={sameAddress}
                options={[
                  { value: 'US', content: 'United States' },
                  { value: 'CA', content: 'Canada' },
                ]}
                errorMessage={errors.billingCountry?.message}
                validationState={errors.billingCountry ? 'invalid' : undefined}
              />
            )}
          />
          <TextInput
            {...register('billingPostalCode')}
            label="Postal Code"
            size="l"
            disabled={sameAddress}
            errorMessage={errors.billingPostalCode?.message}
            validationState={errors.billingPostalCode ? 'invalid' : undefined}
          />
        </div>
        <div className={styles.profileSection}>
          <h2>Change Password</h2>
          <PasswordInput
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            label="Current Password"
            size="l"
          />
          <PasswordInput
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            label="New Password"
            size="l"
          />
          <PasswordInput
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            label="Confirm New Password"
            size="l"
          />
          <Button onClick={handlePasswordChange} view="action">
            Change Password
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function UserPage() {
  const { isAuthenticated, userInfo } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!userInfo) {
    return <div>Loading user data...</div>;
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <PageWrapper title="User Profile">
      <div className={styles.page}>
        <UserContent userInfo={userInfo} isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
      </div>
    </PageWrapper>
  );
}
