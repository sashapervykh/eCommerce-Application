import { Image } from '@commercetools/platform-sdk';

export interface ProductInfo {
  id: string;
  name: string;
  description: string;
  price: string;
  fullPrice?: string;
  images?: Image[];
}
