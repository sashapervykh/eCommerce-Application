import { Image, LocalizedString } from '@commercetools/platform-sdk';

export interface ProductsInfo {
  name: LocalizedString;
  description: LocalizedString | undefined;
  price: number | string;
  images: Image[] | undefined;
}
