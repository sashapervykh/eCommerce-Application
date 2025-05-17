import { CustomerSignInResult } from '@commercetools/platform-sdk';
import { createContext, Dispatch } from 'react';

export const CustomerContext = createContext<CustomerContextType>({ customer: undefined, setCustomer: undefined });

interface CustomerContextType {
  customer: CustomerSignInResult | undefined;
  setCustomer: Dispatch<React.SetStateAction<CustomerSignInResult | undefined>> | undefined;
}
