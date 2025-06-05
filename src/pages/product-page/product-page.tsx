import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../components/hooks/useProducts';
import { useCart } from '../../components/hooks/useCart';
import { Card, Text, Spin, Button, useToaster } from '@gravity-ui/uikit';
import { useEffect, useState } from 'react';
import { NotFoundPage } from '../404/not-found';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Xmark } from '@gravity-ui/icons';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import styles from './styles.module.css';
import modalStyles from './modal.module.css';

interface AttributeValueObject {
  key: string;
  label: string;
}

type AttributeValue = AttributeValueObject | AttributeValueObject[] | string | number;

export function ProductPage() {
  const { productId } = useParams();
  const { productDetails, getProductDetails, isLoading, error, notFound } = useProducts();
  const { addToCart, isProductInCart, removeFromCart } = useCart();
  const [initialSlide, setInitialSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const navigate = useNavigate();
  const toaster = useToaster();

  const getLabel = (item: AttributeValue | AttributeValueObject): string => {
    if (typeof item === 'object') {
      if ('label' in item) {
        return item.label;
      }
      return JSON.stringify(item);
    }
    return String(item);
  };

  const formatAttributeValue = (value: AttributeValue): string => {
    if (Array.isArray(value)) {
      return value.map(getLabel).join(', ');
    }
    return getLabel(value);
  };

  const handleSlideClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).tagName !== 'IMG') {
      closeModal();
    }
  };

  const handleImageClick = (index: number) => {
    setInitialSlide(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddToCart = async () => {
    if (productDetails?.id) {
      try {
        await addToCart(productDetails.id);
        setIsInCart(true);
        toaster.add({
          name: 'cart-success',
          content: 'Product added to cart!',
          theme: 'success',
        });
      } catch (_error) {
        toaster.add({
          name: 'cart-error',
          content: 'Failed to add product to cart.',
          theme: 'info',
        });
      }
    }
  };

  const handleRemoveFromCart = async () => {
    if (productDetails?.id) {
      try {
        await removeFromCart(productDetails.id);
        setIsInCart(false);
        toaster.add({
          name: 'cart-remove-success',
          content: 'Product removed from cart!',
          theme: 'info',
        });
      } catch (_error) {
        toaster.add({
          name: 'cart-remove-error',
          content: 'Failed to remove product from cart.',
          theme: 'info',
        });
      }
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (productId) {
      getProductDetails(productId);
    }
  }, [productId, getProductDetails]);

  useEffect(() => {
    const checkCart = async () => {
      if (productDetails?.id) {
        const inCart = await isProductInCart(productDetails.id);
        setIsInCart(inCart);
      }
    };
    void checkCart();
  }, [productDetails, isProductInCart]);

  if (notFound) {
    return <NotFoundPage />;
  }

  if (error) {
    return (
      <div className={styles['product-page']}>
        <Text variant="body-2">An unknown error occurred. Please try again later.</Text>
      </div>
    );
  }

  if (isLoading || !productDetails) {
    return (
      <div className={styles['loading-container']}>
        <Spin></Spin>
      </div>
    );
  }

  const hasImages = productDetails.images && productDetails.images.length > 0;
  const hasMultipleImages = productDetails.images && productDetails.images.length > 1;

  return (
    <div className={styles['product-page']}>
      <Card view="raised" className={styles['product-card']}>
        <h1 className={styles['product-name']}>{productDetails.name}</h1>
        <div className={styles['content-wrapper']}>
          <div className={styles['images-wrapper']}>
            {hasImages ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={
                  hasMultipleImages
                    ? {
                        prevEl: `.${styles['swiper-button-prev']}`,
                        nextEl: `.${styles['swiper-button-next']}`,
                      }
                    : false
                }
                pagination={hasMultipleImages ? { clickable: true } : false}
                spaceBetween={10}
                slidesPerView={1}
                loop={hasMultipleImages}
                className={styles['swiper-container']}
              >
                {productDetails.images?.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image.url}
                      alt={image.label ?? `${productDetails.name} image`}
                      onClick={() => handleImageClick(index)}
                      style={{ cursor: 'pointer' }}
                      className={styles['product-image']}
                    />
                  </SwiperSlide>
                ))}
                {hasMultipleImages && (
                  <>
                    <div className={styles['swiper-button-prev']}>
                      <ChevronLeft width={20} height={20} color="#000" />
                    </div>
                    <div className={styles['swiper-button-next']}>
                      <ChevronRight width={20} height={20} color="#000" />
                    </div>
                  </>
                )}
              </Swiper>
            ) : (
              <Text variant="body-2" className={styles['no-image']}>
                No images available
              </Text>
            )}
          </div>
          <div className={styles['text-wrapper']}>
            <Text variant="subheader-1" className={styles.price}>
              Price: ${productDetails.price}{' '}
              {productDetails.fullPrice && <span className={styles['full-price']}>${productDetails.fullPrice}</span>}
            </Text>
            <Text variant="body-2" className={styles.description}>
              <b>Description:</b> {productDetails.description}
            </Text>
            {productDetails.attributes && productDetails.attributes.length > 0 && (
              <Text variant="body-2" className={styles.attributes}>
                <h2>Property Features</h2>
                <ul>
                  {productDetails.attributes.map((attribute, index) => (
                    <li key={index}>
                      {attribute.name}: {formatAttributeValue(attribute.value)}
                    </li>
                  ))}
                </ul>
              </Text>
            )}
            {isInCart ? (
              <Button view="outlined" size="l" onClick={handleRemoveFromCart} className={styles['add-to-cart-button']}>
                Remove from Cart
              </Button>
            ) : (
              <Button
                view="action"
                size="l"
                onClick={handleAddToCart}
                disabled={isInCart}
                className={styles['add-to-cart-button']}
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
        <Button view="action" size="l" onClick={() => navigate('/catalog')} className={styles['back-button']}>
          Back to Catalog
        </Button>
      </Card>
      {isModalOpen && hasImages && (
        <div className={modalStyles['modal-overlay']} onClick={closeModal}>
          <div className={modalStyles['modal-content']} onClick={(event) => event.stopPropagation()}>
            <div className={modalStyles['close-button']} onClick={closeModal}>
              <Xmark width={20} height={20} color="#000" />
            </div>
            <Swiper
              modules={[Zoom, ...(hasMultipleImages ? [Navigation, Pagination] : [])]}
              navigation={
                hasMultipleImages
                  ? {
                      prevEl: `.${modalStyles['modal-swiper-button-prev']}`,
                      nextEl: `.${modalStyles['modal-swiper-button-next']}`,
                    }
                  : false
              }
              pagination={hasMultipleImages ? { clickable: true } : false}
              zoom={{ maxRatio: 3, minRatio: 1 }}
              spaceBetween={10}
              slidesPerView={1}
              loop={hasMultipleImages}
              initialSlide={initialSlide}
              className={`${modalStyles['modal-swiper-container']} modal-swiper`}
            >
              {productDetails.images?.map((image, index) => (
                <SwiperSlide key={index} onClick={handleSlideClick}>
                  <div className="swiper-zoom-container" data-swiper-zoom>
                    <img
                      src={image.url}
                      alt={image.label ?? `${productDetails.name} image`}
                      className={modalStyles['modal-image']}
                    />
                  </div>
                </SwiperSlide>
              ))}
              {hasMultipleImages && (
                <>
                  <div className={modalStyles['modal-swiper-button-prev']}>
                    <ChevronLeft width={20} height={20} color="#000" />
                  </div>
                  <div className={modalStyles['modal-swiper-button-next']}>
                    <ChevronRight width={20} height={20} color="#000" />
                  </div>
                </>
              )}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
}
