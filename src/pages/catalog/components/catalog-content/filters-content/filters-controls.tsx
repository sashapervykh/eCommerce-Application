import { Button, Card, Text } from '@gravity-ui/uikit';
import styles from './style.module.css';
import { FormProvider, useForm } from 'react-hook-form';
import { useProducts } from '../../../../../components/hooks/useProducts';
import {
  DEVELOPERS_KEYS,
  FLOORS,
  INITIAL_CRITERIA,
  INITIAL_FILTERS_FORM_STATE,
} from '../../../../../constants/constants';
import { Xmark } from '@gravity-ui/icons';
import { CheckComponent } from './check-component/check-component';
import { FiltersFieldsType } from './types';
import { NumberSlider } from './number-slider/number-slider';
import { useEffect } from 'react';

interface FiltersControlsProps {
  categoryKey?: string;
  subcategoryKey?: string;
  itemsPerPage: number;
  currentPage: number;
}

export function FiltersControls({ categoryKey, subcategoryKey, itemsPerPage }: FiltersControlsProps) {
  const { isFiltersOpen, criteriaData, getProductsByCriteria, setIsFiltersOpen } = useProducts();
  const methods = useForm<FiltersFieldsType>({
    defaultValues: INITIAL_FILTERS_FORM_STATE,
  });

  useEffect(() => {
    methods.reset({
      price: criteriaData.filters.price,
      area: criteriaData.filters.area,
      ...criteriaData.filters.floors,
      ...criteriaData.filters.developers,
    });
  }, [criteriaData, methods]);

  const onSubmit = (data: FiltersFieldsType) => {
    criteriaData.filters.area = data.area;
    criteriaData.filters.price = data.price;

    for (const key of Object.keys(data)) {
      const value: unknown = data[key];
      if (key in criteriaData.filters.floors && typeof value === 'boolean') {
        criteriaData.filters.floors[key] = value;
      }
      if (key in criteriaData.filters.developers && typeof value === 'boolean') {
        criteriaData.filters.developers[key] = value;
      }
    }

    getProductsByCriteria(criteriaData);
    if (window.innerWidth < 570) {
      setIsFiltersOpen(false);
    }
  };

  return (
    <>
      <Card className={`${styles['filters-wrapper']} ${isFiltersOpen ? styles['filters-shown'] : ''}`}>
        <FormProvider {...methods}>
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              void methods.handleSubmit(onSubmit)(event);
            }}
          >
            <Xmark className={styles['close-button']} onClick={() => setIsFiltersOpen(false)}></Xmark>

            <div className={styles['filter-group']}>
              <Text variant="subheader-2">Price, $</Text>
              <NumberSlider type="price" />
            </div>

            <div className={styles['filter-group']}>
              <Text variant="subheader-2">
                Area, m<sup>2</sup>
              </Text>
              <NumberSlider type="area" />
            </div>
            <div className={styles['filter-group']}>
              <Text variant="subheader-2">Developers</Text>
              <div className={styles.developers}>
                {DEVELOPERS_KEYS.map((element) => (
                  <CheckComponent element={element} key={element} />
                ))}
              </div>
            </div>
            <div className={styles['filter-group']}>
              <Text variant="subheader-2">Floors</Text>
              <label className={styles.floors}>
                {FLOORS.map((element) => (
                  <CheckComponent key={element} element={element} />
                ))}
              </label>
            </div>
            <div className={styles['filters-buttons']}>
              <Button
                size="l"
                view="action"
                onClick={() => {
                  methods.reset(INITIAL_FILTERS_FORM_STATE);
                  getProductsByCriteria({
                    ...INITIAL_CRITERIA(),
                    categoryKey,
                    subcategoryKey,
                    limit: itemsPerPage,
                    offset: 0,
                  });
                }}
              >
                Clear
              </Button>
              <Button size="l" view="action" type="submit">
                Apply
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </>
  );
}
