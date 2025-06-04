import { Button, Card, Slider, Text, TextInput } from '@gravity-ui/uikit';
import styles from './style.module.css';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useProducts } from '../../../../../components/hooks/useProducts';
import { DEVELOPERS_KEYS, FLOORS, INITIAL_CRITERIA } from '../../../../../constants/constants';
import { Xmark } from '@gravity-ui/icons';
import { CheckComponent } from './check-component/check-component';
import { FiltersFieldsType } from './types';

interface FiltersControlsProps {
  categoryKey?: string;
  subcategoryKey?: string;
}

const INITIAL_FORM_STATE = {
  '1': false,
  '2': false,
  '3': false,
  NebulaBuilders: false,
  StellarEstates: false,
  GalaxyConstruction: false,
  AstralArchitects: false,
};

export function FiltersControls({ categoryKey, subcategoryKey }: FiltersControlsProps) {
  const methods = useForm<FiltersFieldsType>({
    defaultValues: INITIAL_FORM_STATE,
  });
  const { criteriaData, getProductsByCriteria, setIsFiltersOpen } = useProducts();

  const [priceValue, setPriceValue] = useState<number[]>([
    criteriaData.filters.price[0],
    criteriaData.filters.price[1],
  ]);
  const [areaValue, setAreaValue] = useState<number[]>([criteriaData.filters.area[0], criteriaData.filters.area[1]]);

  const onSubmit = (data: FiltersFieldsType) => {
    criteriaData.filters.area = areaValue;
    criteriaData.filters.price = priceValue;

    Object.keys(data).forEach((key) => {
      if (key in criteriaData.filters.floors) {
        criteriaData.filters.floors[key] = data[key];
      }
      if (key in criteriaData.filters.developers) {
        criteriaData.filters.developers[key] = data[key];
      }
    });

    getProductsByCriteria(criteriaData);
    if (window.innerWidth < 535) {
      setIsFiltersOpen(false);
    }
  };

  return (
    <>
      <Card className={styles['filters-wrapper']}>
        <FormProvider {...methods}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void methods.handleSubmit(onSubmit)(event);
            }}
          >
            <Xmark className={styles['close-button']} onClick={() => setIsFiltersOpen(false)}></Xmark>
            <div className={styles['filter-group']}>
              <Text variant="subheader-2">Price, $</Text>
              <Slider
                size="s"
                defaultValue={[priceValue[0], priceValue[1]]}
                value={[priceValue[0], priceValue[1]]}
                min={0}
                max={1000000}
                step={100000}
                onUpdate={(value) => setPriceValue(value)}
              ></Slider>
              <label className={styles['slider-label']}>
                {' '}
                <div className={styles['label-text']}>from:</div>
                <TextInput value={priceValue[0].toLocaleString('en-US')}></TextInput>
              </label>
              <label className={styles['slider-label']}>
                <div>to:</div>
                <TextInput value={priceValue[1].toLocaleString('en-US')}></TextInput>
              </label>
            </div>

            <div className={styles['filter-group']}>
              <Text variant="subheader-2">
                Area, m<sup>2</sup>
              </Text>
              <Slider
                size="s"
                defaultValue={[areaValue[0], areaValue[1]]}
                value={[areaValue[0], areaValue[1]]}
                min={0}
                max={1000}
                step={50}
                onUpdate={(value) => setAreaValue(value)}
              ></Slider>
              <label className={styles['slider-label']}>
                {' '}
                <div className={styles['label-text']}>from:</div>
                <TextInput value={areaValue[0].toLocaleString('en-US')}></TextInput>
              </label>
              <label className={styles['slider-label']}>
                <div>to:</div>
                <TextInput value={areaValue[1].toLocaleString('en-US')}></TextInput>
              </label>
            </div>
            <div className={styles['filter-group']}>
              <Text variant="subheader-2">Developers</Text>
              <div className={styles.developers}>
                {DEVELOPERS_KEYS.map((element) => (
                  <CheckComponent element={element} />
                ))}
              </div>
            </div>
            <div className={styles['filter-group']}>
              <Text variant="subheader-2">Floors</Text>
              <label className={styles.floors}>
                {FLOORS.map((element) => (
                  <CheckComponent element={element} />
                ))}
              </label>
            </div>
            <div className={styles['filters-buttons']}>
              <Button
                size="l"
                view="action"
                onClick={() => {
                  methods.reset(INITIAL_FORM_STATE);
                  setAreaValue([0, 1000]);
                  setPriceValue([0, 1000000]);
                  getProductsByCriteria({
                    ...INITIAL_CRITERIA(),
                    categoryKey,
                    subcategoryKey,
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
