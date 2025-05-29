import { Attribute, Image } from '@commercetools/platform-sdk';

export interface ProductInfo {
  id: string;
  key: string;
  name: string;
  description: string;
  price: string;
  fullPrice?: string;
  images?: Image[];
  attributes?: Attribute[];
  published: boolean | undefined;
}
