import styles from './style.module.css';
import FormLabel from '../../components/form-label/form-label';
import NavigationButton from '../../components/navigation-button/navigation-button';
import { Card, Text, TextInput, Select, PasswordInput, Button, Checkbox, useToaster } from '@gravity-ui/uikit';
import { DatePicker } from '@gravity-ui/date-components';
import { Routes } from '../../components/navigation-button/type';
import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../api/api';
import { registrationSchema } from '../../utilities/validation-config/validation-rules';
import { useNavigate } from 'react-router';

export default function RegistrationPage() {
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [serverError, setServerError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const toaster = useToaster();

  useEffect(() => {
    if (successMessage && !serverError) {
      toaster.add({
        name: 'success-registration',
        title: 'Success registration',
        content: successMessage,
        theme: 'success',
        autoHiding: 6000,
      });
    }
    if (serverError) {
      toaster.add({
        name: 'error-registration',
        title: 'Registration error',
        content: serverError,
        theme: 'danger',
        autoHiding: 6000,
      });
    }
  }, [successMessage, serverError, toaster]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    reset,
  } = useForm({
    mode: 'onChange',
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      street: '',
      city: '',
      country: undefined,
      postalCode: '',
      setAsDefault: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      setServerError(undefined);
      setSuccessMessage(undefined);

      const response: unknown = await api.createCustomer({
        ...data,
        dateOfBirth: data.dateOfBirth.split('T')[0],
        addresses: [
          {
            streetName: data.street,
            city: data.city,
            country: data.country ?? '',
            postalCode: data.postalCode,
          },
        ],
        setAsDefault: data.setAsDefault ?? false,
      });

      if (
        response &&
        typeof response === 'object' &&
        'statusCode' in response &&
        response.statusCode === 400 &&
        'errors' in response &&
        Array.isArray(response.errors)
      ) {
        if (response.errors.length > 0) {
          const errorMessages = response.errors
            .filter((error: { message?: string }) => error.message)
            .map((error: { message: string }) => error.message)
            .join(', ');
          setServerError(
            (errorMessages || (response as { message?: string }).message) ?? 'Error while registering. Try again.',
          );
        }
        console.error('API error:', response);
        return;
      }

      setSuccessMessage('Account successfully created! Now you can log in.');

      reset();
      void navigate(Routes.main);
    } catch (error) {
      console.error('Error while registering:', error);
      setServerError('A server error has occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <Card type="container" view="outlined" className={styles.container}>
        <form className={styles.form} onSubmit={(error) => void handleSubmit(onSubmit)(error)}>
          <h1 className={styles.h1}>Create a personal account</h1>
          <fieldset className={styles.fieldset}>
            <legend>Personal information</legend>
            <FormLabel text="Please enter your e-mail">
              <TextInput
                {...register('email')}
                placeholder="Enter e-mail"
                className={styles.input}
                size="xl"
                errorMessage={errors.email?.message}
                validationState={errors.email ? 'invalid' : undefined}
              />
            </FormLabel>
            <FormLabel text="Please enter your password">
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <PasswordInput
                    controlRef={field.ref}
                    value={field.value || ''}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    placeholder="Enter password"
                    className={styles.input}
                    size="xl"
                    errorMessage={fieldState.error?.message}
                    validationState={fieldState.invalid ? 'invalid' : undefined}
                    autoComplete="true"
                  />
                )}
              />
            </FormLabel>
            <FormLabel text="Please enter your first name">
              <TextInput
                {...register('firstName')}
                placeholder="Enter first name"
                className={styles.input}
                size="xl"
                errorMessage={errors.firstName?.message}
                validationState={errors.firstName ? 'invalid' : undefined}
              />
            </FormLabel>
            <FormLabel text="Please enter your last name">
              <TextInput
                {...register('lastName')}
                placeholder="Enter last name"
                className={styles.input}
                size="xl"
                errorMessage={errors.lastName?.message}
                validationState={errors.lastName ? 'invalid' : undefined}
              />
            </FormLabel>
            <FormLabel text="Please enter your date of birth">
              <Controller
                name="dateOfBirth"
                control={control}
                render={() => (
                  <DatePicker
                    placeholder="Enter date of birth"
                    className={styles.input}
                    size="xl"
                    format="DD-MM-YYYY"
                    onUpdate={(date) => {
                      const dateString = date?.toISOString().split('T')[0] ?? '';
                      return void register('dateOfBirth').onChange({
                        target: {
                          value: dateString,
                          name: 'dateOfBirth',
                        },
                      });
                    }}
                    errorMessage={errors.dateOfBirth?.message}
                    validationState={errors.dateOfBirth ? 'invalid' : undefined}
                  />
                )}
              />
            </FormLabel>
          </fieldset>
          <fieldset className={styles.fieldset}>
            <legend>Address information</legend>
            <FormLabel text="Please enter your street">
              <TextInput
                {...register('street')}
                placeholder="Enter street"
                className={styles.input}
                size="xl"
                errorMessage={errors.street?.message}
                validationState={errors.street ? 'invalid' : undefined}
              />
            </FormLabel>
            <FormLabel text="Please enter your city">
              <TextInput
                {...register('city')}
                placeholder="Enter city"
                className={styles.input}
                size="xl"
                errorMessage={errors.city?.message}
                validationState={errors.city ? 'invalid' : undefined}
              />
            </FormLabel>
            <FormLabel text="Please select your country">
              <Controller
                name="country"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    value={field.value ? [field.value] : []}
                    placeholder="Select country"
                    className={styles.input}
                    size="xl"
                    onUpdate={(selectedValues) => {
                      const selectedValue = selectedValues[0] ?? '';
                      field.onChange(selectedValue);
                      void trigger(['postalCode', 'country']);
                    }}
                    errorMessage={fieldState.error?.message}
                    validationState={fieldState.invalid ? 'invalid' : undefined}
                  >
                    <Select.Option value="US">United States</Select.Option>
                    <Select.Option value="CA">Canada</Select.Option>
                  </Select>
                )}
              />
            </FormLabel>
            <FormLabel text="Please enter your postal code">
              <TextInput
                {...register('postalCode', {
                  onChange: () => {
                    void trigger(['postalCode', 'country']);
                  },
                })}
                placeholder="Enter postal code"
                className={styles.input}
                size="xl"
                errorMessage={errors.postalCode ? errors.postalCode.message : undefined}
                validationState={errors.postalCode ? 'invalid' : undefined}
              />
            </FormLabel>
            <FormLabel text="Set as default shipping address">
              <Checkbox {...register('setAsDefault')} size="l" className={styles.checkbox} />
            </FormLabel>
          </fieldset>
          <Button type="submit" view="action" size="xl" width="max" disabled={isSubmitting}>
            Create
          </Button>
          <div className={styles.wrapper}>
            <Text variant="subheader-1">Already have an account? Sign in here:</Text>
            <NavigationButton route={Routes.login} text="Sign in" />
          </div>
        </form>
      </Card>
    </main>
  );
}
