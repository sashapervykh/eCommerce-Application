import { ProductProjection } from '@commercetools/platform-sdk';

export function returnProductsData(responseBody: ProductProjection[]) {
  return responseBody.map((productInfo) => {
    const discountedPrice = productInfo.masterVariant.prices?.[0]?.discounted?.value.centAmount;
    const price = productInfo.masterVariant.prices?.[0].value.centAmount;
    let currentPrice: string;
    let fullPrice: string | undefined;

    if (discountedPrice) {
      currentPrice = (discountedPrice / 100).toLocaleString('en-US');
      fullPrice = price ? (price / 100).toLocaleString('en-US') : 'Not provided';
    } else {
      currentPrice = price ? (price / 100).toLocaleString('en-US') : 'Not provided';
    }

    return {
      id: productInfo.id,
      key: productInfo.key ?? productInfo.name['en-US'].split(' ').join(''),
      name: productInfo.name['en-US'],
      description: productInfo.description?.['en-US'] ?? 'Not provided',
      price: currentPrice,
      fullPrice: fullPrice,
      images: productInfo.masterVariant.images,
      published: productInfo.published,
    };
  });
}
