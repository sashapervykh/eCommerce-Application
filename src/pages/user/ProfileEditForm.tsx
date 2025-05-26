import { Button, TextInput } from '@gravity-ui/uikit';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import styles from '../style.module.css';
import { Customer } from '@commercetools/platform-sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema } from '../../utilities/validation-config/validation-rules';
import { z } from 'zod';
import { useProfileForm } from './useProfileForm';

export function ProfileEditForm({ userInfo, onCancel }: { userInfo: Customer; onCancel: () => void }) {
  const { handleSubmit: handleProfileSubmit, isSubmitting } = useProfileForm(userInfo);
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(
      registrationSchema._def.schema.pick({
        email: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
      }) as z.ZodType<{
        email: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
      }>,
    ),
    defaultValues: {
      email: userInfo.email,
      firstName: userInfo.firstName ?? '',
      lastName: userInfo.lastName ?? '',
      dateOfBirth: userInfo.dateOfBirth ?? '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await handleProfileSubmit(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <div className={styles['profile-section']}>
        <h2>Edit Personal Information</h2>
        <div className={styles['form-row']}>
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
      <div className={styles['button-group']}>
        <Button view="normal" onClick={onCancel} className={styles['margin-right']}>
          Cancel
        </Button>
        <Button type="submit" view="action" loading={isSubmitting}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
