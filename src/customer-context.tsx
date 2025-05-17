import { createContext, Dispatch } from 'react';

export const CustomerContext = createContext<CustomerContextType>({ customer: undefined, setCustomer: undefined });

interface CustomerContextType {
  customer: string | undefined;
  setCustomer: Dispatch<React.SetStateAction<string>> | undefined;
}
